import forms from "@tailwindcss/forms";
import defaultTheme from "tailwindcss/defaultTheme";

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
				light: {
					20: "#FEF4E8",
					40: "#F5F4F4",
					60: "#CECECE",
					80: "#AEAEA6",
					100: "#848484",
					DEFAULT: "#F5F4F4",
				},
				dark: {
					20: "#737373",
					40: "#4F4F4F",
					60: "#404040",
					80: "#262626",
					100: "#000000",
					DEFAULT: "#000000",
				},
				danger: {
					20: "#FFE5E5",
					40: "#FF9999",
					60: "#FF666A",
					80: "#CC0100",
					100: "#990000",
					DEFAULT: "#990000",
				},
				warning: {
					20: "#FFF8E5",
					40: "#FFE599",
					60: "#FFD766",
					80: "#FFB000",
					100: "#CB9701",
					DEFAULT: "#CB9701",
				},
				info: {
					20: "#E6EFF6",
					40: "#8FB4D9",
					60: "#006BD2",
					80: "#0138B1",
					100: "#233852",
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
					20: "#EFF9F5",
					40: "#0BD0C5",
					60: "#328466",
					80: "#035343",
					100: "#143529",
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
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
				sidebar: {
					DEFAULT: "hsl(var(--sidebar-background))",
					foreground: "hsl(var(--sidebar-foreground))",
					primary: "hsl(var(--sidebar-primary))",
					"primary-foreground": "hsl(var(--sidebar-primary-foreground))",
					accent: "hsl(var(--sidebar-accent))",
					"accent-foreground": "hsl(var(--sidebar-accent-foreground))",
					border: "hsl(var(--sidebar-border))",
					ring: "hsl(var(--sidebar-ring))",
				},
			},
		},
	},

	plugins: [forms, require("tailwindcss-animate")],
};
