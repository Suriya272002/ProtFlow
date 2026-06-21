import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // shadcn tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--md-primary))",
          foreground: "hsl(var(--md-on-primary))",
          container: "hsl(var(--md-primary-container))",
        },
        secondary: {
          DEFAULT: "hsl(var(--md-secondary))",
          foreground: "hsl(var(--md-on-secondary))",
          fixed: "hsl(var(--md-secondary-fixed))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--md-tertiary))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Material Design surface tokens
        "on-primary":         "hsl(var(--md-on-primary))",
        "on-secondary":       "hsl(var(--md-on-secondary))",
        "on-tertiary":        "hsl(var(--md-on-tertiary))",
        "on-error":           "hsl(var(--md-on-error))",
        "on-surface":         "hsl(var(--md-on-surface))",
        "on-surface-variant": "hsl(var(--md-on-surface-variant))",
        "secondary-fixed":    "hsl(var(--md-secondary-fixed))",
        "primary-container":  "hsl(var(--md-primary-container))",
        "outline-variant":    "hsl(var(--md-outline-variant))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        // Material Design type scale — value + line-height pairs
        "display-lg":  ["3.5625rem",  { lineHeight: "4rem",    letterSpacing: "-0.015625rem" }],
        "display-md":  ["2.8125rem",  { lineHeight: "3.25rem", letterSpacing: "0" }],
        "display-sm":  ["2.25rem",    { lineHeight: "2.75rem", letterSpacing: "0" }],
        "headline-xl": ["2rem",       { lineHeight: "2.5rem",  letterSpacing: "0" }],
        "headline-lg": ["2rem",       { lineHeight: "2.5rem",  letterSpacing: "0" }],
        "headline-md": ["1.75rem",    { lineHeight: "2.25rem", letterSpacing: "0" }],
        "headline-sm": ["1.5rem",     { lineHeight: "2rem",    letterSpacing: "0" }],
        "title-lg":    ["1.375rem",   { lineHeight: "1.75rem", letterSpacing: "0" }],
        "title-md":    ["1rem",       { lineHeight: "1.5rem",  letterSpacing: "0.009375rem" }],
        "title-sm":    ["0.875rem",   { lineHeight: "1.25rem", letterSpacing: "0.00625rem" }],
        "body-lg":     ["1rem",       { lineHeight: "1.5rem",  letterSpacing: "0.03125rem" }],
        "body-md":     ["0.875rem",   { lineHeight: "1.25rem", letterSpacing: "0.015625rem" }],
        "body-sm":     ["0.75rem",    { lineHeight: "1rem",    letterSpacing: "0.025rem" }],
        "label-lg":    ["0.875rem",   { lineHeight: "1.25rem", letterSpacing: "0.00625rem" }],
        "label-md":    ["0.75rem",    { lineHeight: "1rem",    letterSpacing: "0.03125rem" }],
        "label-sm":    ["0.6875rem",  { lineHeight: "1rem",    letterSpacing: "0.03125rem" }],
      },
      fontWeight: {
        "display-lg":  "400",
        "headline-xl": "700",
        "headline-lg": "700",
        "headline-md": "700",
        "body-lg":     "400",
        "body-md":     "400",
        "label-sm":    "500",
        "label-lg":    "500",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
