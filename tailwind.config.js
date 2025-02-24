/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        bubble2: "#1b0618",
        bubble: "#5d0076",
        bubb: "#290924",
      },
      height: {
        100: "551px",
      },
      weigth: {
        100: "40rem",
      },
      spacing: {
        "3px": "585px",
        "2px": "500px",
      },
      zIndex: {
        a: "2,147,483,647",
      },
      fontFamily: {
        g: ["Kind-Sans"],
        o: ["Origin-Tech"],
      },
    },
  },
  plugins: [],
};
