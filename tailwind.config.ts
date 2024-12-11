import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 100% 100%, var(--tw-gradient-stops))",
        img: "url('/img.png')",
      },
      fontSize: {
        sm: ["12px", "16px"], // Default font-size for small screens
        md: ["14px", "20px"], // Adjusted for medium screens
        lg: ["16px", "24px"], // Adjusted for large screens
        xl: ["18px", "28px"], // Adjusted for extra-large screens
      },
      padding: {
        sm: "8px", // Default padding for small screens
        md: "16px", // Adjusted padding for medium screens
        lg: "24px", // Adjusted padding for large screens
      },
      margin: {
        sm: "8px", // Default margin for small screens
        md: "16px", // Adjusted margin for medium screens
        lg: "24px", // Adjusted margin for large screens
      },
      screens: {
        sm: "640px",
        md: "868px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [require("daisyui")],
};

export default config;
