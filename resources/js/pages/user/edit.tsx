import type { User } from "@/types";
import React from "react";
import UserForm from "./partials/user-form";

export default function Edit({ user }: { user: User }) {
	return <UserForm user={user} />;
}
