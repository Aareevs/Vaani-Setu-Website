export default {
  darkMode: 'class', // enable class-based dark mode so the app can toggle it programmatically
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
};