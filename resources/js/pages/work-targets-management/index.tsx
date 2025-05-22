import DashboardLayout from "@/layouts/dashboard-layout";
import { Head } from "@inertiajs/react";
import PerformanceAssessmentsCard from "../../components/features/work-targets-management/performance-assements-card";
import type { User, WorkTarget, WorkTargetValue } from "../../types";

type Props = {
	role: string;
	staffs: (User & {
		average_first_quarter_score: number;
		average_second_quarter_score: number;
		average_third_quarter_score: number;
		average_fourth_quarter_score: number;
	})[];
	workTargets: WorkTarget[];
	performances: (WorkTarget & WorkTargetValue)[];
};

export default function WorkTargetsManagement({
	role,
	staffs,
	performances,
	workTargets,
}: Props) {
	return (
		<DashboardLayout>
			<Head title="Target Kinerja Staf/Kaur" />

			<PerformanceAssessmentsCard
				role={role}
				staffs={staffs}
				performances={performances}
				workTargets={workTargets}
			/>
		</DashboardLayout>
	);
}
