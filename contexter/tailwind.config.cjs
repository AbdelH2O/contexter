/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Poppins: ['Poppins', 'sans-serif'],
        Roboto: ['Roboto' , 'sans-serif'],
        Raleway: ['Raleway' , 'sans-serif'],
        Lato: ['Lato' , 'sans-serif'],
        Kurale: ['Kurale' , 'serif'],
      },
    },
  },
  plugins: [],
};
