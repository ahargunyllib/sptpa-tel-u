"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/dashboard-layout";
import { router } from "@inertiajs/react";
import axios from "axios";
import { useState } from "react";

export default function RubrikasiUploadPage({
    rubrikasi,
}: {
    rubrikasi: string;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!file) {
            alert("Silakan pilih file terlebih dahulu.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        try {
            const response = await axios.post("/api/file/rubrikasi", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("File berhasil diupload.");
			window.location.reload()
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Upload gagal.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout header="Arsip">
            <section className="bg-white rounded-md px-6 py-4 flex flex-col gap-4">
                <div>Upload File Rubrikasi</div>
                <p>Upload file PDF, DOCX, atau TXT (max 10MB).</p>
                <span>
                    File saat ini{" "}
                    {rubrikasi ? (
                        <a
                            className="text-blue-400 underline"
                            href={rubrikasi}
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
                <Button
                    onClick={handleUpload}
                    disabled={loading}
                    className="mt-4"
                >
                    {loading ? "Mengunggah..." : "Upload"}
                </Button>
            </section>
        </DashboardLayout>
    );
}
