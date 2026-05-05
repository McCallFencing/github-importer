import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
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
        charcoal: "hsl(var(--charcoal))",
        steel: "hsl(var(--steel))",
        "steel-dark": "hsl(var(--steel-dark))",
        navy: "hsl(var(--navy))",
        "navy-dark": "hsl(var(--navy-dark))",
        "steel-blue": "hsl(var(--steel-blue))",
        "steel-blue-dark": "hsl(var(--steel-blue-dark))",
        gold: "hsl(var(--gold))",
        "gold-dark": "hsl(var(--gold-dark))",
        wood: "hsl(var(--wood))",
        "wood-dark": "hsl(var(--wood-dark))",
        metal: "hsl(var(--metal))",
        "metal-light": "hsl(var(--metal-light))",
        cream: "hsl(var(--cream))",
        "slate-tech": "hsl(var(--slate-tech))",
        "slate-tech-dark": "hsl(var(--slate-tech-dark))",
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "fence-rise": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fence-grow": {
          "0%": { height: "0", opacity: "0" },
          "100%": { height: "100%", opacity: "1" },
        },
        "rail-slide": {
          "0%": { width: "0", opacity: "0" },
          "100%": { width: "100%", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fence-rise": "fence-rise 0.8s ease-out forwards",
        "fence-grow": "fence-grow 0.6s ease-out forwards",
        "rail-slide": "rail-slide 0.5s ease-out forwards",
        shimmer: "shimmer 3s linear infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;