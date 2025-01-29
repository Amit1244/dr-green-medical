/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#005371"
            },
            fontFamily: {
                montserrat: ["var(--font-montserrat)"],
                quatro: ['Quatro', 'sans-serif'], // Add the font name
                manrope: ['Manrope', 'sans-serif'], // Add the font name
                fontspring: ['Fontspring', 'sans-serif'],
            },
            keyframes: {
                wiggle: {
                    "0%, 100%": { transform: "rotate(-3deg)" },
                    "50%": { transform: "rotate(3deg)" },
                },
            },
            animation: {
                wiggle: "wiggle 4s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};
