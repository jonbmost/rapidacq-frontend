/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // USWDS Federal Color Palette
        'uswds-blue': {
          DEFAULT: '#005EA2',
          5: '#EFF6FB',
          10: '#D9E8F6',
          20: '#AACDEC',
          30: '#73B3E7',
          40: '#4F97D1',
          50: '#2378C3',
          60: '#005EA2',
          70: '#1A4480',
          80: '#162E51',
          90: '#0D1F34',
        },
        'uswds-red': {
          DEFAULT: '#E52207',
          5: '#FEF2F5',
          warm: '#D54309',
        },
        'uswds-green': {
          DEFAULT: '#00A91C',
          cool: '#4D8055',
        },
        'uswds-gold': {
          DEFAULT: '#FFBE2E',
          20: '#F0E6CF',
        },
        'uswds-gray': {
          5: '#F0F0F0',
          10: '#E6E6E6',
          30: '#ADADAD',
          50: '#757575',
          70: '#454545',
          90: '#1B1B1B',
        },
      },
      fontFamily: {
        'sans': ['Public Sans', 'system-ui', '-apple-system', 'sans-serif'],
        'serif': ['Merriweather', 'Georgia', 'serif'],
      },
      fontSize: {
        // USWDS type scale
        'micro': ['0.625rem', { lineHeight: '1.3' }],     // 10px
        'xs': ['0.75rem', { lineHeight: '1.5' }],         // 12px
        'sm': ['0.875rem', { lineHeight: '1.5' }],        // 14px
        'base': ['1rem', { lineHeight: '1.5' }],          // 16px
        'md': ['1.0625rem', { lineHeight: '1.5' }],       // 17px
        'lg': ['1.125rem', { lineHeight: '1.5' }],        // 18px
        'xl': ['1.25rem', { lineHeight: '1.4' }],         // 20px
        '2xl': ['1.5rem', { lineHeight: '1.3' }],         // 24px
        '3xl': ['2rem', { lineHeight: '1.2' }],           // 32px
        '4xl': ['2.5rem', { lineHeight: '1.1' }],         // 40px
        '5xl': ['3rem', { lineHeight: '1.1' }],           // 48px
      },
      spacing: {
        // USWDS spacing units (in 0.5rem/8px increments)
        '05': '0.25rem',    // 4px
        '1': '0.5rem',      // 8px
        '105': '0.75rem',   // 12px
        '2': '1rem',        // 16px
        '205': '1.25rem',   // 20px
        '3': '1.5rem',      // 24px
        '4': '2rem',        // 32px
        '5': '2.5rem',      // 40px
        '6': '3rem',        // 48px
        '7': '3.5rem',      // 56px
        '8': '4rem',        // 64px
      },
    },
  },
  plugins: [],
}
