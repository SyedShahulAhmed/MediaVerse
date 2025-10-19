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
    },
  },
  plugins: [],
};
