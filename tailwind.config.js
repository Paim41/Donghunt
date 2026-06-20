/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        accent: '#22c55e',
        base: '#0b0f1a',
        glass: 'rgba(255,255,255,0.05)',
      },
      fontFamily: {
        heading: ['Orbitron', 'Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: { glow: '0 0 25px rgba(124,58,237,0.45)' },
    },
  },
  plugins: [],
};
