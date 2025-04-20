import EArchiveBlockContainer from "@/components/e-archive/block/section";
import EArchiveListContainer from "@/components/e-archive/list/section";
import { Button } from "@/components/ui/button";
import { EArchiveProvider, useEArchive } from "@/hooks/use-e-archive";
import DashboardLayout from "@/layouts/dashboard-layout";
import EArchiveLayout from "@/layouts/e-archive-layout";
import type { File, Folder } from "@/types";
import { LayoutGrid, List } from "lucide-react";

export default function Index({
	currentFolder,
	subfolders,
	files,
}: { currentFolder: Folder; subfolders: Folder[]; files: File[] }) {
	return (
		<DashboardLayout header="Arsip">
			<EArchiveProvider>
				<EArchiveLayout
					currentFolder={currentFolder}
					subfolders={subfolders}
					files={files}
				/>
			</EArchiveProvider>
		</DashboardLayout>
	);
}
