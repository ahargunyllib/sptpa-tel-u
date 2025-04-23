import { Head, router, usePage } from "@inertiajs/react";
import {
	ArrowUpRightIcon,
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
import { LabelInput } from "../../components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/ui/table";
import DashboardLayout from "../../layouts/dashboard-layout";
import type { User, WorkTarget, WorkTargetValue } from "../../types";

export default function WorkTargetsManagementShow({
	workTargets,
}: {
	workTargets: (WorkTarget & WorkTargetValue)[];
}) {
	const user = usePage().props.auth.user as User;

	const [selectedWorkTargetId, setSelectedWorkTargetId] = useState<
		string | null
	>(null);

	return (
		<DashboardLayout>
			<Head title="Target Kinerja Pegawai" />

			<Card className="shadow-sm">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Target Kinerja: {user.name}</CardTitle>
					<WorkTargetsUserCard user={user} workTargets={workTargets} />
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
										Kategori
									</TableHead>
									<TableHead className="py-3 px-4 text-center">
										Evidance
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

function WorkTargetsUserCard({
	user,
	workTargets,
}: {
	user: User;
	workTargets: (WorkTarget & WorkTargetValue)[];
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="bg-transparent hover:bg-transparent active:bg-transparent text-info-60"
				>
					<ArrowUpRightIcon />
					Tampil
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-7xl">
				<DialogHeader>
					<DialogTitle>Target Kinerja: {user.name}</DialogTitle>
				</DialogHeader>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="py-3 px-4 text-center">No</TableHead>
								<TableHead className="py-3 px-4 w-full text-nowrap">
									Target Kinerja Pegawai
								</TableHead>
								<TableHead className="py-3 px-4 text-center">Satuan</TableHead>
								<TableHead className="py-3 px-4 text-center">Ukuran</TableHead>
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
							</TableRow>
						</TableHeader>
						<TableBody>
							{workTargets.map((workTarget, idx) => {
								return (
									<TableRow key={workTarget.id}>
										<TableCell className="py-3 px-4">{idx + 1}</TableCell>
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
										<TableCell className="py-3 px-4 text-center">
											{workTarget.first_quarter_value}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{workTarget.second_quarter_value}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{workTarget.third_quarter_value}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{workTarget.fourth_quarter_value}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function WorkTargetRow({
	workTarget,
	idx,
	selectedWorkTargetId,
	setSelectedWorkTargetId,
}: {
	workTarget: WorkTarget & WorkTargetValue;
	idx: number;
	selectedWorkTargetId: string | null;
	setSelectedWorkTargetId: (id: string | null) => void;
}) {
	const [scores, setScores] = useState({
		first_quarter_score: workTarget.first_quarter_score,
		second_quarter_score: workTarget.second_quarter_score,
		third_quarter_score: workTarget.third_quarter_score,
		fourth_quarter_score: workTarget.fourth_quarter_score,
	});

	const onSubmit = () => {
		const req = {
			...scores,
		};

		router.put(
			`/dashboard/performance/work-target-value/${workTarget.id}`,
			req,
			{
				preserveState: true,
			},
		);
		setSelectedWorkTargetId(null);
	};

	return (
		<TableRow>
			<TableCell className="py-3 px-4">{idx + 1}</TableCell>
			<TableCell className="py-3 w-full px-4">{workTarget.name}</TableCell>
			<TableCell className="py-3 px-4 text-center">
				{
					{ light: "Ringan", medium: "Sedang", heavy: "Berat" }[
						workTarget.category
					]
				}
			</TableCell>
			<TableCell className="py-3 px-4">
				<Button variant="ghost" size="sm" className="text-info-60">
					<FileTextIcon />
					Lihat
				</Button>
			</TableCell>
			<TableCell className="py-3 text-center">
				<LabelInput
					inputMode="numeric"
					value={scores.first_quarter_score.toString()}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setScores((prev) => ({ ...prev, first_quarter_score: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setScores((prev) => ({
							...prev,
							first_quarter_score: Number(value),
						}));
					}}
					disabled={selectedWorkTargetId !== workTarget.id}
				/>
			</TableCell>
			<TableCell className="py-3 text-center">
				<LabelInput
					inputMode="numeric"
					value={scores.second_quarter_score.toString()}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setScores((prev) => ({ ...prev, second_quarter_score: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setScores((prev) => ({
							...prev,
							second_quarter_score: Number(value),
						}));
					}}
					disabled={selectedWorkTargetId !== workTarget.id}
				/>
			</TableCell>
			<TableCell className="py-3 text-center">
				<LabelInput
					inputMode="numeric"
					value={scores.third_quarter_score.toString()}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setScores((prev) => ({ ...prev, third_quarter_score: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setScores((prev) => ({
							...prev,
							third_quarter_score: Number(value),
						}));
					}}
					disabled={selectedWorkTargetId !== workTarget.id}
				/>
			</TableCell>
			<TableCell className="py-3 text-center">
				<LabelInput
					inputMode="numeric"
					value={scores.fourth_quarter_score.toString()}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setScores((prev) => ({ ...prev, fourth_quarter_score: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setScores((prev) => ({
							...prev,
							fourth_quarter_score: Number(value),
						}));
					}}
					disabled={selectedWorkTargetId !== workTarget.id}
				/>
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
								setScores({
									first_quarter_score: 0,
									second_quarter_score: 0,
									third_quarter_score: 0,
									fourth_quarter_score: 0,
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
								setScores({
									first_quarter_score: 0,
									second_quarter_score: 0,
									third_quarter_score: 0,
									fourth_quarter_score: 0,
								});
							}}
						/>
					</div>
				)}
			</TableCell>
		</TableRow>
	);
}
