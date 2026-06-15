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
        vintage: {
          cream: "#faf5ee",
          parchment: "#f5ede0",
          beige: "#e8dcc8",
          brown: "#8b7355",
          darkBrown: "#5c4a32",
          gold: "#c9a84c",
          darkGold: "#a67c2e",
          rose: "#c4a0a0",
          sage: "#a3b18a",
          burgundy: "#8b2252",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        kalam: ["var(--font-kalam)", "cursive"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "sparkle": "sparkle 2s ease-in-out infinite",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in-left": "fadeInLeft 0.6s ease-out forwards",
        "fade-in-right": "fadeInRight 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        "tape-peel": "tapePeel 0.4s ease-out forwards",
        "polaroid-appear": "polaroidAppear 0.6s ease-out forwards",
        "countdown-pulse": "countdownPulse 2s ease-in-out infinite",
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
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        tapePeel: {
          "0%": { opacity: "0", transform: "rotate(-8deg) scaleX(0.5)" },
          "100%": { opacity: "1", transform: "rotate(-4deg) scaleX(1)" },
        },
        polaroidAppear: {
          "0%": { opacity: "0", transform: "scale(0.85) rotate(-3deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        countdownPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      backgroundImage: {
        "vintage-paper": "url('/textures/paper-bg.png')",
        "paper-noise": "url('/textures/noise.png')",
      },
    },
  },
  plugins: [],
};

export default config;