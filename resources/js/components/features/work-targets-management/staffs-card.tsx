import {
	CheckSquare2Icon,
	Edit3Icon,
	FileTextIcon,
	PlusSquareIcon,
	Trash2Icon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { capitalize } from "../../../lib/utils";
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
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../ui/dialog";
import { Input, LabelInput } from "../../ui/input";
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

const staffs = [
	{
		id: "1",
		name: "Kenzie",
		communication: 90,
		teamwork: 90,
		collaboration: 90,
		solidarity: 90,
		work_ethic: 90,
		technology_usage: 90,
		work_smart: 90,
		initiative: 90,
		role_model: 90,
		responsibility: 90,
		professional_ethic: 90,
		image_maintenance: 90,
		discipline: 90,
		note: "Baik",
	},
];

export default function StaffsCard({ role }: { role: string }) {
	const [staffId, setStaffId] = useState<string | null>(null);

	return (
		<Card className="shadow-sm">
			<CardHeader>
				<CardTitle>Daftar Pegawai</CardTitle>
				<CardDescription>
					Membuat dokumentasi pengembangan aplikasi baik project maupun RFC
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
									Evidance
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Nilai Harmony
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Nilai Exellence
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Nilai Integrity
								</TableHead>
								<TableHead className="py-3 px-4 text-center">Rerata</TableHead>
								<TableHead className="py-3 px-4 text-center w-full">
									Catatan
								</TableHead>
								<TableHead className="py-3 px-4 text-center">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{staffs.map((staff, idx) => {
								const harmonyScore = useMemo(() => {
									const total =
										staff.communication +
										staff.teamwork +
										staff.collaboration +
										staff.solidarity;
									return total / 4;
								}, [staff]);

								const excellenceScore = useMemo(() => {
									const total =
										staff.work_ethic +
										staff.technology_usage +
										staff.work_smart +
										staff.initiative;
									return total / 4;
								}, [staff]);

								const integrityScore = useMemo(() => {
									const total =
										staff.role_model +
										staff.responsibility +
										staff.professional_ethic +
										staff.image_maintenance +
										staff.discipline;
									return total / 5;
								}, [staff]);

								const averageScore = useMemo(() => {
									return (harmonyScore + excellenceScore + integrityScore) / 3;
								}, [harmonyScore, excellenceScore, integrityScore]);

								return (
									<TableRow key={staff.id}>
										<TableCell className="py-3 px-4">{idx + 1}</TableCell>
										<TableCell className="py-3 w-full px-4">
											{staff.name}
										</TableCell>
										<TableCell className="py-3 px-4">
											<Button
												variant="ghost"
												size="sm"
												className="text-info-60"
											>
												<FileTextIcon />
												Lihat
											</Button>
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											<div className="flex flex-row items-center justify-center">
												{harmonyScore}
												{staffId === staff.id ? (
													<HarmonyPerformanceAssessmentDialog staff={staff} />
												) : null}
											</div>
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											<div className="flex flex-row items-center justify-center">
												{excellenceScore}
												{staffId === staff.id ? (
													<ExcellencePerformanceAssessmentDialog
														staff={staff}
													/>
												) : null}
											</div>
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											<div className="flex flex-row items-center justify-center">
												{integrityScore}
												{staffId === staff.id ? (
													<IntegrityPerformanceAssessmentDialog staff={staff} />
												) : null}
											</div>
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{averageScore}
										</TableCell>
										<TableCell className="py-3 px-4 text-center w-full">
											<LabelInput
												value={staff.note}
												disabled={staffId !== staff.id}
											/>
										</TableCell>
										<TableCell className="py-3 px-4">
											{staffId === staff.id ? (
												<div className="flex flex-row gap-2">
													<CheckSquare2Icon
														className="h-4 w-4 cursor-pointer text-primary-60"
														onClick={() => setStaffId(null)}
													/>
													<Trash2Icon
														className="h-4 w-4 cursor-pointer text-danger-80"
														onClick={() => {
															// TODO: Reset staff scores
														}}
													/>
												</div>
											) : (
												<div className="flex flex-row gap-2">
													<Edit3Icon
														className="h-4 w-4 cursor-pointer text-warning-80"
														onClick={() => setStaffId(staff.id)}
													/>
													<Trash2Icon
														className="h-4 w-4 cursor-pointer text-danger-80"
														onClick={() => {
															// TODO: Remove staff scores
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

// TODO: Refactor this component to use a more specific type instead of 'any'.
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function HarmonyPerformanceAssessmentDialog({ staff }: { staff: any }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="text-info-60 bg-transparent hover:bg-transparent active:bg-transparent"
				>
					<PlusSquareIcon />
					Detail
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Penilaian Sikap (Harmony): {staff.name}</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="py-3 px-4 w-full">Detail Sikap</TableHead>
								<TableHead className="py-3 px-4 text-center">Nilai</TableHead>
							</TableRow>
						</TableHeader>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Komunikasi</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.communication}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Kerjasama</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.teamwork}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Kolaborasi</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.collaboration}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Solidaritas</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.solidarity}
								/>
							</TableCell>
						</TableRow>
					</Table>
				</div>
				<DialogFooter>
					<Button variant="ghost">Batalkan</Button>
					<Button>Simpan</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// TODO: Refactor this component to use a more specific type instead of 'any'.
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function ExcellencePerformanceAssessmentDialog({ staff }: { staff: any }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="text-info-60 bg-transparent hover:bg-transparent active:bg-transparent"
				>
					<PlusSquareIcon />
					Detail
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Penilaian Sikap (Exellence): {staff.name}</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="py-3 px-4 w-full">Detail Sikap</TableHead>
								<TableHead className="py-3 px-4 text-center">Nilai</TableHead>
							</TableRow>
						</TableHeader>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Etos kerja</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.work_ethic}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">
								Pemanfaatan media & teknologi (mediatek)
							</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.technology_usage}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Kerja cerdas</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.work_smart}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Inisiatif</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.initiative}
								/>
							</TableCell>
						</TableRow>
					</Table>
				</div>
				<DialogFooter>
					<Button variant="ghost">Batalkan</Button>
					<Button>Simpan</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// TODO: Refactor this component to use a more specific type instead of 'any'.
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function IntegrityPerformanceAssessmentDialog({ staff }: { staff: any }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="text-info-60 bg-transparent hover:bg-transparent active:bg-transparent"
				>
					<PlusSquareIcon />
					Detail
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Penilaian Sikap (Integrity): {staff.name}</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="py-3 px-4 w-full">Detail Sikap</TableHead>
								<TableHead className="py-3 px-4 text-center">Nilai</TableHead>
							</TableRow>
						</TableHeader>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Role model</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.role_model}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Tanggung jawab</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.responsibility}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Etika profesi</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.professional_ethic}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">
								Menjaga citra institusi
							</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.image_maintenance}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Disiplin</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={staff.discipline}
								/>
							</TableCell>
						</TableRow>
					</Table>
				</div>
				<DialogFooter>
					<Button variant="ghost">Batalkan</Button>
					<Button>Simpan</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
