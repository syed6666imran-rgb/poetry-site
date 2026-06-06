import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#5A1E2B',
          light: '#7a2a3b',
          dark: '#3d1520',
        },
        'rose-gold': '#D4A373',
        'soft-pink': '#F8E8E8',
        ivory: '#FFFDF8',
        cream: '#FAF6F0',
        blush: '#f2d9d9',
        'warm-gold': '#E6C068',
        midnight: '#1E293B',
      },
      fontFamily: {
        sans: ['var(--font-lato)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
      animation: {
        'petal-fall': 'petalFall 8s linear infinite',
        'heart-rise': 'heartRise 10s linear infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'modal-in': 'modalIn 0.4s ease',
      },
      keyframes: {
        petalFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '0.8' },
          '50%': { transform: 'translateY(45vh) rotate(180deg) translateX(40px)', opacity: '0.5' },
          '100%': { transform: 'translateY(100vh) rotate(360deg) translateX(-20px)', opacity: '0' },
        },
        heartRise: {
          '0%': { transform: 'translateY(100vh) scale(0)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '80%': { opacity: '0.3' },
          '100%': { transform: 'translateY(-50px) scale(1.2)', opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.6' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.1)', opacity: '1' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'none' },
        },
        modalIn: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'none', opacity: '1' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}

export default config
