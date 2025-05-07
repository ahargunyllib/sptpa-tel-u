import { BookOpenText, FileText, History, Users } from "lucide-react";

import type { ElementType } from "react";

export interface NavItem {
	title: string;
	icon: ElementType;
	href: string;
	active?: boolean;
}

export interface NavSection {
	title: string;
	items: NavItem[];
}

export const tpaPenilaianSections: NavSection[] = [
	{
		title: "KINERJA ANDA",
		items: [
			{
				title: "Target Kinerja",
				icon: FileText,
				href: "/dashboard/work-target/me",
			},
			{
				title: "Sikap Kerja",
				icon: FileText,
				href: "/dashboard/attitude/me",
			},
			{
				title: "Laporan Kinerja",
				icon: FileText,
				href: "/dashboard/work-report/me",
			},
		],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/admin/user",
			},
		],
	},
];

export const kaurPenilaianSections: NavSection[] = [
	{
		title: "KINERJA ANDA",
		items: [
			{
				title: "Target Kinerja",
				icon: FileText,
				href: "/dashboard/work-target/me",
			},
			{
				title: "Sikap Kerja",
				icon: FileText,
				href: "/dashboard/attitude/me",
			},
			{
				title: "Laporan Kinerja",
				icon: FileText,
				href: "/dashboard/work-report/me",
			},
		],
	},
	{
		title: "KINERJA STAF",
		items: [
			{
				title: "Target Kinerja Staf",
				icon: FileText,
				href: "/dashboard/work-target/staf",
			},
			{
				title: "Sikap Kerja Staf",
				icon: FileText,
				href: "/dashboard/attitude/staf",
			},
			{
				title: "Laporan Kinerja Staf",
				icon: FileText,
				href: "/dashboard/work-report/staf",
			},
		],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/admin/user",
			},
		],
	},
];

export const sdmPenilaianSections: NavSection[] = [
	{
		title: "MANAGEMEN DATA & LAPORAN",
		items: [
			{
				title: "Data Atasan & Pegawai",
				icon: Users,
				href: "/dashboard/user",
			},
			{
				title: "Website Log",
				icon: History,
				href: "/dashboard/log",
			},
		],
	},
];

export const wadekPenilaianSections: NavSection[] = [
	{
		title: "KINERJA KAUR",
		items: [
			{
				title: "Target Kinerja Kaur",
				icon: FileText,
				href: "/dashboard/work-target/kaur",
			},
			{
				title: "Sikap Kerja Kaur",
				icon: FileText,
				href: "/dashboard/attitude/kaur",
			},
			{
				title: "Laporan Kinerja Kaur",
				icon: FileText,
				href: "/dashboard/work-report/kaur",
			},
		],
	},
	{
		title: "KINERJA STAF",
		items: [
			{
				title: "Target Kinerja Staf",
				icon: FileText,
				href: "/dashboard/work-target/staf",
			},
			{
				title: "Sikap Kerja Staf",
				icon: FileText,
				href: "/dashboard/attitude/staf",
			},
			{
				title: "Laporan Kinerja Staf",
				icon: FileText,
				href: "/dashboard/work-report/staf",
			},
		],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/admin/user",
			},
		],
	},
];

export const wadekArsipSections: NavSection[] = [
	{
		title: "DOKUMEN",
		items: [
			{
				title: "Dokumen",
				icon: FileText,
				href: "/dashboard/e-archive",
			},
			{
				title: "Dokumen Staf",
				icon: FileText,
				href: "/dashboard/e-archive", // TODO:
			},
			{
				title: "Dokumen Kaur",
				icon: FileText,
				href: "/dashboard/e-archive", // TODO:
			},
		],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/admin/user",
			},
		],
	},
];

export const sdmArsipSections: NavSection[] = [
	{
		title: "DOKUMEN",
		items: [],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/admin/user",
			},
		],
	},
];

export const kaurArsipSections: NavSection[] = [
	{
		title: "DOKUMEN ANDA",
		items: [
			{
				title: "Dokumen Kerja",
				icon: FileText,
				href: "/dashboard/e-archive",
			},
			{
				title: "Dokumen Pegawai",
				icon: FileText,
				href: "/dashboard/e-archive", // TODO:
			},
		],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/admin/user",
			},
		],
	},
];

export const tpaArsipSections: NavSection[] = [
	{
		title: "DOKUMEN ANDA",
		items: [
			{
				title: "Dokumen Kerja",
				icon: FileText,
				href: "/dashboard/e-archive",
			},
			{
				title: "Dokumen Pegawai",
				icon: FileText,
				href: "/dashboard/e-archive", // TODO:
			},
		],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/admin/user",
			},
		],
	},
];
