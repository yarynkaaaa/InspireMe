/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a12", // Neutral 950
        secondary: "#111118", // Neutral 900
        accent: "#c084fc", // Neon Purple 400
        plum: "#301a47", // Plum 500
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
        heading: ["Sora", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
