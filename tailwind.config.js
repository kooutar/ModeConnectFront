/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#7f13ec",
        "primary-hover": "#6810c1",
        "background-light": "#FFFFFF",
        "surface-light": "#f9fafb",
        "border-light": "#e2e8f0",
        "text-main": "#0f172a",
        "text-muted": "#64748b",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}