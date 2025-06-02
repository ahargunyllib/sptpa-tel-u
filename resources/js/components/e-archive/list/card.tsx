import DropDownMenu from "@/components/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import type { File, Folder } from "@/types";
import { Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { Ellipsis, FileIcon, FolderIcon } from "lucide-react";
import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../../ui/dialog";

export default function EArchiveListCard({
	eArchive,
	type,
	folderType,
	onDeleteClick,
}: {
	eArchive: File | Folder;
	type: "folder" | "file";
	folderType?: string;
	onDeleteClick?: () => void;
}) {
	const [isShowPreview, setIsShowPreview] = useState(false);

	return (
		<>
			<TableRow>
				<TableCell>
					<div
						// href={
						// 	type === "folder"
						// 		? `/dashboard/e-archive/${eArchive.id}`
						// 		: `${(eArchive as unknown as File).path}`
						// }
						onClick={() => {
							type === "folder"
								? router.visit(`/dashboard/e-archive/${eArchive.id}`)
								: setIsShowPreview(true);
						}}
						onKeyDown={() => {}}
						className="flex items-center gap-2 font-medium cursor-pointer"
					>
						{type === "folder" ? (
							<FolderIcon className="w-4 h-4" />
						) : (
							<FileIcon className="w-4 h-4" />
						)}
						{eArchive.name}
					</div>
				</TableCell>
				<TableCell className="w-[160px]">
					<div className="truncate">
						{eArchive.updated_at
							? format(new Date(eArchive.updated_at), "dd MMM yyyy")
							: "-"}
					</div>
				</TableCell>

				<TableCell className="w-[100px]">
					<div>
						{type === "file" && "size" in eArchive && (
							<span className=" truncate">
								{eArchive.size
									? `${(eArchive.size / (1024 * 1024)).toFixed(2)} MB`
									: "-"}
							</span>
						)}
					</div>
				</TableCell>

				<TableCell className="w-[50px] text-right">
					{folderType === "kepegawaian" && (
						<DropDownMenu onDelete={onDeleteClick} />
					)}
				</TableCell>
			</TableRow>
			<Dialog open={isShowPreview} onOpenChange={setIsShowPreview}>
				<DialogContent className="sm:max-w-3xl">
					<DialogHeader>
						<DialogTitle>{eArchive.name} - Preview</DialogTitle>
					</DialogHeader>

					{(eArchive as File).type.startsWith("image") ? (
						<img
							src={
								(eArchive as File).path
									? (eArchive as File).path.startsWith("files")
										? `/storage/${(eArchive as File).path}`
										: (eArchive as File).path
									: "https://media-sin2-1.cdn.whatsapp.net/v/t61.24694-24/473401127_1818570005572383_5508634567812061033_n.jpg?ccb=11-4&oh=01_Q5AaIQltFg5tbTKGufIbqFYffpLQLdFSqNQXmAOLR8JC4yqi&oe=6802E54F&_nc_sid=5e03e0&_nc_cat=104"
							}
							alt={eArchive.name}
							className="aspect-square object-contain w-full h-full rounded-md shadow-sm"
						/>
					) : (eArchive as File).type === "application/pdf" ? (
						<iframe
							src={
								(eArchive as File).path
									? (eArchive as File).path.startsWith("files")
										? `/storage/${(eArchive as File).path}`
										: (eArchive as File).path
									: ""
							}
							className="w-full h-[80vh] rounded-md shadow-sm"
							title={eArchive.name}
						/>
					) : (
						<p>
							File preview tidak tersedia untuk tipe: {(eArchive as File).type}
							<br />
							<a
								className="text-blue-500 underline"
								target="_blank"
								rel="noopener noreferrer"
								href={`/storage/${(eArchive as File).path}`}
							>
								Akses secara langsung atau unduh
							</a>
						</p>
					)}

					<p className="mt-4 text-sm text-gray-500">
						{(eArchive as File).type}
					</p>
				</DialogContent>
			</Dialog>
		</>
	);
}
