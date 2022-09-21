module.exports = {
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  mode: "jit",
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      colors: {
        transparent: "transparent",
        invisible: "rgba(1,1,1,0)",
        current: "currentColor",
        primary: "#fff",
        accent: "rgba(204, 22, 22, 0.5)",
        main: "#6828b1",
        dark: "#111",
      },
      fontFamily: {
        primary: ["Inter", "sans-serif"],
      },
      fontSize: {
        xxs: "0.6rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
