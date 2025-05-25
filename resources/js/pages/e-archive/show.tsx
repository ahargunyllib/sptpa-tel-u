import { EArchiveProvider } from "@/hooks/use-e-archive";
import DashboardLayout from "@/layouts/dashboard-layout";
import EArchiveLayout from "@/layouts/e-archive-layout";
import type { BreadCrumbs, File, Folder } from "@/types";

export default function Show({
	breadcrumbs,
	currentFolder,
	subfolders,
	files,
}: {
	breadcrumbs: BreadCrumbs[];
	currentFolder: Folder;
	subfolders: Folder[];
	files: File[];
}) {
	return (
		<DashboardLayout header="Arsip">
			<EArchiveProvider>
				<EArchiveLayout
					currentFolder={currentFolder}
					subfolders={subfolders}
					breadcrumbs={breadcrumbs}
					files={files}
				/>
			</EArchiveProvider>
		</DashboardLayout>
	);
}
