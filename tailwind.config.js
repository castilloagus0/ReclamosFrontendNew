/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'background-light': 'var(--color-background-light)',
        'background-white': 'var(--color-background-white)',
        'background-dark': 'var(--color-background-dark)',
      },
      fontFamily: {
        display: 'var(--font-display)',
      },
    },
  },
  plugins: [],
}

