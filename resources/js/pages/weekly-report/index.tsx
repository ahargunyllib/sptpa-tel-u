import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/layouts/dashboard-layout";
import type { PageProps, DataWithPagination, Tag, WeeklyReport } from "@/types";
import { Head, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { format } from "date-fns";
import { TagIcon } from "lucide-react";
import { CreateReportModal } from "@/components/features/weekly-report/create-report-modal";
import WeeklyReportCard from "@/components/features/weekly-report/weekly-report-card";
import { TagFilterModal } from "@/components/features/weekly-report/tag-filter-modal";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { DateRange } from "react-day-picker";
import { debounce } from "lodash";

export default function WeeklyReportIndex({
    weeklyReports,
    tags,
    filters,
}: {
    weeklyReports: DataWithPagination<WeeklyReport>;
    tags: Tag[];
    filters: {
        search: string;
        per_page: number;
        start_date?: string;
        end_date?: string;
        tag_ids?: string[];
    };
}) {
    const [isCreateReportModalOpen, setIsCreateReportModalOpen] =
        useState(false);
    const [reportToDelete, setReportToDelete] = useState<WeeklyReport | null>(
        null
    );
    const user = usePage<PageProps>().props.auth.user;
    const [isEditReportModalOpen, setIsEditReportModalOpen] = useState(false);
    const [reportToEdit, setReportToEdit] = useState<WeeklyReport | null>(null);
    const [search, setSearch] = useState(filters.search || "");
    const [dateRange, setDateRange] = useState<DateRange | undefined>(
        filters.start_date && filters.end_date
            ? {
                  from: new Date(filters.start_date),
                  to: new Date(filters.end_date),
              }
            : undefined
    );
    const [isTagFilterModalOpen, setIsTagFilterModalOpen] = useState(false);
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
        filters.tag_ids || []
    );

    const debouncedSearch = React.useMemo(
        () =>
            debounce((value: string) => {
                router.get(
                    route("weekly-report.index"),
                    {
                        search: value,
                        start_date: dateRange?.from
                            ? format(dateRange.from, "yyyy-MM-dd")
                            : undefined,
                        end_date: dateRange?.to
                            ? format(dateRange.to, "yyyy-MM-dd")
                            : undefined,
                        tag_ids:
                            selectedTagIds.length > 0
                                ? selectedTagIds
                                : undefined,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                    }
                );
            }, 500),
        [dateRange, selectedTagIds]
    );

    const handleTagFilter = (tagIds: string[]) => {
        setSelectedTagIds(tagIds);
        router.get(
            route("weekly-report.index"),
            {
                search,
                start_date: dateRange?.from
                    ? format(dateRange.from, "yyyy-MM-dd")
                    : undefined,
                end_date: dateRange?.to
                    ? format(dateRange.to, "yyyy-MM-dd")
                    : undefined,
                tag_ids: tagIds.length > 0 ? tagIds : undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <DashboardLayout>
            <Head title="Management Tag" />
            <div className="flex flex-col-reverse xl:flex-row gap-4">
                <section className="w-full rounded-lg bg-white p-6 flex flex-col gap-4 ">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-semibold text-base">
                            Weekly Report Tag
                        </h2>
                        <span className="text-dark-40 text-xs">
                            Membuat dokumentasi pengembangan
                        </span>
                    </div>
                    <div className="flex flex-col gap-2 xl:flex-row w-full ">
                        <Input
                            className="w-full"
                            placeholder="Cari laporan..."
                            value={search}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSearch(value);
                                debouncedSearch(value);
                            }}
                        />

                        <Button
                            onClick={() => setIsCreateReportModalOpen(true)}
                        >
                            Tambah Report
                        </Button>
                        <Button
                            variant={"ghost"}
                            onClick={() => setIsTagFilterModalOpen(true)}
                            className="flex items-center gap-1"
                        >
                            <TagIcon className="h-4 w-4" />
                            Tag
                            {selectedTagIds.length > 0 && (
                                <span className="ml-1 bg-danger-80 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {selectedTagIds.length}
                                </span>
                            )}
                        </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                        {weeklyReports.data.map((weeklyReport) => (
                            <WeeklyReportCard
                                key={weeklyReport.id}
                                weeklyReport={weeklyReport}
                                user={user}
                                onDelete={() => setReportToDelete(weeklyReport)}
                                onEdit={() => {
                                    setReportToEdit(weeklyReport);
                                    setIsEditReportModalOpen(true);
                                }}
                            />
                        ))}
                    </div>
                </section>

                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                        setDateRange(range);
                        router.get(
                            route("weekly-report.index"),
                            {
                                search,
                                start_date: range?.from
                                    ? format(range.from, "yyyy-MM-dd")
                                    : undefined,
                                end_date: range?.to
                                    ? format(range.to, "yyyy-MM-dd")
                                    : undefined,
                                tag_ids:
                                    selectedTagIds.length > 0
                                        ? selectedTagIds
                                        : undefined,
                            },
                            {
                                preserveState: true,
                                preserveScroll: true,
                            }
                        );
                    }}
                    className="bg-white rounded-lg p-6 self-start"
                />
            </div>
            <CreateReportModal
                open={isCreateReportModalOpen || isEditReportModalOpen}
                onOpenChange={(open) => {
                    setIsCreateReportModalOpen(open);
                    if (!open) setReportToEdit(null);
                }}
                tags={tags}
                initialValues={
                    reportToEdit
                        ? {
                              report: reportToEdit.content,
                              tags: reportToEdit.tags.map((t) => t.id),
                          }
                        : undefined
                }
                onSubmit={(values) => {
                    if (reportToEdit) {
                        router.put(
                            route("weekly-report.update", reportToEdit.id),
                            values,
                            {
                                onSuccess: () => {
                                    setIsEditReportModalOpen(false);
                                    setReportToEdit(null);
                                },
                                preserveState: true,
                            }
                        );
                    } else {
                        router.post(route("weekly-report.store"), values, {
                            onSuccess: () => setIsCreateReportModalOpen(false),
                        });
                    }
                }}
            />

            <TagFilterModal
                open={isTagFilterModalOpen}
                onOpenChange={setIsTagFilterModalOpen}
                tags={tags}
                selectedTags={selectedTagIds}
                onApplyFilter={handleTagFilter}
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
