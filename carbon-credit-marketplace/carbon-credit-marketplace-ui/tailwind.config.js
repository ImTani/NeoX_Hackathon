/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This includes all JS/JSX files in src
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Custom primary color
        secondary: '#3B82F6', // Custom secondary color
        accent: '#FBBF24', // Custom accent color
      }
    },
  },
  plugins: [],
}
