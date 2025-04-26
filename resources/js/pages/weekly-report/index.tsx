import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/layouts/dashboard-layout";
import type { PageProps, DataWithPagination, Tag, WeeklyReport } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Tag as TagIcon } from "lucide-react";
import { CreateReportModal } from "@/components/features/weekly-report/create-report-modal";
import WeeklyReportCard from "@/components/features/weekly-report/weekly-report-card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function WeeklyReportIndex({
    weeklyReports,
}: {
    weeklyReports: DataWithPagination<WeeklyReport>;
}) {
    const [isCreateReportModalOpen, setIsCreateReportModalOpen] =
        useState(false);
    const [reportToDelete, setReportToDelete] = useState<WeeklyReport | null>(
        null
    );
    const user = usePage<PageProps>().props.auth.user;

    return (
        <DashboardLayout>
            <Head title="Management Tag" />
            <div className="flex flex-col xl:flex-row gap-4">
                <section className="w-full rounded-lg bg-white p-6 flex flex-col gap-4 xl:col-span-9">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-semibold text-base">
                            Weekly Report Tag
                        </h2>
                        <span className="text-dark-40 text-xs">
                            Membuat dokumentasi pengembangan
                        </span>
                    </div>
                    <div className="flex flex-col gap-2 xl:flex-row w-full ">
                        <Input className="w-full" />
                        <Button
                            onClick={() => setIsCreateReportModalOpen(true)}
                        >
                            Tambah Report
                        </Button>
                        <Button variant={"ghost"}>Tag</Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {weeklyReports.data.map((weeklyReport) => (
                            <WeeklyReportCard
                                key={weeklyReport.id}
                                weeklyReport={weeklyReport}
                                user={user}
                                onDelete={() => setReportToDelete(weeklyReport)}
                            />
                        ))}
                    </div>
                </section>

                <Calendar className="bg-white rounded-lg p-6" />
            </div>
            <CreateReportModal
                open={isCreateReportModalOpen}
                onOpenChange={setIsCreateReportModalOpen}
                tags={weeklyReports.data[0].tags}
                onSubmit={(values) => {
                    router.post(route("weekly-report.store"), values);
                    setIsCreateReportModalOpen(false);
                }}
            />
            <AlertDialog
                open={!!reportToDelete}
                onOpenChange={() => setReportToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Apakah kamu yakin ingin menghapus laporan ini?
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-danger-80"
                            onClick={() => {
                                console.log("kontol")
                                if (reportToDelete) {
                                    router.delete(
                                        route(
                                            "weekly-report.destroy",
                                            reportToDelete.id
                                        ),
                                        {
                                            onSuccess: () =>
                                                setReportToDelete(null),
                                        }
                                    );
                                }
                            }}
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
