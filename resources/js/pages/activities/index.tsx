import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/layouts/dashboard-layout";
import type { Activity, PageProps } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { PencilLine, SquarePen, Trash } from "lucide-react";
import { useState } from "react";
import Select from "react-select";

interface Props {
	activities: Activity[];
	staffList: { id: string; name: string }[];
	kaurList: { id: string; name: string }[];
}

export default function Index({ activities, staffList, kaurList }: Props) {
	const user = usePage<PageProps>().props.auth.user;
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const handleDelete = (id: string) => {
		router.delete(`/dashboard/e-archive/pelatihan-pegawai/${id}`);
	};
	const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
		null,
	);

	const [sortField, setSortField] = useState<"user" | "start_date" | null>(
		null,
	);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const pathname = window.location.pathname;

	const filteredList =
		pathname === "/dashboard/e-archive/pelatihan-pegawai-kaur/wadek"
			? kaurList
			: staffList;
	function getRouteNameFromPath(pathname: string) {
		if (
			pathname.includes("/dashboard/e-archive/pelatihan-pegawai-kaur/wadek")
		) {
			return "activities.index.kaurByWadek";
		}

		if (pathname.includes("/dashboard/e-archive/pelatihan-pegawai/kaur")) {
			return "activities.index.kaur";
		}

		if (pathname.includes("/dashboard/e-archive/pelatihan-pegawai/wadek")) {
			return "activities.index.wadek";
		}

		return "activities.index";
	}
	const routeName = getRouteNameFromPath(pathname);

	const handleSort = (field: "user" | "start_date") => {
		const nextOrder =
			sortField === field && sortOrder === "asc" ? "desc" : "asc";

		setSortField(field);
		setSortOrder(nextOrder);

		router.get(
			route(routeName),
			{
				sort_field: field,
				sort_order: nextOrder,
			},
			{
				preserveState: true,
				replace: true,
			},
		);
	};
	const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
	const [selectedStaffs, setSelectedStaffs] = useState<
		{ label: string; value: string }[]
	>([]);

	const handleFilterStaff = () => {
		const staffIds = selectedStaffs.map((s) => s.value);

		router.get(
			route(routeName),
			{
				user_ids: staffIds,
			},
			{
				preserveState: true,
				replace: true,
			},
		);

		setIsFilterDialogOpen(false);
	};

	return (
		<DashboardLayout>
			<Head title="Daftar Pelatihan" />
			<div className="container px-6">
				<Card className="h-full">
					<CardContent className="p-4 overflow-auto">
						<div className="flex justify-between items-center mb-6">
							<h1 className="text-xl font-bold">Daftar Pelatihan</h1>
							<div>
								<div className="flex justify-end gap-4 mb-4">
									<Button variant="outline" onClick={() => handleSort("user")}>
										Urutkan Nama{" "}
										{sortField === "user" && (sortOrder === "asc" ? "⬆️" : "⬇️")}
									</Button>
									<Button
										variant="outline"
										onClick={() => handleSort("start_date")}
									>
										Urutkan Tanggal{" "}
										{sortField === "start_date" &&
											(sortOrder === "asc" ? "⬆️" : "⬇️")}
									</Button>

									{/* Tombol Filter */}
									{window.location.pathname !==
										"/dashboard/e-archive/pelatihan-pegawai" && (
										<Dialog
											open={isFilterDialogOpen}
											onOpenChange={setIsFilterDialogOpen}
										>
											<DialogTrigger asChild>
												<Button variant="outline">
													{pathname ===
													"/dashboard/e-archive/pelatihan-pegawai-kaur/wadek"
														? "Filter Kaur"
														: "Filter Staf"}{" "}
												</Button>
											</DialogTrigger>
											<DialogContent className="max-w-md">
												<DialogHeader>
													<DialogTitle>
														{pathname ===
														"/dashboard/e-archive/pelatihan-pegawai-kaur/wadek"
															? "Filter Berdasarkan Kaur"
															: "Filter Berdasarkan Staf"}{" "}
													</DialogTitle>
												</DialogHeader>

												<div className="space-y-4">
													<Label>
														{pathname ===
														"/dashboard/e-archive/pelatihan-pegawai-kaur/wadek"
															? "Pilih Kaur"
															: "Pilih Staf"}
													</Label>
													{filteredList && filteredList.length > 0 ? (
														<Select
															isMulti
															options={filteredList.map(
																(person: { id: string; name: string }) => ({
																	value: person.id,
																	label: person.name,
																}),
															)}
															value={selectedStaffs}
															onChange={(value) =>
																setSelectedStaffs(
																	Array.isArray(value) ? [...value] : [],
																)
															}
															className="react-select-container"
															classNamePrefix="react-select"
														/>
													) : (
														<div>Data Staf/Kaur tidak tersedia</div>
													)}
												</div>

												<DialogFooter className="pt-4">
													<Button
														variant="ghost"
														onClick={() => setIsFilterDialogOpen(false)}
													>
														Batal
													</Button>
													<Button onClick={handleFilterStaff}>
														Terapkan Filter
													</Button>
												</DialogFooter>
											</DialogContent>
										</Dialog>
									)}

									{window.location.pathname ===
										"/dashboard/e-archive/pelatihan-pegawai" && (
										<Link
											href={route("activities.pelatihan-pegawai.create.self")}
										>
											<Button variant="outline" className="gap-2">
												<SquarePen className="h-4 w-4" />
												Tambah Pelatihan
											</Button>
										</Link>
									)}
								</div>
							</div>
						</div>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nama Kegiatan</TableHead>
									<TableHead>Deskripsi</TableHead>
									<TableHead>Tanggal Mulai</TableHead>
									<TableHead>Tanggal Selesai</TableHead>
									<TableHead>Pengguna</TableHead>
									<TableHead>File Pendukung</TableHead>
									{window.location.pathname ===
										"/dashboard/e-archive/pelatihan-pegawai" && (
										<TableHead className="text-right">Aksi</TableHead>
									)}
								</TableRow>
							</TableHeader>
							<TableBody>
								{activities.length === 0 ? (
									<TableRow>
										<TableCell colSpan={7}>
											<p className="flex justify-center items-center py-10">
												Tidak ada data pelatihan
											</p>{" "}
										</TableCell>
									</TableRow>
								) : (
									activities.map((item) => (
										<TableRow key={item.id}>
											<TableCell>{item.title}</TableCell>
											<TableCell>{item.type}</TableCell>
											<TableCell>{item.start_date}</TableCell>
											<TableCell>{item.end_date}</TableCell>
											<TableCell>{item.user?.name ?? "-"}</TableCell>
											<TableCell>
												{item.file ? (
													<a
														href={`/storage/${item.file}`}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-500 underline"
													>
														Lihat File
													</a>
												) : (
													"-"
												)}
											</TableCell>
											{/* <TableCell className="text-right space-x-2">
													<Link
														href={`/dashboard/e-archive/pelatihan-pegawai/${item.id}/edit`}
													>
														<Button variant="outline" size="icon">
															<Edit className="w-4 h-4" />
														</Button>
													</Link>
													<Button
														variant="destructive"
														size="icon"
														onClick={() => handleDelete(item.id)}
													>
														<Trash2 className="w-4 h-4" />
													</Button>
												</TableCell> */}
											{window.location.pathname ===
												"/dashboard/e-archive/pelatihan-pegawai" && (
												<TableCell className="py-3 px-4">
													<div className="flex gap-1 items-center justify-end">
														{window.location.pathname ===
														"/dashboard/e-archive/pelatihan-pegawai" ? (
															<Link
																href={route(
																	"activities.pelatihan-pegawai.edit.self",
																	{
																		id: item.id,
																	},
																)}
															>
																<PencilLine className="text-warning-80" />
															</Link>
														) : (
															<Link
																href={`/dashboard/e-archive/pelatihan-pegawai/${item.id}/edit`}
															>
																<PencilLine className="text-warning-80" />
															</Link>
														)}
														<AlertDialog
															open={isDialogOpen}
															onOpenChange={setIsDialogOpen}
														>
															<AlertDialogTrigger asChild>
																<Trash
																	className="text-danger-80 cursor-pointer"
																	onClick={() => {
																		setSelectedActivityId(item.id);
																		setIsDialogOpen(true);
																	}}
																/>
															</AlertDialogTrigger>
															<AlertDialogContent>
																<AlertDialogHeader>
																	<AlertDialogTitle>
																		Hapus User?
																	</AlertDialogTitle>
																	<AlertDialogDescription>
																		Apakah kamu yakin ingin menghapus data ini?
																		Tindakan ini tidak dapat dibatalkan.
																	</AlertDialogDescription>
																</AlertDialogHeader>
																<AlertDialogFooter>
																	<AlertDialogCancel>Batal</AlertDialogCancel>
																	<AlertDialogAction
																		onClick={() => {
																			if (selectedActivityId)
																				handleDelete(selectedActivityId);
																		}}
																		className="bg-destructive text-white hover:bg-destructive/90"
																	>
																		Hapus
																	</AlertDialogAction>
																</AlertDialogFooter>
															</AlertDialogContent>
														</AlertDialog>
													</div>
												</TableCell>
											)}
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
		</DashboardLayout>
	);
}
