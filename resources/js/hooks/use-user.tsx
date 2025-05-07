import type { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";

export const useUser = () => {
	const { props } = usePage();
	const {
		auth: { user },
	} = props as unknown as PageProps;

	return user;
};
