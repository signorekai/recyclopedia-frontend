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
        DEFAULT: '#123592',
        light: '#224DBF',
      },
      purple: '#A855F7',
      black: '#15193B',
      white: {
        pure: '#ffffff',
        DEFAULT: '#FEFAFA',
      },
      coral: '#FF6153',
      teal: '#28C9AA',
      bg: '#F1EDEA',
      grey: {
        dark: '#707075',
        mid: '#87878C',
        light: '#EBe7e5',
        DEFAULT: '#c8c8c8',
      },
    },
    extend: {
      gridTemplateRows: {
        8: 'repeat(8, minmax(0, 1fr))',
        12: 'repeat(12, minmax(0, 1fr))',
      },
      borderRadius: {
        smd: '4px',
        30: '30px',
      },
      width: {
        'screen-1/4': '25vw',
        'screen-1/2': '50vw',
        'screen-3/4': '75vw',
      },
      borderWidth: {
        1: '1px',
      },
      fontFamily: {
        sans: ['ibm-plex-sans', ...defaultTheme.fontFamily.sans],
        archivo: ['Archivo', ...defaultTheme.fontFamily.sans],
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
      },
    },
  },
  plugins: [],
};
