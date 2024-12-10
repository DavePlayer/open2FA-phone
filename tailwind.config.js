/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        text: "#fff",
        bg: "#15161b",
        bg2: "#1a1b1e",
        secondary: "#9146FF"
      }
    },
  },
  plugins: [],
}