import {
    DropdownMenu as DropdownShadcnMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Pencil, Trash } from "lucide-react";

export default function DropDownMenu({
    onEdit,
    onDelete,
}: {
    onEdit?: () => void;
    onDelete?: () => void;
}) {
    return (
        <DropdownShadcnMenu >
            <DropdownMenuTrigger asChild>
                <button className="text-gray-600 hover:text-black">
                    <Ellipsis size={20} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {onEdit && (
                    <DropdownMenuItem
                        onClick={onEdit}
                        className="gap-2 text-blue-600"
                    >
                        <Pencil size={16} />
                        Edit
                    </DropdownMenuItem>
                )}
                {onDelete && (
                    <DropdownMenuItem
                        onClick={onDelete}
                        className="gap-2 text-red-600"
                    >
                        <Trash size={16} />
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownShadcnMenu>
    );
}
