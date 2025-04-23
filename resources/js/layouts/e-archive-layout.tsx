import EArchiveBlockContainer from "@/components/e-archive/block/section";
import EArchiveListContainer from "@/components/e-archive/list/section";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useEArchive } from "@/hooks/use-e-archive";
import type { BreadCrumbs, File, Folder } from "@/types";
import { LayoutGrid, List } from "lucide-react";
import React from "react";

export default function EArchiveLayout({
	currentFolder,
	breadcrumbs,
	subfolders,
	files,
}: {
	currentFolder: Folder;
	subfolders: Folder[];
	breadcrumbs?: BreadCrumbs[];
	files: File[];
}) {
	const { layout, setLayout } = useEArchive();

	return (
		<main className="px-4 py-6 bg-white flex flex-col gap-6 flex-1">
			<div className="flex flex-col xl:flex-row gap-2 justify-between">
				<div className="flex flex-col gap-2 ">
					<h2 className="font-semibold text-base">Data Arsip</h2>
					<p className="text-xs text-[#475467]">
						Kumpulan dokumen arsip yang telah diunggah.
					</p>
				</div>
				<div className="flex items-center gap-1 ">
					<Button
						variant={layout === "list" ? "default" : "ghost"}
						className="flex justify-center items-center gap-2.5 w-full"
						onClick={() => setLayout("list")}
					>
						<List className={layout === "list" ? "text-white" : "text-black"} />
						List
					</Button>
					<Button
						variant={layout === "grid" ? "default" : "ghost"}
						className="flex justify-center items-center gap-2.5 w-full"
						onClick={() => setLayout("grid")}
					>
						<LayoutGrid
							className={layout === "grid" ? "text-white" : "text-black"}
						/>
						Grid
					</Button>
				</div>
			</div>
			<Breadcrumb>
				<BreadcrumbList>
					{/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
					{breadcrumbs &&
						breadcrumbs.map((crumb, index) => (
							<React.Fragment key={crumb.id}>
								<BreadcrumbItem>
									<BreadcrumbLink
										href={
											index === 0
												? "/dashboard/e-archive"
												: `/dashboard/e-archive/${crumb.id}`
										}
									>
										{crumb.name}
									</BreadcrumbLink>
								</BreadcrumbItem>
								{index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
							</React.Fragment>
						))}
				</BreadcrumbList>
			</Breadcrumb>
			{subfolders.length === 0 && files?.length === 0 ? (
				<div className="flex-1 flex items-center justify-center text-gray-500">
					Tidak ada data
				</div>
			) : layout === "grid" ? (
				<EArchiveBlockContainer folders={subfolders} files={files} />
			) : (
				<EArchiveListContainer folders={subfolders} files={files} />
			)}
		</main>
	);
}
