export type User = {
	id: string;
	name: string;
	email: string;
	nip: string;
	location: string;
	division:
		| "academic_service"
		| "laboratory"
		| "secretary"
		| "student_affair"
		| "finance_logistic_resource";
	role: "staf" | "kaur" | "wadek1" | "wadek2" | "sdm";
	email_verified_at?: string;
	photo_profile?: string;
	updated_at?: string | Date;
};

export type PageProps<
	T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
	auth: {
		user: User;
	};
	flash: {
		success?: string;
		error?: string;
	};
};

export interface PaginationMeta {
	total_data: number;
	total_page: number;
	page: number;
	limit: number;
}

export interface Log {
	id: number;
	user_id: string;
	description: string;
	ip_address: string;
	created_at: string;
	updated_at: string;
	user: User;
}

export interface DataWithPagination<T> {
	data: T[];
	meta: PaginationMeta;
}

export interface Folder {
	id: string;
	name: string;
	parent_id: string;
	work_target_id: string;
	user_id: string;
	type: string;
	created_at: string;
	updated_at: string;
}

export interface File {
	id: string;
	name: string;
	type: string;
	size: number;
	path: string;
	thumbnail: string;
	folder_id: string;
	user_id: string;
	created_at: string;
	updated_at: string;
}

export interface BreadCrumbs {
	id: string;
	name: string;
	type: string;
}

export type WorkTarget = {
	id: string;
	name: string;
	unit:
		| "at_week"
		| "total"
		| "work_day"
		| "percentage"
		| "month"
		| "rupiah"
		| "date"
		| "time"
		| "other";
	category: "light" | "medium" | "heavy";
	comparator: "eq" | "gt" | "gte" | "lt" | "lte";

	first_quarter_target: number;
	second_quarter_target: number;
	third_quarter_target: number;
	fourth_quarter_target: number;

	first_quarter_value: number;
	second_quarter_value: number;
	third_quarter_value: number;
	fourth_quarter_value: number;

	first_quarter_score: number;
	second_quarter_score: number;
	third_quarter_score: number;
	fourth_quarter_score: number;

	final_score: number;

	creator_id: string;
	creator: User;

	assigned_id: string;
	assigned: User;
};

export type UserAttitudeEvaluation = {
	id: string;
	user_id: string;
	user: User;
	communication: number;
	teamwork: number;
	collaboration: number;
	solidarity: number;
	work_ethic: number;
	technology_usage: number;
	work_smart: number;
	initiative: number;
	role_model: number;
	responsibility: number;
	professional_ethic: number;
	image_maintenance: number;
	discipline: number;
	evidence?: string;
};

export type UserFeedback = {
	id: string;
	user_id: string;
	user: User;
	kaur_feedback?: string;
	wadek_feedback?: string;
};

export type WorkReport = {
	id: string;
	work_target_id: string;
	work_target: WorkTarget;
	creator_id: string;
	creator: User;
	content: string;
	created_at: string;
};

interface Activity {
	id: string;
	title: string;
	type: string;
	method: string;
	implementation_date: string;
	user: User;
	file: string | null;
	user_id: string;
}
