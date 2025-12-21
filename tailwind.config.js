/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        income: '#10B981',
        expense: '#EF4444',
        balance: '#3B82F6',
      },
    },
  },
  plugins: [],
}
