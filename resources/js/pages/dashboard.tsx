import DataPegawaiCard from "@/components/dashboard/data-pegawai-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthenticatedLayout from "@/layouts/dashboard-layout";
import { PageProps } from "@/types";
import { Head, usePage } from "@inertiajs/react";

export default function Dashboard() {
    const user = usePage<PageProps>().props.auth.user;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <section>
				<DataPegawaiCard user={user} />
				
			</section>
        </AuthenticatedLayout>
    );
}
