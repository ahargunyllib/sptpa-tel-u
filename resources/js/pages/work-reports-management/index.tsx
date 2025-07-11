import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Head, router } from "@inertiajs/react";
import {
	CalendarIcon,
	ChevronDown,
	MinusSquareIcon,
	PlusSquareIcon,
	Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../components/ui/popover";
import useDebounce from "../../hooks/use-debounce";
import type { User, WorkReport, WorkTarget } from "../../types";

type Props = {
	staffs: (User & {
		work_targets: (WorkTarget & {
			quarters: {
				quarter: number;
				target: number;
				progress: number;
				work_reports: WorkReport[];
			}[];
		})[];
	})[];
};

export default function WorkReportsManagement({ staffs }: Props) {
	const [filter, setFilter] = useState<{
		search: string;
		date: Date | undefined;
	}>({
		search: "",
		date: undefined,
	});

	const debouncedFilter = useDebounce<{
		search: string;
		date: Date | undefined;
	}>(filter, 500);

	useEffect(() => {
		router.get(
			window.location.pathname,
			{
				search: debouncedFilter.search,
				date: debouncedFilter.date
					? debouncedFilter.date.toISOString().split("T")[0] // Format date to YYYY-MM-DD
					: undefined,
			},
			{
				replace: true,
				preserveState: true,
				preserveScroll: true,
				only: ["work_targets"],
			},
		);
	}, [debouncedFilter]);

	return (
		<DashboardLayout>
			<Head title="Laporan Kinerja Staf/Kaur" />

			<Card className="shadow-sm">
				<CardHeader>
					<CardTitle>Laporan kinerja</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex flex-row gap-2">
							<Input
								placeholder="Cari Laporan Kinerja"
								value={filter.search}
								onChange={(e) =>
									setFilter((prev) => ({ ...prev, search: e.target.value }))
								}
							/>
							{/* <Button>Cari</Button> */}
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline">
										<CalendarIcon />
										Filter
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="end">
									<Calendar
										mode="single"
										selected={filter.date}
										onSelect={(date) =>
											setFilter((prev) => ({
												...prev,
												date,
											}))
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							{filter.date && (
								<Button
									variant="destructive"
									onClick={() =>
										setFilter((prev) => ({
											...prev,
											date: undefined,
										}))
									}
								>
									<Trash2Icon />
								</Button>
							)}
						</div>
						<div className="overflow-x-auto relative w-full text-sm">
							{/* Header */}
							<div className="flex flex-row border-b transition-colors hover:bg-muted/50">
								<div className="flex items-center w-1/4">
									<span className="font-medium text-muted-foreground px-6 py-3">
										Periode
									</span>
								</div>
								<div className="flex items-center w-1/4">
									<span className="font-medium text-muted-foreground px-6 py-3">
										Target
									</span>
								</div>
								<div className="flex items-center flex-grow">
									<span className="font-medium text-muted-foreground px-6 py-3">
										Progress
									</span>
								</div>
								<div className="flex items-center justify-end w-1/8">
									<span className="font-medium text-muted-foreground px-6 py-3">
										Aksi
									</span>
								</div>
							</div>

							{/* Row */}
							{staffs.map((staff) => {
								return (
									<details
										key={staff.id}
										className="flex flex-col border-b transition-colors hover:bg-muted/50 group/staff"
									>
										<summary className="flex items-center justify-between w-full">
											<span className="py-3 px-4">{staff.name}</span>
											<div className="flex items-center gap-2 cursor-pointer pr-6 group-open/staff:hidden text-blue-500">
												<PlusSquareIcon className="size-4" />
												Selengkapnya
											</div>
											<div className="hidden items-center gap-2 cursor-pointer pr-6 group-open/staff:flex text-muted-foreground">
												<MinusSquareIcon className="size-4" />
												Sembunyikan
											</div>
										</summary>
										{staff.work_targets.length === 0 && (
											<div className="py-3 flex flex-row items-center justify-center text-xs gap-2 cursor-pointer">
												Tidak ada Target Kinerja.
											</div>
										)}

										{staff.work_targets.map((workTarget) => {
											return (
												<details className="flex flex-col" key={workTarget.id}>
													<summary className="px-10 py-3 text-black font-semibold bg-muted text-wrap">
														{workTarget.name}
													</summary>

													<div>
														{workTarget.quarters.map((quarter) => {
															return (
																<details
																	key={quarter.quarter}
																	className="group/quarter"
																>
																	<summary className="flex flex-row items-center border-b">
																		<div className="flex items-center w-1/4">
																			<span className="py-3 px-10 font-medium text-black ">
																				Triwulan {quarter.quarter}
																			</span>
																		</div>
																		<div className="flex items-center w-1/4">
																			<span className="py-3 px-6 font-medium text-black">
																				{quarter.target}
																			</span>
																		</div>
																		<div className="flex flex-row items-center flex-grow">
																			<div className="w-full h-2 ml-6 bg-muted rounded-lg">
																				<div
																					className="bg-primary-60 h-2 rounded-lg"
																					style={{
																						width: `${quarter.progress * 100 > 100 ? 100 : quarter.progress * 100}%`,
																					}}
																				/>
																			</div>
																			<span className="px-2 text-xs text-muted-foreground">
																				{(quarter.progress * 100).toFixed(1)}%
																			</span>
																		</div>
																		<div className="flex flex-row items-center justify-end w-1/8">
																			<ChevronDown className="mx-4 size-8 cursor-pointer group-open/quarter:rotate-180 transition-transform ease-in-out duration-300" />
																		</div>
																	</summary>
																	<div className="flex flex-col">
																		{quarter.work_reports.length === 0 && (
																			<div className="py-3 flex flex-row items-center justify-center text-xs gap-2">
																				Tidak ada Komentar Laporan Kinerja.
																			</div>
																		)}

																		{quarter.work_reports.map((workReport) => {
																			return (
																				<div
																					key={workReport.id}
																					className="flex flex-row items-center bg-muted text-xs"
																				>
																					<div className="flex flex-shrink-0 items-center w-1/4">
																						<span className="py-3 px-14 font-medium text-black text-nowrap">
																							{new Date(
																								workReport.created_at,
																							).toLocaleDateString("id-ID", {
																								month: "short",
																								day: "numeric",
																								year: "numeric",
																							})}
																						</span>
																					</div>
																					<div className="flex flex-grow items-center">
																						<span className="py-3 px-6 font-medium text-black text-wrap">
																							{workReport.content}
																						</span>
																					</div>
																				</div>
																			);
																		})}
																	</div>
																</details>
															);
														})}
													</div>
												</details>
											);
										})}
									</details>
								);
							})}
						</div>
					</div>
				</CardContent>
			</Card>
		</DashboardLayout>
	);
}
