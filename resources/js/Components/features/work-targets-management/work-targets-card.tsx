import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/react";
import { debounce } from "lodash";
import {
	CheckSquare2Icon,
	Edit3Icon,
	PlusSquareIcon,
	SearchIcon,
	Trash2Icon,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { capitalize, cn } from "../../../lib/utils";
import type { User, WorkTarget } from "../../../types";
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
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../../ui/form";
import { Input, LabelInput } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
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

export default function WorkTargetsCard({
	role,
	users,
	workTargets,
}: {
	role: string;
	users: User[];
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
		router.post("/dashboard/performance/work-target", data, {});
		form.reset();
	});

	return (
		<Card className="shadow-sm">
			<CardHeader>
				<CardTitle>Target Kinerja untuk {capitalize(role)}</CardTitle>
				<CardDescription>
					Lengkapilah daftar target kinerja yang nantinya akan anda tugaskan ke{" "}
					{role}.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-row gap-2">
					<Form {...form}>
						<form onSubmit={onSubmit} className="flex w-full">
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
								<TableHead className="py-3 px-4 text-center">Staff</TableHead>
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
										role={role}
										users={users}
										idx={idx}
									/>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}

function AddStaffDialog({
	workTarget,
	onClick,
	role,
	users,
	onAddStaffs,
}: {
	workTarget: WorkTarget;
	onClick: () => void;
	role: string;
	users: User[];
	onAddStaffs: (staffs: User[]) => void;
}) {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);
	const [search, setSearch] = useState("");

	const inputRef = useRef<HTMLInputElement>(null);

	const handleSearchChange = useCallback(
		debounce((search: string) => {
			console.log("search call", search);
			router.get(
				window.location.pathname,
				{
					search,
				},
				{
					preserveState: true,
				},
			);
		}, 500),
		[],
	);

	const [staffs, setStaffs] = useState<User[]>(workTarget.staffs);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" onClick={onClick}>
					<PlusSquareIcon className="h-4 w-4" />
					Tambah
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{capitalize(role)} yang ditugaskan</DialogTitle>
					<DialogDescription>
						Tambahkan {role} yang akan ditugaskan di target kinerja ini
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<div className="w-full">
						<Popover
							open={isPopoverOpen}
							onOpenChange={setIsPopoverOpen}
							modal={isPopoverOpen}
						>
							<PopoverTrigger asChild>
								<div className="w-full">
									{/* Search Input */}
									<div className="relative">
										<Input
											ref={inputRef}
											className="w-full peer ps-9"
											placeholder={`Cari ${role} disini`}
											value={search}
											onChange={(e) => {
												const value = e.target.value;
												console.log("search", value);
												setSearch(value);
												if (value) setIsPopoverOpen(true);
												handleSearchChange(value);
											}}
											onFocus={() => search && setIsPopoverOpen(true)}
										/>
										<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
											<SearchIcon size={16} aria-hidden="true" />
										</div>
									</div>
								</div>
							</PopoverTrigger>
							<PopoverContent
								className="w-[var(--radix-popover-trigger-width)] p-0"
								align="start"
								onInteractOutside={(e) =>
									e.target === inputRef.current && e.preventDefault()
								}
								onOpenAutoFocus={(e) => e.preventDefault()}
								sideOffset={5}
							>
								{users.length > 0 ? (
									<div className="max-h-60 overflow-auto py-1 hover:bg-background/80">
										{users.map((user) => (
											<div
												key={user.id}
												onClick={(e) => {
													e.stopPropagation();
													setStaffs((prev) => [...prev, user]);
													setIsPopoverOpen(false);
													setSearch("");
													router.get(
														window.location.pathname,
														{
															search: "",
														},
														{
															preserveState: true,
														},
													);
													setTimeout(() => inputRef.current?.focus(), 0);
												}}
												onMouseDown={(e) => e.preventDefault()}
												onKeyDown={() => {}}
												className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
											>
												<span>
													{user.name} ({user.nip})
												</span>
											</div>
										))}
									</div>
								) : (
									<span className="line-clamp-1 leading-none px-4 py-2">
										User tidak ditemukan
									</span>
								)}
							</PopoverContent>
						</Popover>
					</div>

					{/* User Table */}
					<div className="flex flex-col gap-2">
						<Label>Daftar {role} </Label>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="py-3 px-4 text-center">No</TableHead>
									<TableHead className="py-3 px-4 w-full">
										Nama {capitalize(role)}
									</TableHead>
									<TableHead className="py-3 px-4 ">NIP</TableHead>
									<TableHead className="py-3 px-4 text-center">Aksi</TableHead>
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
												{staff.nip}
											</TableCell>
											<TableCell className="py-3 px-4">
												<Trash2Icon
													className="h-4 w-4 cursor-pointer text-danger-80"
													onClick={() => {
														setStaffs((prev) =>
															prev.filter((s) => s.id !== staff.id),
														);
													}}
												/>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button
							variant="ghost"
							onClick={() => {
								router.get(window.location.pathname);
								setIsPopoverOpen(false);
								setSearch("");
								inputRef.current?.focus();
								setIsPopoverOpen(false);
							}}
						>
							Batalkan
						</Button>
					</DialogClose>
					<DialogClose asChild>
						<Button
							onClick={() => {
								onAddStaffs(staffs);
							}}
						>
							Simpan
						</Button>
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
	role,
	users,
}: {
	workTarget: WorkTarget;
	idx: number;
	selectedWorkTargetId: string | null;
	setSelectedWorkTargetId: (id: string | null) => void;
	role: string;
	users: User[];
}) {
	const [data, setData] = useState<WorkTarget>(workTarget);

	const onSubmit = () => {
		if (data.name === "") {
			setData((prev) => ({ ...prev, name: workTarget.name }));
		}

		// transform staffs to array of objects
		const { staffs, ...req } = {
			...data,
			staffIds: data.staffs.map((staff) => staff.id),
		};

		console.log(req);

		router.put(`/dashboard/performance/work-target/${workTarget.id}`, req, {
			preserveState: true,
		});
		setSelectedWorkTargetId(null);
	};

	const onAddStaffs = (staffs: User[]) => {
		setData((prev) => ({
			...prev,
			staffs,
		}));
	};

	return (
		<TableRow>
			<TableCell className="py-3 px-4">{idx + 1}</TableCell>
			<TableCell className="py-3 w-full px-4">
				<LabelInput
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
				<AddStaffDialog
					workTarget={data}
					onClick={() => {
						setSelectedWorkTargetId(workTarget.id);
					}}
					role={role}
					users={users}
					onAddStaffs={onAddStaffs}
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
						{[
							{
								label: "Menit",
								value: "minute",
							},
							{
								label: "Hari",
								value: "day",
							},
							{
								label: "Jumlah",
								value: "total",
							},
							{
								label: "Minggu",
								value: "week",
							},
						].map((value) => (
							<SelectItem key={value.value} value={value.value}>
								{value.label}
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
						<SelectValue placeholder="=" />
					</SelectTrigger>
					<SelectContent>
						{[
							{
								label: "=",
								value: "eq",
							},
							{
								label: ">=",
								value: "gte",
							},
							{
								label: "<=",
								value: "lte",
							},
							{
								label: ">",
								value: "gt",
							},
							{
								label: "<",
								value: "lt",
							},
						].map((value) => (
							<SelectItem key={value.value} value={value.value}>
								{value.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</TableCell>
			<TableCell className="py-3 px-4">
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
			<TableCell className="py-3 px-4">
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
			<TableCell className="py-3 px-4">
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
			<TableCell className="py-3 px-4">
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
						<Trash2Icon
							className="h-4 w-4 cursor-pointer text-danger-80"
							onClick={() => {
								router.delete(
									`/dashboard/performance/work-target/${workTarget.id}`,
								);
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
								router.delete(
									`/dashboard/performance/work-target/${workTarget.id}`,
								);
							}}
						/>
					</div>
				)}
			</TableCell>
		</TableRow>
	);
}
