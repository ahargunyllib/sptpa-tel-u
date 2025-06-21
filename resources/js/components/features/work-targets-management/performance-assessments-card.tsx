import { Button } from "@/components/ui/button";
import { FileTextIcon } from "lucide-react";
import { useMemo } from "react";
import { useUser } from "../../../hooks/use-user";
import { capitalize } from "../../../lib/utils";
import type { User, UserAttitudeEvaluation, WorkTarget } from "../../../types";
import Pagination from "../../pagination";
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
import PerformanceAssessmentsDialog from "./performance-assessments-dialog";
import WorkTargetsDialog from "./work-targets-dialog";

export default function PerformanceAssessmentsCard({
	role,
	staffs,
}: {
	role: string;
	staffs: (User & {
		average_first_quarter_score: number;
		average_second_quarter_score: number;
		average_third_quarter_score: number;
		average_fourth_quarter_score: number;
	} & {
		work_targets: WorkTarget[];
	} & {
		bukti_kinerja_folder_id: string | null;
	} & {
		user_attitude_evaluations: UserAttitudeEvaluation | null;
	})[];
}) {
	const user = useUser();

	return (
		<Card className="shadow-sm">
			<CardHeader className="flex flex-row justify-between items-center">
				<div className="flex flex-col space-y-1.5 p-6">
					<CardTitle>Penilaian Kinerja</CardTitle>
					<CardDescription>
						Dibawah ini merupakan {capitalize(role)} yang Anda kelola
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
										{staffs.map((staff, idx) => (
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
												staffId={staff.id}
												staffName={staff.name}
												workTargets={staff.work_targets}
											/>
										</TableCell>
										<TableCell className="py-3 w-full px-4">
											<PerformanceAssessmentsDialog
												staffId={staff.id}
												staffName={staff.name}
												buktiKinerjaFolderId={staff.bukti_kinerja_folder_id}
												performances={staff.work_targets}
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

function OverallRowDialog({
	staff,
	idx,
}: {
	staff: User & {
		average_first_quarter_score: number;
		average_second_quarter_score: number;
		average_third_quarter_score: number;
		average_fourth_quarter_score: number;
	} & {
		work_targets: WorkTarget[];
	} & {
		bukti_kinerja_folder_id: string | null;
	} & {
		user_attitude_evaluations: UserAttitudeEvaluation | null;
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
		return staff.user_attitude_evaluations
			? (staff.user_attitude_evaluations.communication +
					staff.user_attitude_evaluations.teamwork +
					staff.user_attitude_evaluations.collaboration +
					staff.user_attitude_evaluations.solidarity +
					staff.user_attitude_evaluations.work_ethic +
					staff.user_attitude_evaluations.technology_usage +
					staff.user_attitude_evaluations.work_smart +
					staff.user_attitude_evaluations.initiative +
					staff.user_attitude_evaluations.role_model +
					staff.user_attitude_evaluations.responsibility +
					staff.user_attitude_evaluations.professional_ethic +
					staff.user_attitude_evaluations.image_maintenance +
					staff.user_attitude_evaluations.discipline) /
					13
			: 0;
	}, [staff.user_attitude_evaluations]);

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
