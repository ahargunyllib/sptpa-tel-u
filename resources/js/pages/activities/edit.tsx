import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/layouts/dashboard-layout";
import type { Activity, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
	.object({
		title: z.string().min(1, "Nama Kegiatan wajib diisi"),
		type: z.string().min(1, "Deskripsi wajib diisi"),
		metode: z.enum(["Online", "Offline"], {
			required_error: "Metode wajib dipilih",
		}),
		start_date: z.string().min(1, "Tanggal wajib diisi"),
		end_date: z.string().min(1, "Tanggal akhir wajib diisi"),
		user_id: z.string().min(1, "Pengguna wajib dipilih"),
		file_pendukung: z.any().optional(), // handled separately in FormData
	})
	.refine((data) => data.start_date <= data.end_date, {
		message: "Start date cannot be later than end date.",
		path: ["start_date"],
	});

type FormSchema = z.infer<typeof formSchema>;
interface Props {
	activity: Activity;
	users: User[];
	errors: Record<string, string>;
}
export default function Edit({ activity, users, errors }: Props) {
	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors: validationErrors },
	} = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: activity.title,
			type: activity.type,
			metode: activity.method as "Online" | "Offline",
			start_date: activity.start_date,
			end_date: activity.end_date,
			user_id: activity.user_id,
		},
	});

	const [file, setFile] = useState<File | null>(null);

	const onSubmit = (data: FormSchema) => {
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("type", data.type);
		formData.append("method", data.metode);
		formData.append("start_date", data.start_date);
		formData.append("end_date", data.end_date);
		formData.append("user_id", data.user_id);
		if (file) {
			formData.append("file", file);
		}

		router.post(
			route("activities.pelatihan-pegawai.update", activity.id),
			formData,
		);
		window.history.back();
	};
	return (
		<DashboardLayout header="Pelatihan Pegawai">
			<Head title="Create Activity" />
			<div className="w-full py-4">
				<Card>
					<CardTitle className="text-lg font-semibold px-6 pt-5">
						Tambah Pelatihan Pegawai
					</CardTitle>
					<CardContent className="p-6 space-y-6">
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							{/* Title */}
							<div>
								<Label htmlFor="title">Nama Kegiatan</Label>
								<Input id="title" {...register("title")} />
								{validationErrors.title && (
									<p className="text-sm text-red-500">
										{validationErrors.title.message}
									</p>
								)}
							</div>

							{/* Type */}
							<div>
								<Label htmlFor="type">Deskripsi</Label>
								<Input id="type" {...register("type")} />
								{validationErrors.type && (
									<p className="text-sm text-red-500">
										{validationErrors.type.message}
									</p>
								)}
							</div>

							{/* Tanggal */}
							<div>
								<Label htmlFor="start_date">Tanggal Mulai</Label>
								<Input
									id="start_date"
									type="date"
									{...register("start_date")}
								/>
								{validationErrors.start_date && (
									<p className="text-sm text-red-500">
										{validationErrors.start_date.message}
									</p>
								)}
							</div>
							<div>
								<Label htmlFor="end_date">Tanggal Akhir</Label>
								<Input id="end_date" type="date" {...register("end_date")} />
								{validationErrors.end_date && (
									<p className="text-sm text-red-500">
										{validationErrors.end_date.message}
									</p>
								)}
							</div>

							{/* File */}
							<div>
								<Label htmlFor="file_pendukung">File Pendukung</Label>
								<Input
									id="file_pendukung"
									type="file"
									onChange={(e) => setFile(e.target.files?.[0] || null)}
								/>
							</div>

							{/* User */}
							<div>
								<Label>Pengguna</Label>
								<Select
									onValueChange={(val) => setValue("user_id", val)}
									defaultValue=""
									value={watch("user_id")}
								>
									<SelectTrigger>
										<SelectValue placeholder="Pilih pengguna" />
									</SelectTrigger>
									<SelectContent>
										{users.map((user) => (
											<SelectItem key={user.id} value={user.id}>
												{user.name} - {user.division}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{validationErrors.user_id && (
									<p className="text-sm text-red-500">
										{validationErrors.user_id.message}
									</p>
								)}
							</div>

							{/* Submit */}
							<div className="text-right">
								<Button type="submit">Simpan</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</div>
		</DashboardLayout>
	);
}
