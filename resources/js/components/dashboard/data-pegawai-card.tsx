import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDivisionLabel, getRoleLabel } from "@/lib/enums";
import type { User } from "@/types";

export default function DataPegawaiCard({ user }: { user: User }) {
	return (
		<div className="py-5 px-6 bg-white rounded-lg flex flex-col w-full gap-6">
			<span className="text-sm md:text-base text-[#1D2939] font-semibold ">
				Data pegawai
			</span>
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
					<span>{`Deskripsi kerja sebagai: ${getRoleLabel(user.role)}`}</span>
					<span>{`Bagian Urusan: ${getDivisionLabel(user.division)}`}</span>
					<span>Periode Penilaian: 2025</span>
				</div>
			</div>
		</div>
	);
}
