import DashboardLayout from "@/layouts/dashboard-layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { ArrowUpRightIcon, FileTextIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Pagination from "../../components/pagination";
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
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
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
import type {
	PageProps,
	User,
	UserAttitudeEvaluation,
	UserFeedback,
	WorkTargetValue,
} from "../../types";
import type { WorkTarget } from "../../types/index";

export default function MyWorkTargets({
	workTargets,
	userAttitudeEvaluation,
	userFeedback,
}: {
	workTargets: (WorkTarget & WorkTargetValue)[];
	userAttitudeEvaluation: UserAttitudeEvaluation;
	userFeedback: UserFeedback;
}) {
	const { props } = usePage<PageProps>();
	const user = props.auth.user as User;

	const userAttitudeEvaluationSchema = z.object({
		evidance: z.string(),
	});

	const form = useForm<z.infer<typeof userAttitudeEvaluationSchema>>({
		resolver: zodResolver(userAttitudeEvaluationSchema),
		defaultValues: {
			evidance: userAttitudeEvaluation.evidance || "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		router.put("/dashboard/user-attitude-evaluation/me", data);
		form.reset();
	});

	const average = useMemo(() => {
		return (
			(userAttitudeEvaluation.collaboration +
				userAttitudeEvaluation.communication +
				userAttitudeEvaluation.discipline +
				userAttitudeEvaluation.image_maintenance +
				userAttitudeEvaluation.initiative +
				userAttitudeEvaluation.professional_ethic +
				userAttitudeEvaluation.responsibility +
				userAttitudeEvaluation.role_model +
				userAttitudeEvaluation.solidarity +
				userAttitudeEvaluation.teamwork +
				userAttitudeEvaluation.technology_usage +
				userAttitudeEvaluation.work_ethic +
				userAttitudeEvaluation.work_smart) /
			13
		);
	}, [userAttitudeEvaluation]);

	return (
		<DashboardLayout>
			<Head title="Target Kinerja Pegawai" />

			<Tabs defaultValue="work-target">
				<TabsList className="space-x-2">
					<TabsTrigger value="work-target">Target kinerja pegawai</TabsTrigger>
					<TabsTrigger value="attitude">Sikap kerja</TabsTrigger>
				</TabsList>
				<TabsContent value="work-target" className="flex flex-row gap-4 h-full">
					<div className="w-3/5 flex flex-col gap-4">
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle>Data Pegawai</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								<div className="flex flex-row bg-[#f5faf7] text-[#3a5a50] p-4 gap-4 rounded-md">
									<p className="break-words text-justify border-r-2 pr-4 border-[#4d8d78]">
										Dokumen pendukung untuk penilaian kinerja TPA ini
										menggunakan Daftar Target Kinerja Pegawai (D-TKP).
									</p>
									<p className="break-words text-justify">
										Hasil capaian target Kinerja Anda akan menjadi acuan bagi
										pimpinan dalam melakukan penilaian kinerja.
									</p>
								</div>

								<span>Nama Pegawai : {user.name}</span>
								<span>NIP : {user.nip}</span>
								<span>
									Deskripsi kerja sebagai :{" "}
									{
										{
											kaur: "Kepala Urusan",
											wadek: "Wakil Dekan",
											tpa: "Tenaga Pengurus Akademik",
										}[user.role]
									}
								</span>
								<span>Lokasi Kerja : {user.location}</span>
								<span>
									Periode Penilaian :{" "}
									{new Date().toLocaleDateString("id-ID", {
										year: "numeric",
									})}
								</span>
							</CardContent>
						</Card>
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle>Informasi Pengisian Form</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								<p>
									1. Minimal data yang diinputkan adalah 4 target kinerja dan
									maksimal 10 target kinerja pegawai.
								</p>
								<p>
									2. Target dan Realisasi diisi berdasarkan TW, serta pastikan
									seluruh isian harus sesuai dengan template TKP yang telah
									disusun.
								</p>
								<p>
									3. Data yang sudah diajukan dan disetujui oleh atasan tidak
									dapat diedit kembali, pastikan untuk mengecek data sebelum
									diajukan.
								</p>
								<p>
									4. Kolom Satuan diisi dengan satuan dari masing-masing
									indikator target maupun realisasi sesuai dengan kategori yang
									tersedia.
								</p>
								<p>
									5. Kolom Ukuran merupakan interpretasi dari nilai target dan
									realisasi sebagai salah satu parameter ketercapaian dtkp.
								</p>
								<p>
									6. Kolom score dan score rata-rata dtkp akan tampil setelah
									data yang diajukan telah disetujui oleh atasan langsung
								</p>
							</CardContent>
						</Card>
					</div>
					<div className="w-full">
						<Card className="shadow-sm">
							<CardHeader className="flex flex-row items-center justify-between">
								<div className="flex flex-col space-y-1.5">
									<CardTitle>Target kinerja pegawai</CardTitle>
									<CardDescription>
										Lengkapilah Data Target Kinerja anda.
									</CardDescription>
								</div>
								<Button
									variant="ghost"
									size="sm"
									className="bg-transparent hover:bg-transparent active:bg-transparent text-info-60"
									asChild
								>
									<Link href="/dashboard/performance/me/detail">
										<ArrowUpRightIcon />
										Edit Kinerja
									</Link>
								</Button>
							</CardHeader>
							<CardContent>
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
					</div>
				</TabsContent>
				<TabsContent value="attitude" className="flex flex-row gap-4 h-full">
					<div className="w-3/5 flex flex-col gap-4">
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle>Data Pegawai</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								<span>Nama Pegawai : {user.name}</span>
								<span>NIP : {user.nip}</span>
								<span>
									Deskripsi kerja sebagai :{" "}
									{
										{
											kaur: "Kepala Urusan",
											wadek: "Wakil Dekan",
											tpa: "Tenaga Pengurus Akademik",
										}[user.role]
									}
								</span>
								<span>Lokasi Kerja : {user.location}</span>
								<span>
									Periode Penilaian :{" "}
									{new Date().toLocaleDateString("id-ID", {
										year: "numeric",
									})}
								</span>
							</CardContent>
						</Card>
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle>Penilaian Sikap Kerja</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								<div className="flex flex-row bg-[#f5faf7] text-[#3a5a50] p-4 gap-4 rounded-md">
									<p className="break-words text-justify border-r-2 pr-4 border-[#4d8d78]">
										Penilaian Sikap Kerja memerlukan waktu pengerjaan kurang
										lebih 7-10 menit. Silahkan input nilai berdasarkan rentang
										nilai yang telah ditentukan, sesuai dengan item pada pada
										masing-masing aspek penilaian.
									</p>
									<p className="break-words text-justify">
										Bapak/bu Atasan langsung maupun Atasan tidak langsung
										dimohon untuk setiap jawaban dapat dibaca dengan seksama
										karena tidak ada pilihan untuk edit dan perubahan apabila
										sudah tersimpan
									</p>
								</div>
								<p>
									Penilaian Sikap Kerja terdiri dari 3 aspek yang telah
									ditentukan diantaranya:
								</p>
								<p>1. Aspek Harmony</p>
								<p>2. Aspek Excellent</p>
								<p>3. Aspek Integrity</p>
							</CardContent>
						</Card>
					</div>
					<div className="w-full flex flex-col gap-4">
						<Card className="shadow-sm">
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle>Sikap Kerja</CardTitle>
									<CardDescription>
										Dibawah merupakan detail dari setiap penilai
									</CardDescription>
								</div>

								<Dialog>
									<DialogTrigger asChild>
										<Button variant="ghost">
											<FileTextIcon />
											Lihat Detail
										</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Penilaian Sikap</DialogTitle>
										</DialogHeader>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="py-3 px-4 w-full">
														Detail Sikap (Harmony)
													</TableHead>
													<TableHead className="py-3 px-4 text-center">
														Nilai
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												<TableRow>
													<TableCell className="py-3 px-4">
														Komunikasi
													</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.communication}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className="py-3 px-4">Kerjasama</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.teamwork}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className="py-3 px-4">
														Kolaborasi
													</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.collaboration}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className="py-3 px-4">
														Solidaritas
													</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.solidarity}
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="py-3 px-4 w-full">
														Detail Sikap (Excellent)
													</TableHead>
													<TableHead className="py-3 px-4 text-center">
														Nilai
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												<TableRow>
													<TableCell className="py-3 px-4">
														Etos Kerja
													</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.work_ethic}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className="py-3 px-4">
														Pemanfaatan media & teknologi (mediatek)
													</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.technology_usage}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className="py-3 px-4">
														Kerja Cerdas
													</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.work_smart}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className="py-3 px-4">Inisiatif</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.initiative}
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead className="py-3 px-4 w-full">
														Detail Sikap (Integrity)
													</TableHead>
													<TableHead className="py-3 px-4 text-center">
														Nilai
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												<TableRow>
													<TableCell className="py-3 px-4">
														Role Model
													</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.role_model}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className="py-3 px-4">
														Tanggung Jawab
													</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.responsibility}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className="py-3 px-4">
														Etika Profesi
													</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.work_ethic}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className="py-3 px-4">
														Menjaga citra institusi
													</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.image_maintenance}
													</TableCell>
												</TableRow>
												<TableRow>
													<TableCell className="py-3 px-4">Disipline</TableCell>
													<TableCell className="py-3 px-4 text-center">
														{userAttitudeEvaluation.discipline}
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</DialogContent>
								</Dialog>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Form {...form}>
										<form
											onSubmit={onSubmit}
											className="flex flex-row gap-2 w-full"
										>
											<FormField
												name="evidance"
												control={form.control}
												render={({ field }) => {
													return (
														<FormItem className="w-full">
															<FormControl>
																<Input
																	className="w-full"
																	placeholder="Tuliskan evidance sikap"
																	disabled={!!userAttitudeEvaluation.evidance}
																	{...field}
																/>
															</FormControl>
															{/* <FormMessage/> */}
														</FormItem>
													);
												}}
											/>
											<Button
												type="submit"
												disabled={!!userAttitudeEvaluation.evidance}
											>
												Simpan
											</Button>
										</form>
									</Form>
								</div>
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Hasil Penilaian</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell>
													Rata - rata penilaian dari {average} (Unknown)
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													Rata - rata Penilaian Sikap Kerja sebelum pembobotan
													adalah {average} dengan keterangan ditunjukkan dengan
													(unknown)
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle>Feedback Atasan</CardTitle>
								<CardDescription>
									Dibawah merupakan saran & masukan dari atasan secara langsung
									maupun tidak
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Saran & Masukan</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell>
													Atasan langsung :{" "}
													<strong>{userFeedback.kaur_feedback}</strong>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell>
													Atasan tidak langsung :{" "}
													<strong>{userFeedback.wadek_feedback}</strong>
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</DashboardLayout>
	);
}
