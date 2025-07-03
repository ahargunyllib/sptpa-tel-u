import EArchiveBlockContainer from "@/components/e-archive/block/section";
import EArchiveListContainer from "@/components/e-archive/list/section";
import { type FileItem, FileUploadModal } from "@/components/e-archive/modal";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEArchive } from "@/hooks/use-e-archive";
import type { BreadCrumbs, File, Folder } from "@/types";
import { router } from "@inertiajs/react";
import { LayoutGrid, List } from "lucide-react";
import React, { useMemo, useState } from "react";
import RootLayout from "./root-layout";

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
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);

	const handleSaveFiles = (files: FileItem[]) => {
		setUploadedFiles(files);

		// biome-ignore lint/complexity/noForEach: <explanation>
		files.forEach((fileItem) => {
			const formData = new FormData();
			formData.append("file", fileItem.file);
			formData.append("folder_id", currentFolder.id);

			router.post(route("files.store"), formData, {
				onSuccess: () => {
					alert("File uploaded successfully");
				},
				onError: (errors) => {
					alert("Error uploading file");
				},
			});
			setUploadedFiles([]);
		});
	};

	const [selectedQuarter, setSelectedQuarter] = useState<
		"1" | "2" | "3" | "4" | "all"
	>("all");

	const filteredFiles = useMemo(() => {
		if (currentFolder.type !== "target_kinerja" || selectedQuarter === "all")
			return files;

		// filter by created at to suit the quarter
		return files.filter(
			(file) =>
				Math.floor(new Date(file.created_at).getMonth() / 3) + 1 ===
				Number.parseInt(selectedQuarter),
		);
	}, [selectedQuarter, currentFolder.type, files]);

	return (
		<RootLayout>
			<main className="px-4 py-6 bg-white flex flex-col gap-6 flex-1">
				<div className="flex flex-col xl:flex-row gap-2 justify-between">
					<div className="flex flex-col gap-2 ">
						<h2 className="font-semibold text-base">Data Arsip</h2>
						<p className="text-xs text-[#475467]">
							Kumpulan dokumen arsip yang telah diunggah.
						</p>
					</div>
					<div className="flex flex-row justify-between items-center gap-2">
						{currentFolder.type === "kepegawaian" && (
							<Button onClick={() => setIsModalOpen(true)}>Add</Button>
						)}
						{currentFolder.type === "target_kinerja" && (
							<Select
								value={selectedQuarter}
								onValueChange={(val: "1" | "2" | "3" | "4" | "all") =>
									setSelectedQuarter(val)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Pilih TW" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">Semua</SelectItem>
									<SelectItem value="1">TW1</SelectItem>
									<SelectItem value="2">TW2</SelectItem>
									<SelectItem value="3">TW3</SelectItem>
									<SelectItem value="4">TW4</SelectItem>
								</SelectContent>
							</Select>
						)}
						<div className="flex items-center gap-1 ">
							<Button
								variant={layout === "list" ? "default" : "ghost"}
								className="flex justify-center items-center gap-2.5 w-full"
								onClick={() => setLayout("list")}
							>
								<List
									className={layout === "list" ? "text-white" : "text-black"}
								/>
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
					<EArchiveBlockContainer
						folders={subfolders}
						files={filteredFiles}
						folderType={currentFolder.type}
					/>
				) : (
					<EArchiveListContainer
						folders={subfolders}
						files={filteredFiles}
						folderType={currentFolder.type}
					/>
				)}
				<FileUploadModal
					acceptedFileTypes={[".jpg", ".png", ".pdf", ".zip", ".xlsx"]}
					onOpenChange={setIsModalOpen}
					maxFiles={5}
					maxSize={10}
					onSave={handleSaveFiles}
					open={isModalOpen}
				/>
			</main>
		</RootLayout>
	);
}
