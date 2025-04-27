import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { PageProps, User } from "@/types";
import { usePage } from "@inertiajs/react";
import type { PropsWithChildren, ReactNode } from "react";

export default function DashboardLayout({
    header,
    children,
}: PropsWithChildren<{ header?: string | ReactNode }>) {
    const user = usePage<PageProps>().props.auth.user as User;
    const date = new Date();

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-[#F2F2F2] max-w-screen overflow-hidden">
                <AppSidebar />
                <main className="text-black pl-0 md:pl-[40vh] xl:pl-[30vh] 2xl:pl-[35vh] min-h-screen flex-1 w-screen">
                    <div className=" flex flex-col h-full gap-6 ">
                        <div className="pt-16 md:pt-4 w-full py-4 px-6 bg-white flex flex-col gap-1">
                            <h2 className="text-xl font-medium text-black">
                                {header ? header : "Selamat datang di SPTPA"}
                            </h2>
                            <p>
                                Terakhir diupdate,{" "}
                                {date.toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="p-4 flex-1">{children}</div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
