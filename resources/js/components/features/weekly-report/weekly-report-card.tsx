// import DropDownMenu from "@/components/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import type { Tag, User, WeeklyReport } from "@/types";
// import { format } from "date-fns";
// import { Ellipsis, TagIcon } from "lucide-react";
// import React from "react";

// export default function WeeklyReportCard({
//     weeklyReport,
//     onDelete,
//     onEdit,
//     user,
// }: {
//     weeklyReport: WeeklyReport;
//     onDelete: () => void;
//     onEdit?: () => void;
//     user: User;
// }) {
//     return (
//         <div
//             key={weeklyReport.id}
//             className="flex gap-2 p-4 relative bg-[#F9FAFB] rounded-md"
//         >
//             <Avatar className="w-8 md:h-12 h-8 md:w-12 rounded-lg object-cover">
//                 <AvatarImage
//                     // src={
//                     // 	user.photo_profile ||
//                     // 	"https://media-sin2-1.cdn.whatsapp.net/v/t61.24694-24/473401127_1818570005572383_5508634567812061033_n.jpg?ccb=11-4&oh=01_Q5AaIQltFg5tbTKGufIbqFYffpLQLdFSqNQXmAOLR8JC4yqi&oe=6802E54F&_nc_sid=5e03e0&_nc_cat=104"
//                     // }
//                     src={
//                         weeklyReport.user.photo_profile
//                             ? weeklyReport.user.photo_profile.startsWith(
//                                   "profile-photos"
//                               )
//                                 ? `/storage/${weeklyReport.user.photo_profile}`
//                                 : weeklyReport.user.photo_profile
//                             : "https://media-sin2-1.cdn.whatsapp.net/v/t61.24694-24/473401127_1818570005572383_5508634567812061033_n.jpg?ccb=11-4&oh=01_Q5AaIQltFg5tbTKGufIbqFYffpLQLdFSqNQXmAOLR8JC4yqi&oe=6802E54F&_nc_sid=5e03e0&_nc_cat=104"
//                     }
//                     alt="Profile"
//                 />

//                 <AvatarFallback>
//                     {weeklyReport.user.name?.charAt(0) || "-"}
//                 </AvatarFallback>
//             </Avatar>
//             <div className="flex flex-col gap-4">
//                 <div className="flex flex-col gap-1">
//                     <div className="flex items-center gap-1">
//                         <h2 className="text-base font-semibold">
//                             {weeklyReport.user.name}
//                         </h2>
//                         <div className="w-1 h-1 bg-[#A8A6AC]" />
//                         <span className="text-sm text-[#A8A6AC]">
//                             {format(
//                                 new Date(weeklyReport.updated_at),
//                                 "dd MMM yyyy"
//                             )}
//                         </span>
//                     </div>
//                     <p className="text-sm">{weeklyReport.content}</p>
//                 </div>
//                 <div className="flex flex-row gap-1">
//                     {weeklyReport.tags.map((tag: Tag) => (
//                         <div
//                             className="flex gap-1 items-center bg-[#98A2B3] text-white rounded-sm py-1 px-2 text-xs"
//                             key={tag.id}
//                         >
//                             <TagIcon className="w-3 h-3" />
//                             {tag.name}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//             {weeklyReport.user.id === user.id && (
//                 <div className="absolute top-2 right-2">
//                     <DropDownMenu onDelete={onDelete} onEdit={onEdit} />
//                 </div>
//             )}
//         </div>
//     );
// }
