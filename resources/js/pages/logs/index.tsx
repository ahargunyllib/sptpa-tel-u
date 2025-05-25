import { Head, router } from "@inertiajs/react";
import { debounce } from "lodash";
import { type FormEvent, useCallback, useState } from "react";

import Pagination from "@/components/pagination";
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
import type { DataWithPagination, Log } from "@/types";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

type LogFilters = {
	username?: string;
	description?: string;
	start_date?: string;
	end_date?: string;
	per_page?: number;
};

export default function LogsIndex({
	logs,
	filters,
}: {
	logs: DataWithPagination<Log>;
	filters: LogFilters;
}) {
	const [searchForm, setSearchForm] = useState({
		username: filters.username || "",
		description: filters.description || "",
		start_date: filters.start_date || "",
		end_date: filters.end_date || "",
	});

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
					only: ["logs", "filters"],
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
				only: ["logs", "filters"],
			},
		);
	};

	const clearFilters = () => {
		const clearedForm = {
			username: "",
			description: "",
			start_date: "",
			end_date: "",
		};
		setSearchForm(clearedForm);
		router.get(
			window.location.pathname,
			{
				...clearedForm,
				per_page: filters.per_page,
				page: 1,
			},
			{
				preserveState: true,
				preserveScroll: false,
				only: ["logs", "filters"],
			},
		);
	};

	const hasActiveFilters = () => {
		return (
			searchForm.username !== "" ||
			searchForm.description !== "" ||
			searchForm.start_date !== "" ||
			searchForm.end_date !== ""
		);
	};

	const formatDate = (dateString: string) => {
		try {
			return format(new Date(dateString), "PPP");
		} catch (error) {
			return dateString;
		}
	};

	return (
		<DashboardLayout>
			<Head title="System Logs" />

			<Card className="shadow-sm">
				<CardHeader>
					<CardTitle>Aktivitas Website</CardTitle>
				</CardHeader>
				<CardContent>
					{/* Search and Filter Form */}
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
									placeholder="Cari berdasarkan username"
									className="w-full bg-transparent"
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="description" className="text-sm font-medium">
									Deskripsi
								</label>
								<Input
									id="description"
									name="description"
									value={searchForm.description}
									onChange={(e) => {
										handleInputChange("description", e.target.value);
										debouncedSearch({
											...searchForm,
											description: e.target.value,
										});
									}}
									placeholder="Cari berdasarkan deskripsi"
									className="w-full bg-transparent"
								/>
							</div>

							<div className="space-y-2">
								<label htmlFor="start_date" className="text-sm font-medium">
									Tanggal Mulai
								</label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn(
												"w-full justify-start text-left font-normal",
												!searchForm.start_date && "text-muted-foreground",
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{searchForm.start_date ? (
												formatDate(searchForm.start_date)
											) : (
												<span>Pilih tanggal</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={
												searchForm.start_date
													? new Date(searchForm.start_date)
													: undefined
											}
											onSelect={(date) => {
												const formatted = date
													? format(date, "yyyy-MM-dd")
													: "";
												handleInputChange("start_date", formatted);
											}}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>

							<div className="space-y-2">
								<label htmlFor="end_date" className="text-sm font-medium">
									Tanggal Selesai
								</label>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											className={cn(
												"w-full justify-start text-left font-normal",
												!searchForm.end_date && "text-muted-foreground",
											)}
										>
											<CalendarIcon className="mr-2 h-4 w-4" />
											{searchForm.end_date ? (
												formatDate(searchForm.end_date)
											) : (
												<span>Pilih tanggal</span>
											)}
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0">
										<Calendar
											mode="single"
											selected={
												searchForm.end_date
													? new Date(searchForm.end_date)
													: undefined
											}
											onSelect={(date) => {
												const formatted = date
													? format(date, "yyyy-MM-dd")
													: "";
												handleInputChange("end_date", formatted);
											}}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</div>

							<div className="flex items-end space-x-2">
								{hasActiveFilters() && (
									<Button
										variant="ghost"
										type="button"
										onClick={clearFilters}
										className="flex-1"
									>
										Bersihkan Filter
									</Button>
								)}
								<Button type="submit" className="flex-1">
									Terapkan Filter
								</Button>
							</div>
						</div>
					</form>

					{/* Logs table */}
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="py-3 px-4">No</TableHead>
									<TableHead className="py-3 px-4">Deskripsi Log</TableHead>
									<TableHead className="py-3 px-4">Role & User</TableHead>
									<TableHead className="py-3 px-4">Tanggal</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{logs.data.length > 0 ? (
									logs.data.map((log, index) => {
										const { page, limit } = logs.meta;
										const number = (page - 1) * limit + index + 1;
										return (
											<TableRow key={log.id}>
												<TableCell className="py-3 px-4">{number}</TableCell>
												<TableCell className="py-3 px-4">
													{log.description}
												</TableCell>
												<TableCell className="py-3 px-4">
													{log.user?.role ?? ""} - {log.user?.name ?? ""}
												</TableCell>
												<TableCell className="py-3 px-4">
													{format(new Date(log.created_at), "yyyy-MM-dd")}
												</TableCell>
											</TableRow>
										);
									})
								) : (
									<TableRow>
										<TableCell colSpan={4} className="h-24 text-center">
											Tidak ada log yang ditemukan.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>

					{/* Pagination component */}
					<div className="mt-6 flex justify-between items-center">
						<Pagination meta={logs.meta} />
						<div className="flex items-center space-x-2">
							<span className="text-sm text-muted-foreground">
								Item per halaman
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
