import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/layouts/dashboard-layout";
import type { UserAttitudeEvaluation, UserFeedback } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router } from "@inertiajs/react";
import { FileTextIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function MyUserAttitudeEvaluation({
	userAttitudeEvaluation,
	userFeedback,
}: {
	userAttitudeEvaluation: UserAttitudeEvaluation;
	userFeedback: UserFeedback;
}) {
	const userAttitudeEvaluationSchema = z.object({
		evidence: z.string(),
	});

	const form = useForm<z.infer<typeof userAttitudeEvaluationSchema>>({
		resolver: zodResolver(userAttitudeEvaluationSchema),
		defaultValues: {
			evidence: userAttitudeEvaluation.evidence || "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		router.put("/dashboard/user-attitude-evaluation/me", data);
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
			<Head title="Sikap Kerja" />

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
											<TableCell className="py-3 px-4">Komunikasi</TableCell>
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
											<TableCell className="py-3 px-4">Kolaborasi</TableCell>
											<TableCell className="py-3 px-4 text-center">
												{userAttitudeEvaluation.collaboration}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="py-3 px-4">Solidaritas</TableCell>
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
											<TableCell className="py-3 px-4">Etos Kerja</TableCell>
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
											<TableCell className="py-3 px-4">Kerja Cerdas</TableCell>
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
											<TableCell className="py-3 px-4">Role Model</TableCell>
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
											<TableCell className="py-3 px-4">Etika Profesi</TableCell>
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
										name="evidence"
										control={form.control}
										render={({ field }) => {
											return (
												<FormItem className="w-full">
													<FormControl>
														<Input
															className="w-full"
															placeholder="Tuliskan bukti sikap"
															disabled={!!userAttitudeEvaluation.evidence}
															{...field}
														/>
													</FormControl>
												</FormItem>
											);
										}}
									/>
									<Button
										type="submit"
										disabled={!!userAttitudeEvaluation.evidence}
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
											Rata - rata penilaian dari <b>{average}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											Rata - rata Penilaian Sikap Kerja sebelum pembobotan
											adalah <b>{average}</b>
											{/* dengan keterangan ditunjukkan dengan */}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle>Umpan Balik Atasan</CardTitle>
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
		</DashboardLayout>
	);
}
