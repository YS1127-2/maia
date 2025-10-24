/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '45': '11.25rem', // 180px
      },
      maxHeight: {
        '90': '22.5rem', // 360px
      },
      zIndex: {
        '2': '2',
      },
    },
  },
  plugins: [],
}
