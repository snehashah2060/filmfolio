import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#101014",
          primary: "#101014",
          secondary: "#1B1B21",
          card: "#222229",
          hover: "#2A2A33",
          border: "#34343A",
          borderLight: "#484852",
        },
        gold: {
          DEFAULT: "#C5A46D",
          primary: "#C5A46D",
          secondary: "#E0C18B",
          dark: "#9E814E",
          subtle: "rgba(197, 164, 109, 0.12)",
          hover: "#D4B67E",
        },
        cinema: {
          text: "#F5F1E8",
          muted: "#A6A19A",
          subtle: "#6E6A63",
          red: "#E5484D",
          green: "#46A758",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
      },
      boxShadow: {
        gold: "0 0 25px -5px rgba(197, 164, 109, 0.25)",
        "gold-sm": "0 0 15px -3px rgba(197, 164, 109, 0.2)",
        "gold-lg": "0 0 40px -10px rgba(197, 164, 109, 0.35)",
        cinematic: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #E0C18B 0%, #C5A46D 100%)",
        "gold-gradient-subtle": "linear-gradient(135deg, rgba(224, 193, 139, 0.15) 0%, rgba(197, 164, 109, 0.05) 100%)",
        "obsidian-gradient": "linear-gradient(180deg, rgba(16, 16, 20, 0.6) 0%, #101014 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
