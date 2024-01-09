/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    100: "#cddee7",
                    200: "#9cbdce",
                    300: "#6a9bb6",
                    400: "#397a9d",
                    500: "#075985",
                    600: "#06476a",
                    700: "#045570",
                    800: "#032435",
                    900: "#01121b",
                },
                secondary: {
                    50: "#e2eaf8",
                    100: "#d6e0ea",
                    200: "#adc1d5",
                    300: "#84a2c1",
                    400: "#5b83ac",
                    500: "#326497",
                    600: "#285079",
                    700: "#1e3c5b",
                    800: "#14283c",
                    900: "#0a141e",
                },
                effect: {
                    100: "#d7f2fe",
                    200: "#afe5fc",
                    300: "#88d7fb",
                    400: "#60caf9",
                    500: "#38bdf8",
                    600: "#2d97c6",
                    700: "#227195",
                    800: "#164c63",
                    900: "#0b2632",
                },
                optional: {
                    100: "#fee3d0",
                    200: "#fdc7a2",
                    300: "#fbab73",
                    400: "#fa8f45",
                    500: "#f97316",
                    600: "#c75c12",
                    700: "#95450d",
                    800: "#642e09",
                    900: "#321704",
                },
                error: "#ff4561",
                warning: "#fbbf24",
            },
        },
    },
    plugins: [
        require("@tailwindcss/line-clamp"),
        // ...
    ],
};
