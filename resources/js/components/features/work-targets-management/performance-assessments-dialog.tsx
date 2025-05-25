import { LabelInput } from "@/components/ui/input";
import { router } from "@inertiajs/react";
import {
	ArrowUpRightIcon,
	CheckSquare2Icon,
	Edit3Icon,
	FileTextIcon,
	Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { WorkTargetUnit } from "../../../lib/enums";
import type { User, WorkTarget } from "../../../types";
import { Button } from "../../ui/button";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../ui/table";

export default function PerformanceAssessmentsDialog({
	staffName,
	staffId,
	performances,
}: {
	staffName: User["name"];
	staffId: User["id"];
	performances: WorkTarget[];
}) {
	const [selectedWorkTargetId, setSelectedWorkTargetId] = useState<
		string | null
	>(null);

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
			<DialogContent className="max-w-4xl">
				<DialogHeader className="flex flex-row items-center justify-between">
					<DialogTitle>Penilaian Kinerja: {staffName}</DialogTitle>
					<Button variant="outline">
						<FileTextIcon />
						Bukti kinerja
					</Button>
				</DialogHeader>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="py-3 px-4 text-center">No</TableHead>
								<TableHead className="py-3 px-4 w-full text-nowrap">
									Daftar Target Kinerja
								</TableHead>
								<TableHead className="py-3 px-4 text-center">Satuan</TableHead>
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
								<TableHead className="py-3 px-6 text-center">
									Nilai TW1
								</TableHead>
								<TableHead className="py-3 px-6 text-center">
									Nilai TW2
								</TableHead>
								<TableHead className="py-3 px-6 text-center">
									Nilai TW3
								</TableHead>
								<TableHead className="py-3 px-6 text-center">
									Nilai TW4
								</TableHead>
								<TableHead className="py-3 px-6 text-center">
									Nilai Keseluruhan
								</TableHead>
								<TableHead className="py-3 px-4 text-center">Aksi</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{performances.map((workTarget, idx) => {
								return (
									<PerformanceAssessmentRow
										key={workTarget.id}
										workTarget={workTarget}
										selectedWorkTargetId={selectedWorkTargetId}
										setSelectedWorkTargetId={setSelectedWorkTargetId}
										idx={idx}
									/>
								);
							})}
						</TableBody>
					</Table>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button disabled={!!selectedWorkTargetId}>Selesai</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function PerformanceAssessmentRow({
	idx,
	workTarget,
	selectedWorkTargetId,
	setSelectedWorkTargetId,
}: {
	idx: number;
	workTarget: WorkTarget;
	selectedWorkTargetId: string | null;
	setSelectedWorkTargetId: (id: string | null) => void;
}) {
	const [scores, setScores] = useState({
		first_quarter_score: workTarget.first_quarter_score,
		second_quarter_score: workTarget.second_quarter_score,
		third_quarter_score: workTarget.third_quarter_score,
		fourth_quarter_score: workTarget.fourth_quarter_score,
		final_score: workTarget.final_score,
	});

	const onSubmit = () => {
		const req = {
			...scores,
		};

		router.post(`/dashboard/work-target/${workTarget.id}/assess`, req, {
			preserveState: true,
		});
		setSelectedWorkTargetId(null);
	};

	return (
		<TableRow key={workTarget.id}>
			<TableCell className="py-3 px-4">{idx + 1}</TableCell>
			<TableCell className="py-3 w-full px-4">{workTarget.name}</TableCell>
			<TableCell className="py-3 px-4 text-center">
				{WorkTargetUnit[workTarget.unit]}
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
			<TableCell className="py-3 text-center">
				<LabelInput
					inputMode="numeric"
					value={scores.first_quarter_score.toString()}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setScores((prev) => ({
								...prev,
								first_quarter_score: 0,
							}));
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
							setScores((prev) => ({
								...prev,
								second_quarter_score: 0,
							}));
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
							setScores((prev) => ({
								...prev,
								third_quarter_score: 0,
							}));
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
							setScores((prev) => ({
								...prev,
								fourth_quarter_score: 0,
							}));
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
			<TableCell className="py-3 text-center">
				<LabelInput
					inputMode="numeric"
					value={scores.final_score.toString()}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setScores((prev) => ({
								...prev,
								all_score: 0,
							}));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setScores((prev) => ({
							...prev,
							all_score: Number(value),
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
									final_score: 0,
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
									final_score: 0,
								});
							}}
						/>
					</div>
				)}
			</TableCell>
		</TableRow>
	);
}
