import DashboardLayout from "@/layouts/dashboard-layout";

export default function PanduanShowPage({
	panduan,
}: {
	panduan: string;
}) {
	return (
		<DashboardLayout header="Arsip">
			<section className="bg-white rounded-md px-6 py-4 flex flex-col gap-4">
				<div>File Panduan</div>
				<span>
					File saat ini{" "}
					{panduan ? (
						<a
							className="text-blue-400 underline"
							href={panduan}
							target="_blank"
							rel="noopener noreferrer"
						>
							Link File saat ini
						</a>
					) : (
						<b>Tidak ada file yang diupload.</b>
					)}
				</span>
			</section>
		</DashboardLayout>
	);
}
