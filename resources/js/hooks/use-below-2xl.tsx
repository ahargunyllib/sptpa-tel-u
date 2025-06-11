import { useEffect, useState } from "react";

export function useIsBelow2XL() {
	const [isBelow2XL, setIsBelow2XL] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 1535px)");

		const handleChange = () => setIsBelow2XL(mediaQuery.matches);

		handleChange(); // Initial check
		mediaQuery.addEventListener("change", handleChange);

		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	return isBelow2XL;
}
