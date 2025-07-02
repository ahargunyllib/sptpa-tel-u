import { type FileItem, FileUploadModal } from "@/components/e-archive/modal";
import { Head, router } from "@inertiajs/react";
import {
	CheckSquare2Icon,
	Edit3Icon,
	FileIcon,
	FileTextIcon,
	PencilLineIcon,
	PlusSquareIcon,
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
	DialogDescription,
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
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../components/ui/tabs";
import DashboardLayout from "../../layouts/dashboard-layout";
import {
	WorkTargetCategory,
	WorkTargetComparator,
	WorkTargetUnit,
} from "../../lib/enums";
import type { File, WorkTarget } from "../../types";

export default function MyWorkTargets({
	workTargets,
}: {
	workTargets: (WorkTarget & {
		files: (File & { quarter: 1 | 2 | 3 | 4 })[];
	})[];
}) {
	const [selectedWorkTargetId, setSelectedWorkTargetId] = useState<
		string | null
	>(null);
	const [isShowParentModal, setIsShowParentModal] = useState(false);

	return (
		<DashboardLayout>
			<Head title="Target Kinerja" />

			<Card className="shadow-sm">
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Daftar objektif kinerja</CardTitle>
						<CardDescription>
							Dibawah ini adalah target kinerja yang harus anda selesaikan per
							periode
						</CardDescription>
					</div>
					<div className="flex flex-row gap-2">
						<Button
							variant="outline"
							onClick={() => setIsShowParentModal(true)}
						>
							<FileTextIcon />
							Bukti Kinerja
						</Button>
						<Dialog
							open={isShowParentModal}
							onOpenChange={setIsShowParentModal}
						>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle>Bukti Kinerja</DialogTitle>
									<DialogDescription>
										Tambahkan bukti dokumen sesuai dengan target kinerja dan
										periodenya
									</DialogDescription>
								</DialogHeader>
								<Tabs defaultValue="first_quarter" className="w-full">
									<TabsList className="w-full">
										{[
											{
												idx: 1,
												value: "first",
											},
											{
												idx: 2,
												value: "second",
											},
											{
												idx: 3,
												value: "third",
											},
											{
												idx: 4,
												value: "fourth",
											},
										].map((quarter) => (
											<TabsTrigger
												key={quarter.value}
												className="flex-grow"
												value={`${quarter.value}_quarter`}
											>
												TW{quarter.idx}
											</TabsTrigger>
										))}
									</TabsList>
									{[
										{
											idx: 1,
											value: "first",
										},
										{
											idx: 2,
											value: "second",
										},
										{
											idx: 3,
											value: "third",
										},
										{
											idx: 4,
											value: "fourth",
										},
									].map((quarter) => (
										<TabsContent
											value={`${quarter.value}_quarter`}
											key={quarter.value}
										>
											{workTargets.map((workTarget) => {
												const [uploadedFiles, setUploadedFiles] = useState<
													FileItem[]
												>([]);
												const [isModalOpen, setIsModalOpen] = useState(false);

												const handleSaveFiles = (files: FileItem[]) => {
													setUploadedFiles(files);

													for (const fileItem of files) {
														const date = Intl.DateTimeFormat("id-ID", {
															day: "2-digit",
															month: "short",
															year: "numeric",
														}).format(new Date());
														const workTargetName = workTarget.name;
														// TWX_DDmmYYYY_workTargetName
														// Example: TW1_01Jan2023_workTargetName
														const currentMonth = new Date().getMonth() + 1;
														const tw = `TW${currentMonth % 4}`;
														const fileName = `${tw}_${date.split(" ").join("")}_${workTargetName}`;

														const formData = new FormData();
														formData.append("evidence", fileItem.file);
														formData.append("file_name", fileName);

														router.post(
															`/dashboard/work-target/${workTarget.id}/evidence`,
															formData,
														);
													}
													setUploadedFiles([]);
												};

												const workTargetFiles = workTarget.files.filter(
													(file) =>
														(new Date(file.created_at).getMonth() + 1) % 4 ===
														quarter.idx,
												);

												return (
													<div
														key={workTarget.id}
														className="border rounded-md p-3"
													>
														<div className="flex items-center justify-between">
															<div className="flex items-center gap-2">
																<FileIcon className="h-5 w-5 text-muted-foreground" />
																<div>
																	<p className="text-sm font-medium">
																		Bukti Kinerja TW{quarter.idx}_
																		{workTarget.name}
																	</p>
																</div>
															</div>

															<div className="flex flex-row items-center gap-2">
																{workTargetFiles.length === 0 ? (
																	<Button
																		variant="ghost"
																		onClick={() => {
																			setIsModalOpen(true);
																		}}
																		disabled={
																			(new Date().getMonth() + 1) % 4 !==
																			quarter.idx
																		}
																	>
																		<PlusSquareIcon />
																		Unggah
																	</Button>
																) : (
																	<>
																		<Button
																			variant="ghost"
																			className="bg-info-20 hover:bg-info-40 text-info-80"
																			onClick={() => {
																				router.visit(
																					`/dashboard/e-archive/${workTargetFiles[0].folder_id}`,
																				);
																			}}
																		>
																			<FileIcon />
																			Lihat
																		</Button>
																		<Button
																			variant="ghost"
																			onClick={() => {
																				setIsModalOpen(true);
																			}}
																			className="bg-warning-20 hover:bg-warning-40 text-warning-80"
																		>
																			<PencilLineIcon />
																			Ubah
																		</Button>
																	</>
																)}
															</div>
														</div>
														<FileUploadModal
															acceptedFileTypes={[
																".jpg",
																".png",
																".pdf",
																".zip",
																".xlsx",
															]}
															onOpenChange={setIsModalOpen}
															maxFiles={5}
															maxSize={10}
															onSave={handleSaveFiles}
															open={isModalOpen}
															initialFiles={workTargetFiles.map((file) => ({
																name: file.name,
																id: file.id,
																size: file.size,
																progress: 100,
																status: undefined,
																file: new File([], file.name),
															}))}
															onDeleteFile={(fileId) => {
																router.delete(
																	`/dashboard/work-target/${workTarget.id}/evidence/${fileId}`,
																	{
																		preserveState: true,
																	},
																);
															}}
														/>
													</div>
												);
											})}
										</TabsContent>
									))}
								</Tabs>
								<DialogFooter>
									<DialogClose asChild>
										<Button variant="ghost">Kembali</Button>
									</DialogClose>
									<DialogClose asChild>
										<Button onClick={() => {}}>Simpan</Button>
									</DialogClose>
								</DialogFooter>
							</DialogContent>
						</Dialog>
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
										Nilai Keseluruhan
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
				{WorkTargetComparator[workTarget.comparator]}
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
							setValues((prev) => ({
								...prev,
								first_quarter_value: 0,
							}));
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
							setValues((prev) => ({
								...prev,
								second_quarter_value: 0,
							}));
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
							setValues((prev) => ({
								...prev,
								third_quarter_value: 0,
							}));
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
							setValues((prev) => ({
								...prev,
								fourth_quarter_value: 0,
							}));
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
				{workTarget.final_score}
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
