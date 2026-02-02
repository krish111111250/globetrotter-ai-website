/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        aero: {
          900: '#000000',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
          50: '#FAFAFA',
        },
        primary: {
          600: '#2563EB', // Vibrant Blue
          500: '#3B82F6',
          400: '#60A5FA',
        },
        accent: {
          gold: '#3B82F6',
          teal: '#60A5FA',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
