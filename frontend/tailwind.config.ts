/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // <-- Yeh zaroori hai Next.js App Router ke liye
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};