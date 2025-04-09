import ApplicationLogo from "@/components/ApplicationLogo";
import Dropdown from "@/components/Dropdown";
import NavLink from "@/components/NavLink";
import ResponsiveNavLink from "@/components/ResponsiveNavLink";
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import type { PropsWithChildren, ReactNode } from "react";

export default function Authenticated({
	header,
	children,
}: PropsWithChildren<{ header?: ReactNode }>) {
	const user = usePage().props.auth.user;

	return (
		<SidebarProvider>
			<div className="min-h-screen bg-[#F2F2F2] max-w-screen overflow-hidden">
				<AppSidebar />
				<main className="text-black pl-0 md:pl-[35vh] xl:pl-[30vh] 2xl:pl-[40vh] min-h-screen flex-1 w-screen">
					<div className="p-6 md:p-8 flex flex-col gap-">
						{/* <div className="w-full py-8">
							<h2 className="text-h4 text-black">
								Selamat Datang, {profile.payload.user.name}
							</h2>
						</div> */}
						<div className="py-6 flex-1">{children}</div>
					</div>
				</main>
			</div>
		</SidebarProvider>
	);
}
