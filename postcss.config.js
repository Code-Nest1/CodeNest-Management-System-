/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cnWhite: "#feffff",
        cnLightGreen: "#2b945f",
        cnDarkGreen: "#0c3740",
        cnBlack: "#000000",
        cnGrey: "#5a5a5a",
      },
    },
  },
  plugins: [],
}