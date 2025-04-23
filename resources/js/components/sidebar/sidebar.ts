import {
	BookOpenText,
	FileText,
	History,
	LogOut,
	MessageSquareText,
	UserIcon,
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
		title: "PENILAIAN KINERJA",
		items: [
			{
				title: "Target kinerja pegawai",
				icon: FileText,
				href: "/target-kinerja",
			},
		],
	},
	{
		title: "MANAGEMEN DATA & LAPORAN",
		items: [
			{
				title: "Data Atasan & Pegawai",
				icon: Users,
				href: "/admin/user",
			},
			{
				title: "Weekly Report",
				icon: MessageSquareText,
				href: "/admin/user",
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
	{
		title: "UMUM",
		items: [
			{
				title: "Akun",
				icon: UserIcon,
				href: "/profile",
			},
			{
				title: "Logout",
				icon: LogOut,
				href: "/logout",
			},
		],
	},
];

export const kaurPenilaianSections: NavSection[] = [
	{
		title: "PENILAIAN KINERJA",
		items: [
			{
				title: "Target kinerja pegawai",
				icon: FileText,
				href: "/dashboard/performance/me",
			},
			{
				title: "Kinerja TPA",
				icon: FileText,
				href: "/dashboard/performance/tpa",
			},
		],
	},
	{
		title: "MANAGEMEN DATA & LAPORAN",
		items: [
			{
				title: "Data Atasan & Pegawai",
				icon: Users,
				href: "/admin/user",
			},
			{
				title: "Weekly Report",
				icon: MessageSquareText,
				href: "/admin/user",
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
	{
		title: "UMUM",
		items: [
			{
				title: "Akun",
				icon: UserIcon,
				href: "/profile",
			},
			{
				title: "Logout",
				icon: LogOut,
				href: "/logout",
			},
		],
	},
];

export const sdmPenilaianSections: NavSection[] = [
	{
		title: "PENILAIAN KINERJA",
		items: [
			{
				title: "Target kinerja pegawai",
				icon: FileText,
				href: "/target-kinerja",
			},
		],
	},
	{
		title: "MANAGEMEN DATA & LAPORAN",
		items: [
			{
				title: "Data Atasan & Pegawai",
				icon: Users,
				href: "/dashboard/user",
			},
			{
				title: "Weekly Report",
				icon: MessageSquareText,
				href: "/dashboard/tag",
			},
			{
				title: "Website Log",
				icon: History,
				href: "/dashboard/log",
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
	{
		title: "UMUM",
		items: [
			{
				title: "Akun",
				icon: UserIcon,
				href: "/profile",
			},
			{
				title: "Logout",
				icon: LogOut,
				href: "/logout",
			},
		],
	},
];

export const wadekPenilaianSections: NavSection[] = [
	{
		title: "PENILAIAN KINERJA",
		items: [
			{
				title: "Kinerja TPA",
				icon: FileText,
				href: "/dashboard/performance/tpa",
			},
			{
				title: "Kinerja Kaur",
				icon: FileText,
				href: "/dashboard/performance/kaur",
			},
		],
	},
	{
		title: "MANAGEMEN DATA & LAPORAN",
		items: [
			{
				title: "Data Atasan & Pegawai",
				icon: Users,
				href: "/admin/user",
			},
			{
				title: "Weekly Report",
				icon: MessageSquareText,
				href: "/admin/user",
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
	{
		title: "UMUM",
		items: [
			{
				title: "Akun",
				icon: UserIcon,
				href: "/profile",
			},
			{
				title: "Logout",
				icon: LogOut,
				href: "/logout",
			},
		],
	},
];

export const arsipSections: NavSection[] = [
	{
		title: "ARSIP DOKUMEN",
		items: [
			{
				title: "File",
				icon: FileText,
				href: "/dashboard/e-archive",
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
	{
		title: "UMUM",
		items: [
			{
				title: "Akun",
				icon: UserIcon,
				href: "/profile",
			},
			{
				title: "Logout",
				icon: LogOut,
				href: "/logout",
			},
		],
	},
];
