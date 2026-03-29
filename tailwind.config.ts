import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
        serif: ["Sedan", ...defaultTheme.fontFamily.serif],
        display: ["'Playfair Display'", "serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
} satisfies Config;
