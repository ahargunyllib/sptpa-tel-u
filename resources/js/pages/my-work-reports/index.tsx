import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/dashboard-layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router } from "@inertiajs/react";
import {
	CalendarIcon,
	CheckSquare2Icon,
	ChevronDown,
	EditIcon,
	PlusSquareIcon,
	Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
} from "../../components/ui/form";
import { Input, LabelInput } from "../../components/ui/input";
import type { WorkReport, WorkTarget } from "../../types";

type Props = {
	work_targets: (WorkTarget & {
		quarters: {
			quarter: number;
			target: number;
			progress: number;
			work_reports: WorkReport[];
		}[];
	})[];
};

export default function MyWorkReports({ work_targets }: Props) {
	return (
		<DashboardLayout>
			<Head title="Laporan Kinerja" />

			<Card className="shadow-sm">
				<CardHeader>
					<CardTitle>Laporan kinerja</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="flex flex-row gap-2">
							<Input placeholder="Cari Laporan Kinerja" />
							<Button>Cari</Button>
							<Button variant="outline">
								<CalendarIcon />
								Filter
							</Button>
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
							{work_targets.map((workTarget) => {
								return (
									<details className="flex flex-col" key={workTarget.id}>
										<summary className="px-10 py-3 text-black font-semibold bg-muted text-wrap">
											{workTarget.name}
										</summary>

										{workTarget.quarters.map((quarter) => {
											const schema = z.object({
												content: z
													.string()
													.min(1, "Komentar tidak boleh kosong"),
											});

											type FormValues = z.infer<typeof schema>;

											const form = useForm<FormValues>({
												resolver: zodResolver(schema),
												defaultValues: {
													content: "",
												},
											});

											const onSubmitHandler = form.handleSubmit((data) => {
												router.post("/dashboard/work-report", {
													content: data.content,
													work_target_id: workTarget.id,
												});
												form.reset();
											});

											const [selectedWorkReport, setSelectedWorkReport] =
												useState<WorkReport | null>(null);

											return (
												<details key={quarter.quarter} className="group">
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
																		width: `${quarter.progress}%`,
																	}}
																/>
															</div>
															<span className="px-2 text-xs text-muted-foreground">
																{quarter.progress}%
															</span>
														</div>
														<div className="flex flex-row items-center justify-end w-1/8">
															<ChevronDown className="mx-4 size-8 cursor-pointer group-open:rotate-180 transition-transform ease-in-out duration-300" />
														</div>
													</summary>
													<div className="flex flex-col">
														{quarter.work_reports.length === 0 && (
															<div className="py-3 flex flex-row items-center justify-center text-xs gap-2">
																Tidak ada Komentar Laporan Kinerja.
															</div>
														)}
														{((new Date().getMonth() + 1) % 4) + 1 ===
															quarter.quarter && (
															<details>
																<summary className="py-3 flex flex-row items-center justify-center text-xs gap-2 cursor-pointer">
																	<PlusSquareIcon className="size-4" />
																	Tambahkan Komentar Laporan Kinerja
																</summary>
																<div className="flex flex-row items-center bg-muted text-xs">
																	<div className="flex flex-shrink-0 items-center w-1/4">
																		<span className="py-3 px-14 font-medium text-black text-nowrap">
																			{new Date().toLocaleDateString("id-ID", {
																				month: "short",
																				day: "numeric",
																				year: "numeric",
																			})}
																		</span>
																	</div>
																	<div className="flex gap-4 flex-grow items-center p-2">
																		<Form {...form}>
																			<FormField
																				name="content"
																				control={form.control}
																				render={({ field }) => {
																					return (
																						<FormItem className="w-full">
																							<FormControl>
																								<LabelInput
																									className="h-8 text-left text-xs placeholder:text-xs"
																									placeholder="Komentar Laporan Kinerja"
																									{...field}
																								/>
																							</FormControl>
																						</FormItem>
																					);
																				}}
																			/>
																		</Form>
																		<div className="flex flex-row gap-2 items-center">
																			<CheckSquare2Icon
																				className="size-4 cursor-pointer text-primary-60"
																				onClick={(e) => onSubmitHandler(e)}
																			/>
																			<Trash2Icon
																				className="size-4 cursor-pointer text-danger-80"
																				onClick={() => form.reset()}
																			/>
																		</div>
																	</div>
																</div>
															</details>
														)}
														{quarter.work_reports.map((workReport) => {
															const schema = z.object({
																content: z
																	.string()
																	.min(1, "Komentar tidak boleh kosong"),
															});

															type FormValues = z.infer<typeof schema>;

															const form = useForm<FormValues>({
																resolver: zodResolver(schema),
																defaultValues: {
																	content: workReport.content,
																},
															});

															const onSubmitHandler = form.handleSubmit(
																(data) => {
																	router.put(
																		`/dashboard/work-report/${workReport.id}`,
																		{
																			content: data.content,
																		},
																		{
																			preserveState: false,
																		},
																	);
																	form.reset();
																},
															);

															const onDeleteHandler = () => {
																router.delete(
																	`/dashboard/work-report/${workReport.id}`,
																);
															};

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
																	<div className="flex gap-4 flex-grow items-center p-2">
																		<Form {...form}>
																			<FormField
																				name="content"
																				control={form.control}
																				render={({ field }) => {
																					return (
																						<FormItem className="w-full">
																							<FormControl>
																								<LabelInput
																									{...field}
																									disabled={
																										selectedWorkReport?.id !==
																										workReport.id
																									}
																									className="h-8 font-medium text-black text-wrap w-full text-left text-xs placeholder:text-xs"
																								/>
																							</FormControl>
																						</FormItem>
																					);
																				}}
																			/>
																		</Form>
																		<div className="flex flex-row gap-2 items-center">
																			{workReport.id ===
																			selectedWorkReport?.id ? (
																				<CheckSquare2Icon
																					className="size-4 cursor-pointer text-primary-60"
																					onClick={() => {
																						onSubmitHandler();
																						setSelectedWorkReport(null);
																					}}
																				/>
																			) : (
																				<EditIcon
																					className="size-4 cursor-pointer text-warning-80"
																					onClick={() => {
																						setSelectedWorkReport(workReport);
																						form.reset();
																					}}
																				/>
																			)}
																			<Trash2Icon
																				className="size-4 cursor-pointer text-danger-80"
																				onClick={() => onDeleteHandler()}
																			/>
																		</div>
																	</div>
																</div>
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
