import { Calendar } from "@/components/ui/calendar";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Button, buttonVariants } from "../../components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
} from "../../components/ui/form";
import { Input, LabelInput } from "../../components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "../../components/ui/popover";
import useDebounce from "../../hooks/use-debounce";
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
			<Head title="Laporan Kinerja" />

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
							{work_targets.map((workTarget) => {
								return (
									<details className="flex flex-col" key={workTarget.id}>
										<summary className="px-10 py-3 text-black font-semibold bg-muted text-wrap">
											{workTarget.name}
										</summary>

										{workTarget.quarters.map((quarter) => {
											return (
												<WorkTargetQuarterRow
													key={quarter.quarter}
													workTarget={workTarget}
													quarter={quarter}
												/>
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

function WorkTargetQuarterRow({
	workTarget,
	quarter,
}: {
	workTarget: WorkTarget;
	quarter: {
		quarter: number;
		target: number;
		progress: number;
		work_reports: WorkReport[];
	};
}) {
	const schema = z.object({
		content: z.string().min(1, "Komentar tidak boleh kosong"),
	});

	type FormValues = z.infer<typeof schema>;

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			content: "",
		},
	});

	const onSubmitHandler = form.handleSubmit((data) => {
		router.post(
			"/dashboard/work-report",
			{
				content: data.content,
				work_target_id: workTarget.id,
			},
			{
				preserveState: true,
			},
		);
		form.reset();
	});

	const [selectedWorkReport, setSelectedWorkReport] =
		useState<WorkReport | null>(null);

	const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;

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
								width: `${quarter.progress * 100 > 100 ? 100 : quarter.progress * 100}%`,
							}}
						/>
					</div>
					<span className="px-2 text-xs text-muted-foreground">
						{(quarter.progress * 100).toFixed(1)}%
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
				{currentQuarter === quarter.quarter && (
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
					return (
						<WorkReportRow
							key={workReport.id}
							workReport={workReport}
							selectedWorkReport={selectedWorkReport}
							setSelectedWorkReport={setSelectedWorkReport}
						/>
					);
				})}
			</div>
		</details>
	);
}

function WorkReportRow({
	workReport,
	selectedWorkReport,
	setSelectedWorkReport,
}: {
	workReport: WorkReport;
	selectedWorkReport: WorkReport | null;
	setSelectedWorkReport: (workReport: WorkReport | null) => void;
}) {
	const schema = z.object({
		content: z.string().min(1, "Komentar tidak boleh kosong"),
	});

	type FormValues = z.infer<typeof schema>;

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			content: workReport.content,
		},
	});

	const onSubmitHandler = form.handleSubmit((data) => {
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
	});

	const onDeleteHandler = () => {
		router.delete(`/dashboard/work-report/${workReport.id}`);
	};

	return (
		<div
			key={workReport.id}
			className="flex flex-row items-center bg-muted text-xs"
		>
			<div className="flex flex-shrink-0 items-center w-1/4">
				<span className="py-3 px-14 font-medium text-black text-nowrap">
					{new Date(workReport.created_at).toLocaleDateString("id-ID", {
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
											disabled={selectedWorkReport?.id !== workReport.id}
											className="h-8 font-medium text-black text-wrap w-full text-left text-xs placeholder:text-xs"
										/>
									</FormControl>
								</FormItem>
							);
						}}
					/>
				</Form>
				<div className="flex flex-row gap-2 items-center">
					{workReport.id === selectedWorkReport?.id ? (
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
					<AlertDialog>
						<AlertDialogTrigger>
							<Trash2Icon className="size-4 cursor-pointer text-danger-80" />
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Apakah Anda yakin ingin menghapus laporan ini?
								</AlertDialogTitle>
								<AlertDialogDescription>
									Setelah dihapus, laporan ini tidak dapat dikembalikan lagi.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel asChild>
									<Button variant="outline">Batalkan</Button>
								</AlertDialogCancel>
								<AlertDialogAction
									className={buttonVariants({
										variant: "destructive",
									})}
									onClick={() => onDeleteHandler()}
								>
									Hapus
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>
		</div>
	);
}
