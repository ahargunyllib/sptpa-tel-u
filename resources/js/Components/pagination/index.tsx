import type { PaginationMeta } from "@/types";
import { router } from "@inertiajs/react";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

interface PaginationProps {
	meta: PaginationMeta;
	className?: string;
}

export default function Pagination({ meta, className }: PaginationProps) {
	const createPageURL = (pageNumber: number): string => {
		// Get the current URL and query parameters
		const url = new URL(window.location.href);
		const params = new URLSearchParams(url.search);
		params.set("page", pageNumber.toString());
		return `${url.pathname}?${params.toString()}`;
	};

	const handlePageChange = (pageNumber: number): void => {
		// Use Inertia router to navigate without a full page reload
		router.visit(createPageURL(pageNumber), {
			preserveState: true,
			preserveScroll: true,
			only: ["logs", "filters"],
		});
	};

	// Generate page numbers to display
	const generatePagination = (): (number | "dots")[] => {
		// If 7 or fewer pages, show all
		if (meta.total_page <= 7) {
			return Array.from({ length: meta.total_page }, (_, i) => i + 1);
		}

		// Always include first and last page
		// Show dots when needed
		const leftSiblingIndex = Math.max(meta.page - 1, 1);
		const rightSiblingIndex = Math.min(meta.page + 1, meta.total_page);

		// Don't show dots if only one position away from the end
		const shouldShowLeftDots = leftSiblingIndex > 2;
		const shouldShowRightDots = rightSiblingIndex < meta.total_page - 1;

		if (!shouldShowLeftDots && shouldShowRightDots) {
			// Show first 5 pages, then dots, then last page
			const leftRange = Array.from({ length: 5 }, (_, i) => i + 1);
			return [...leftRange, "dots", meta.total_page];
		}

		if (shouldShowLeftDots && !shouldShowRightDots) {
			// Show first page, then dots, then last 5 pages
			const rightRange = Array.from(
				{ length: 5 },
				(_, i) => meta.total_page - 4 + i,
			);
			return [1, "dots", ...rightRange];
		}

		if (shouldShowLeftDots && shouldShowRightDots) {
			// Show first page, dots, current page and siblings, dots, last page
			const middleRange = [leftSiblingIndex, meta.page, rightSiblingIndex];
			return [1, "dots", ...middleRange, "dots", meta.total_page];
		}

		return [];
	};

	const pages = generatePagination();

	// Helper function to combine class names
	const cn = (...classes: (string | undefined | boolean)[]): string => {
		return classes.filter(Boolean).join(" ");
	};

	return (
		<nav className={cn("flex items-center font-normal space-x-2", className)}>
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button
				onClick={() => handlePageChange(1)}
				disabled={meta.page <= 1}
				className="p-2 rounded-md hover:bg-light-40 disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="First page"
			>
				<ChevronsLeft className="h-5 w-5 text-[#BFBFBF]" />
			</button>
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button
				onClick={() => meta.page > 1 && handlePageChange(meta.page - 1)}
				disabled={meta.page <= 1}
				className="p-2 rounded-md hover:bg-light-40 disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Previous page"
			>
				<ChevronLeft className="h-5 w-5 text-[#BFBFBF]" />
			</button>

			{pages.map((page, i) =>
				page === "dots" ? (
					<span
						key={`dots-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							i
						}`}
						className="px-3 py-2"
					>
						...
					</span>
				) : (
					// biome-ignore lint/a11y/useButtonType: <explanation>
					<button
						key={page}
						onClick={() => handlePageChange(Number(page))}
						className={cn(
							"px-3 py-1 rounded-md",
							meta.page === page
								? "text-[#E3872A] font-medium"
								: "text-[#BFBFBF] hover:bg-light-40",
						)}
						aria-current={meta.page === page ? "page" : undefined}
					>
						{page}
					</button>
				),
			)}

			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button
				onClick={() =>
					meta.page < meta.total_page && handlePageChange(meta.page + 1)
				}
				disabled={meta.page >= meta.total_page}
				className="p-2 rounded-md hover:bg-light-40 disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Next page"
			>
				<ChevronRight className="h-5 w-5 text-[#BFBFBF]" />
			</button>
			{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
			<button
				onClick={() => handlePageChange(meta.total_page)}
				disabled={meta.page >= meta.total_page}
				className="p-2 rounded-md hover:bg-light-40 disabled:opacity-50 disabled:cursor-not-allowed"
				aria-label="Last page"
			>
				<ChevronsRight className="h-5 w-5 text-[#BFBFBF]" />
			</button>
		</nav>
	);
}
