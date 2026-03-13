/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:      '#07090F',
          surface: '#0D1117',
          card:    '#121820',
          border:  '#1E2837',
          cyan:    '#00D4FF',
          orange:  '#FF5C00',
          muted:   '#4A5568',
          text:    '#E8EDF5',
          sub:     '#8896A8',
        },
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
      animation: {
        'pulse-cyan': 'pulse-cyan 2s ease-in-out infinite',
        'slide-up':   'slide-up 0.4s ease-out',
        'fade-in':    'fade-in 0.6s ease-out',
      },
      keyframes: {
        'pulse-cyan': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,212,255,0.4)' },
          '50%':       { boxShadow: '0 0 0 12px rgba(0,212,255,0)' },
        },
        'slide-up': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
