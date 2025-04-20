import type { File, Folder } from "@/types";
import { Link } from "@inertiajs/react";
import { Ellipsis } from "lucide-react";
import React from "react";

export default function BlockArchiveCard({
	type,
	archive,
}: { type: "folder" | "file"; archive: File | Folder }) {
	return (
		<Link
			key={archive.id}
			href={`/dashboard/e-archive/${archive.id}`}
			className="p-4 bg-light-20 rounded-md flex flex-col gap-3 "
		>
			<img src="/placeholder-file.jpg" alt="" className="w-full h-52" />
			<div className="flex flex-col gap-1">
				<div className="flex justify-between items-center">
					<span className="text-base text-black font-semibold">
						{archive.name}
					</span>
					<Ellipsis />
				</div>
			</div>
		</Link>
	);
}
