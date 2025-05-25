import DashboardLayout from "@/layouts/dashboard-layout";
import { Head } from "@inertiajs/react";
import PerformanceAssessmentsCard from "../../components/features/work-targets-management/performance-assessments-card";
import type { User, WorkTarget } from "../../types";

type Props = {
	role: string;
	staffs: (User & {
		average_first_quarter_score: number;
		average_second_quarter_score: number;
		average_third_quarter_score: number;
		average_fourth_quarter_score: number;
	} & {
		work_targets: WorkTarget[];
	} & {
		bukti_kinerja_folder_id: string | null;
	})[];
};

export default function WorkTargetsManagement({ role, staffs }: Props) {
	return (
		<DashboardLayout>
			<Head title="Target Kinerja Staf/Kaur" />

			<PerformanceAssessmentsCard role={role} staffs={staffs} />
		</DashboardLayout>
	);
}
