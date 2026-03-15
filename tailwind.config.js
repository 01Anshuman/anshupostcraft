/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        linkedin: {
          blue: '#0A66C2',
          dark: '#004182',
          light: '#EBF3FB',
        },
      },
    },
  },
  plugins: [],
}
