import { Link } from "@inertiajs/react";
import { ArrowUpRightIcon } from "lucide-react";
import { capitalize } from "../../../lib/utils";
import Pagination from "../../pagination";
import { Button } from "../../ui/button";
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

const performanceAssessments = [
	{
		id: "1",
		name: "Kenzie",
		role: "kaur",
		average_first_quarter_score: 90,
		average_second_quarter_score: 90,
		average_third_quarter_score: 90,
		average_fourth_quarter_score: 90,
	},
];

export default function PerformanceAssessmentsCard({
	role,
}: {
	role: string;
}) {
	return (
		<Card className="shadow-sm">
			<CardHeader>
				<CardTitle>Penilaian Kerja</CardTitle>
				<CardDescription>
					Dibawah ini merupakan {role} yang anda kelola
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
									Target Kerja
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
							{performanceAssessments.map((performanceAssessment, idx) => {
								return (
									<TableRow key={performanceAssessment.id}>
										<TableCell className="py-3 px-4">{idx + 1}</TableCell>
										<TableCell className="py-3 w-full px-4">
											{performanceAssessment.name}
										</TableCell>
										<TableCell className="py-3 w-full px-4">
											<Button
												variant="ghost"
												size="sm"
												className="bg-transparent hover:bg-transparent active:bg-transparent text-info-60"
												asChild
											>
												<Link
													href={route(
														`dashboard.performance.${performanceAssessment.role}.show`,
														{
															id: performanceAssessment.id,
														},
													)}
												>
													<ArrowUpRightIcon />
													Tampil
												</Link>
											</Button>
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{performanceAssessment.average_first_quarter_score}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{performanceAssessment.average_second_quarter_score}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{performanceAssessment.average_third_quarter_score}
										</TableCell>
										<TableCell className="py-3 px-4 text-center">
											{performanceAssessment.average_fourth_quarter_score}
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
							Items per page
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
