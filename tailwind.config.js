/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sora", "sans-serif"],
      },
      colors: {
        background: "#0c0c0c",
        foreground: "#ffffff",
        muted: "#9ca3af",
        border: "#1f2937",
        gold: "#facc15",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
