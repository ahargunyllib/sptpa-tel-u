export const UserRoles = {
	staf: "Staf",
	kaur: "Kaur",
	wadek1: "Wadek 1",
	wadek2: "Wadek 2",
	sdm: "Admin",
} as const;

export const UserDivisions = {
	academic_service: "Layanan Akademik",
	laboratory: "Laboratorium",
	secretary: "Sekretariat",
	student_affair: "Kemahasiswaan",
	finance_logistic_resource: "Keuangan, Logisitik, dan Sumber Daya",
} as const;

export const WorkTargetUnit = {
	at_week: "Minggu ke",
	work_day: "Hari kerja",
	total: "Jumlah",
	percentage: "Persentase",
	month: "Bulan",
	rupiah: "Rupiah",
	date: "Tanggal",
	time: "Jam",
	other: "Lainnya",
} as const;

export const WorkTargetComparator = {
	eq: "=",
	lte: "<=",
	gte: ">=",
	lt: "<",
	gt: ">",
} as const;

export const WorkTargetCategory = {
	light: "Ringan",
	medium: "Sedang",
	heavy: "Berat",
} as const;

export const getRoleLabel = (role: keyof typeof UserRoles) => {
	return UserRoles[role] || role;
};

export const getDivisionLabel = (division: keyof typeof UserDivisions) => {
	return UserDivisions[division] || division;
};
