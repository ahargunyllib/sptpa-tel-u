import { AppSidebar } from "@/components/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";
import { Link } from "@inertiajs/react";
import {
    ChevronDownSquareIcon,
    LogOut,
    MenuIcon,
    User,
    UserSquareIcon,
} from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";
import { Button } from "../components/ui/button";
import { usePeriod } from "../hooks/use-period";

export default function DashboardLayout({
    children,
}: PropsWithChildren<{ header?: string | ReactNode }>) {
    const user = useUser();
    const { period, setPeriod, getCurrentYear, getAvailableYears } =
        usePeriod();

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-[#F2F2F2] max-w-screen overflow-hidden">
                <AppSidebar />
                <main className="text-black pl-0 md:pl-[40vh] xl:pl-[30vh] 2xl:pl-[35vh] min-h-screen flex-1 w-screen">
                    <div className="flex flex-col h-full gap-6 ">
                        <div className="flex flex-row items-center justify-between bg-white py-4 px-6 pt-16 md:pt-4 w-full">
                            <div className="flex flex-row gap-4 items-center justify-start">
                                <MenuIcon />
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-4 items-center">
                                        <h1 className="font-bold text-xl text-primary-60 ">
                                            SITPA
                                        </h1>
                                        <span className="text-xs text-[#98A2B3] text-center text-wrap w-40">
                                            Sistem Informasi Tenaga Penunjang
                                            Akademik
                                        </span>
                                    </div>

                                    <img
                                        src="/logo-fri.webp"
                                        alt="logo"
                                        className="max-w-96 h-16"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 items-center justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="text-xs h-min"
                                        >
                                            Periode: {getCurrentYear()}
                                            <ChevronDownSquareIcon />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {getAvailableYears().map((year) => (
                                            <DropdownMenuItem
                                                key={year}
                                                onClick={() =>
                                                    setPeriod(
                                                        new Date(year, 0, 1)
                                                    )
                                                }
                                            >
                                                {year}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <span className="text-xs text-[#98A2B3]">
                                    {user.name}
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <UserSquareIcon />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2 rounded-lg text-body-lg xl:text-h6 w-full"
                                            >
                                                <User className="text-dark-60 w-5 h-5" />
                                                <span className="text-dark-60">
                                                    Akun
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/logout"
                                                method="post"
                                                className="flex items-center gap-2 rounded-lg text-body-lg xl:text-h6 w-full"
                                            >
                                                <LogOut className="text-dark-60 w-5 h-5" />
                                                <span className="text-dark-60">
                                                    Logout
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                        <div className="p-4 flex-1">{children}</div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
