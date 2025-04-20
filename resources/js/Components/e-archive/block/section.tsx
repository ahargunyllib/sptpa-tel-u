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
				<Link
					key={`folder-${folder.id}`}
					href={`/dashboard/e-archive/${folder.id}`}
					className="p-4 bg-light-20 rounded-md flex flex-col gap-3 shadow-sm"
				>
					<div className="w-full h-52 flex items-center justify-center bg-gray-100 rounded-md">
						<FolderIcon className="w-16 h-16 text-gray-500" />
					</div>
					<div className="flex flex-col gap-1">
						<div className="flex justify-between items-center">
							<span className="text-base text-black font-semibold truncate">
								{folder.name}
							</span>
							<Ellipsis />
						</div>
					</div>
				</Link>
			))}

			{/* File Cards */}
			{files.map((file) => (
				<Link
					key={`file-${file.id}`}
					href={`/dashboard/e-archive/file/${file.id}`}
					className="p-4 bg-light-20 rounded-md flex flex-col gap-3 shadow-sm"
				>
					<div className="w-full h-52 flex items-center justify-center bg-gray-50 rounded-md">
						<FileIcon className="w-16 h-16 text-gray-500" />
					</div>
					<div className="flex flex-col gap-1">
						<div className="flex justify-between items-center">
							<span className="text-base text-black font-semibold truncate">
								{file.name}
							</span>
							<Ellipsis />
						</div>
					</div>
				</Link>
			))}
		</section>
	);
}
