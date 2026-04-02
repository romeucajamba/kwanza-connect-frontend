/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1173d4',
        accent: '#00d4aa',
        'bg-light': '#f6f7f8',
        'bg-dark': '#0d1117',
        'surface-light': '#ffffff',
        'surface-dark': '#161b22',
        'border-light': '#e1e4e8',
        'border-dark': '#30363d',
        secondary: '#0D47A1',
        success: '#34C759',
        warning: '#FF9500',
        danger: '#FF3B30',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        tv: '2560px',
      },
    },
  },
  plugins: [],
}

