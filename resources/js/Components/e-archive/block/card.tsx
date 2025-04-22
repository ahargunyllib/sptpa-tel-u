import type { File, Folder } from "@/types";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import { Ellipsis, FileIcon, FolderIcon } from "lucide-react";
import React from "react";

export default function BlockArchiveCard({
	type,
	eArchive,
}: { type: "folder" | "file"; eArchive: File | Folder }) {
	return (
		<Link
			href={
				type === "folder"
					? `/dashboard/e-archive/${eArchive.id}`
					: `/dashboard/e-archive/file/${eArchive.id}`
			}
			className="p-4 bg-light-20 rounded-md flex flex-col gap-3 shadow-sm w-full"
		>
			<div className="w-full h-52 flex items-center justify-center bg-gray-100 rounded-md">
				{type === "folder" ? (
					<FolderIcon className="w-4 h-4" />
				) : (
					<FileIcon className="w-4 h-4" />
				)}{" "}
			</div>
			<div className="flex flex-col gap-1">
				<div className="flex justify-between items-center">
					<span className="text-base text-black font-semibold truncate">
						{eArchive.name}
					</span>
					<Ellipsis />
				</div>
				<div className="flex justify-between w-full items-center">
					<div>
						{type === "file" ? (
							<span className="text-base text-[#98A2B3] font-semibold truncate">
								{type === "file" && "size" in eArchive
									? eArchive.size || "-"
									: ""}
							</span>
						) : null}
					</div>
					<span className="text-base text-[#98A2B3] font-semibold truncate">
						{eArchive.updated_at
							? format(new Date(eArchive.updated_at), "dd MMM yyyy")
							: "-"}{" "}
					</span>
				</div>
			</div>
		</Link>
	);
}
