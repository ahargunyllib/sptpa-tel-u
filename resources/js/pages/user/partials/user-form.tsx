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

const formSchema = z.object({
	name: z.string().min(2, { message: "Nama harus diisi" }),
	nip: z.string().min(1, { message: "NIP harus diisi" }),
	email: z.string().email({ message: "Email tidak valid" }),
	location: z.string().min(1, { message: "Lokasi kerja harus diisi" }),
	division: z.string().min(1, { message: "Divisi harus diisi" }),
	role: z.string().min(1, { message: "Jabatan harus diisi" }),
	password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});
type FormValues = z.infer<typeof formSchema>;

export default function UserForm({ user }: { user?: User }) {
	const [processing, setProcessing] = useState(false);

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
	useEffect(() => {
		const subscription = form.watch((value, { name, type }) => {
			const errors = form.formState.errors;
			console.log("Changed field:", name);
			console.log("Current form values:", value);
			console.log("Validation errors:", errors);
		});

		return () => subscription.unsubscribe();
	}, [form]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const unsubscribe = router.on("start", () => setProcessing(true));
		router.on("finish", () => setProcessing(false));

		return () => {
			unsubscribe();
		};
	}, [router]);

	const onSubmit = (data: FormValues) => {
		const isEditing = !!user?.id;
		const url = isEditing
			? route("users.update", user.id)
			: route("users.store");

		router[isEditing ? "put" : "post"](url, data, {
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

			<div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
				{/* Left Column - Profile Photo */}
				<div className="col-span-1 xl:col-span-1 ">
					<div className="bg-white p-6 rounded-lg shadow-sm">
						<h2 className="font-semibold text-base mb-4">Foto Profil</h2>
						<div className="flex flex-col items-center gap-6">
							<Avatar className="h-44 w-44 rounded-lg object-cover">
								<AvatarImage
									// src={
									// 	user?.photo_profile ||
									// 	"https://media-sin2-1.cdn.whatsapp.net/v/t61.24694-24/473401127_1818570005572383_5508634567812061033_n.jpg?ccb=11-4&oh=01_Q5AaIQltFg5tbTKGufIbqFYffpLQLdFSqNQXmAOLR8JC4yqi&oe=6802E54F&_nc_sid=5e03e0&_nc_cat=104"
									// }
									src={
										user?.photo_profile
											? user?.photo_profile.startsWith("profile-photos")
												? `/storage/${user?.photo_profile}`
												: user?.photo_profile
											: "https://media-sin2-1.cdn.whatsapp.net/v/t61.24694-24/473401127_1818570005572383_5508634567812061033_n.jpg?ccb=11-4&oh=01_Q5AaIQltFg5tbTKGufIbqFYffpLQLdFSqNQXmAOLR8JC4yqi&oe=6802E54F&_nc_sid=5e03e0&_nc_cat=104"
									}
									alt="Profile"
								/>

								<AvatarFallback>{user?.name?.charAt(0) || "-"}</AvatarFallback>
							</Avatar>
							<div className="w-full space-y-2">
								<Button
									variant="ghost"
									className="w-full justify-start"
									onClick={handlePhotoUpload}
								>
									<ImagePlus className="mr-2 h-4 w-4" />
									<span>Ubah foto profile</span>
								</Button>
								<Button
									variant="destructive"
									className="w-full justify-start "
									onClick={handlePhotoDelete}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Hapus foto profile
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Right Column - Profile Data */}
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
							onSubmit={form.handleSubmit(onSubmit)}
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

							<FormField
								control={form.control}
								name="location"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Lokasi kerja</FormLabel>
										<FormControl>
											<Input {...field} className="bg-gray-50" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="division"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Divisi</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
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
