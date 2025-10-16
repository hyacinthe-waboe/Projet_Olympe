/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Cette ligne dit à Tailwind de scanner tous vos fichiers React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}