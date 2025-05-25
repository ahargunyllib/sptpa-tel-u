import DropDownMenu from "@/components/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import type { File, Folder } from "@/types";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import { Ellipsis, FileIcon, FolderIcon } from "lucide-react";
import React from "react";

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
    return (
        <TableRow>
            <TableCell>
                <Link
                    href={
                        type === "folder"
                            ? `/dashboard/e-archive/${eArchive.id}`
                            : `/dashboard/e-archive/file/${eArchive.id}`
                    }
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
            <TableCell className="w-[160px]">
                <div className="truncate">
                    {eArchive.updated_at
                        ? format(new Date(eArchive.updated_at), "dd MMM yyyy")
                        : "-"}
                </div>
            </TableCell>

            <TableCell className="w-[100px]">
                <div className="truncate">
                    {type === "file" && "size" in eArchive
                        ? eArchive.size || "-"
                        : ""}
                </div>
            </TableCell>

            <TableCell className="w-[50px] text-right">
                {folderType === "kepegawaian" && (
                    <DropDownMenu onDelete={onDeleteClick} />
                )}
            </TableCell>
        </TableRow>
    );
}
