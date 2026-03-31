export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#F7C600",
          dark: "#E6B800",
          light: "#FFF8CC",
        },
        ui: {
          black: "#1A1A1A", // Softer black
          white: "#FFFFFF",
          bg: "#F8FAFC",    // Clean dashboard background
          gray: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
          }
        },
        status: {
          green: "#10B981", // More modern green
          red: "#EF4444",   // More modern red
          orange: "#F59E0B",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
