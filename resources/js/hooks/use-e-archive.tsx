"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type LayoutType = "grid" | "list";

interface EArchiveContextType {
	layout: LayoutType;
	setLayout: (layout: LayoutType) => void;
	toggleLayout: () => void;
}

const EArchiveContext = createContext<EArchiveContextType | undefined>(
	undefined,
);

export function EArchiveProvider({ children }: { children: React.ReactNode }) {
	const [layout, setLayout] = useState<LayoutType>(() => {
		if (typeof window !== "undefined") {
			const savedLayout = localStorage.getItem("e-archive-layout");
			return (savedLayout as LayoutType) || "grid";
		}
		return "grid";
	});

	const toggleLayout = () => {
		setLayout((prevLayout) => (prevLayout === "grid" ? "list" : "grid"));
	};

	useEffect(() => {
		localStorage.setItem("e-archive-layout", layout);
	}, [layout]);

	return (
		<EArchiveContext.Provider value={{ layout, setLayout, toggleLayout }}>
			{children}
		</EArchiveContext.Provider>
	);
}

export function useEArchive() {
	const context = useContext(EArchiveContext);

	if (context === undefined) {
		throw new Error("useEArchive must be used within an EArchiveProvider");
	}

	return context;
}
