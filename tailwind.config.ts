import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#F3EFE6",
          panel: "#EAE4D9",
          raised: "#E4DCCC",
          line: "#D7D0C3",
          line2: "#C8BEAD",
        },
        ink: {
          DEFAULT: "#171717",
          muted: "#5F5B55",
          faint: "#918B80",
        },
        signal: {
          red: "#EF3B2D",
          amber: "#A6762C",
          green: "#357A5B",
        },
      },
      fontFamily: {
        display: ["var(--font-barlow-condensed)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backgroundImage: {
        "grid-track": "linear-gradient(rgba(23,23,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(23,23,23,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-cell": "40px 40px",
      },
      keyframes: {
        sweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "boundary-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(239,59,45,0.35)" },
          "50%": { boxShadow: "0 0 0 6px rgba(239,59,45,0)" },
        },
      },
      animation: {
        sweep: "sweep 1.8s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out both",
        "boundary-pulse": "boundary-pulse 2.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
