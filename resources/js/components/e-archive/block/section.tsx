import { File, Folder } from "@/types";
import { router } from "@inertiajs/react";
import { useState } from "react";
import BlockArchiveCard from "./card";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function EArchiveBlockContainer({
    folders,
    files,
    folderType,
}: {
    folders: Folder[];
    files: File[];
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
        <>
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {folders.map((folder) => (
                    <BlockArchiveCard
                        key={folder.id}
                        eArchive={folder}
                        type="folder"
                    />
                ))}

                {files.map((file) => (
                    <BlockArchiveCard
                        key={file.id}
                        eArchive={file}
                        type="file"
                        folderType={folderType}
                        onDeleteClick={() => {
                            setSelectedId(file.id);
                            setOpen(true);
                        }}
                    />
                ))}
            </section>

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
        </>
    );
}
