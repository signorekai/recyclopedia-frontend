const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  mode: 'jit',
  theme: {
    extend: {
      borderWidth: {
        1: '1px',
      },
      colors: {
        blue: {
          dark: '#252B5C',
          DEFAULT: '#224DBFA',
        },
        white: '#FEFAFA',
        orange: '#FF6153',
        teal: '#28C9AA',
        grey: {
          dark: '#707075',
          light: '#EBe7e5',
          DEFAULT: '#c8c8c8',
        },
      },
      fontFamily: {
        sans: ['ibm-plex-sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
