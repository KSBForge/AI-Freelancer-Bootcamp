/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07090D',
        charcoal: '#0C0F16',
        midnight: '#10141F',
        night: '#171B28',
        ivory: '#F4EFE6',
        cream: '#FAF7F0',
        sand: '#E7DECB',
        sanddeep: '#D8CBAC',
        gold: {
          DEFAULT: '#C8A45F',
          light: '#E7CE9A',
          soft: '#D9BC80',
          deep: '#9A7A3C',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
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
