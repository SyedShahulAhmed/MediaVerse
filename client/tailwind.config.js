/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9b5cf6",
        card: "#1a1a1f",
      },
      boxShadow: {
        glow: "0 0 20px rgba(155, 92, 246, 0.3)",
      },
      animation: {
        "spin-slow": "spin 4s linear infinite",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        heading: ["Poppins", "Inter", "sans-serif"],
        futuristic: ["Orbitron", "Poppins", "sans-serif"], // optional accent font
      },
    },
  },
  plugins: [],
};
