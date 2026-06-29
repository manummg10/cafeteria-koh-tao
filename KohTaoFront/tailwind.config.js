/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Unificamos la Sans para que sea limpia y moderna (títulos, botones, logo)
        sans: ['Montserrat', 'Inter', 'sans-serif'],
        // Unificamos la Serif para que tenga ese toque clásico y acogedor de cafetería (descripciones, cursivas)
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}