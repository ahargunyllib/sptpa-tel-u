import BlockArchiveCard from "@/components/e-archive/block/card";
import type { File, Folder } from "@/types";
import { Link } from "@inertiajs/react";
import { Ellipsis, FileIcon, FolderIcon } from "lucide-react";
import React from "react";

export default function EArchiveBlockContainer({
	folders,
	files,
}: {
	folders: Folder[];
	files: File[];
}) {
	return (
		<section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
			{/* Folder Cards */}
			{folders.map((folder) => (
				<BlockArchiveCard key={folder.id} eArchive={folder} type="folder" />
			))}

			{/* File Cards */}
			{files.map((file) => (
				<BlockArchiveCard key={file.id} eArchive={file} type="file" />
			))}
		</section>
	);
}
