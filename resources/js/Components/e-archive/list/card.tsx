import { TableCell, TableRow } from "@/components/ui/table";
import type { File, Folder } from "@/types";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import { FileIcon, FolderIcon, MoreHorizontal } from "lucide-react";
import React from "react";

export default function EArchiveListCard({
	eArchive,
	type,
}: { eArchive: File | Folder; type: "folder" | "file" }) {
	return (
		<TableRow>
			<TableCell>
				<Link
					href={`/dashboard/e-archive/${eArchive.id}`}
					className="flex items-center gap-2 font-medium"
				>
					{type === "folder" ? (
						<FolderIcon className="w-4 h-4" />
					) : (
						<FileIcon className="w-4 h-4" />
					)}
					{eArchive.name}
				</Link>
			</TableCell>
			<TableCell>
				{eArchive.updated_at
					? format(new Date(eArchive.updated_at), "dd MMM yyyy")
					: "-"}
			</TableCell>
			<TableCell>
				{type === "file" && "size" in eArchive ? eArchive.size || "-" : ""}
			</TableCell>
		</TableRow>
	);
}
