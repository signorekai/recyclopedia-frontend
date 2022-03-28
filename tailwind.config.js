const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  mode: 'jit',
  theme: {
    screens: {
      md: '768px',
      lg: '1080px',
      xl: '1600px',
      wide: '1920px',
    },
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      blue: {
        dark: '#252B5C',
        DEFAULT: '#224DBF',
      },
      purple: 'rgb(168, 85, 247)',
      black: '#15193B',
      white: '#FEFAFA',
      orange: '#FF6153',
      teal: '#28C9AA',
      bg: '#F1EDEA',
      grey: {
        dark: '#707075',
        light: '#EBe7e5',
        DEFAULT: '#c8c8c8',
      },
    },
    extend: {
      borderWidth: {
        1: '1px',
      },
      fontFamily: {
        sans: ['ibm-plex-sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
