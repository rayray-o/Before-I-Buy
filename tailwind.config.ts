import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F8F8F4",
          50: "#FDFDFB",
          100: "#F8F8F4",
          200: "#F0F0E9",
          300: "#E4E4DA",
        },
        ink: {
          DEFAULT: "#1C2321",
          light: "#4A5450",
          faint: "#7C8680",
        },
        sage: {
          50: "#EEF4EF",
          100: "#DCE9DE",
          200: "#B7D3BC",
          300: "#8FB998",
          400: "#649D72",
          500: "#4C7A5E",
          600: "#3B6049",
          700: "#2C4837",
        },
        coral: {
          50: "#FBEEEA",
          100: "#F5D9CF",
          200: "#E7AF9C",
          300: "#D6816A",
          400: "#C7644A",
          500: "#B04B33",
          600: "#8E3A28",
          700: "#6D2C1E",
        },
        amber: {
          50: "#FBF2E3",
          100: "#F3DFB4",
          200: "#E7C481",
          300: "#DBA84E",
          400: "#C98A2C",
          500: "#A66E1F",
          600: "#7D5217",
        },
        line: "#DBDBD1",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "stamp-down": {
          "0%": { transform: "scale(2.2) rotate(-14deg)", opacity: "0" },
          "60%": { transform: "scale(0.92) rotate(-8deg)", opacity: "1" },
          "80%": { transform: "scale(1.05) rotate(-8deg)" },
          "100%": { transform: "scale(1) rotate(-8deg)", opacity: "1" },
        },
        "rise-in": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(176,75,51,0.35)" },
          "100%": { boxShadow: "0 0 0 10px rgba(176,75,51,0)" },
        },
      },
      animation: {
        "stamp-down": "stamp-down 0.5s cubic-bezier(.2,.8,.3,1.2) forwards",
        "rise-in": "rise-in 0.4s ease-out forwards",
        "confetti-fall": "confetti-fall linear forwards",
        "slide-up": "slide-up 0.35s cubic-bezier(.2,.8,.2,1) forwards",
        "slide-in-right": "slide-in-right 0.35s cubic-bezier(.2,.8,.2,1) forwards",
        "fade-in": "fade-in 0.25s ease-out forwards",
        "pulse-ring": "pulse-ring 1.6s cubic-bezier(0,0,.2,1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
