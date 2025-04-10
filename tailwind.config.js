/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c0392b',
          dark: '#a93226',
          light: '#e74c3c',
        },
        background: {
          DEFAULT: '#0a0a0a',
          light: '#1a1a1a',
          lighter: '#2a2a2a',
        },
        text: {
          DEFAULT: '#ffffff',
          muted: '#cccccc',
        },
        accent: {
          red: '#DC2626',
          blue: '#3B82F6',
          green: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 12px 24px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}

