"use client";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import {
	type NavSection,
	kaurArsipSections,
	kaurPenilaianSections,
	sdmArsipSections,
	sdmPenilaianSections,
	tpaArsipSections,
	tpaPenilaianSections,
	wadekArsipSections,
	wadekPenilaianSections,
} from "@/components/sidebar/sidebar";
import { useIsBelow2XL } from "@/hooks/use-below-2xl";
import { useUser } from "@/hooks/use-user";
import { Link } from "@inertiajs/react";
import { ClipboardList, Folder, LayoutDashboard, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function AppSidebar() {
	const user = useUser();

	const [isOpen, setIsOpen] = useState(true);
	const [activeMenu, setActiveMenu] = useState<"penilaian" | "e-archive">(
		() => {
			const saved = localStorage.getItem("activeMenu");
			if (saved === "penilaian" || saved === "e-archive") {
				return saved;
			}
			return "penilaian";
		},
	);
	const isMobile = useIsMobile();
	const pathName = window.location.pathname;
	const [menus, setMenus] = useState<NavSection[]>(tpaPenilaianSections);

	useEffect(() => {
		if (isMobile) {
			setIsOpen(false);
		} else {
			setIsOpen(true);
		}
	}, [isMobile]);

	useEffect(() => {
		localStorage.setItem("activeMenu", activeMenu);
	}, [activeMenu]);

	useEffect(() => {
		const role = user.role;
		if (role === "staf") {
			const menu =
				activeMenu === "e-archive" ? tpaArsipSections : tpaPenilaianSections;
			setMenus(menu);
			return;
		}

		if (role === "kaur") {
			const menu =
				activeMenu === "e-archive" ? kaurArsipSections : kaurPenilaianSections;
			setMenus(menu);
			return;
		}

		if (role === "sdm") {
			const menu =
				activeMenu === "e-archive" ? sdmArsipSections : sdmPenilaianSections;
			setMenus(sdmPenilaianSections);
			return;
		}

		if (role === "wadek1" || role === "wadek2") {
			const menu =
				activeMenu === "e-archive"
					? wadekArsipSections
					: wadekPenilaianSections;
			setMenus(menu);
			return;
		}
	}, [activeMenu, user.role]);

	return (
		<>
			{/* Mobile overlay */}
			{isMobile && isOpen && (
				// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
				<div
					className="fixed inset-0 bg-white z-40"
					onClick={() => setIsOpen(false)}
				/>
			)}

			{/* Toggle button for mobile */}
			{isMobile && (
				<Button
					variant="ghost"
					size="icon"
					className="fixed top-4 left-4 z-[999]"
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					<span className="sr-only">Toggle menu</span>
				</Button>
			)}

			{/* Sidebar */}
			<aside
				className={cn(
					"py-6 fixed inset-y-0 left-0 z-50 flex xl:min-w-[30vh] 2xl:min-w-[35vh] flex-col bg-white text-[#475467] transition-transform duration-300 px-4 w-full md:w-auto ",
					isMobile && !isOpen && "-translate-x-full",
				)}
			>
				<div className="flex flex-col h-full gap-8">
					{user.role !== "sdm" && (
						<div className="grid grid-cols-2">
							{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
							<div
								className={cn(
									"cursor-pointer rounded-t-xl border-b-2 py-3 px-5 border-transparent",
									activeMenu === "penilaian" &&
										"bg-[#FFF0F1] border-b-danger-80",
								)}
								onClick={() => setActiveMenu("penilaian")}
							>
								<div className="flex justify-center items-center flex-col gap-2">
									<ClipboardList
										className={cn(
											activeMenu === "penilaian"
												? "text-danger-80 "
												: "text-light-100",
											"w-4 h-4",
										)}
									/>
									<span
										className={`${
											activeMenu === "penilaian"
												? "text-danger-80 "
												: "text-light-100"
										}`}
									>
										Penilaian
									</span>
								</div>
							</div>
							{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
							<div
								className={cn(
									"cursor-pointer rounded-t-xl border-b-2 border-transparent py-3 px-5",
									activeMenu === "e-archive" &&
										"bg-[#FFF0F1] border-b-danger-80 ",
								)}
								onClick={() => setActiveMenu("e-archive")}
							>
								<div className="flex justify-center items-center flex-col gap-2">
									<Folder
										className={cn(
											activeMenu === "e-archive"
												? "text-danger-80 "
												: "text-light-100",
											"w-4 h-4",
										)}
									/>
									<span
										className={`${
											activeMenu === "e-archive"
												? "text-danger-80 "
												: "text-light-100"
										}`}
									>
										Arsip
									</span>
								</div>
							</div>
						</div>
					)}

					{/* Navigation */}
					<nav className="flex-1 px-4 space-y-8 overflow-y-scroll">
						<Link
							href="/dashboard"
							className={cn(
								"flex items-center gap-6 px-6 py-4 rounded-lg text-body-lg xl:text-h6 transition-colors",
								pathName === "/dashboard" ? "bg-primary-60" : "bg",
							)}
						>
							<LayoutDashboard
								className={`${
									pathName === "/dashboard" ? "text-white" : "text-dark-60"
								} w-5 h-5`}
							/>
							<span
								className={`${
									pathName === "/dashboard" ? "text-white" : "text-dark-60"
								}`}
							>
								Menu Utama
							</span>
						</Link>

						{menus.map((section) => (
							<div key={section.title} className="space-y-2">
								<h2 className="text-xs tracking-wider text-dark-100 font-semibold px-2">
									{section.title}
								</h2>
								<ul className="space-y-2">
									{section.items.map((item) => {
										const isActive = pathName === item.href;

										return (
											<li key={item.title}>
												<Link
													href={item.href}
													method={item.href === "/logout" ? "post" : undefined}
													className={cn(
														"flex items-center gap-6 px-6 py-4 rounded-lg text-body-lg xl:text-h6 transition-colors",
														isActive ? "bg-primary-60" : "bg",
													)}
												>
													<item.icon
														className={`${
															isActive ? "text-white" : "text-dark-60"
														} w-5 h-5`}
													/>
													<span
														className={`${
															isActive ? "text-white" : "text-dark-60"
														}`}
													>
														{item.title}
													</span>
												</Link>
											</li>
										);
									})}
								</ul>
							</div>
						))}
					</nav>
				</div>
			</aside>
		</>
	);
}
