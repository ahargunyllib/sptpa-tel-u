import type { File, Folder } from "@/types";
import { Link } from "@inertiajs/react";
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

import EArchiveListCard from "@/components/e-archive/list/card";
import { Button } from "@/components/ui/button";
import { isFile } from "@/lib/e-archive";

export default function EArchiveListContainer({
	files,
	folders,
}: {
	files: File[];
	folders: Folder[];
}) {
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
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
