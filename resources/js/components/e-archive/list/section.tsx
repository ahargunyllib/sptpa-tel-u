import type { File, Folder } from "@/types";
import { Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { FileIcon, FolderIcon, MoreHorizontal } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import EArchiveListCard from "@/components/e-archive/list/card";
import { Button } from "@/components/ui/button";
import { isFile } from "@/lib/e-archive";
import { useState } from "react";

export default function EArchiveListContainer({
    files,
    folders,
    folderType,
}: {
    files: File[];
    folders: Folder[];
    folderType?: string;
}) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const handleDelete = (id: string) => {
        router.delete(route("files.destroy", id), {
            onSuccess: () => {
                setSelectedId(null);
                setOpen(false);
            },
        });
    };

    const handleConfirmDelete = () => {
        if (selectedId) {
            handleDelete(selectedId);
        }
    };
    return (
        <div className="rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-xs text-[#667085]">
                            Nama
                        </TableHead>
                        <TableHead className="text-xs text-[#667085]">
                            Terakhir diubah
                        </TableHead>
                        <TableHead className="text-xs text-[#667085]">
                            Ukuran
                        </TableHead>
                        {/* <TableHead className="w-[70px]">Action</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Folder rows */}
                    {folders.map((folder) => (
                        <EArchiveListCard
                            key={`folder-${folder.id}`}
                            eArchive={folder}
                            type="folder"
                        />
                    ))}

                    {/* File rows */}
                    {files.map((file) => (
                        <EArchiveListCard
                            key={`file-${file.id}`}
                            eArchive={file}
                            type="file"
							folderType={folderType}
							onDeleteClick={() => {
								setSelectedId(file.id);
								setOpen(true);
							}}
                        />
                    ))}
                </TableBody>
            </Table>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <h2 className="text-lg font-semibold">Hapus File</h2>
                        <p>
                            Apakah kamu yakin ingin menghapus file ini? Tindakan
                            ini tidak dapat dibatalkan.
                        </p>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
