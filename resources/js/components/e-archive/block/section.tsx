import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { File, Folder } from "@/types";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { buttonVariants } from "../../ui/button";
import BlockArchiveCard from "./card";

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
					<BlockArchiveCard key={folder.id} eArchive={folder} type="folder" />
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
						<AlertDialogTitle>Hapus File</AlertDialogTitle>
						<AlertDialogDescription>
							Apakah kamu yakin ingin menghapus file ini? Tindakan ini tidak
							dapat dibatalkan.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							className={buttonVariants({
								variant: "destructive",
							})}
						>
							Hapus
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
