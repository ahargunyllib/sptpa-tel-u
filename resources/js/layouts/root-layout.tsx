import { Toaster } from "@/components/ui/sonner";
import { useFlashMessages } from "../hooks/use-flash-messages";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	useFlashMessages();

	return (
		<>
			{children}
			<Toaster richColors />
		</>
	);
}
