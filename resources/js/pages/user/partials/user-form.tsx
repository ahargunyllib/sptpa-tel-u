import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import AuthenticatedLayout from "@/layouts/dashboard-layout";
import { UserDivisions, UserRoles } from "@/lib/enums";
import type { PageProps, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router, usePage } from "@inertiajs/react";
import { ImagePlus, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function UserForm({ user }: { user?: User }) {
	const [processing, setProcessing] = useState(false);
	const isEditing = !!user?.id;

	const formSchema = z
		.object({
			name: z.string().min(2, { message: "Nama harus diisi" }),
			nip: z.string().min(1, { message: "NIP harus diisi" }),
			email: z.string().email({ message: "Email tidak valid" }),
			location: z.string().optional(),
			division: z.string().optional(),
			role: z.string().min(1, { message: "Jabatan harus diisi" }),
			password: isEditing
				? z.string().optional()
				: z.string().min(6, { message: "Password minimal 6 karakter" }),
		})
		.refine(
			(data) =>
				["wadek1", "wadek2", "sdm"].includes(data.role) ||
				(data.division && data.division.length > 0),

			{
				message: "Divisi harus diisi",
				path: ["division"],
			},
		);
	type FormValues = z.infer<typeof formSchema>;

	const defaultValues: FormValues = {
		name: user?.name ?? "",
		nip: user?.nip ?? "",
		email: user?.email ?? "",
		location: user?.location ?? "",
		division: user?.division ?? "",
		role: user?.role ?? "",
		password: "",
	};

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
		mode: "onChange",
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const unsubscribe = router.on("start", () => setProcessing(true));
		router.on("finish", () => setProcessing(false));

		return () => {
			unsubscribe();
		};
	}, [router]);

	const role = form.watch("role");

	useEffect(() => {
		if (["wadek1", "wadek2", "sdm"].includes(role)) {
			form.setValue("division", "");
		}
	}, [role, form]);

	const onSubmit = (data: FormValues) => {
		console.log(data);
		const isEditing = !!user?.id;
		const url = isEditing
			? route("users.update", user.id)
			: route("users.store");

		const sanitizedData = {
			...data,
			division: data.division?.trim() === "" ? null : data.division,
		};
		console.log(sanitizedData);
		router[isEditing ? "put" : "post"](url, sanitizedData, {
			onSuccess: () => {
				window.location.assign("/dashboard/user");
			},
		});
	};

	const handlePhotoUpload = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const formData = new FormData();
				formData.append("photo", file);

				router.post(route("profile.updatePhoto"), formData, {
					forceFormData: true,
				});
			}
		};
		input.click();
	};

	const handlePhotoDelete = () => {
		if (confirm("Apakah Anda yakin ingin menghapus foto profil?")) {
			router.delete(route("profile.deletePhoto"));
		}
	};

	return (
		<AuthenticatedLayout header="Akun">
			<Head title="Manajemen Akun" />

			<div className="">
				<div className="col-span-1 xl:col-span-3 bg-white p-6 rounded-lg shadow-sm">
					<div className="flex justify-between items-center mb-2">
						<div>
							<h2 className="font-semibold text-base">Data diri</h2>
							<p className="text-xs text-gray-500">
								Ubah foto dan data kamu disini
							</p>
						</div>
						{/* {!isEditing ? (
                            <Button
                                variant="outline"
                                onClick={handleEditToggle}
                                className="gap-2"
                            >
                                <SquarePen className="h-4 w-4" />
                                Edit profil
                            </Button>
                        ) : null} */}
					</div>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit, (errors) => {
								console.log("Form validation errors:", errors);
							})}
							className="space-y-4 mt-6"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nama lengkap</FormLabel>
										<FormControl>
											<Input {...field} className="bg-gray-50" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="nip"
								render={({ field }) => (
									<FormItem>
										<FormLabel>NIP</FormLabel>
										<FormControl>
											<Input {...field} className="bg-gray-50" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input {...field} type="email" className="bg-gray-50" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lokasi kerja</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                className="bg-gray-50"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

							{!["wadek1", "wadek2", "sdm"].includes(role) && (
								<FormField
									control={form.control}
									name="division"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Divisi</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
												disabled={["wadek1", "wadek2", "sdm"].includes(role)}
											>
												<FormControl>
													<SelectTrigger className="bg-gray-50">
														<SelectValue placeholder="Pilih divisi" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{Object.entries(UserDivisions).map(([key, label]) => (
														<SelectItem key={key} value={key}>
															{label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Jabatan</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-gray-50">
													<SelectValue placeholder="Pilih jabatan" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.entries(UserRoles).map(([key, label]) => (
													<SelectItem key={key} value={key}>
														{label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="password"
												className="bg-gray-50"
												placeholder={
													user ? "Kosongkan jika tidak ingin mengubah" : ""
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-end gap-2 mt-6">
								{/* <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleCancel}
                                    >
                                        Batalkan
                                    </Button> */}
								<Button
									type="submit"
									variant={"secondary"}
									className="bg-dark-80 text-white hover:bg-gray-800"
									disabled={processing}
								>
									{processing ? "Menyimpan..." : "Simpan perubahan"}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</AuthenticatedLayout>
	);
}
