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
      mlg: '1200px',
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
      coral: { DEFAULT: '#FF6153', dark: 'rgb(219, 45, 30)' },
      teal: '#28C9AA',
      red: '#D40606',
      bg: '#F1EDEA',
      grey: {
        dark: '#707075',
        mid: '#87878C',
        light: '#EBe7e5',
        DEFAULT: '#c8c8c8',
      },
    },
    extend: {
      animation: {
        featured: 'animateFeatured 2s infinite linear',
      },
      keyframes: {
        animateFeatured: {
          '0%': { 'background-position': '0 0' },
          '100%': { 'background-position': '100% 0' },
        },
      },
      letterSpacing: {
        2: '2px',
      },
      gridTemplateRows: {
        8: 'repeat(8, minmax(0, 1fr))',
        12: 'repeat(12, minmax(0, 1fr))',
      },
      borderRadius: {
        smd: '4px',
        30: '30px',
        22: '22px',
        18: 'px',
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
      cursor: {
        'prev-btn': 'url(/img/previous-btn.png),pointer',
        'next-btn': 'url(/img/next-btn.png),pointer',
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
