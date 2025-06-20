import DataPegawaiCard from "@/components/dashboard/data-pegawai-card";
import AuthenticatedLayout from "@/layouts/dashboard-layout";
import { cn } from "@/lib/utils";
import type { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";

export default function Dashboard() {
	const user = usePage<PageProps>().props.auth.user;

	const accessRoles = {
		sdm: [
			{
				title: "Data Akses Pegawai",
				description:
					"Dapat mengelola  data serta akses pegawai yang ingin masuk ke website. ",
			},
			{
				title: "Aktivitas Website",
				description:
					"Dapat melihat aktivitas yang dilakukan oleh masing masing role di website.",
			},
			{
				title: "Unggah Rubrik",
				description:
					"Melakukan pengunggahan rubrik penilaian yang nantinya akan digunakan oleh Kepala Urusan dan Wakil Dekan dalam menilai Staf.",
			},
			{
				title: "Unggah Panduan",
				description:
					"Melakukan pengunggahan panduan pengguna, agar pengguna bisa melihat tata cara atau aktivitas yang dapat dilakukan sesuai dengan rolenya.",
			},
		],
		wadek: [
			{
				title: "Penilaian Target Kinerja Kaur",
				description:
					"Melakukan pengisian penilaian target kinerja kaur berdasarkan realisasi target dan evidence yang diberikan lalu melakukan penilaian per tw.",
			},
			{
				title: "Penilaian Target Kinerja Staf",
				description:
					"Melakukan pengisian penilaian target kinerja staf berdasarkan realisasi target dan evidence yang diberikan lalu melakukan penilaian per tw.",
			},
			{
				title: "Penilaian Sikap Kerja",
				description:
					"Melakukan pengisian penilaian berdasarkan 3 kategori  yaitu Harmony, Exellence, dan Integrity sesuai dengan kinerja staf.",
			},
			{
				title: "Laporan Kinerja",
				description: "Dapat melihat laporan kinerja staf yang sudah dilakukan.",
			},
			{
				title: "Penilaian Sikap Kerja",
				description:
					"Melakukan pengisian penilaian berdasarkan 3 kategori  yaitu Harmony, Exellence, dan Integrity sesuai dengan kinerja staf.",
			},
			{
				title: "Laporan Kinerja",
				description: "Dapat melihat laporan kinerja staf yang sudah dilakukan.",
			},
		],
		kaur: [
			{
				title: "Target Kinerja",
				description:
					"Melakukan pengisian realisasi target kinerja yang sudah dilakukan berdasarkan realisasi yang sudah dilaukan per triwulan. Hasil capaian target Kinerja Anda akan menjadi acuan bagi pimpinan dalam melakukan penilaian kinerja.",
			},
			{
				title: "Penilaian Target Kinerja Staf",
				description:
					"Melakukan pengisian penilaian target kinerja staf berdasarkan realisasi target dan evidence yang diberikan lalu melakukan penilaian per tw.",
			},
			{
				title: "Sikap Kerja",
				description:
					"Melakukan input evidence terhadap sikap kerja diri dan dapat melihat hasil penilaian sikap kerja serta feedback dari penilai.",
			},
			{
				title: "Penilaian Sikap Kerja",
				description:
					"Melakukan pengisian penilaian berdasarkan 3 kategori  yaitu Harmony, Exellence, dan Integrity sesuai dengan kinerja staf.",
			},
			{
				title: "Laporan Kinerja",
				description:
					"Dapat menambahkan laporan kinerja yang nantinya dapat dilihat oleh kepala urusan dan wakil dekan yang nantinya dapat memberikan komentar terkait kinerja yang dilaporkan oleh staf",
			},
			{
				title: "Laporan Kinerja",
				description: "Dapat melihat laporan kinerja staf yang sudah dilakukan.",
			},
		],
		staf: [
			{
				title: "Target Kinerja",
				description:
					"Melakukan pengisian realisasi target kinerja yang sudah dilakukan berdasarkan realisasi yang sudah dilaukan per triwulan. Hasil capaian target Kinerja Anda akan menjadi acuan bagi pimpinan dalam melakukan penilaian kinerja.",
			},
			{
				title: "Sikap Kerja",
				description:
					"Melakukan input evidence terhadap sikap kerja diri dan dapat melihat hasil penilaian sikap kerja serta feedback dari penilai.",
			},
			{
				title: "Penilaian Kinerja",
				description:
					"Dapat menambahkan laporan kinerja yang nantinya dapat dilihat oleh kepala urusan dan wakil dekan yang nantinya dapat memberikan komentar terkait kinerja yang dilaporkan oleh staf",
			},
		],
	};

	const roleKey =
		user.role === "wadek1" || user.role === "wadek2" ? "wadek" : user.role;
	const roleItems = accessRoles[roleKey] || [];

	function getGridColsClass(length: number) {
		if (length === 4) return "grid-cols-2";
		if (length <= 3) return "grid-cols-1";
		return "grid-cols-2";
	}

	return (
		<AuthenticatedLayout
			header={
				<h2 className="text-xl font-semibold leading-tight text-gray-800">
					Dashboard
				</h2>
			}
		>
			<section className="flex flex-col gap-4">
				<DataPegawaiCard user={user} />
				<div className={cn("grid gap-4", getGridColsClass(roleItems.length))}>
					{roleItems.map((item, index) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							className="py-5 px-6 bg-white rounded-lg flex flex-col w-full gap-4"
						>
							<span className="text-sm md:text-base text-[#1D2939] font-semibold">
								{item.title}
							</span>
							<div className="px-4 py-2.5 bg-primary-20 text-dark-40 rounded-md">
								{item.description}
							</div>
						</div>
					))}
				</div>
			</section>
		</AuthenticatedLayout>
	);
}
