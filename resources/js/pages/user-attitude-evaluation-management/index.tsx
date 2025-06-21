import DashboardLayout from "@/layouts/dashboard-layout";
import type { User, UserAttitudeEvaluation, WorkTarget } from "@/types";
import { Head } from "@inertiajs/react";
import StaffsCard from "../../components/features/user-attitude-evaluation-management/staffs-card";

type Props = {
	role: string;
	userAttitudeEvaluations: (User &
		UserAttitudeEvaluation & {
			note: string;
		} & {
			work_targets: WorkTarget[];
		})[];
};

export default function UserAttitudeEvaluationManagement({
	role,
	userAttitudeEvaluations,
}: Props) {
	return (
		<DashboardLayout>
			<Head title="Sikap Kerja Staf/Kaur" />

			<StaffsCard
				role={role}
				userAttitudeEvaluations={userAttitudeEvaluations}
			/>
		</DashboardLayout>
	);
}
