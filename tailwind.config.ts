import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#F8FAF8",
        "surface-alt": "#F0F7F0",
        border: "#E2EDE2",
        primary: {
          DEFAULT: "#16A34A",
          hover: "#15803D",
          light: "#DCFCE7",
          dark: "#14532D",
          foreground: "#FFFFFF",
        },
        "text-primary": "#0F1F0F",
        "text-muted": "#6B7B6B",
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        warning: "#F59E0B",
        success: "#22C55E",
        foreground: "#0F1F0F",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F1F0F",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0F1F0F",
        },
        secondary: {
          DEFAULT: "#F0F7F0",
          foreground: "#0F1F0F",
        },
        muted: {
          DEFAULT: "#F8FAF8",
          foreground: "#6B7B6B",
        },
        accent: {
          DEFAULT: "#F0F7F0",
          foreground: "#0F1F0F",
        },
        input: "#E2EDE2",
        ring: "#16A34A",
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        "pulse-green": "pulse-green 2s ease-in-out infinite",
        marquee: "marquee 20s linear infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-green": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        premium: "rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px",
        float: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
