const path = require('node:path');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
// const Image = require('@11ty/eleventy-img');
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");
const { DateTime } = require('luxon');
const crypto = require('node:crypto');
const fs = require('node:fs');

module.exports = function(eleventyConfig) {
  // Copy static assets
  // eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy({ 'src/public': '/' });
  
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    svgShortCircuit: 'size', 
  });

  // Watch CSS files for changes
  eleventyConfig.addWatchTarget('./src/css/style.css');
  eleventyConfig.addWatchTarget('./_site/css/style.css');

  eleventyConfig.addShortcode('guid', () => crypto.randomUUID());

  // Add environment variable to global data
  eleventyConfig.addGlobalData('isDevelopment', process.env.ELEVENTY_ENV !== 'production');
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  eleventyConfig.addFilter('jsonify', (value) => JSON.stringify(value, null, 2));
  eleventyConfig.addFilter('formatDateTime', (value, format = 'LLLL dd, yyyy') => DateTime.fromJSDate(value).toFormat(format));

  // Add filter to filter jobs by type
  eleventyConfig.addFilter('filterJobsByType', (jobs, type) => {
    return jobs.filter(job => job.data.job_type === type);
  });

  eleventyConfig.addNunjucksFilter("first", (arr) => arr[0]);
  eleventyConfig.addNunjucksFilter("last", (arr) => arr[arr.length - 1]);
  eleventyConfig.addNunjucksFilter("slice", (arr, start, limit) => arr.slice(start, limit));
  eleventyConfig.addNunjucksFilter("limit", (arr, limit) => arr.slice(0, limit));

  eleventyConfig.addFilter('rev', (() => {
    const fingerPrints = {};

    return (basePath) => {
      const { dir } = eleventyConfig;
      const { output } = dir;
      
      if (/\.(css|js)$/.test(basePath)) {
        const compiledPath = path.join(output, basePath);
        const { [compiledPath]: cachedFingerprintedFile } = fingerPrints;

        if (!cachedFingerprintedFile) {
          const contents = fs.readFileSync(compiledPath, 'utf8');
          const fingerPrint = crypto.createHash('md5').update(contents).digest('hex').toString();
          const fingerPrintedFile = `${basePath}?v=${fingerPrint}`;

          fingerPrints[compiledPath] = fingerPrintedFile;

          return fingerPrintedFile;
        }

        return cachedFingerprintedFile;
      }

      return basePath;
    };
  })());  

  eleventyConfig.addFilter('opengraphImage', (basePath) => {
    const key = 'i8rx2bNBZwHoMQM5osRF7Q';
    const secret = 'GGw8MEQHL4gPBVT-3mzUI5oMFuO_LpezJUoKSYr4gWA';
    const path = `${key}${basePath}`;
    const signature = crypto.createHash('md5').update(`${secret}${path}`).digest('hex').toString();
  
    if (path.indexOf('?') === -1) {
      return `https://cdn.opengraphimage.com/${path}?s=${signature}`;
    }
  
    return `https://cdn.opengraphimage.com/${path}&s=${signature}`;
  });  

	// eleventyConfig.addShortcode('image', async function (src, alt, widths = [300, 600, 900, 1200], sizes = '100vh') {
  //   let inputFilePath = path.join(eleventyConfig.dir.input, 'public', src);

	// 	let metadata = await Image(inputFilePath, {
	// 		widths,
  //     outputDir: './_site/images/optimized/',
  //     urlPath: '/images/optimized/',      
	// 		formats: ['avif', 'jpeg'],
  //     transform: (sharp) => {
  //       sharp.keepExif();
  //     }
	// 	});

	// 	let imageAttributes = {
	// 		alt,
	// 		sizes,
	// 		loading: 'lazy',
	// 		decoding: 'async',
  //     class: 'w-full h-full object-cover'
	// 	};

	// 	return Image.generateHTML(metadata, imageAttributes);
	// });

  const order = (attribute, direction = 'asc') => {
    return (a, b) => {
      const res = a.data[attribute] < b.data[attribute] ? -1 : 1;

      if (direction === 'desc') {
        return res * -1;
      }

      return 0;
    };
  }

  eleventyConfig.addCollection('jobs', (collection) => {
    return collection.getFilteredByGlob('src/jobs/**/*.md').sort(order('date', 'desc'));
  });

  eleventyConfig.addCollection('news', (collection) => {
    return collection.getFilteredByGlob('src/news/**/*.md').sort(order('date', 'desc'));
  });


  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts'
    },
    pathPrefix: '/',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    templateFormats: ['html', 'njk', 'md'],
    passthroughFileCopy: true
  };
};
