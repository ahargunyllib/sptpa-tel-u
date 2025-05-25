import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function capitalize(str: string, locale = "id-ID"): string {
	return str.charAt(0).toLocaleUpperCase(locale) + str.slice(1);
}
