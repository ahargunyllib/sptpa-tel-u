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
				title: "Rubrikasi Penilaian",
				icon: Inbox,
				href: "/dashboard/rubric",
			},
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
		title: "MANAJEMEN DATA & LAPORAN",
		items: [
			{
				title: "Data Pengguna",
				icon: Users,
				href: "/dashboard/user",
			},
			{
				title: "Aktifitas Website",
				icon: History,
				href: "/dashboard/log",
			},
		],
	},
	{
		title: "UNGGAH DOKUMEN BANTUAN",
		items: [
			{
				title: "Unggah Rubrikasi",
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
				title: "Rubrikasi Penilaian",
				icon: Inbox,
				href: "/dashboard/rubric",
			},
			{
				title: "Panduan Pengguna",
				icon: BookOpenText,
				href: "/admin/user",
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
				title: "Rubrikasi Penilaian",
				icon: Inbox,
				href: "/dashboard/rubric",
			},
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
		title: "DOKUMEN ANDA",
		items: [
			{
				title: "Dokumen Kerja",
				icon: FolderIcon,
				href: "/dashboard/e-archive/kerja",
			},
			{
				title: "Dokumen Pegawai",
				icon: FolderIcon,
				href: "/dashboard/e-archive/pegawai",
			},
		],
	},
	{
		title: "DOKUMEN KAUR",
		items: [
			{
				title: "Dokumen Kerja",
				icon: FolderIcon,
				href: "/dashboard/e-archive/kaur/kerja",
			},
			{
				title: "Dokumen Pegawai",
				icon: FolderIcon,
				href: "/dashboard/e-archive/kaur/pegawai",
			},
		],
	},
	{
		title: "DOKUMEN STAF",
		items: [
			{
				title: "Dokumen Kerja",
				icon: FolderIcon,
				href: "/dashboard/e-archive/staf/wadek/kerja",
			},
			{
				title: "Dokumen Pegawai",
				icon: FolderIcon,
				href: "/dashboard/e-archive/staf/wadek/pegawai",
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
				icon: FolderIcon,
				href: "/dashboard/e-archive/kerja",
			},
			{
				title: "Dokumen Pegawai",
				icon: FolderIcon,
				href: "/dashboard/e-archive/pegawai",
			},
		],
	},
	{
		title: "DOKUMEN STAF",
		items: [
			{
				title: "Dokumen Kerja",
				icon: FolderIcon,
				href: "/dashboard/e-archive/staf/kerja",
			},
			{
				title: "Dokumen Pegawai",
				icon: FolderIcon,
				href: "/dashboard/e-archive/staf/pegawai",
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
				icon: FolderIcon,
				href: "/dashboard/e-archive/kerja",
			},
			{
				title: "Dokumen Pegawai",
				icon: FolderIcon,
				href: "/dashboard/e-archive/pegawai",
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
