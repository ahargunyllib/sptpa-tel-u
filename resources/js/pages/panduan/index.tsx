"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/dashboard-layout";
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function PanduanUploadPage({ panduan }: { panduan: string }) {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);

	const handleUpload = () => {
		if (!file) {
			alert("Silakan pilih file terlebih dahulu.");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		setLoading(true);
		router.post(route("files.panduanUpload"), formData, {
			onFinish: () => setLoading(false),
			onError: (errors) => alert(errors.file || "Upload gagal."),
			onSuccess: () => alert("File berhasil diupload."),
		});
	};

	return (
		<DashboardLayout header="Arsip">
			<section className="bg-white rounded-md px-6 py-4 flex flex-col gap-4">
				<div>Upload File panduan</div>
				<p>Upload file PDF, DOCX, atau TXT (max 10MB).</p>
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
					) : null}
					.
				</span>
				<input
					type="file"
					accept=".pdf,.docx,.txt"
					onChange={(e) => setFile(e.target.files?.[0] || null)}
				/>
				<Button onClick={handleUpload} disabled={loading} className="mt-4">
					{loading ? "Mengunggah..." : "Upload"}
				</Button>
			</section>
		</DashboardLayout>
	);
}
