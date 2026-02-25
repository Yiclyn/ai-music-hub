import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8a2be2", // Electric purple
      },
      textColor: {
        'primary': "#0F1419",
        'secondary': "#536471",
      },
      maxWidth: {
        'main': '1265px',
      },
    },
  },
  plugins: [],
};
export default config;
