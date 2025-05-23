import { Head, router } from "@inertiajs/react";
import {
	CheckSquare2Icon,
	Edit3Icon,
	FileTextIcon,
	Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../components/ui/dialog";
import { LabelInput } from "../../components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/ui/table";
import DashboardLayout from "../../layouts/dashboard-layout";
import { WorkTargetCategory, WorkTargetUnit } from "../../lib/enums";
import type { WorkTarget } from "../../types";

export default function MyWorkTargets({
	workTargets,
}: {
	workTargets: WorkTarget[];
}) {
	const [selectedWorkTargetId, setSelectedWorkTargetId] = useState<
		string | null
	>(null);

	return (
		<DashboardLayout>
			<Head title="Target Kinerja" />

			<Card className="shadow-sm">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Daftar Objektif Kinerja</CardTitle>
						<CardDescription>
							Membuat dokumentasi pengembangan aplikasi baik project maupun RFC
						</CardDescription>
					</div>
					<div className="flex flex-row gap-2">
						{/* TODO */}
						<Button variant="outline">
							<FileTextIcon />
							Bukti Kinerja
						</Button>
						<Dialog>
							<DialogTrigger asChild>
								<Button variant="outline">
									<FileTextIcon />
									Lihat Detail Nilai
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle>Detail Penilaian Objektif Kinerja</DialogTitle>
								</DialogHeader>
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead className="py-3 px-4 text-center">
													No
												</TableHead>
												<TableHead className="py-3 px-4 w-full">
													Target Kinerja Pegawai
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
											</TableRow>
										</TableHeader>
										<TableBody>
											{workTargets.map((workTarget, idx) => {
												return (
													<TableRow key={workTarget.id}>
														<TableCell className="py-3 px-4">
															{idx + 1}
														</TableCell>
														<TableCell className="py-3 w-full px-4">
															{workTarget.name}
														</TableCell>
														<TableCell className="py-3 px-4 text-center">
															{workTarget.first_quarter_score}
														</TableCell>
														<TableCell className="py-3 px-4 text-center">
															{workTarget.second_quarter_score}
														</TableCell>
														<TableCell className="py-3 px-4 text-center">
															{workTarget.third_quarter_score}
														</TableCell>
														<TableCell className="py-3 px-4 text-center">
															{workTarget.fourth_quarter_score}
														</TableCell>
														<TableCell className="py-3 px-4 text-center">
															{workTarget.final_score}
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="ghost">Kembali</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="py-3 px-4 text-center">No</TableHead>
									<TableHead className="py-3 px-4 w-full">
										Target Kinerja Pegawai
									</TableHead>
									<TableHead className="py-3 px-4 text-center">
										Satuan
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
										Kategori
									</TableHead>
									<TableHead className="py-3 px-4 text-center">
										Nilai Akhir
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
											idx={idx}
											selectedWorkTargetId={selectedWorkTargetId}
											setSelectedWorkTargetId={setSelectedWorkTargetId}
										/>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</DashboardLayout>
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
	const [values, setValues] = useState({
		first_quarter_value: workTarget.first_quarter_value,
		second_quarter_value: workTarget.second_quarter_value,
		third_quarter_value: workTarget.third_quarter_value,
		fourth_quarter_value: workTarget.fourth_quarter_value,
		category: workTarget.category,
	});

	const onSubmit = () => {
		const req = {
			...values,
		};

		router.post(`/dashboard/work-target/${workTarget.id}/submit`, req, {
			preserveState: true,
		});
		setSelectedWorkTargetId(null);
	};

	return (
		<TableRow>
			<TableCell className="py-3 px-4">{idx + 1}</TableCell>
			<TableCell className="py-3 w-full px-4">{workTarget.name}</TableCell>
			<TableCell className="py-3 px-4 text-center">
				{WorkTargetUnit[workTarget.unit]}
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
			<TableCell className="py-3 text-center">
				<LabelInput
					inputMode="numeric"
					value={values.first_quarter_value.toString()}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setValues((prev) => ({ ...prev, first_quarter_value: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setValues((prev) => ({
							...prev,
							first_quarter_value: Number(value),
						}));
					}}
					disabled={selectedWorkTargetId !== workTarget.id}
				/>
			</TableCell>
			<TableCell className="py-3 text-center">
				<LabelInput
					inputMode="numeric"
					value={values.second_quarter_value.toString()}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setValues((prev) => ({ ...prev, second_quarter_value: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setValues((prev) => ({
							...prev,
							second_quarter_value: Number(value),
						}));
					}}
					disabled={selectedWorkTargetId !== workTarget.id}
				/>
			</TableCell>
			<TableCell className="py-3 text-center">
				<LabelInput
					inputMode="numeric"
					value={values.third_quarter_value.toString()}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setValues((prev) => ({ ...prev, third_quarter_value: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setValues((prev) => ({
							...prev,
							third_quarter_value: Number(value),
						}));
					}}
					disabled={selectedWorkTargetId !== workTarget.id}
				/>
			</TableCell>
			<TableCell className="py-3 text-center">
				<LabelInput
					inputMode="numeric"
					value={values.fourth_quarter_value.toString()}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setValues((prev) => ({ ...prev, fourth_quarter_value: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setValues((prev) => ({
							...prev,
							fourth_quarter_value: Number(value),
						}));
					}}
					disabled={selectedWorkTargetId !== workTarget.id}
				/>
			</TableCell>
			<TableCell className="py-3 px-4">
				<Select
					value={values.category}
					onValueChange={(value) => {
						setSelectedWorkTargetId(workTarget.id);
						setValues((prev) => ({
							...prev,
							category: value as keyof typeof WorkTargetCategory,
						}));
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="Ringan" />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(WorkTargetCategory)
							.map(([key, value]) => ({
								key,
								value,
							}))
							.map((category) => (
								<SelectItem key={category.key} value={category.key}>
									{category.value}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			</TableCell>
			<TableCell className="py-3 px-4 text-center">
				{workTarget.first_quarter_score}
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
								setValues({
									first_quarter_value: 0,
									second_quarter_value: 0,
									third_quarter_value: 0,
									fourth_quarter_value: 0,
									category: workTarget.category,
								});
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
								setSelectedWorkTargetId(workTarget.id);
								setValues({
									first_quarter_value: 0,
									second_quarter_value: 0,
									third_quarter_value: 0,
									fourth_quarter_value: 0,
									category: workTarget.category,
								});
							}}
						/>
					</div>
				)}
			</TableCell>
		</TableRow>
	);
}
