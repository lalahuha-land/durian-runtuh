/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        durian: {
          primary: '#007852',
          secondary: '#01AF5E',
          light: '#95D598',
          cream: '#F5F6E4',
          yellow: '#FFE32B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
} 