import { useEffect, useState } from "react";

const START_YEAR = 2024;

export const usePeriod = () => {
	const [period, setPeriod] = useState<Date>(new Date());

	const getCurrentYear = () => {
		return period.getFullYear();
	};

	const getAvailableYears = () => {
		const currentYear = new Date().getFullYear();
		const years = [];
		for (let year = START_YEAR; year <= currentYear + 1; year++) {
			years.push(year);
		}
		return years;
	};

	useEffect(() => {
		const currentYear = period.getFullYear();
		const url = new URL(window.location.href);
		url.searchParams.set("period", currentYear.toString());
		window.history.replaceState({}, "", url.toString());
	}, [period]);

	return {
		period,
		setPeriod,
		getCurrentYear,
		getAvailableYears,
	};
};
