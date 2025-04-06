import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                // Light Colors (White)
                light: {
                    100: "#848484",
                    80: "#AEAEA6",
                    60: "#CECECE",
                    40: "#F5F4F4",
                    20: "#FEF4E8",
                    DEFAULT: "#F5F4F4",
                },

                // Dark Colors (Black)
                dark: {
                    100: "#000000",
                    80: "#262626",
                    60: "#404040",
                    40: "#4F4F4F",
                    20: "#737373",
                    DEFAULT: "#000000",
                },

                // Danger Colors (Red)
                danger: {
                    100: "#990000",
                    80: "#CC0100",
                    60: "#FF666A",
                    40: "#FF9999",
                    20: "#FFE5E5",
                    DEFAULT: "#990000",
                },

                // Warning Colors (Yellow)
                warning: {
                    100: "#CB9701",
                    80: "#FFB000",
                    60: "#FFD766",
                    40: "#FFE599",
                    20: "#FFF8E5",
                    DEFAULT: "#CB9701",
                },

                // Info Colors (Blue)
                info: {
                    100: "#233852",
                    80: "#0138B1",
                    60: "#006BD2",
                    40: "#8FB4D9",
                    20: "#E6EFF6",
                    DEFAULT: "#233852",
                },
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    100: "#143529",
                    80: "#035343",
                    60: "#328466",
                    40: "#0BD0C5",
                    20: "#EFF9F5",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
            },
        },
    },

    plugins: [forms, require("tailwindcss-animate")],
};
