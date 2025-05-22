import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input, LabelInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import {
	ArrowUpRightIcon,
	CheckSquare2Icon,
	Edit3Icon,
	FileTextIcon,
	Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { capitalize } from "../../../lib/utils";
import type { User, WorkTarget, WorkTargetValue } from "../../../types";
import Pagination from "../../pagination";
import { Button } from "../../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../ui/table";

export default function PerformanceAssessmentsCard({
	role,
	staffs,
	workTargets,
	performances,
}: {
	role: string;
	staffs: (User & {
		average_first_quarter_score: number;
		average_second_quarter_score: number;
		average_third_quarter_score: number;
		average_fourth_quarter_score: number;
	})[];
	workTargets: WorkTarget[];
	performances: (WorkTarget & WorkTargetValue)[];
}) {
	return (
		<Card className="shadow-sm">
			<CardHeader>
				<CardTitle>Penilaian Kinerja</CardTitle>
				<CardDescription>
					Dibawah ini merupakan {capitalize(role)} yang Anda kelola
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="py-3 px-4 text-center">No</TableHead>
								<TableHead className="py-3 px-4 w-full">
									Nama {capitalize(role)}
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Target Kinerja
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Penilaian
								</TableHead>
								<TableHead className="py-3 px-4 text-center text-nowrap">
									Nilai TW1
								</TableHead>
								<TableHead className="py-3 px-4 text-center text-nowrap">
									Nilai TW2
								</TableHead>
								<TableHead className="py-3 px-4 text-center text-nowrap">
									Nilai TW3
								</TableHead>
								<TableHead className="py-3 px-4 text-center text-nowrap">
									Nilai TW4
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{staffs.map((staff, idx) => {
								return (
									<TableRow key={staff.id}>
										<TableCell className="py-3 px-4">{idx + 1}</TableCell>
										<TableCell className="py-3 w-full px-4">
											{staff.name}
										</TableCell>
										<TableCell className="py-3 w-full px-4">
											<WorkTargetsDialog
												role={role}
												workTargets={workTargets}
											/>
										</TableCell>
										<TableCell className="py-3 w-full px-4">
											<PerformanceAssessmentsDialog
												performances={performances}
											/>
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{staff.average_first_quarter_score}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{staff.average_second_quarter_score}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{staff.average_third_quarter_score}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{staff.average_fourth_quarter_score}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>

				{/* Pagination component */}
				<div className="mt-6 flex justify-between items-center">
					<Pagination
						meta={{
							total_page: 1,
							limit: 10,
							page: 1,
							total_data: 20,
						}}
					/>
					<div className="flex items-center space-x-2">
						<span className="text-sm text-muted-foreground">
							Items per page
						</span>
						<Select
							// value={filters.per_page?.toString() || "10"}
							value={"10"}
							onValueChange={(value) => {
								const url = new URL(window.location.href);
								url.searchParams.set("per_page", value);
								url.searchParams.delete("page"); // Reset to page 1
								window.location.href = url.toString();
							}}
						>
							<SelectTrigger className="w-[70px]">
								<SelectValue placeholder="10" />
							</SelectTrigger>
							<SelectContent>
								{[10, 25, 50, 100].map((value) => (
									<SelectItem key={value} value={value.toString()}>
										{value}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function WorkTargetsDialog({
	role,
	workTargets,
}: {
	role: string;
	workTargets: WorkTarget[];
}) {
	const [selectedWorkTargetId, setSelectedWorkTargetId] = useState<
		string | null
	>(null);

	const createWorkTargetSchema = z.object({
		name: z
			.string()
			.min(1, { message: "Nama target kinerja tidak boleh kosong" }),
	});

	const form = useForm<z.infer<typeof createWorkTargetSchema>>({
		resolver: zodResolver(createWorkTargetSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		console.log(data);
		// router.post("/dashboard/performance/work-target", data, {});
		form.reset();
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="bg-transparent hover:bg-transparent active:bg-transparent text-info-60"
				>
					<ArrowUpRightIcon />
					Tampil
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl">
				<DialogHeader>
					<DialogTitle>Daftar Target Kinerja: name</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex flex-row gap-2">
						<Form {...form}>
							<form onSubmit={onSubmit} className="flex w-full gap-2">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormControl>
												<Input
													className="w-full"
													placeholder="Tuliskan target kerja disini"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<Button type="submit">Tambahkan</Button>
							</form>
						</Form>
					</div>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="py-3 px-4 text-center">No</TableHead>
									<TableHead className="py-3 px-4 w-full">
										Daftar Target Kinerja
									</TableHead>
									<TableHead className="py-3 px-4 text-center">
										Satuan
									</TableHead>
									<TableHead className="py-3 px-4 text-center">
										Ukuran
									</TableHead>
									<TableHead className="py-3 px-4 text-center">
										Target TW1
									</TableHead>
									<TableHead className="py-3 px-4 text-center">
										Target TW2
									</TableHead>
									<TableHead className="py-3 px-4 text-center">
										Target TW3
									</TableHead>
									<TableHead className="py-3 px-4 text-center">
										Target TW4
									</TableHead>
									<TableHead className="py-3 px-4 text-center">Aksi</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{workTargets.map((workTarget, idx) => {
									return (
										<WorkTargetRow
											key={workTarget.id}
											workTarget={workTarget}
											selectedWorkTargetId={selectedWorkTargetId}
											setSelectedWorkTargetId={setSelectedWorkTargetId}
											idx={idx}
										/>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button>Selesai</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function WorkTargetRow({
	workTarget,
	idx,
	selectedWorkTargetId,
	setSelectedWorkTargetId,
}: {
	workTarget: WorkTarget;
	idx: number;
	selectedWorkTargetId: string | null;
	setSelectedWorkTargetId: (id: string | null) => void;
}) {
	const [data, setData] = useState<WorkTarget>(workTarget);

	const onSubmit = () => {
		if (data.name === "") {
			setData((prev) => ({ ...prev, name: workTarget.name }));
		}

		// transform staffs to array of objects
		const { staffs, ...req } = {
			...data,
			staffIds: data.staffs.map((staff) => staff.id),
		};

		// router.put(`/dashboard/performance/work-target/${workTarget.id}`, req, {
		// 	preserveState: true,
		// });
		setSelectedWorkTargetId(null);
	};

	return (
		<TableRow>
			<TableCell className="py-3 px-4">{idx + 1}</TableCell>
			<TableCell className="py-3 w-full px-4">
				<LabelInput
					className={cn(
						"w-full text-left",
						selectedWorkTargetId === workTarget.id ? "pl-2" : "pl-0",
					)}
					value={data.name}
					disabled={selectedWorkTargetId !== workTarget.id}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setData((prev) => ({ ...prev, name: "" }));
						}

						if (value.length > 255) {
							return;
						}

						setData((prev) => ({ ...prev, name: e.target.value }));
					}}
				/>
			</TableCell>
			<TableCell className="py-3 px-4">
				<Select
					value={data.unit}
					onValueChange={(value) => {
						setSelectedWorkTargetId(workTarget.id);
						setData((prev) => ({ ...prev, unit: value as WorkTarget["unit"] }));
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="Minggu" />
					</SelectTrigger>
					<SelectContent>
						{[
							{
								label: "Menit",
								value: "minute",
							},
							{
								label: "Hari",
								value: "day",
							},
							{
								label: "Jumlah",
								value: "total",
							},
							{
								label: "Minggu",
								value: "week",
							},
						].map((value) => (
							<SelectItem key={value.value} value={value.value}>
								{value.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</TableCell>
			<TableCell className="py-3 px-4">
				<Select
					value={data.comparator}
					onValueChange={(value) => {
						setSelectedWorkTargetId(workTarget.id);
						setData((prev) => ({
							...prev,
							comparator: value as WorkTarget["comparator"],
						}));
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="=" />
					</SelectTrigger>
					<SelectContent>
						{[
							{
								label: "=",
								value: "eq",
							},
							{
								label: ">=",
								value: "gte",
							},
							{
								label: "<=",
								value: "lte",
							},
							{
								label: ">",
								value: "gt",
							},
							{
								label: "<",
								value: "lt",
							},
						].map((value) => (
							<SelectItem key={value.value} value={value.value}>
								{value.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</TableCell>
			<TableCell className="py-3 px-4">
				<LabelInput
					inputMode="numeric"
					value={data.first_quarter_target.toString()}
					disabled={selectedWorkTargetId !== workTarget.id}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setData((prev) => ({ ...prev, first_quarter_target: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setData((prev) => ({
							...prev,
							first_quarter_target: Number(value),
						}));
					}}
				/>
			</TableCell>
			<TableCell className="py-3 px-4">
				<LabelInput
					inputMode="numeric"
					value={data.second_quarter_target.toString()}
					disabled={selectedWorkTargetId !== workTarget.id}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setData((prev) => ({ ...prev, second_quarter_target: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setData((prev) => ({
							...prev,
							second_quarter_target: Number(value),
						}));
					}}
				/>
			</TableCell>
			<TableCell className="py-3 px-4">
				<LabelInput
					inputMode="numeric"
					value={data.third_quarter_target.toString()}
					disabled={selectedWorkTargetId !== workTarget.id}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setData((prev) => ({ ...prev, third_quarter_target: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setData((prev) => ({
							...prev,
							third_quarter_target: Number(value),
						}));
					}}
				/>
			</TableCell>
			<TableCell className="py-3 px-4">
				<LabelInput
					inputMode="numeric"
					value={data.fourth_quarter_target.toString()}
					disabled={selectedWorkTargetId !== workTarget.id}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setData((prev) => ({ ...prev, fourth_quarter_target: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setData((prev) => ({
							...prev,
							fourth_quarter_target: Number(value),
						}));
					}}
				/>
			</TableCell>
			<TableCell className="py-3 px-4">
				{selectedWorkTargetId === workTarget.id ? (
					<div className="flex flex-row gap-2">
						<CheckSquare2Icon
							className="h-4 w-4 cursor-pointer text-primary-60"
							onClick={() => {
								setSelectedWorkTargetId(null);
								onSubmit();
							}}
						/>
						<Trash2Icon
							className="h-4 w-4 cursor-pointer text-danger-80"
							onClick={() => {
								router.delete(
									`/dashboard/performance/work-target/${workTarget.id}`,
								);
							}}
						/>
					</div>
				) : (
					<div className="flex flex-row gap-2">
						<Edit3Icon
							className="h-4 w-4 cursor-pointer text-warning-80"
							onClick={() => setSelectedWorkTargetId(workTarget.id)}
						/>
						<Trash2Icon
							className="h-4 w-4 cursor-pointer text-danger-80"
							onClick={() => {
								router.delete(
									`/dashboard/performance/work-target/${workTarget.id}`,
								);
							}}
						/>
					</div>
				)}
			</TableCell>
		</TableRow>
	);
}

function PerformanceAssessmentsDialog({
	performances,
}: {
	performances: (WorkTarget & WorkTargetValue)[];
}) {
	const [selectedWorkTargetId, setSelectedWorkTargetId] = useState<
		string | null
	>(null);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="bg-transparent hover:bg-transparent active:bg-transparent text-info-60"
				>
					<ArrowUpRightIcon />
					Tampil
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl">
				<DialogHeader className="flex flex-row items-center justify-between">
					<DialogTitle>Penilaian Kinerja: name</DialogTitle>
					<Button variant="outline">
						<FileTextIcon />
						Bukti kinerja
					</Button>
				</DialogHeader>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="py-3 px-4 text-center">No</TableHead>
								<TableHead className="py-3 px-4 w-full text-nowrap">
									Daftar Target Kinerja
								</TableHead>
								<TableHead className="py-3 px-4 text-center">Satuan</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Target TW1
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Target TW2
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Target TW3
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Target TW4
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Realisasi TW1
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Realisasi TW2
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Realisasi TW3
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Realisasi TW4
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Nilai TW1
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Nilai TW2
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Nilai TW3
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Nilai TW4
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Nilai Keseluruhan
								</TableHead>
								<TableHead className="py-3 px-4 text-center">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{performances.map((workTarget, idx) => {
								const [scores, setScores] = useState({
									first_quarter_score: workTarget.first_quarter_score,
									second_quarter_score: workTarget.second_quarter_score,
									third_quarter_score: workTarget.third_quarter_score,
									fourth_quarter_score: workTarget.fourth_quarter_score,
									// all_score: workTarget.all_score,
									all_score: 0,
								});

								const onSubmit = () => {
									const req = {
										...scores,
									};

									router.put(
										`/dashboard/performance/work-target-value/${workTarget.id}`,
										req,
										{
											preserveState: true,
										},
									);
									setSelectedWorkTargetId(null);
								};

								return (
									<TableRow key={workTarget.id}>
										<TableCell className="py-3 px-4">{idx + 1}</TableCell>
										<TableCell className="py-3 w-full px-4">
											{workTarget.name}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{
												{
													minute: "Menit",
													day: "Hari",
													total: "Jumlah",
													week: "Minggu",
												}[workTarget.unit]
											}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{
												{
													eq: "=",
													gte: ">=",
													gt: ">",
													lte: "<=",
													lt: "<",
												}[workTarget.comparator]
											}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{workTarget.first_quarter_target}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{workTarget.second_quarter_target}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{workTarget.third_quarter_target}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{workTarget.fourth_quarter_target}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{workTarget.first_quarter_value}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{workTarget.second_quarter_value}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{workTarget.third_quarter_value}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{workTarget.fourth_quarter_value}
										</TableCell>
										<TableCell className="py-3 text-center">
											<LabelInput
												inputMode="numeric"
												value={scores.first_quarter_score.toString()}
												onChange={(e) => {
													const value = e.target.value;
													if (value === "") {
														setScores((prev) => ({
															...prev,
															first_quarter_score: 0,
														}));
													}

													if (Number.isNaN(Number(value))) {
														return;
													}

													setScores((prev) => ({
														...prev,
														first_quarter_score: Number(value),
													}));
												}}
												disabled={selectedWorkTargetId !== workTarget.id}
											/>
										</TableCell>
										<TableCell className="py-3 text-center">
											<LabelInput
												inputMode="numeric"
												value={scores.second_quarter_score.toString()}
												onChange={(e) => {
													const value = e.target.value;
													if (value === "") {
														setScores((prev) => ({
															...prev,
															second_quarter_score: 0,
														}));
													}

													if (Number.isNaN(Number(value))) {
														return;
													}

													setScores((prev) => ({
														...prev,
														second_quarter_score: Number(value),
													}));
												}}
												disabled={selectedWorkTargetId !== workTarget.id}
											/>
										</TableCell>
										<TableCell className="py-3 text-center">
											<LabelInput
												inputMode="numeric"
												value={scores.third_quarter_score.toString()}
												onChange={(e) => {
													const value = e.target.value;
													if (value === "") {
														setScores((prev) => ({
															...prev,
															third_quarter_score: 0,
														}));
													}

													if (Number.isNaN(Number(value))) {
														return;
													}

													setScores((prev) => ({
														...prev,
														third_quarter_score: Number(value),
													}));
												}}
												disabled={selectedWorkTargetId !== workTarget.id}
											/>
										</TableCell>
										<TableCell className="py-3 text-center">
											<LabelInput
												inputMode="numeric"
												value={scores.fourth_quarter_score.toString()}
												onChange={(e) => {
													const value = e.target.value;
													if (value === "") {
														setScores((prev) => ({
															...prev,
															fourth_quarter_score: 0,
														}));
													}

													if (Number.isNaN(Number(value))) {
														return;
													}

													setScores((prev) => ({
														...prev,
														fourth_quarter_score: Number(value),
													}));
												}}
												disabled={selectedWorkTargetId !== workTarget.id}
											/>
										</TableCell>
										<TableCell className="py-3 text-center">
											<LabelInput
												inputMode="numeric"
												value={scores.all_score.toString()}
												onChange={(e) => {
													const value = e.target.value;
													if (value === "") {
														setScores((prev) => ({
															...prev,
															all_score: 0,
														}));
													}

													if (Number.isNaN(Number(value))) {
														return;
													}

													setScores((prev) => ({
														...prev,
														all_score: Number(value),
													}));
												}}
												disabled={selectedWorkTargetId !== workTarget.id}
											/>
										</TableCell>
										<TableCell className="py-3 px-4">
											{selectedWorkTargetId === workTarget.id ? (
												<div className="flex flex-row gap-2">
													<CheckSquare2Icon
														className="h-4 w-4 cursor-pointer text-primary-60"
														onClick={() => {
															onSubmit();
															setSelectedWorkTargetId(null);
														}}
													/>
													<Trash2Icon
														className="h-4 w-4 cursor-pointer text-danger-80"
														onClick={() => {
															setScores({
																first_quarter_score: 0,
																second_quarter_score: 0,
																third_quarter_score: 0,
																fourth_quarter_score: 0,
																all_score: 0,
															});
														}}
													/>
												</div>
											) : (
												<div className="flex flex-row gap-2">
													<Edit3Icon
														className="h-4 w-4 cursor-pointer text-warning-80"
														onClick={() =>
															setSelectedWorkTargetId(workTarget.id)
														}
													/>
													<Trash2Icon
														className="h-4 w-4 cursor-pointer text-danger-80"
														onClick={() => {
															setSelectedWorkTargetId(workTarget.id);
															setScores({
																first_quarter_score: 0,
																second_quarter_score: 0,
																third_quarter_score: 0,
																fourth_quarter_score: 0,
																all_score: 0,
															});
														}}
													/>
												</div>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button>Selesai</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
