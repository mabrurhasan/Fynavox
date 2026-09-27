import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9dffd",
          300: "#7cc4fb",
          400: "#36a5f6",
          500: "#0c87e8",
          600: "#0069c6",
          700: "#0154a1",
          800: "#064785",
          900: "#0b3c6e",
        },
        navy: {
          800: "#1a2744",
          900: "#0f1729",
          950: "#0a1020",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        heartbeat: "heartbeat 1.2s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "slide-in": "slide-in 0.4s ease-out",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "14%": { transform: "scale(1.15)", opacity: "0.9" },
          "28%": { transform: "scale(1)", opacity: "1" },
          "42%": { transform: "scale(1.1)", opacity: "0.95" },
          "70%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 41, 0.08), 0 4px 12px rgba(15, 23, 41, 0.04)",
        elevated:
          "0 4px 6px rgba(15, 23, 41, 0.06), 0 12px 24px rgba(15, 23, 41, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
