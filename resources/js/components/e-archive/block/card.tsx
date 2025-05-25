import DropDownMenu from "@/components/dropdown-menu";
import type { File, Folder } from "@/types";
import { format } from "date-fns";
import { FileIcon, FolderIcon } from "lucide-react";

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
	return (
		<div className="relative p-4 bg-light-20 rounded-md flex flex-col gap-3 shadow-sm w-full">
			<a
				href={
					type === "folder"
						? `/dashboard/e-archive/${eArchive.id}`
						: `${(eArchive as unknown as File).path}`
				}
				target={type === "file" ? "_blank" : undefined}
				rel={type === "file" ? "noopener noreferrer" : undefined}
				className="w-full h-52 flex items-center justify-center bg-gray-100 rounded-md"
			>
				{type === "folder" ? (
					<FolderIcon className="w-4 h-4" />
				) : (
					<FileIcon className="w-4 h-4" />
				)}
			</a>
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
		</div>
	);
}
