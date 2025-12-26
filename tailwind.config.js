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
        cnLightGreen: "#2b945f", // Professional Emerald
        cnDarkGreen: "#0c3740", // Deep Forest/Navy
        cnBlack: "#1a1a1a",     // Softer Black
        cnGrey: "#64748b",      // Modern Slate Grey
      },
    },
  },
  plugins: [],
}