/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ["Poppins", "sans-serif"]
      },
      colors: {
        primary: '#181A20',
      }
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"]
  }

}