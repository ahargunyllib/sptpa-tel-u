import {
	BookOpenText,
	ClipboardList,
	ClipboardListIcon,
	FileText,
	FolderIcon,
	History,
	Inbox,
	StarIcon,
	Upload,
	Users,
} from "lucide-react";

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
				icon: StarIcon,
				href: "/dashboard/user-attitude-evaluation/me",
			},
			{
				title: "Laporan Kinerja",
				icon: ClipboardListIcon,
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
				href: "/dashboard/panduan",
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
				icon: StarIcon,
				href: "/dashboard/user-attitude-evaluation/me",
			},
			{
				title: "Laporan Kinerja",
				icon: ClipboardList,
				href: "/dashboard/work-report/me",
			},
		],
	},
	{
		title: "KINERJA STAF",
		items: [
			{
				title: "Target Kinerja",
				icon: FileText,
				href: "/dashboard/work-target/staf",
			},
			{
				title: "Sikap Kerja",
				icon: StarIcon,
				href: "/dashboard/user-attitude-evaluation/staf",
			},
			{
				title: "Laporan Kinerja",
				icon: ClipboardList,
				href: "/dashboard/work-report/staf",
			},
		],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Rubrik Penilaian",
				icon: Inbox,
				href: "/dashboard/rubric",
			},
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/dashboard/panduan",
			},
		],
	},
];

export const sdmPenilaianSections: NavSection[] = [
	{
		title: "MANAJEMEN DATA & LAPORAN",
		items: [
			{
				title: "Data Pengguna",
				icon: Users,
				href: "/dashboard/user",
			},
			{
				title: "Aktivitas Website",
				icon: History,
				href: "/dashboard/log",
			},
		],
	},
	{
		title: "UNGGAH DOKUMEN BANTUAN",
		items: [
			{
				title: "Unggah Rubrik",
				icon: Upload,
				href: "/dashboard/upload/rubrikasi", // TODO
			},
			{
				title: "Unggah Panduan",
				icon: Upload,
				href: "/dashboard/upload/panduan", // TODO
			},
		],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Rubrik Penilaian",
				icon: Inbox,
				href: "/dashboard/rubric",
			},
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/dashboard/panduan",
			},
		],
	},
];

export const wadekPenilaianSections: NavSection[] = [
	{
		title: "KINERJA KAUR",
		items: [
			{
				title: "Target Kinerja",
				icon: FileText,
				href: "/dashboard/work-target/kaur",
			},
			{
				title: "Sikap Kerja",
				icon: StarIcon,
				href: "/dashboard/user-attitude-evaluation/kaur",
			},
			{
				title: "Laporan Kinerja",
				icon: ClipboardList,
				href: "/dashboard/work-report/kaur",
			},
		],
	},
	{
		title: "KINERJA STAF",
		items: [
			{
				title: "Target Kinerja",
				icon: FileText,
				href: "/dashboard/work-target/staf",
			},
			{
				title: "Sikap Kerja",
				icon: StarIcon,
				href: "/dashboard/user-attitude-evaluation/staf",
			},
			{
				title: "Laporan Kinerja",
				icon: ClipboardList,
				href: "/dashboard/work-report/staf",
			},
		],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Rubrik Penilaian",
				icon: Inbox,
				href: "/dashboard/rubric",
			},
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/dashboard/panduan",
			},
		],
	},
];

export const wadekArsipSections: NavSection[] = [
	{
		title: "DOKUMEN ANDA",
		items: [
			// {
			// 	title: "Dokumen Kinerja",
			// 	icon: FolderIcon,
			// 	href: "/dashboard/e-archive/kerja",
			// },
			{
				title: "Data Pelatihan",
				icon: FolderIcon,
				href: "/dashboard/e-archive/pelatihan-pegawai",
			},
		],
	},
	{
		title: "DOKUMEN KAUR",
		items: [
			{
				title: "Dokumen Kinerja",
				icon: FolderIcon,
				href: "/dashboard/e-archive/kaur/kerja",
			},
			{
				title: "Data Pelatihan Kaur",
				icon: FolderIcon,
				href: "/dashboard/e-archive/pelatihan-pegawai-kaur/wadek",
			},
		],
	},
	{
		title: "DOKUMEN STAF",
		items: [
			{
				title: "Dokumen Kinerja",
				icon: FolderIcon,
				href: "/dashboard/e-archive/staf/wadek/kerja",
			},
			{
				title: "Data Pelatihan Staf",
				icon: FolderIcon,
				href: "/dashboard/e-archive/pelatihan-pegawai/wadek",
			},
		],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/dashboard/panduan",
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
				href: "/dashboard/panduan",
			},
		],
	},
];

export const kaurArsipSections: NavSection[] = [
	{
		title: "DOKUMEN ANDA",
		items: [
			{
				title: "Dokumen Kinerja",
				icon: FolderIcon,
				href: "/dashboard/e-archive/kerja",
			},
			{
				title: "Data Pelatihan",
				icon: FolderIcon,
				href: "/dashboard/e-archive/pelatihan-pegawai",
			},
		],
	},
	{
		title: "DOKUMEN STAF",
		items: [
			{
				title: "Dokumen Kinerja",
				icon: FolderIcon,
				href: "/dashboard/e-archive/staf/kerja",
			},
			{
				title: "Data Pelatihan",
				icon: FolderIcon,
				href: "/dashboard/e-archive/pelatihan-pegawai/kaur",
			},
		],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/dashboard/panduan",
			},
		],
	},
];

export const tpaArsipSections: NavSection[] = [
	{
		title: "DOKUMEN ANDA",
		items: [
			{
				title: "Dokumen Kinerja",
				icon: FolderIcon,
				href: "/dashboard/e-archive/kerja",
			},
			{
				title: "Data Pelatihan",
				icon: FolderIcon,
				href: "/dashboard/e-archive/pelatihan-pegawai",
			},
		],
	},
	{
		title: "BANTUAN",
		items: [
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/dashboard/panduan",
			},
		],
	},
];
