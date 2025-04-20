import type { File, Folder } from "@/types";

export function isFile(archive: Folder | File): archive is File {
	return (archive as File).size !== undefined;
}
