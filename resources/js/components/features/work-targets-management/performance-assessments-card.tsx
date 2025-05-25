import { capitalize } from "../../../lib/utils";
import type { User, WorkTarget } from "../../../types";
import Pagination from "../../pagination";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../ui/table";
import PerformanceAssessmentsDialog from "./performance-assessments-dialog";
import WorkTargetsDialog from "./work-targets-dialog";

export default function PerformanceAssessmentsCard({
	role,
	staffs,
}: {
	role: string;
	staffs: (User & {
		average_first_quarter_score: number;
		average_second_quarter_score: number;
		average_third_quarter_score: number;
		average_fourth_quarter_score: number;
	} & {
		work_targets: WorkTarget[];
	})[];
}) {
	return (
		<Card className="shadow-sm">
			<CardHeader>
				<CardTitle>Penilaian Kinerja</CardTitle>
				<CardDescription>
					Dibawah ini merupakan {capitalize(role)} yang Anda kelola
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="py-3 px-4 text-center">No</TableHead>
								<TableHead className="py-3 px-4 w-full">
									Nama {capitalize(role)}
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Target Kinerja
								</TableHead>
								<TableHead className="py-3 px-4 text-center">
									Penilaian
								</TableHead>
								<TableHead className="py-3 px-4 text-center text-nowrap">
									Nilai TW1
								</TableHead>
								<TableHead className="py-3 px-4 text-center text-nowrap">
									Nilai TW2
								</TableHead>
								<TableHead className="py-3 px-4 text-center text-nowrap">
									Nilai TW3
								</TableHead>
								<TableHead className="py-3 px-4 text-center text-nowrap">
									Nilai TW4
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{staffs.map((staff, idx) => {
								return (
									<TableRow key={staff.id}>
										<TableCell className="py-3 px-4">{idx + 1}</TableCell>
										<TableCell className="py-3 w-full px-4">
											{staff.name}
										</TableCell>
										<TableCell className="py-3 w-full px-4">
											<WorkTargetsDialog
												staffId={staff.id}
												staffName={staff.name}
												workTargets={staff.work_targets}
											/>
										</TableCell>
										<TableCell className="py-3 w-full px-4">
											<PerformanceAssessmentsDialog
												staffId={staff.id}
												staffName={staff.name}
												performances={staff.work_targets}
											/>
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{staff.average_first_quarter_score}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{staff.average_second_quarter_score}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{staff.average_third_quarter_score}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{staff.average_fourth_quarter_score}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>

				{/* Pagination component */}
				<div className="mt-6 flex justify-between items-center">
					<Pagination
						meta={{
							total_page: 1,
							limit: 10,
							page: 1,
							total_data: 20,
						}}
					/>
					<div className="flex items-center space-x-2">
						<span className="text-sm text-muted-foreground">
							Item per halaman
						</span>
						<Select
							// value={filters.per_page?.toString() || "10"}
							value={"10"}
							onValueChange={(value) => {
								const url = new URL(window.location.href);
								url.searchParams.set("per_page", value);
								url.searchParams.delete("page"); // Reset to page 1
								window.location.href = url.toString();
							}}
						>
							<SelectTrigger className="w-[70px]">
								<SelectValue placeholder="10" />
							</SelectTrigger>
							<SelectContent>
								{[10, 25, 50, 100].map((value) => (
									<SelectItem key={value} value={value.toString()}>
										{value}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
