

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}



// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}", 
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx}",
//     "./pages/**/*.{js,ts,jsx,tsx}",
//     "./app/**/*.{js,ts,jsx,tsx}",
//     "./public/index.html"
//   ],
//   theme: {
//     extend: {
//       colors: {
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: "hsl(var(--primary))",
//         secondary: "hsl(var(--secondary))",
//         muted: "hsl(var(--muted))",
//         accent: "hsl(var(--accent))",
//         destructive: "hsl(var(--destructive))",
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//       },
//       borderRadius: {
//         DEFAULT: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         lg: "calc(var(--radius) + 2px)",
//       },
//       animation: {
//         "fade-in-slide": "fade-in-slide 0.6s cubic-bezier(0.18,0.7,0.32,1.01)",
//       },
//       keyframes: {
//         "fade-in-slide": {
//           from: { opacity: "0", transform: "translateY(20px)" },
//           "80%": { opacity: "1", transform: "translateY(-2px)" },
//           to: { opacity: "1", transform: "translateY(0)" },
//         },
//       },
//     },
//   },
//   plugins: [
//     require("@tailwindcss/forms"),
//     require("@tailwindcss/typography"),
//     require("@tailwindcss/aspect-ratio"),
//   ],
// };
