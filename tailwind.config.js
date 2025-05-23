/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        light: "var(--color-light)",
        dark: "var(--color-dark)",
        "link": "#474a77",
        "sweet-accent": "#F87171",
        "card-bg": "#f9fafb",
        "style-txt": "#f9fafb",
      }
    },
  },
  plugins: [],
}
