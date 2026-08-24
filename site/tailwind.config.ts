import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Official palette, per the founder's brand brief. Roles: Midnight/Cloud
      // are the foundation (~60%), Olive/Steel carry editorial/secondary
      // character (~20%), Gold is a sparing premium accent (~15%), Burnt
      // Orange is a sparing energetic accent (~5%). Don't use all six equally.
      colors: {
        ink: '#11151A',      // Midnight — dark backgrounds, core applications
        paper: '#E6DECD',    // Cloud — primary light background/neutral
        olive: '#484933',    // Deep Olive — editorial/creative supporting sections
        steel: '#767F83',    // Lunar Steel — secondary text, UI, borders
        gold: {
          DEFAULT: '#C6A15B', // Antique Gold — used sparingly: logo, highlights
          light: '#E4CFA0',
          dark: '#8F723D',
        },
        ember: '#B6421D',    // Burnt Orange — sparing creative accent (CTAs, the "A")
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
