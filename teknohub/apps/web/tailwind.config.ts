import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-text-primary)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        accent: "var(--color-accent)",
        "accent-secondary": "var(--color-accent-secondary)",
        "accent-dim": "var(--color-accent-dim)",
        muted: "var(--color-text-muted)",
        tertiary: "var(--color-text-tertiary)",
        border: "var(--color-border)",
        glow: "var(--color-glow)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "-apple-system", "BlinkMacSystemFont", '"SF Pro Display"', '"SF Pro Text"', "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "-apple-system", "BlinkMacSystemFont", '"SF Pro Display"', "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "glow-sm": "0 0 8px var(--color-glow)",
        "glow-md": "0 4px 16px -4px var(--color-glow)",
        "glow-lg": "0 8px 24px -8px var(--color-glow)",
        "glow-xl": "0 12px 32px -8px var(--color-glow), 0 0 40px var(--color-glow-wide)",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px var(--color-glow)" },
          "50%": { boxShadow: "0 0 40px var(--color-glow), 0 0 80px var(--color-glow-wide)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        cardLift: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease forwards",
        "glow-pulse": "glowPulse 2s infinite",
        shimmer: "shimmer 1.5s infinite",
        "card-lift": "cardLift 0.2s ease forwards",
      },
    },
  },
  plugins: [typography],
};
export default config;
