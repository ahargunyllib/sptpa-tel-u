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
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input, LabelInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import {
	ArrowUpRightIcon,
	CheckSquare2Icon,
	Edit3Icon,
	Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { WorkTargetComparator, WorkTargetUnit } from "../../../lib/enums";
import type { User, WorkTarget } from "../../../types";
import { Button, buttonVariants } from "../../ui/button";
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
import { TextareaInput } from "../../ui/textarea";

export default function WorkTargetsDialog({
	staffName,
	staffId,
	workTargets,
}: {
	staffName: User["name"];
	staffId: User["id"];
	workTargets: WorkTarget[];
}) {
	const [selectedWorkTargetId, setSelectedWorkTargetId] = useState<
		string | null
	>(null);

	const createWorkTargetSchema = z.object({
		name: z
			.string()
			.min(1, { message: "Nama target kinerja tidak boleh kosong" }),
	});

	const form = useForm<z.infer<typeof createWorkTargetSchema>>({
		resolver: zodResolver(createWorkTargetSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		console.log(data);
		router.post(
			"/dashboard/work-target",
			{
				...data,
				assigned_id: staffId,
			},
			{},
		);
		form.reset();
	});

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
				<DialogHeader>
					<DialogTitle>Daftar Target Kinerja: {staffName}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<div className="flex flex-row gap-2">
						<Form {...form}>
							<form onSubmit={onSubmit} className="flex w-full gap-2">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem className="w-full">
											<FormControl>
												<Input
													className="w-full"
													placeholder="Tuliskan target kerja disini"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<Button type="submit">Tambahkan</Button>
							</form>
						</Form>
					</div>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="py-3 px-4 text-center">No</TableHead>
									<TableHead className="py-3 px-4 w-full">
										Daftar Target Kinerja
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
									<TableHead className="py-3 px-4 text-center">Aksi</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{workTargets.map((workTarget, idx) => {
									return (
										<WorkTargetRow
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

function WorkTargetRow({
	workTarget,
	idx,
	selectedWorkTargetId,
	setSelectedWorkTargetId,
}: {
	workTarget: WorkTarget;
	idx: number;
	selectedWorkTargetId: string | null;
	setSelectedWorkTargetId: (id: string | null) => void;
}) {
	const [data, setData] = useState<WorkTarget>(workTarget);

	const onSubmit = () => {
		if (data.name === "") {
			setData((prev) => ({ ...prev, name: workTarget.name }));
		}

		router.put(`/dashboard/work-target/${workTarget.id}`, data, {
			preserveState: true,
		});
		setSelectedWorkTargetId(null);
	};

	return (
		<TableRow>
			<TableCell className="py-3 px-4">{idx + 1}</TableCell>
			<TableCell className="py-3 w-full px-4">
				<TextareaInput
					className={cn(
						"w-full text-left",
						selectedWorkTargetId === workTarget.id ? "pl-2" : "pl-0",
					)}
					value={data.name}
					disabled={selectedWorkTargetId !== workTarget.id}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setData((prev) => ({ ...prev, name: "" }));
						}

						if (value.length > 255) {
							return;
						}

						setData((prev) => ({ ...prev, name: e.target.value }));
					}}
				/>
			</TableCell>
			<TableCell className="py-3 px-4">
				<Select
					value={data.unit}
					onValueChange={(value) => {
						setSelectedWorkTargetId(workTarget.id);
						setData((prev) => ({ ...prev, unit: value as WorkTarget["unit"] }));
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="Minggu" />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(WorkTargetUnit)
							.map(([key, value]) => ({
								key,
								value,
							}))
							.map((unit) => (
								<SelectItem key={unit.key} value={unit.key}>
									{unit.value}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			</TableCell>
			<TableCell className="py-3 px-4">
				<Select
					value={data.comparator}
					onValueChange={(value) => {
						setSelectedWorkTargetId(workTarget.id);
						setData((prev) => ({
							...prev,
							comparator: value as WorkTarget["comparator"],
						}));
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="eq" />
					</SelectTrigger>
					<SelectContent>
						{Object.entries(WorkTargetComparator)
							.map(([key, value]) => ({
								key,
								value,
							}))
							.map((unit) => (
								<SelectItem key={unit.key} value={unit.key}>
									{unit.value}
								</SelectItem>
							))}
					</SelectContent>
				</Select>
			</TableCell>
			<TableCell className="py-3">
				<LabelInput
					inputMode="numeric"
					value={data.first_quarter_target.toString()}
					disabled={selectedWorkTargetId !== workTarget.id}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setData((prev) => ({ ...prev, first_quarter_target: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setData((prev) => ({
							...prev,
							first_quarter_target: Number(value),
						}));
					}}
				/>
			</TableCell>
			<TableCell className="py-3">
				<LabelInput
					inputMode="numeric"
					value={data.second_quarter_target.toString()}
					disabled={selectedWorkTargetId !== workTarget.id}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setData((prev) => ({ ...prev, second_quarter_target: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setData((prev) => ({
							...prev,
							second_quarter_target: Number(value),
						}));
					}}
				/>
			</TableCell>
			<TableCell className="py-3">
				<LabelInput
					inputMode="numeric"
					value={data.third_quarter_target.toString()}
					disabled={selectedWorkTargetId !== workTarget.id}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setData((prev) => ({ ...prev, third_quarter_target: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setData((prev) => ({
							...prev,
							third_quarter_target: Number(value),
						}));
					}}
				/>
			</TableCell>
			<TableCell className="py-3">
				<LabelInput
					inputMode="numeric"
					value={data.fourth_quarter_target.toString()}
					disabled={selectedWorkTargetId !== workTarget.id}
					onChange={(e) => {
						const value = e.target.value;
						if (value === "") {
							setData((prev) => ({ ...prev, fourth_quarter_target: 0 }));
						}

						if (Number.isNaN(Number(value))) {
							return;
						}

						setData((prev) => ({
							...prev,
							fourth_quarter_target: Number(value),
						}));
					}}
				/>
			</TableCell>
			<TableCell className="py-3 px-4">
				{selectedWorkTargetId === workTarget.id ? (
					<div className="flex flex-row gap-2">
						<CheckSquare2Icon
							className="h-4 w-4 cursor-pointer text-primary-60"
							onClick={() => {
								setSelectedWorkTargetId(null);
								onSubmit();
							}}
						/>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Trash2Icon className="h-4 w-4 cursor-pointer text-danger-80" />
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Apakah Anda yakin ingin menghapus target kinerja ini?
									</AlertDialogTitle>
									<AlertDialogDescription>
										Setelah dihapus, target kinerja ini tidak dapat dikembalikan
										lagi.
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
										onClick={() => {
											router.delete(`/dashboard/work-target/${workTarget.id}`);
										}}
									>
										Hapus
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				) : (
					<div className="flex flex-row gap-2">
						<Edit3Icon
							className="h-4 w-4 cursor-pointer text-warning-80"
							onClick={() => setSelectedWorkTargetId(workTarget.id)}
						/>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Trash2Icon className="h-4 w-4 cursor-pointer text-danger-80" />
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										Apakah Anda yakin ingin menghapus target kinerja ini?
									</AlertDialogTitle>
									<AlertDialogDescription>
										Setelah dihapus, target kinerja ini tidak dapat dikembalikan
										lagi.
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
										onClick={() => {
											router.delete(`/dashboard/work-target/${workTarget.id}`);
										}}
									>
										Hapus
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				)}
			</TableCell>
		</TableRow>
	);
}
