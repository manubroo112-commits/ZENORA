/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        obsidian: "#17100c",
        graphite: "#2a1d15",
        platinum: "#f4eadc",
        mist: "rgba(255,247,236,0.68)"
      },
      boxShadow: {
        glow: "0 0 40px rgba(100, 160, 255, 0.22)",
        violet: "0 0 55px rgba(168, 85, 247, 0.24)"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseglow: "pulseglow 4s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -18px, 0)" }
        },
        pulseglow: {
          "0%, 100%": { opacity: 0.48, transform: "scale(1)" },
          "50%": { opacity: 0.82, transform: "scale(1.04)" }
        }
      }
    }
  },
  plugins: []
};
