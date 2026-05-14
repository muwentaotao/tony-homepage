/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tony-dark': '#0a0a0f',
        'tony-darker': '#050508',
        'tony-card': 'rgba(255, 255, 255, 0.03)',
        'tony-card-hover': 'rgba(255, 255, 255, 0.06)',
        'tony-border': 'rgba(148, 163, 184, 0.08)',
        'tony-border-hover': 'rgba(148, 163, 184, 0.18)',
        'tony-glow': 'rgba(148, 163, 184, 0.15)',
        'tony-gold': 'rgba(212, 175, 55, 0.25)',
        'tony-gold-bright': '#d4af37',
        'tony-text': '#f0f0f0',
        'tony-muted': '#9ca3af',
        'tony-ice': '#94a3b8',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(148, 163, 184, 0.1)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
