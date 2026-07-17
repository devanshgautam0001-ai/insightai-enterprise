import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#030712',
          'bg-sec': '#0B1120',
          card: '#111827',
          accent: '#3B82F6',
          intel: '#0EA5E9',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
