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
