import type { File, Folder } from "@/types";
import { router } from "@inertiajs/react";

import EArchiveListCard from "@/components/e-archive/list/card";
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
import { buttonVariants } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
						<TableHead className="text-xs text-[#667085]">Nama</TableHead>
						<TableHead className="text-xs text-[#667085]">
							Terakhir diubah
						</TableHead>
						<TableHead className="text-xs text-[#667085]">Ukuran</TableHead>
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
							className={buttonVariants({ variant: "destructive" })}
						>
							Hapus
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
