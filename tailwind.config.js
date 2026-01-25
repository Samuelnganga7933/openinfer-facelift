/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./.eleventy.js",
    "./src/**/*.{html,js,njk,md}",
    "./src/_includes/**/*.{html,js,njk}",
    "./src/_layouts/**/*.{html,js,njk}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        'primary': '#121212',      // Black - Primary text, logos, interface anchors
        'surface': '#F5F4F1',      // Pale Orange - Background surfaces
        'muted': '#6F7B74',        // Gray - Section dividers, muted UI background
        'accent': '#434343',       // Olive Drab - Primary accent for buttons, highlights, flow
        'brand': '#434343',        // Brand color - same as accent
        'surface-dark': '#95928A', // Darker surface color
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}