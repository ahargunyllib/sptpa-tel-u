export interface User {
	id: string;
	name: string;
	email: string;
	nip: string;
	location: string;
	division: string;
	role: string;
	email_verified_at: string;
	photo_profile: string;
}

export type PageProps<
	T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
	auth: {
		user: User;
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

export type WorkTarget = {
	id: string;
	name: string;
	staffs: User[];
	unit: "week" | "total" | "day" | "minute";
	comparator: "eq" | "gt" | "lt" | "gte" | "lte";
	first_quarter_target: number;
	second_quarter_target: number;
	third_quarter_target: number;
	fourth_quarter_target: number;
};

export type WorkTargetValue = {
	id: string;
	user_id: string;
	work_target_id: string;
	first_quarter_value: number;
	second_quarter_value: number;
	third_quarter_value: number;
	fourth_quarter_value: number;
	category: "light" | "medium" | "heavy";
	first_quarter_score: number;
	second_quarter_score: number;
	third_quarter_score: number;
	fourth_quarter_score: number;
};
