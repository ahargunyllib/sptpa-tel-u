import { useUser } from "@/hooks/use-user";
import { capitalize } from "@/lib/utils";
import type { User, UserAttitudeEvaluation, WorkTarget } from "@/types";
import { router } from "@inertiajs/react";
import {
	CheckSquare2Icon,
	Edit3Icon,
	FileTextIcon,
	PlusSquareIcon,
	Trash2Icon,
} from "lucide-react";
import { useMemo, useState } from "react";
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

export default function StaffsCard({
	role,
	userAttitudeEvaluations,
}: {
	role: string;
	userAttitudeEvaluations: (User &
		UserAttitudeEvaluation & {
			note: string;
		} & {
			work_targets: WorkTarget[];
		})[];
}) {
	const [staffId, setStaffId] = useState<string | null>(null);

	const user = useUser();

	return (
		<Card className="shadow-sm">
			<CardHeader className="flex flex-row justify-between items-center">
				<div className="flex flex-col space-y-1.5 p-6">
					<CardTitle>Daftar {capitalize(role)}</CardTitle>
					<CardDescription>
						Dibawah ini merupakan {role} yang Anda kelola
					</CardDescription>
				</div>
				{(user.role === "kaur" ||
					user.role === "wadek1" ||
					user.role === "wadek2") && (
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" className="gap-2">
								<FileTextIcon className="h-4 w-4" />
								Lihat Detail Nilai Keseluruhan
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-2xl">
							<DialogHeader>
								<DialogTitle>Detail Nilai Keseluruhan</DialogTitle>
							</DialogHeader>
							<div className="overflow-x-auto">
								<Table className="w-full">
									<TableHeader>
										<TableRow>
											<TableHead className="py-3 px-4 text-center">
												No
											</TableHead>
											<TableHead className="py-3 px-4 w-full">
												Nama Staf
											</TableHead>
											<TableHead className="py-3 px-4 text-center text-nowrap">
												Target Kinerja
											</TableHead>
											<TableHead className="py-3 px-4 text-center text-nowrap">
												Sikap Kerja
											</TableHead>
											<TableHead className="py-3 px-4 text-center text-nowrap">
												Nilai Akhir
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{userAttitudeEvaluations.map((staff, idx) => (
											<OverallRowDialog
												key={staff.id}
												staff={staff}
												idx={idx}
											/>
										))}
									</TableBody>
								</Table>
							</div>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Kembali</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				)}
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
									Evidence
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Nilai Harmony
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Nilai Excellence
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Nilai Integrity
								</TableHead>
								<TableHead className="py-3 px-4 text-center">Rerata</TableHead>
								<TableHead className="py-3 px-20 text-center w-full">
									Catatan
								</TableHead>
								<TableHead className="py-3 px-4 text-center">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{userAttitudeEvaluations.map((staff, idx) => (
								<StaffRow
									key={staff.id}
									staff={staff}
									idx={idx}
									selectedStaffId={staffId}
									setSelectedStaffId={setStaffId}
								/>
							))}
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
							Item per halaman
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

function StaffRow({
	staff,
	idx,
	selectedStaffId,
	setSelectedStaffId,
}: {
	staff: User &
		UserAttitudeEvaluation & {
			note: string;
		};
	idx: number;
	selectedStaffId: string | null;
	setSelectedStaffId: (id: string | null) => void;
}) {
	const [data, setData] = useState({
		communication: staff.communication,
		teamwork: staff.teamwork,
		collaboration: staff.collaboration,
		solidarity: staff.solidarity,
		work_ethic: staff.work_ethic,
		technology_usage: staff.technology_usage,
		work_smart: staff.work_smart,
		initiative: staff.initiative,
		role_model: staff.role_model,
		responsibility: staff.responsibility,
		professional_ethic: staff.professional_ethic,
		image_maintenance: staff.image_maintenance,
		discipline: staff.discipline,
		note: staff.note,
	});

	const harmonyScore = useMemo(() => {
		const total =
			data.communication + data.teamwork + data.collaboration + data.solidarity;
		return total / 4;
	}, [data]);

	const excellenceScore = useMemo(() => {
		const total =
			data.work_ethic +
			data.technology_usage +
			data.work_smart +
			data.initiative;
		return total / 4;
	}, [data]);

	const integrityScore = useMemo(() => {
		const total =
			data.role_model +
			data.responsibility +
			data.professional_ethic +
			data.image_maintenance +
			data.discipline;
		return total / 5;
	}, [data]);

	const averageScore = useMemo(() => {
		return (harmonyScore + excellenceScore + integrityScore) / 3;
	}, [harmonyScore, excellenceScore, integrityScore]);

	function onChange(key: keyof typeof data, value: number) {
		setData((prev) => ({
			...prev,
			[key]: value,
		}));
	}

	function onSubmit() {
		const req = {
			...data,
		};

		router.put(`/dashboard/user-attitude-evaluation/${staff.id}`, req);
	}

	return (
		<TableRow key={staff.id}>
			<TableCell className="py-3 px-4">{idx + 1}</TableCell>
			<TableCell className="py-3 w-full px-4">{staff.name}</TableCell>
			<TableCell className="py-3 px-4">
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="ghost" size="sm" className="text-info-60">
							<FileTextIcon />
							Lihat
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogTitle>Evidence sikap kerja : {staff.name}</DialogTitle>
						<p className="w-full p-4 border text-muted-foreground rounded-lg">
							{staff.evidence || "Belum ada."}
						</p>
					</DialogContent>
				</Dialog>
			</TableCell>
			<TableCell className="py-3 px-4 text-center">
				<div className="flex flex-row items-center justify-center">
					{harmonyScore.toFixed(2)}
					{selectedStaffId === staff.id ? (
						<HarmonyPerformanceAssessmentDialog
							staffName={staff.name}
							data={data}
							onChange={onChange}
						/>
					) : null}
				</div>
			</TableCell>
			<TableCell className="py-3 px-4 text-center">
				<div className="flex flex-row items-center justify-center">
					{excellenceScore.toFixed(2)}
					{selectedStaffId === staff.id ? (
						<ExcellencePerformanceAssessmentDialog
							staffName={staff.name}
							data={data}
							onChange={onChange}
						/>
					) : null}
				</div>
			</TableCell>
			<TableCell className="py-3 px-4 text-center">
				<div className="flex flex-row items-center justify-center">
					{integrityScore.toFixed(2)}
					{selectedStaffId === staff.id ? (
						<IntegrityPerformanceAssessmentDialog
							staffName={staff.name}
							data={data}
							onChange={onChange}
						/>
					) : null}
				</div>
			</TableCell>
			<TableCell className="py-3 px-4 text-center">
				{averageScore.toFixed(2)}
			</TableCell>
			<TableCell className="py-3 px-4 text-center w-full">
				<LabelInput
					className="w-full text-wrap"
					value={data.note}
					disabled={selectedStaffId !== staff.id}
					onChange={(e) => {
						const value = e.target.value;

						setData((prev) => {
							return { ...prev, note: value };
						});
					}}
				/>
			</TableCell>
			<TableCell className="py-3 px-4">
				{selectedStaffId === staff.id ? (
					<div className="flex flex-row gap-2">
						<CheckSquare2Icon
							className="h-4 w-4 cursor-pointer text-primary-60"
							onClick={() => {
								setSelectedStaffId(null);
								onSubmit();
							}}
						/>
						<Trash2Icon
							className="h-4 w-4 cursor-pointer text-danger-80"
							onClick={() => {
								setData({
									communication: 0,
									teamwork: 0,
									collaboration: 0,
									solidarity: 0,
									work_ethic: 0,
									technology_usage: 0,
									work_smart: 0,
									initiative: 0,
									role_model: 0,
									responsibility: 0,
									professional_ethic: 0,
									image_maintenance: 0,
									discipline: 0,
									note: "",
								});
							}}
						/>
					</div>
				) : (
					<div className="flex flex-row gap-2">
						<Edit3Icon
							className="h-4 w-4 cursor-pointer text-warning-80"
							onClick={() => setSelectedStaffId(staff.id)}
						/>
						<Trash2Icon
							className="h-4 w-4 cursor-pointer text-danger-80"
							onClick={() => {
								setSelectedStaffId(staff.id);
								setData({
									communication: 0,
									teamwork: 0,
									collaboration: 0,
									solidarity: 0,
									work_ethic: 0,
									technology_usage: 0,
									work_smart: 0,
									initiative: 0,
									role_model: 0,
									responsibility: 0,
									professional_ethic: 0,
									image_maintenance: 0,
									discipline: 0,
									note: "",
								});
							}}
						/>
					</div>
				)}
			</TableCell>
		</TableRow>
	);
}

function HarmonyPerformanceAssessmentDialog({
	staffName,
	data,
	onChange,
}: {
	staffName: string;
	data: {
		communication: number;
		teamwork: number;
		collaboration: number;
		solidarity: number;
	};
	onChange: (
		key: "communication" | "teamwork" | "collaboration" | "solidarity",
		value: number,
	) => void;
}) {
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
					<DialogTitle>Penilaian Sikap (Harmony): {staffName}</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="py-3 px-4 w-full">Detail Sikap</TableHead>
								<TableHead className="py-3 px-6 text-center">Nilai</TableHead>
							</TableRow>
						</TableHeader>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Komunikasi</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={data.communication}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("communication", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("communication", 0);
											return;
										}

										if (val > 120) {
											onChange("communication", 120);
											return;
										}

										onChange("communication", Number(value));
									}}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Kerjasama</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={data.teamwork}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("teamwork", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("teamwork", 0);
											return;
										}

										if (val > 120) {
											onChange("teamwork", 120);
											return;
										}

										onChange("teamwork", Number(value));
									}}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Kolaborasi</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={data.collaboration}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("collaboration", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("collaboration", 0);
											return;
										}

										if (val > 120) {
											onChange("collaboration", 120);
											return;
										}

										onChange("collaboration", Number(value));
									}}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Solidaritas</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={data.solidarity}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("solidarity", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("solidarity", 0);
											return;
										}

										if (val > 120) {
											onChange("solidarity", 120);
											return;
										}

										onChange("solidarity", Number(value));
									}}
								/>
							</TableCell>
						</TableRow>
					</Table>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="ghost">Batalkan</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button>Simpan</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function ExcellencePerformanceAssessmentDialog({
	staffName,
	data,
	onChange,
}: {
	staffName: string;
	data: {
		work_ethic: number;
		technology_usage: number;
		work_smart: number;
		initiative: number;
	};
	onChange: (
		key: "work_ethic" | "technology_usage" | "work_smart" | "initiative",
		value: number,
	) => void;
}) {
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
					<DialogTitle>Penilaian Sikap (Excellence): {staffName}</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="py-3 px-4 w-full">Detail Sikap</TableHead>
								<TableHead className="py-3 px-6 text-center">Nilai</TableHead>
							</TableRow>
						</TableHeader>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Etos kerja</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={data.work_ethic}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("work_ethic", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("work_ethic", 0);
											return;
										}

										if (val > 120) {
											onChange("work_ethic", 120);
											return;
										}

										onChange("work_ethic", Number(value));
									}}
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
									value={data.technology_usage}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("technology_usage", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("technology_usage", 0);
											return;
										}

										if (val > 120) {
											onChange("technology_usage", 120);
											return;
										}

										onChange("technology_usage", Number(value));
									}}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Kerja cerdas</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={data.work_smart}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("work_smart", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("work_smart", 0);
											return;
										}

										if (val > 120) {
											onChange("work_smart", 120);
											return;
										}

										onChange("work_smart", Number(value));
									}}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Inisiatif</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={data.initiative}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("initiative", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("initiative", 0);
											return;
										}

										if (val > 120) {
											onChange("initiative", 120);
											return;
										}

										onChange("initiative", Number(value));
									}}
								/>
							</TableCell>
						</TableRow>
					</Table>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="ghost">Batalkan</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button>Simpan</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function IntegrityPerformanceAssessmentDialog({
	staffName,
	data,
	onChange,
}: {
	staffName: string;
	data: {
		role_model: number;
		responsibility: number;
		professional_ethic: number;
		image_maintenance: number;
		discipline: number;
	};
	onChange: (
		key:
			| "role_model"
			| "responsibility"
			| "professional_ethic"
			| "image_maintenance"
			| "discipline",
		value: number,
	) => void;
}) {
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
					<DialogTitle>Penilaian Sikap (Integrity): {staffName}</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="py-3 px-4 w-full">Detail Sikap</TableHead>
								<TableHead className="py-3 px-6 text-center">Nilai</TableHead>
							</TableRow>
						</TableHeader>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Role model</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={data.role_model}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("role_model", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("role_model", 0);
											return;
										}

										if (val > 120) {
											onChange("role_model", 120);
											return;
										}

										onChange("role_model", Number(value));
									}}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Tanggung jawab</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={data.responsibility}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("responsibility", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("role_model", 0);
											return;
										}

										if (val > 120) {
											onChange("role_model", 120);
											return;
										}

										onChange("responsibility", Number(value));
									}}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Etika profesi</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={data.professional_ethic}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("professional_ethic", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("professional_ethic", 0);
											return;
										}

										if (val > 120) {
											onChange("professional_ethic", 120);
											return;
										}

										onChange("professional_ethic", Number(value));
									}}
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
									value={data.image_maintenance}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("image_maintenance", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("image_maintenance", 0);
											return;
										}

										if (val > 120) {
											onChange("image_maintenance", 120);
											return;
										}

										onChange("image_maintenance", Number(value));
									}}
								/>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="py-3 px-4 w-full">Disiplin</TableCell>
							<TableCell className="">
								<Input
									inputMode="numeric"
									className="text-center"
									value={data.discipline}
									onChange={(e) => {
										const value = e.target.value;

										if (value === "") {
											onChange("discipline", 0);
										}

										if (Number.isNaN(Number(value))) {
											return;
										}

										const val = Number(value);
										if (val < 0) {
											onChange("discipline", 0);
											return;
										}

										if (val > 120) {
											onChange("discipline", 120);
											return;
										}

										onChange("discipline", Number(value));
									}}
								/>
							</TableCell>
						</TableRow>
					</Table>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="ghost">Batalkan</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button>Simpan</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function OverallRowDialog({
	staff,
	idx,
}: {
	staff: User &
		UserAttitudeEvaluation & {
			note: string;
		} & {
			work_targets: WorkTarget[];
		};
	idx: number;
}) {
	const workTargetAverage = useMemo(() => {
		const totalScore = staff.work_targets.reduce((acc, target) => {
			return (
				acc +
				(target.first_quarter_score +
					target.second_quarter_score +
					target.third_quarter_score +
					target.fourth_quarter_score) /
					4
			);
		}, 0);

		return staff.work_targets.length
			? totalScore / staff.work_targets.length
			: 0;
	}, [staff.work_targets]);

	const userAttitudeEvaluationAverage = useMemo(() => {
		return (
			(staff.communication +
				staff.teamwork +
				staff.collaboration +
				staff.solidarity +
				staff.work_ethic +
				staff.technology_usage +
				staff.work_smart +
				staff.initiative +
				staff.role_model +
				staff.responsibility +
				staff.professional_ethic +
				staff.image_maintenance +
				staff.discipline) /
			13
		);
	}, [staff]);

	const finalScore = useMemo(() => {
		return 0.4 * workTargetAverage + 0.6 * userAttitudeEvaluationAverage;
	}, [workTargetAverage, userAttitudeEvaluationAverage]);

	return (
		<TableRow>
			<TableCell className="py-3 px-4 text-center">{idx + 1}</TableCell>
			<TableCell className="py-3 px-4">{staff.name}</TableCell>
			<TableCell className="py-3 px-4 text-center">
				{workTargetAverage.toFixed(2)}
			</TableCell>
			<TableCell className="py-3 px-4 text-center">
				{userAttitudeEvaluationAverage.toFixed(2)}
			</TableCell>
			<TableCell className="py-3 px-4 text-center">
				{finalScore.toFixed(2)}
			</TableCell>
		</TableRow>
	);
}
