import { EArchiveProvider } from "@/hooks/use-e-archive";
import DashboardLayout from "@/layouts/dashboard-layout";
import EArchiveLayout from "@/layouts/e-archive-layout";
import type { File, Folder } from "@/types";

export default function EArchiveKinerjaStafPage({
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
