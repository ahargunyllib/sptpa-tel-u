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
import type { PageProps, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	title: z.string().min(1, "Nama Kegiatan wajib diisi"),
	type: z.string().min(1, "Deskripsi wajib diisi"),
	metode: z.enum(["Online", "Offline"], {
		required_error: "Metode wajib dipilih",
	}),
	implementation_date: z.string().min(1, "Tanggal wajib diisi"),
	user_id: z.string().min(1, "Pengguna wajib dipilih"),
	file_pendukung: z.any().optional(), // handled separately in FormData
});

type FormSchema = z.infer<typeof formSchema>;
interface Props {
	users: User[];
	errors: Record<string, string>;
}
export default function Create() {
	const user = usePage<PageProps>().props.auth.user;

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors: validationErrors },
	} = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			type: "",
			metode: "Online",
			implementation_date: "",
			user_id: user?.id || "",
		},
	});

	const [file, setFile] = useState<File | null>(null);

	const onSubmit = async (data: FormSchema) => {
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("type", data.type);
		formData.append("method", data.metode);
		formData.append("implementation_date", data.implementation_date);
		formData.append("user_id", data.user_id);
		if (file) {
			formData.append("file", file);
		}

		await router.post(route("activities.pelatihan-pegawai.store"), formData);
		// window.history.back();
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
								<Label htmlFor="implementation_date">Tanggal Pelaksanaan</Label>
								<Input
									id="implementation_date"
									type="date"
									{...register("implementation_date")}
								/>
								{validationErrors.implementation_date && (
									<p className="text-sm text-red-500">
										{validationErrors.implementation_date.message}
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
