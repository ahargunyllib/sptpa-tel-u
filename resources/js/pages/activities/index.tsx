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
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Edit, Plus, Trash2 } from "lucide-react";

interface Props {
	activities: Activity[];
}

export default function Index({ activities }: Props) {
	const user = usePage<PageProps>().props.auth.user;

	const handleDelete = (id: string) => {
		router.delete(`/dashboard/e-archive/pelatihan-pegawai/${id}`);
	};

	return (
		<DashboardLayout>
			<Head title="Daftar Pelatihan" />
			<div className="container px-6 py-10">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-xl font-bold">Daftar Pelatihan</h1>
					{user && user.role !== "staf" && (
						<Link href={route("activities.pelatihan-pegawai.create")}>
							<Button>
								<Plus className="w-4 h-4 mr-2" /> Tambah Pelatihan
							</Button>
						</Link>
					)}
				</div>

				<Card>
					<CardContent className="p-4 overflow-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Judul</TableHead>
									<TableHead>Tipe</TableHead>
									<TableHead>Metode</TableHead>
									<TableHead>Tanggal</TableHead>
									<TableHead>Pengguna</TableHead>
									<TableHead>File Pendukung</TableHead>
									<TableHead className="text-right">Aksi</TableHead>
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
											<TableCell>{item.method}</TableCell>
											<TableCell>{item.implementation_date}</TableCell>
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
											<TableCell className="text-right space-x-2">
												<Link
													href={`/dashboard/e-archive/pelatihan-pegawai/${item.id}/edit`}
												>
													<Button variant="outline" size="icon">
														<Edit className="w-4 h-4" />
													</Button>
												</Link>
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button variant="destructive" size="icon">
															<Trash2 className="w-4 h-4" />
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>
																Hapus Pelatihan
															</AlertDialogTitle>
															<AlertDialogDescription>
																Apakah Anda yakin ingin menghapus pelatihan ini?
																Tindakan ini tidak dapat dibatalkan.
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
																onClick={() => handleDelete(item.id)}
															>
																Hapus
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											</TableCell>
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
