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
