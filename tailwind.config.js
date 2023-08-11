/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  darkMode: 'class',
  content: ["./*.{html,js}"],
  theme: {
    extend: {},
    screens: {
      'xxs': '280px',
      'xs': '375px',
      ...defaultTheme.screens,
    },
  },
  plugins: [],
}

