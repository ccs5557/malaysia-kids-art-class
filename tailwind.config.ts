import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        foreground: '#000000',
        muted: '#6F6F6F',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        body: ['Inter', 'Arial', 'sans-serif'],
        doodle: ['"ZCOOL KuaiLe"', '"Microsoft YaHei"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
