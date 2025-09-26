/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          cyan: '#00b8ff',
          green: '#00ff88',
        },
        category: {
          sns: '#ff6b6b',
          expertise: '#4ecdc4',
          marketing: '#45b7d1',
          business: '#f9ca24'
        },
        priority: {
          S: '#ff4757',
          A: '#ffa502',
          B: '#2ed573'
        },
        energy: {
          high: '#00ff88',
          medium: '#ffa502',
          low: '#ff4757'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'primary-gradient': 'linear-gradient(135deg, #00b8ff 0%, #00ff88 100%)',
      },
      animation: {
        'checkmark-bounce': 'checkmarkBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        checkmarkBounce: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}