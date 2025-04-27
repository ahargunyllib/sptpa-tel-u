"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import type { Tag } from "@/types";

const formSchema = z.object({
    report: z.string().min(1, "Laporan harus diisi"),
    tags: z.array(z.string()).min(1, "Minimal satu tag harus ditambahkan"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateReportModal({
    open,
    onOpenChange,
    tags,
    onSubmit,
    initialValues,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tags: Tag[];
    onSubmit: (values: FormValues) => void;
    initialValues?: FormValues;
}) {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            report: "",
            tags: [],
        },
    });

    const updateSelectedTags = (tagIds: string[]) => {
        const newSelectedTags = tags.filter((tag) => tagIds.includes(tag.id));
        setSelectedTags(newSelectedTags);
        form.setValue("tags", tagIds, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        });
    };

    const handleRemoveTag = (tagId: string) => {
        const updatedTags = selectedTags.filter((tag) => tag.id !== tagId);
        setSelectedTags(updatedTags);
        form.setValue(
            "tags",
            updatedTags.map((tag) => tag.id),
            {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            }
        );
    };

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.reset(initialValues);
                setSelectedTags(
                    tags.filter((tag) => initialValues.tags.includes(tag.id))
                );
            } else {
                form.reset({
                    report: "",
                    tags: [],
                });
                setSelectedTags([]);
            }
        }
        console.log("tes infinite")
    }, [open, initialValues, tags, form]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {initialValues
                            ? "Edit Weekly Report"
                            : "Tambah Weekly Report"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialValues
                            ? "Edit laporan dan tag yang ingin diubah"
                            : "Isi semua kolom untuk menambahkan report"}
                    </DialogDescription>
                </DialogHeader>


                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="report"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-medium">
                                        Laporan
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tulis disini"
                                            className="resize-none min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="tags"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="text-base font-medium">
                                            Tags
                                        </FormLabel>
                                        <div className="flex flex-col gap-2">
                                            {tags.map((tag) => (
                                                <label
                                                    key={tag.id}
                                                    className="flex items-center gap-2"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        value={tag.id}
                                                        checked={form
                                                            .watch("tags")
                                                            .includes(tag.id)}
                                                        onChange={(e) => {
                                                            const checked =
                                                                e.target
                                                                    .checked;
                                                            const currentValues =
                                                                form.getValues(
                                                                    "tags"
                                                                );
                                                            const updatedValues =
                                                                checked
                                                                    ? [
                                                                          ...currentValues,
                                                                          tag.id,
                                                                      ]
                                                                    : currentValues.filter(
                                                                          (
                                                                              id
                                                                          ) =>
                                                                              id !==
                                                                              tag.id
                                                                      );
                                                            updateSelectedTags(
                                                                updatedValues
                                                            );
                                                        }}
                                                        className="accent-blue-600"
                                                    />
                                                    {tag.name}
                                                </label>
                                            ))}
                                        </div>
                                        {form.formState.errors.tags && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {
                                                    form.formState.errors.tags
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <FormLabel>Tags</FormLabel>
                            <div className="border border-primary-60 rounded-md px-4 py-3 flex items-center gap-1 ">
                                {selectedTags.map((tag) => (
                                    <div
                                        className="bg-light-100 flex gap-1.5 items-center py-1.5 px-2 text-white rounded-sm text-xs"
                                        key={tag.id}
                                    >
                                        {tag.name}{" "}
                                        <X
                                            className="text-white cursor-pointer"
                                            onClick={() =>
                                                handleRemoveTag(tag.id)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Batalkan
                            </Button>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
