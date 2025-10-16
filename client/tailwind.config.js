/** @type {import('tailwindcss').Config} */
export default {
  // La section "content" est la plus importante.
  // Elle dit à Tailwind : "Regarde dans ces fichiers pour trouver les classes CSS à utiliser".
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
