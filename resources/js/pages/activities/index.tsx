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
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
import { Edit, PencilLine, Plus, SquarePen, Trash, Trash2 } from "lucide-react";
import { useState } from "react";

interface Props {
	activities: Activity[];
}

export default function Index({ activities }: Props) {
	const user = usePage<PageProps>().props.auth.user;
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const handleDelete = (id: string) => {
		router.delete(`/dashboard/e-archive/pelatihan-pegawai/${id}`);
	};
	const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
		null
	);

	const [sortField, setSortField] = useState<
		"user" | "implementation_date" | null
	>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const pathname = window.location.pathname;
	function getRouteNameFromPath(pathname: string) {
		if (
			pathname.includes(
				"/dashboard/e-archive/pelatihan-pegawai-kaur/wadek"
			)
		) {
			return "activities.index.kaurByWadek";
		} else if (
			pathname.includes("/dashboard/e-archive/pelatihan-pegawai/kaur")
		) {
			return "activities.index.kaur";
		} else if (
			pathname.includes("/dashboard/e-archive/pelatihan-pegawai/wadek")
		) {
			return "activities.index.wadek";
		} else {
			return "activities.index";
		}
	}
	const routeName = getRouteNameFromPath(pathname);

	const handleSort = (field: "user" | "implementation_date") => {
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
			}
		);
	};

	return (
		<DashboardLayout>
			<Head title="Daftar Pelatihan" />
			<div className="container px-6">
				<Card className="h-full">
					<CardContent className="p-4 overflow-auto">
						<div className="flex justify-between items-center mb-6">
							<h1 className="text-xl font-bold">
								Daftar Pelatihan
							</h1>
							<div>
								<div className="flex justify-end gap-4 mb-4">
									<Button
										variant="outline"
										onClick={() => handleSort("user")}
									>
										Urutkan Nama{" "}
										{sortField === "user" &&
											(sortOrder === "asc" ? "⬆️" : "⬇️")}
									</Button>
									<Button
										variant="outline"
										onClick={() =>
											handleSort("implementation_date")
										}
									>
										Urutkan Tanggal{" "}
										{sortField === "implementation_date" &&
											(sortOrder === "asc" ? "⬆️" : "⬇️")}
									</Button>
									{window.location.pathname ===
										"/dashboard/e-archive/pelatihan-pegawai" ? (
										<Link
											href={route(
												"activities.pelatihan-pegawai.create.self"
											)}
										>
											{" "}
											<Button
												variant="outline"
												className="gap-2"
											>
												<SquarePen className="h-4 w-4" />
												Tambah Pelatihan
											</Button>
										</Link>
									) : null}
								</div>

							</div>
						</div>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nama Kegiatan</TableHead>
									<TableHead>Deskripsi</TableHead>
									<TableHead>Tanggal</TableHead>
									<TableHead>Pengguna</TableHead>
									<TableHead>File Pendukung</TableHead>
									{window.location.pathname ===
										"/dashboard/e-archive/pelatihan-pegawai" && (
											<TableHead className="text-right">
												Aksi
											</TableHead>
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
											<TableCell>
												{item.implementation_date}
											</TableCell>
											<TableCell>
												{item.user?.name ?? "-"}
											</TableCell>
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
															{window.location
																.pathname ===
																"/dashboard/e-archive/pelatihan-pegawai" ? (
																<Link
																	href={route(
																		"activities.pelatihan-pegawai.edit.self",
																		{
																			id: item.id,
																		}
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
																onOpenChange={
																	setIsDialogOpen
																}
															>
																<AlertDialogTrigger
																	asChild
																>
																	<Trash
																		className="text-danger-80 cursor-pointer"
																		onClick={() => {
																			setSelectedActivityId(
																				item.id
																			);
																			setIsDialogOpen(
																				true
																			);
																		}}
																	/>
																</AlertDialogTrigger>
																<AlertDialogContent>
																	<AlertDialogHeader>
																		<AlertDialogTitle>
																			Hapus
																			User?
																		</AlertDialogTitle>
																		<AlertDialogDescription>
																			Apakah
																			kamu
																			yakin
																			ingin
																			menghapus
																			data
																			ini?
																			Tindakan
																			ini
																			tidak
																			dapat
																			dibatalkan.
																		</AlertDialogDescription>
																	</AlertDialogHeader>
																	<AlertDialogFooter>
																		<AlertDialogCancel>
																			Batal
																		</AlertDialogCancel>
																		<AlertDialogAction
																			onClick={() => {
																				if (
																					selectedActivityId
																				)
																					handleDelete(
																						selectedActivityId
																					);
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
