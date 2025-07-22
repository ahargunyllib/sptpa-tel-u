import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

const START_YEAR = 2024;

export const usePeriod = () => {
	const searchParams = new URLSearchParams(window.location.search);
	const initialPeriod = searchParams.get("period");
	const initialYear = initialPeriod
		? Number.parseInt(initialPeriod, 10)
		: new Date().getFullYear();
	const [period, setPeriod] = useState<Date>(
		initialPeriod ? new Date(initialYear, 0, 1) : new Date(),
	);

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

	// useEffect(() => {
	// 	const currentYear = period.getFullYear();
	// 	const url = new URL(window.location.href);
	// 	url.searchParams.set("period", currentYear.toString());
	// 	router.get(
	// 		window.location.pathname,
	// 		{
	// 			period: currentYear.toString(),
	// 		},
	// 		{
	// 			preserveState: true,
	// 			preserveScroll: false,
	// 		},
	// 	);
	// }, [period]);

	const handleChangePeriod = (year: number) => {
		const url = new URL(window.location.href);
		url.searchParams.set("period", year.toString());
		router.get(
			window.location.pathname,
			{
				period: year.toString(),
			},
			{
				// preserveState: true,
				preserveScroll: false,
			},
		);
		setPeriod(new Date(year, 0, 1));
	};

	return {
		period,
		getCurrentYear,
		getAvailableYears,
		handleChangePeriod,
	};
};
