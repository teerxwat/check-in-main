/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'neu-out': '10px 10px 20px #d1d5db, -10px -10px 20px #ffffff',
        'neu-out-sm': '5px 5px 10px #d1d5db, -5px -5px 10px #ffffff',
        'neu-out-lg': '20px 20px 60px #d1d5db, -20px -20px 60px #ffffff',
        'neu-in': 'inset 5px 5px 10px #d1d5db, inset -5px -5px 10px #ffffff',
        'neu-in-lg': 'inset 10px 10px 20px #d1d5db, inset -10px -10px 20px #ffffff',
      },
      colors: {
        background: '#f1f5f9', // slate-100
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: 0, transform: 'translateY(-20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: 0.5 },
          '100%': { transform: 'scale(4)', opacity: 0 },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'ripple': 'ripple var(--duration, 600ms) linear',
      },
    },
  },
  plugins: [],
}
