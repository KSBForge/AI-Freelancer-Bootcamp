/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#080706',
        charcoal: '#0c0c0a',
        midnight: '#10100c',
        night: '#151411',
        ivory: '#F5EFE4',
        cream: '#FAF6EC',
        sand: '#E7D09A',
        sanddeep: '#C9A45C',
        gold: {
          DEFAULT: '#C9A45C',
          light: '#E7D09A',
          soft: '#D9BC80',
          deep: '#9A7A3C',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive'],
      },
      letterSpacing: {
        widest2: '0.32em',
      },
      boxShadow: {
        lux: '0 30px 80px -24px rgba(0,0,0,0.55)',
        'lux-sm': '0 14px 40px -16px rgba(0,0,0,0.45)',
        'gold-glow': '0 10px 40px -10px rgba(200,164,95,0.45)',
        card: '0 1px 2px rgba(16,20,31,0.06), 0 12px 32px -12px rgba(16,20,31,0.18)',
      },
      transitionTimingFunction: {
        lux: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
