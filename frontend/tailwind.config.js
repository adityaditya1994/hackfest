/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Jarvis Analytics Color Palette - using E10075 as primary
        primary: {
          50: '#fef2f7',
          100: '#fce7f0',
          200: '#f9d0e1',
          300: '#f5a8c8',
          400: '#ee74aa',
          500: '#E10075', // Main magenta color
          600: '#c8006a',
          700: '#a8005a',
          800: '#8a004a',
          900: '#72003e',
          950: '#460022',
        },
        // Clean grays for modern look
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Chart colors matching screenshot
        chart: {
          blue: '#4f46e5',  // Indigo blue for charts
          'blue-light': '#6366f1',
          green: '#10b981', // Emerald green for charts  
          'green-light': '#34d399',
          orange: '#f59e0b', // Amber for accents
          'orange-light': '#fbbf24',
        },
        // Status colors
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
        info: '#0284c7',
      },
      fontFamily: {
        // Clean, modern typography
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}

