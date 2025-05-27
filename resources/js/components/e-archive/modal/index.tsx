import type React from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { File, RotateCw, Trash2, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export type FileStatus = "uploading" | "failed" | "success";

export interface FileItem {
	id: string;
	name: string;
	size: number;
	progress: number;
	status: FileStatus;
	file: File;
}

interface FileUploadModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (files: FileItem[]) => void;
	maxFiles?: number;
	maxSize?: number;
	acceptedFileTypes?: string[];
	title?: string;
	description?: string;
	saveButtonText?: string;
	cancelButtonText?: string;
}

export function FileUploadModal({
	open,
	onOpenChange,
	onSave,
	maxFiles = 5,
	maxSize = 10,
	acceptedFileTypes = [".jpg", ".png"],
	title = "Unggah Dokumen",
	description = "Tambahkan dokumen disini dan hanya bisa mengunggah maksimal 5 file",
	saveButtonText = "Simpan",
	cancelButtonText = "Batalkan",
}: FileUploadModalProps) {
	const [files, setFiles] = useState<FileItem[]>([]);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const processFile = (file: File): FileItem => {
		// Generate a unique ID for the file
		const id = Math.random().toString(36).substring(2, 9);

		// Simulate file upload with progress
		const newFile: FileItem = {
			id,
			name: file.name,
			size: file.size,
			progress: 0,
			status: "uploading",
			file: file,
		};

		// Simulate upload progress
		const interval = setInterval(() => {
			setFiles((prevFiles) => {
				const fileIndex = prevFiles.findIndex((f) => f.id === id);
				if (fileIndex === -1) {
					clearInterval(interval);
					return prevFiles;
				}

				const updatedFiles = [...prevFiles];
				const currentFile = updatedFiles[fileIndex];

				if (currentFile.progress >= 100) {
					clearInterval(interval);
					updatedFiles[fileIndex] = {
						...currentFile,
						progress: 100,
						status: "success",
					};
				} else {
					updatedFiles[fileIndex] = {
						...currentFile,
						progress: currentFile.progress + 5,
					};
				}

				return updatedFiles;
			});
		}, 200);

		return newFile;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
				const newFiles = Array.from(e.dataTransfer.files);

				// Check if adding these files would exceed the maximum
				if (files.length + newFiles.length > maxFiles) {
					alert(`You can only upload a maximum of ${maxFiles} files.`);
					return;
				}

				// Process each file
				const processedFiles = newFiles
					.map((file) => {
						// Check file size
						if (file.size > maxSize * 1024 * 1024) {
							alert(
								`File ${file.name} exceeds the maximum size of ${maxSize}MB.`,
							);
							return null;
						}

						// Check file type
						const fileExtension = `.${file.name
							.split(".")
							.pop()
							?.toLowerCase()}`;
						if (!acceptedFileTypes.includes(fileExtension)) {
							alert(`File type ${fileExtension} is not supported.`);
							return null;
						}

						return processFile(file);
					})
					.filter(Boolean) as FileItem[];

				setFiles((prev) => [...prev, ...processedFiles]);
			}
		},
		[files, maxFiles, maxSize, acceptedFileTypes],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.files && e.target.files.length > 0) {
				const newFiles = Array.from(e.target.files);

				// Check if adding these files would exceed the maximum
				if (files.length + newFiles.length > maxFiles) {
					alert(`You can only upload a maximum of ${maxFiles} files.`);
					return;
				}

				// Process each file
				const processedFiles = newFiles
					.map((file) => {
						// Check file size
						if (file.size > maxSize * 1024 * 1024) {
							alert(
								`File ${file.name} exceeds the maximum size of ${maxSize}MB.`,
							);
							return null;
						}

						// Check file type
						const fileExtension = `.${file.name
							.split(".")
							.pop()
							?.toLowerCase()}`;
						if (!acceptedFileTypes.includes(fileExtension)) {
							alert(`File type ${fileExtension} is not supported.`);
							return null;
						}

						return processFile(file);
					})
					.filter(Boolean) as FileItem[];

				setFiles((prev) => [...prev, ...processedFiles]);
			}

			// Reset the input value so the same file can be selected again
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		[files, maxFiles, maxSize, acceptedFileTypes],
	);

	const handleBrowseClick = useCallback(() => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	}, []);

	const handleRemoveFile = useCallback((id: string) => {
		setFiles((prev) => prev.filter((file) => file.id !== id));
	}, []);

	const handleRetryUpload = useCallback((id: string) => {
		setFiles((prev) => {
			const fileIndex = prev.findIndex((file) => file.id === id);
			if (fileIndex === -1) return prev;

			const updatedFiles = [...prev];
			updatedFiles[fileIndex] = {
				...updatedFiles[fileIndex],
				progress: 0,
				status: "uploading",
			};

			// Simulate upload progress again
			const interval = setInterval(() => {
				setFiles((prevFiles) => {
					const currentFileIndex = prevFiles.findIndex((f) => f.id === id);
					if (currentFileIndex === -1) {
						clearInterval(interval);
						return prevFiles;
					}

					const updatedFiles = [...prevFiles];
					const currentFile = updatedFiles[currentFileIndex];

					if (currentFile.progress >= 100) {
						clearInterval(interval);
						updatedFiles[currentFileIndex] = {
							...currentFile,
							progress: 100,
							status: "success", // Always succeed on retry for better UX
						};
					} else {
						updatedFiles[currentFileIndex] = {
							...currentFile,
							progress: currentFile.progress + 5,
						};
					}

					return updatedFiles;
				});
			}, 200);

			return updatedFiles;
		});
	}, []);

	const handleSave = useCallback(() => {
		onSave(files);
		onOpenChange(false);
	}, [files, onSave, onOpenChange]);

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return `${bytes}b`;
		if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}kb`;
		return `${Math.round(bytes / (1024 * 1024))}mb`;
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md lg:max-w-xl">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<p className="text-sm text-muted-foreground">{description}</p>
				</DialogHeader>

				<div
					className={cn(
						"mt-4 border-2 border-dashed rounded-md p-8 text-center",
						isDragging
							? "border-primary bg-primary/5"
							: "border-muted-foreground/20",
					)}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileInputChange}
						className="hidden"
						multiple
						accept={acceptedFileTypes.join(",")}
					/>

					<div className="flex flex-col items-center justify-center gap-2">
						<File className="h-10 w-10 text-muted-foreground" />
						<p className="text-sm font-medium">
							Tarik dokumenmu atau{" "}
							<button
								type="button"
								onClick={handleBrowseClick}
								className="text-blue-600 hover:underline focus:outline-none"
							>
								jelajahi
							</button>
						</p>
						<p className="text-xs text-muted-foreground">
							Ukuran maksimal {maxSize}mb
						</p>
					</div>
				</div>

				<p className="text-xs text-muted-foreground">
					Hanya mendukung {acceptedFileTypes.join(", ")} files
				</p>

				{files.length > 0 && (
					<div className="mt-4 space-y-2">
						{files.map((file) => (
							<div key={file.id} className="border rounded-md p-3">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<File className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="text-sm font-medium">{file.name}</p>
											<p className="text-xs text-muted-foreground">
												{formatFileSize(file.size)}
											</p>
											{file.status === "failed" && (
												<p className="text-xs text-red-500">Unggah failed</p>
											)}
											{file.status === "success" && (
												<p className="text-xs text-green-500">Unggah sukses</p>
											)}
										</div>
									</div>

									{file.status === "uploading" && (
										<button
											type="button"
											onClick={() => handleRemoveFile(file.id)}
											className="text-muted-foreground hover:text-foreground"
										>
											<X className="h-4 w-4" />
											<span className="sr-only">Remove</span>
										</button>
									)}

									{file.status === "failed" && (
										<button
											type="button"
											onClick={() => handleRetryUpload(file.id)}
											className="text-muted-foreground hover:text-foreground"
										>
											<RotateCw className="h-4 w-4" />
											<span className="sr-only">Retry</span>
										</button>
									)}

									{file.status === "success" && (
										<button
											type="button"
											onClick={() => handleRemoveFile(file.id)}
											className="text-muted-foreground hover:text-foreground"
										>
											<Trash2 className="h-4 w-4" />
											<span className="sr-only">Delete</span>
										</button>
									)}
								</div>

								{file.status === "uploading" && (
									<div className="mt-2">
										<div className="h-2 w-full bg-muted rounded-full overflow-hidden">
											<div
												className="h-full bg-green-500 transition-all duration-300 ease-in-out"
												style={{
													width: `${file.progress}%`,
												}}
											/>
										</div>
										<p className="text-xs text-right mt-1">{file.progress}%</p>
									</div>
								)}
							</div>
						))}
					</div>
				)}

				<DialogFooter className="flex justify-between sm:justify-between">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						{cancelButtonText}
					</Button>
					<Button type="button" onClick={handleSave}>
						{saveButtonText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
