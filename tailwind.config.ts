import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef7f0",
          100: "#fdedd9",
          200: "#fad8b3",
          300: "#f5bc7f",
          400: "#f09540",
          500: "#ed7619",
          600: "#de5810",
          700: "#b94210",
          800: "#943616",
          900: "#792f15",
          950: "#431709",
        },
        gold: {
          100: "#fef9e7",
          200: "#fcf1c6",
          300: "#f7e385",
          400: "#f2d045",
          500: "#f0c420",
          600: "#d9a40f",
          700: "#b3820e",
          800: "#916415",
          900: "#774e16",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "sparkle": "sparkle 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow-expand": "glow-expand 1.2s ease-out forwards",
        "crease-line": "crease-line 0.6s ease-out forwards",
        "particle-burst": "particle-burst 0.8s ease-out forwards",
        "slide-glow": "slide-glow 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.8)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-expand": {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(4)", opacity: "0" },
        },
        "crease-line": {
          "0%": { width: "0%", opacity: "0" },
          "50%": { width: "100%", opacity: "1" },
          "100%": { width: "100%", opacity: "0" },
        },
        "particle-burst": {
          "0%": { transform: "translate(0, 0) scale(0)", opacity: "1" },
          "100%": { transform: "translate(var(--tx), var(--ty)) scale(1.5)", opacity: "0" },
        },
        "slide-glow": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(212, 175, 55, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
