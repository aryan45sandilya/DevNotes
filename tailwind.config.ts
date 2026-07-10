import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyber-cyan': '#00E5FF',
        'cyber-purple': '#8B5CF6',
        'cyber-lime': '#A3FF12',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float-blob': 'float-blob 12s infinite ease-in-out',
        'blink': 'blink 1s infinite',
      },
      keyframes: {
        'float-blob': {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)', filter: 'blur(80px)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.15)', filter: 'blur(100px)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.9)', filter: 'blur(70px)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
