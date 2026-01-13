import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          500: '#3b82f6',
          600: '#2563eb'
        }
      }
    }
  },
  plugins: []
};

export default config;
