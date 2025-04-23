import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Head, router, usePage } from "@inertiajs/react";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { PageProps, type DataWithPagination, type Tag } from "@/types";
import { ConfirmationModal } from "@/components/confirm-modal";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { SquareCheck, PencilLine, Trash } from "lucide-react";
import Pagination from "@/components/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TagFilters = {
    search?: string;
    start_date?: string;
    end_date?: string;
    per_page?: number;
};

const tagSchema = z.object({
    name: z.string().min(2, "Tag harus minimal 3 karakter"),
});

type TagFormData = z.infer<typeof tagSchema>;

export default function TagIndex({
    tags,
    filters,
}: {
    tags: DataWithPagination<Tag>;
    filters: TagFilters;
}) {
    const [editingTagId, setEditingTagId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    const form = useForm<TagFormData>({
        resolver: zodResolver(tagSchema),
        defaultValues: { name: "" },
    });

    const { props } = usePage<PageProps>();

    useEffect(() => {
        if (props.flash?.success) {
            alert(props.flash.success);
        }
        if (props.flash?.error) {
            alert(props.flash.error);
        }
    }, [props.flash]);

    const onConfirmHandler = () => {
        const data = form.getValues();
        router.post(route("tags.store"), data, {
            onSuccess: () => form.reset(),
            onError: () => alert("Gagal menambahkan tag, silakan coba lagi."),
        });
    };

    const onUpdateTag = (tagId: string) => {
        router.patch(
            route("tags.update", tagId),
            { name: editValue },
            {
                onSuccess: () => {
                    setEditingTagId(null);
                    setEditValue("");
                },
                onError: () => alert("Gagal update tag."),
            }
        );
    };

    const onDeleteTag = (tagId: string) => {
        router.delete(route("tags.destroy", tagId), {
            onError: () => alert("Gagal menghapus tag."),
        });
    };

    return (
        <DashboardLayout>
            <Head title="Management Tag" />
            <section className="rounded-lg bg-white p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="font-semibold text-base">
                        Weekly Report Tag
                    </h2>
                    <span className="text-dark-40 text-xs">Kelola Tag</span>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(() => {})} // disable default submit
                        className="flex flex-col gap-2 md:flex-row items-stretch"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            placeholder="Tuliskan tag disini"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ConfirmationModal
                            title="Tambahkan Tag"
                            description="Yakin ingin menambahkan tag ini?"
                            onConfirm={onConfirmHandler}
                            trigger={
                                <Button
                                    type="button"
                                    disabled={!form.formState.isValid}
                                    onClick={() => form.trigger()} // pastikan validasi sudah dijalankan
                                >
                                    Tambahkan
                                </Button>
                            }
                        />
                    </form>
                </Form>

                {/* Table */}
                <div className="overflow-x-auto mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs text-[#667085]">
                                    No
                                </TableHead>
                                <TableHead className="text-xs text-[#667085]">
                                    Daftar Tag Report
                                </TableHead>
                                <TableHead className="text-xs text-[#667085]">
                                    Terakhir diubah
                                </TableHead>
                                <TableHead className="w-[70px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tags.data.map((tag) => (
                                <TableRow key={tag.id}>
                                    <TableCell className="text-sm font-medium">
                                        {tags.data.indexOf(tag) + 1}
                                    </TableCell>

                                    <TableCell className="text-sm font-medium">
                                        {editingTagId === tag.id ? (
                                            <Input
                                                value={editValue}
                                                onChange={(e) =>
                                                    setEditValue(e.target.value)
                                                }
                                                className="w-full"
                                            />
                                        ) : (
                                            tag.name
                                        )}
                                    </TableCell>

                                    <TableCell className="text-sm font-medium">
                                        {new Date(
                                            tag.updated_at
                                        ).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
                                    </TableCell>

                                    <TableCell className="w-[70px] flex gap-2">
                                        {editingTagId === tag.id ? (
                                            <ConfirmationModal
                                                title="Konfirmasi Update"
                                                description="Yakin ingin menyimpan perubahan tag ini?"
                                                onConfirm={() =>
                                                    onUpdateTag(tag.id)
                                                }
                                                trigger={
                                                    <SquareCheck className="w-4 h-4 text-primary-60" />
                                                }
                                            />
                                        ) : (
                                            <PencilLine
                                                className="w-4 h-4 text-warning-80"
                                                onClick={() => {
                                                    setEditingTagId(tag.id);
                                                    setEditValue(tag.name);
                                                }}
                                            />
                                        )}

                                        <ConfirmationModal
                                            title="Hapus Tag"
                                            description="Yakin ingin menghapus tag ini?"
                                            onConfirm={() =>
                                                onDeleteTag(tag.id)
                                            }
                                            trigger={
                                                <Trash className="w-4 h-4 text-danger-80" />
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* Pagination component */}
                <div className="mt-6 flex justify-between items-center">
                    <Pagination meta={tags.meta} queryKey={["tags"]} />
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                            Items per page
                        </span>
                        <Select
                            value={filters.per_page?.toString() || "10"}
                            onValueChange={(value) => {
                                const url = new URL(window.location.href);
                                url.searchParams.set("per_page", value);
                                url.searchParams.delete("page"); // Reset to page 1
                                window.location.href = url.toString();
                            }}
                        >
                            <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 100].map((value) => (
                                    <SelectItem
                                        key={value}
                                        value={value.toString()}
                                    >
                                        {value}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>
        </DashboardLayout>
    );
}
