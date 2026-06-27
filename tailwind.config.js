/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'on-secondary-container': '#636564', 'surface-bright': '#fcf9f4', 'inverse-on-surface': '#f3f0eb',
        'on-primary': '#ffffff', 'surface-variant': '#e5e2dd', 'secondary-container': '#e2e3e1',
        'surface-container-high': '#ebe8e3', 'inverse-primary': '#ffb4ab', primary: '#ba0013',
        'on-surface': '#1c1c19', 'surface-container': '#f0ede9', background: '#fcf9f4',
        'primary-fixed': '#ffdad6', 'primary-container': '#e31e24', 'outline-variant': '#e7bdb8',
        'on-secondary-fixed-variant': '#454746', 'surface-container-highest': '#e5e2dd',
        'on-surface-variant': '#5d3f3c', 'surface-container-low': '#f6f3ee',
        'surface-container-lowest': '#ffffff', 'on-secondary': '#ffffff', 'primary-fixed-dim': '#ffb4ab',
        secondary: '#5d5f5e', error: '#ba1a1a'
      },
      fontFamily: { headline: ['Manrope', 'sans-serif'], body: ['Work Sans', 'sans-serif'] },
      borderRadius: { DEFAULT: '0.125rem', lg: '0.25rem', xl: '0.5rem' }
    }
  },
  plugins: []
};
