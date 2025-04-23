import { useEffect } from "react";

export default function Welcome() {
	useEffect(() => {
		window.location.assign("/dashboard");
	}, []);
	return null;
}
