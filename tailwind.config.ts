import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF7F2",
        ink: "#1C1B19",
        inksoft: "#6B655C",
        line: "#E4DFD4",
        coral: "#E85D2C",
        coraldark: "#B9451D",
        sage: "#3F6B58",
        sagebg: "#E7EFE7",
        gold: "#C9A15C",
        goldbg: "#FBF3E3"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      },
      borderRadius: {
        xl2: "16px",
        xl3: "24px"
      }
    }
  },
  plugins: []
};
export default config;
