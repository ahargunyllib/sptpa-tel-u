import DashboardLayout from "@/layouts/dashboard-layout";
import { useEffect } from "react";

export default function RubrikasiShowPage({
    rubrikasi,
}: {
    rubrikasi: string;
}) {
    useEffect(() => {
        if (rubrikasi) {
            window.location.assign(rubrikasi);
        }
    }, []);

    return (
        !rubrikasi && (
            <DashboardLayout header="Arsip">
                <section className="bg-white rounded-md px-6 py-4 flex flex-col gap-4">
                    <div>File Rubrik</div>
                    <span>
                        File saat ini{" "}
                        {rubrikasi ? (
                            <a
                                className="text-blue-400 underline"
                                href={rubrikasi}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Link File saat ini
                            </a>
                        ) : (
                            <b>Tidak ada file yang diupload.</b>
                        )}
                    </span>
                </section>
            </DashboardLayout>
        )
    );
}
