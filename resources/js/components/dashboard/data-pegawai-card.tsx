import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TableRow } from "@/components/ui/table";
import { getDivisionLabel, getRoleLabel } from "@/lib/enums";
import type { User } from "@/types";
import { FileTextIcon } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
} from "../ui/table";

export default function DataPegawaiCard({
	user,
	overall,
}: {
	user: User;
	overall?: {
		work_target: number;
		user_attitude_evaluation: number;
	};
}) {
	return (
		<div className="py-5 px-6 bg-white rounded-lg flex flex-col w-full gap-6">
			<div className="flex flex-row justify-between items-center">
				<span className="text-sm md:text-base text-[#1D2939] font-semibold ">
					Data pegawai
				</span>
				{overall && (
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline" className="gap-2">
								<FileTextIcon className="h-4 w-4" />
								Lihat Detail Nilai Keseluruhan
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Detail Nilai Keseluruhan</DialogTitle>
							</DialogHeader>
							<div className="overflow-x-auto">
								<Table className="w-full">
									<TableHeader>
										<TableRow>
											<TableHead className="py-3 px-4 text-center">
												No
											</TableHead>
											<TableHead className="py-3 px-4 w-full">
												Kriteria Penilaian
											</TableHead>
											<TableHead className="py-3 px-4 text-center">
												Nilai
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										<TableRow>
											<TableCell className="py-3 px-4 text-center">1</TableCell>
											<TableCell className="py-3 px-4">
												Target Kinerja
											</TableCell>
											<TableCell className="py-3 px-4 text-center">
												{overall.work_target.toFixed(2)}
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className="py-3 px-4 text-center">2</TableCell>
											<TableCell className="py-3 px-4">Sikap Kerja</TableCell>
											<TableCell className="py-3 px-4 text-center">
												{overall.user_attitude_evaluation.toFixed(2)}
											</TableCell>
										</TableRow>
									</TableBody>
									<TableFooter>
										<TableRow>
											<TableCell colSpan={2} className="text-left">
												Rata-Rata
											</TableCell>
											<TableCell className="py-3 px-4 text-center">
												{(
													0.4 * overall.work_target +
													0.6 * overall.user_attitude_evaluation
												).toFixed(2)}
											</TableCell>
										</TableRow>
									</TableFooter>
								</Table>
							</div>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Kembali</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				)}
			</div>
			<div className="w-full gap-6 flex flex-col xl:flex-row">
				<Avatar className="h-40 w-40 rounded-lg">
					<AvatarImage
						src={
							user.photo_profile
								? user.photo_profile.startsWith("profile-photos")
									? `/storage/${user.photo_profile}`
									: user.photo_profile
								: "https://media-sin2-1.cdn.whatsapp.net/v/t61.24694-24/473401127_1818570005572383_5508634567812061033_n.jpg?ccb=11-4&oh=01_Q5AaIQltFg5tbTKGufIbqFYffpLQLdFSqNQXmAOLR8JC4yqi&oe=6802E54F&_nc_sid=5e03e0&_nc_cat=104"
						}
						alt="Profile"
						className="object-cover"
					/>

					<AvatarFallback>{user.name?.charAt(0) || "-"}</AvatarFallback>
				</Avatar>
				<div className="flex flex-col gap-2.5 text-xs text-[#090E17]">
					<span>{`Nama Pegawai: ${user.name}`}</span>
					<span>{`NIP: ${user.nip}`}</span>
					{user.role && (
						<span>
							{`Deskripsi kerja sebagai: ${
								getRoleLabel(user.role).toLowerCase().includes("wadek")
									? "Wakil Dekan"
									: getRoleLabel(user.role).toLowerCase().includes("kaur")
										? "Kepala Urusan"
										: getRoleLabel(user.role)
							}`}
						</span>
					)}
					{user.division && (
						<span>{`Bagian Urusan: ${getDivisionLabel(user.division)}`}</span>
					)}
					<span>Periode Penilaian: 2025</span>
				</div>
			</div>
		</div>
	);
}
