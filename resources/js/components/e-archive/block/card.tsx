import DropDownMenu from "@/components/dropdown-menu";
import type { File, Folder } from "@/types";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { FileIcon, FolderIcon } from "lucide-react";
import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../../ui/dialog";

export default function BlockArchiveCard({
	type,
	eArchive,
	folderType,
	onDeleteClick,
}: {
	type: "folder" | "file";
	eArchive: File | Folder;
	folderType?: string;
	onDeleteClick?: () => void;
}) {
	const [isShowPreview, setIsShowPreview] = useState(false);
	return (
		<div className="relative p-4 bg-light-20 rounded-md flex flex-col gap-3 shadow-sm w-full">
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
				className="w-full h-52 flex items-center justify-center bg-gray-100 rounded-md"
			>
				{type === "folder" ? (
					<FolderIcon className="w-4 h-4" />
				) : (
					<FileIcon className="w-4 h-4" />
				)}
			</div>
			<div className="flex flex-col gap-1">
				<div className="flex justify-between items-center">
					<span className="text-base text-black font-semibold truncate">
						{eArchive.name}
					</span>
					{folderType === "kepegawaian" && (
						<DropDownMenu onDelete={onDeleteClick} />
					)}
				</div>
				<div className="flex justify-between w-full items-center">
					<div>
						{type === "file" && "size" in eArchive && (
							<span className="text-base text-[#98A2B3] font-semibold truncate">
								{eArchive.size || "-"}
							</span>
						)}
					</div>
					<span className="text-base text-[#98A2B3] font-semibold truncate">
						{eArchive.updated_at
							? format(new Date(eArchive.updated_at), "dd MMM yyyy")
							: "-"}
					</span>
				</div>
			</div>

			<Dialog open={isShowPreview} onOpenChange={setIsShowPreview}>
				<DialogContent className="sm:max-w-3xl">
					<DialogHeader>
						<DialogTitle>{eArchive.name} - Preview</DialogTitle>
					</DialogHeader>
					<img
						src={(eArchive as File).path}
						alt={eArchive.name}
						className="aspect-square object-contain w-full h-full rounded-md shadow-sm"
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
