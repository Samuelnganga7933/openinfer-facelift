# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the OpenInfer website built with Eleventy (11ty), a static site generator. The site features:
- Company information and team pages
- News/blog posts with markdown content
- Job listings
- OpenGraph image generation for social sharing
- Responsive design with TailwindCSS
- JavaScript bundling with esbuild

## Development Commands

### Development
```bash
npm install        # Install dependencies
npm start         # Start development server (runs all dev:* scripts in parallel)
```

Development mode runs:
- `dev:11ty`: Eleventy dev server on port 3000 with live reload
- `dev:css`: TailwindCSS compilation with watch mode  
- `dev:js`: esbuild bundling with watch mode

### Production Build
```bash
npm run build     # Production build (runs all build:* scripts)
```

Production build includes:
- `build:11ty`: Eleventy static site generation
- `build:css`: TailwindCSS compilation with minification
- `build:js`: esbuild bundling with minification

## Architecture

### Directory Structure
- `src/` - Source files
  - `_includes/` - Eleventy includes (reusable components)
  - `_layouts/` - Eleventy layouts (page templates)
  - `css/` - Source CSS (TailwindCSS)
  - `js/` - JavaScript source files
  - `images/` - Image assets
  - `news/` - Blog post markdown files
  - `jobs/` - Job listing markdown files
  - `public/` - Static assets (copied to root)
- `_site/` - Generated output directory
- `.eleventy.js` - Eleventy configuration

### Key Technologies
- **Eleventy**: Static site generator with Nunjucks templating
- **TailwindCSS**: Utility-first CSS framework with typography and aspect-ratio plugins
- **esbuild**: Fast JavaScript bundler
- **npm-run-all**: Parallel script execution
- **Alpine.js**: Lightweight reactive framework for interactive components
- **@11ty/eleventy-img**: Image optimization (configured but commented out)
- **Three.js**: 3D graphics library
- **Luxon**: Date/time manipulation

### Content Management
- News articles in `src/news/` as markdown files with frontmatter
- Job postings in `src/jobs/` as markdown files with frontmatter
- Collections automatically created and sorted (news by date desc, jobs by title asc)
- OpenGraph image generation via external service with signed URLs

### Image Handling
- Static images in `src/images/` with optimized versions in `_site/images/optimized/`
- Image optimization plugin configured but currently commented out in .eleventy.js:50-72
- Manual image optimization workflow appears to be in use

### Environment Configuration
- Development vs production controlled by `ELEVENTY_ENV` environment variable
- Available globally in templates via `isDevelopment` variable