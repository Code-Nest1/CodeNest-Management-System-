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
        cnDarkGreen: "#0c3740",
       cnLightGreen: "#2b945f",
        cnBlack: "#000000",
        cnGrey: "#5a5a5a",
      },  
    },
  },
  plugins: [],
}