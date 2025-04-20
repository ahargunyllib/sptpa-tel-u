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
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nama</TableHead>
						<TableHead>Terakhir diubah</TableHead>
						<TableHead>Ukuran</TableHead>
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
						<TableRow key={`file-${file.id}`}>
							<TableCell>
								<Link
									href={`/dashboard/e-archive/file/${file.id}`}
									className="flex items-center gap-2 font-medium"
								>
									<FileIcon className="w-4 h-4" />
									{file.name}
								</Link>
							</TableCell>
							<TableCell>
								{file.updated_at
									? format(new Date(file.updated_at), "dd MMM yyyy")
									: "-"}
							</TableCell>
							<TableCell>{file.size || "-"}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
