import { Head, Link, router } from "@inertiajs/react";
import { debounce } from "lodash";
import { type FormEvent, useCallback, useState } from "react";

import Pagination from "@/components/pagination";
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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/layouts/dashboard-layout";
import { cn } from "@/lib/utils";
import type { DataWithPagination, Log, User } from "@/types";
import { format } from "date-fns";
import { CalendarIcon, PencilLine, SquarePen, Trash, X } from "lucide-react";

type UserFilters = {
	username?: string;
	division?: string;
	per_page?: number;
};

export default function UsersIndex({
	users,
	filters,
}: {
	users: DataWithPagination<User>;
	filters: UserFilters;
}) {
	const [searchForm, setSearchForm] = useState({
		username: filters.username || "",
		division: filters.division || "",
	});

	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleDeleteUser = (id: string) => {
		router.delete(`/dashboard/user/${id}`, {
			preserveScroll: true,
			onSuccess: () => {
				setIsDialogOpen(false);
				setSelectedUserId(null);
			},
		});
	};

	const handleInputChange = (name: string, value: string) => {
		setSearchForm((prev) => ({ ...prev, [name]: value }));
	};

	const debouncedSearch = useCallback(
		debounce((query: typeof searchForm) => {
			router.get(
				window.location.pathname,
				{
					...query,
					page: 1,
				},
				{
					preserveState: true,
					preserveScroll: false,
					only: ["users", "filters"],
				},
			);
		}, 500),
		[],
	);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		router.get(
			window.location.pathname,
			{
				...searchForm,
				page: 1,
			},
			{
				preserveState: true,
				preserveScroll: false,
				only: ["users", "filters"],
			},
		);
	};

	return (
		<DashboardLayout>
			<Head title="User Management" />

			<Card className="shadow-sm">
				<CardHeader>
					<CardTitle>Manajemen Akun</CardTitle>
				</CardHeader>
				<CardContent className="">
					{/* Search and Filter Form */}
					<div className="flex justify-between flex-col xl:flex-row gap-4 xl:items-center">
						<form
							onSubmit={handleSubmit}
							className="mb-6 bg-muted/40 p-4 rounded-lg"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
								<div className="space-y-2">
									<label htmlFor="username" className="text-sm font-medium">
										Username
									</label>
									<Input
										id="username"
										name="username"
										value={searchForm.username}
										onChange={(e) => {
											handleInputChange("username", e.target.value);
											debouncedSearch({
												...searchForm,
												username: e.target.value,
											});
										}}
										placeholder="Search by username"
										className="w-full bg-transparent"
									/>
								</div>

								<div className="space-y-2">
									<label htmlFor="division" className="text-sm font-medium">
										Division
									</label>
									<Input
										id="division"
										name="division"
										value={searchForm.division}
										onChange={(e) => {
											handleInputChange("division", e.target.value);
											debouncedSearch({
												...searchForm,
												division: e.target.value,
											});
										}}
										placeholder="Search by division"
										className="w-full bg-transparent"
									/>
								</div>
							</div>
						</form>
						<Link href={"/dashboard/user/create"}>
							<Button variant="outline" className="gap-2">
								<SquarePen className="h-4 w-4" />
								Buat Akun
							</Button>
						</Link>
					</div>

					{/* Logs table */}
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="py-3 px-4">No</TableHead>
									<TableHead className="py-3 px-4">Nama</TableHead>
									<TableHead className="py-3 px-4">NIP</TableHead>
									<TableHead className="py-3 px-4">Email</TableHead>
									<TableHead className="py-3 px-4">Divisi</TableHead>
									<TableHead className="py-3 px-4">Jabatan</TableHead>
									<TableHead className="py-3 px-4">Aksi</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{users.data.length > 0 ? (
									users.data.map((user, index) => {
										const { page, limit } = users.meta;
										const number = (page - 1) * limit + index + 1;

										return (
											<TableRow key={user.id}>
												<TableCell className="py-3 px-4">{number}</TableCell>
												<TableCell className="py-3 px-4">{user.name}</TableCell>
												<TableCell className="py-3 px-4">{user.nip}</TableCell>
												<TableCell className="py-3 px-4">
													{user.email}
												</TableCell>
												<TableCell className="py-3 px-4">
													{user.division ?? ""}
												</TableCell>
												<TableCell className="py-3 px-4">
													{user.role ?? ""}
												</TableCell>
												<TableCell className="py-3 px-4">
													<div className="flex gap-1 items-center">
														<Link href={`/dashboard/user/${user.id}`}>
															<PencilLine className="text-warning-80" />
														</Link>
														<AlertDialog
															open={isDialogOpen}
															onOpenChange={setIsDialogOpen}
														>
															<AlertDialogTrigger asChild>
																<Trash
																	className="text-danger-80"
																	onClick={() => {
																		setSelectedUserId(user.id);
																		setIsDialogOpen(true);
																	}}
																/>
															</AlertDialogTrigger>
															<AlertDialogContent>
																<AlertDialogHeader>
																	<AlertDialogTitle>
																		Hapus User?
																	</AlertDialogTitle>
																	<AlertDialogDescription>
																		Apakah kamu yakin ingin menghapus user ini?
																		Tindakan ini tidak dapat dibatalkan.
																	</AlertDialogDescription>
																</AlertDialogHeader>
																<AlertDialogFooter>
																	<AlertDialogCancel>Batal</AlertDialogCancel>
																	<AlertDialogAction
																		onClick={() => {
																			if (selectedUserId)
																				handleDeleteUser(selectedUserId);
																		}}
																		className="bg-destructive text-white hover:bg-destructive/90"
																	>
																		Hapus
																	</AlertDialogAction>
																</AlertDialogFooter>
															</AlertDialogContent>
														</AlertDialog>
													</div>
												</TableCell>
												{/* <TableCell className="py-3 px-4">
                                                {format(
                                                    new Date(user.updated_at),
                                                    "yyyy-MM-dd"
                                                )}
                                            </TableCell> */}
											</TableRow>
										);
									})
								) : (
									<TableRow>
										<TableCell colSpan={7} className="h-24 text-center">
											No users found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					{/* Pagination component */}
					<div className="mt-6 flex justify-between items-center">
						<Pagination meta={users.meta} queryKey={["users"]} />
						<div className="flex items-center space-x-2">
							<span className="text-sm text-muted-foreground">
								Items per page
							</span>
							<Select
								value={filters.per_page?.toString() || "10"}
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
		</DashboardLayout>
	);
}
