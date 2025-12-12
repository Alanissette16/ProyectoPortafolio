import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Poppins"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        lavender: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
        },
        blush: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
        },
        cream: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
        },
        sage: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      borderRadius: {
        'blob': '60% 40% 30% 70% / 60% 30% 70% 40%',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-feminine': 'linear-gradient(135deg, #fce7f3 0%, #f3e8ff 50%, #e0e7ff 100%)',
      },
    },
  },
  daisyui: {
    themes: [
      {
        rosegold: {
          "primary": "#f472b6",
          "primary-content": "#ffffff",
          "secondary": "#c084fc",
          "secondary-content": "#ffffff",
          "accent": "#fb7185",
          "accent-content": "#ffffff",
          "neutral": "#fdf2f8",
          "neutral-content": "#831843",
          "base-100": "#fffbfe",
          "base-200": "#fdf2f8",
          "base-300": "#fce7f3",
          "base-content": "#831843",
          "info": "#7dd3fc",
          "success": "#86efac",
          "warning": "#fde68a",
          "error": "#fca5a5",
        },
      },
      {
        lavender: {
          "primary": "#a855f7",
          "primary-content": "#ffffff",
          "secondary": "#ec4899",
          "secondary-content": "#ffffff",
          "accent": "#8b5cf6",
          "accent-content": "#ffffff",
          "neutral": "#faf5ff",
          "neutral-content": "#581c87",
          "base-100": "#fefcff",
          "base-200": "#faf5ff",
          "base-300": "#f3e8ff",
          "base-content": "#581c87",
          "info": "#93c5fd",
          "success": "#86efac",
          "warning": "#fde68a",
          "error": "#fca5a5",
        },
      },
      {
        rosepink: {
          "primary": "#ec4899",
          "primary-content": "#ffffff",
          "secondary": "#f472b6",
          "secondary-content": "#ffffff",
          "accent": "#fb7185",
          "accent-content": "#ffffff",
          "neutral": "#fdf2f8",
          "neutral-content": "#9d174d",
          "base-100": "#fff0f5",
          "base-200": "#ffe4ec",
          "base-300": "#ffd6e0",
          "base-content": "#9d174d",
          "info": "#f9a8d4",
          "success": "#fbcfe8",
          "warning": "#fda4af",
          "error": "#f43f5e",
        },
      },
    ],
    darkTheme: 'rosepink',
    base: true,
    styled: true,
    utils: true,
  },
  plugins: [daisyui],
}
