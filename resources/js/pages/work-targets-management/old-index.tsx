import { Head } from "@inertiajs/react";
import PerformanceAssessmentsCard from "../../components/features/work-targets-management/performance-assements-card";
import StaffsCard from "../../components/features/work-targets-management/staffs-card";
import WorkTargetsCard from "../../components/features/work-targets-management/work-targets-card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "../../components/ui/tabs";
import DashboardLayout from "../../layouts/dashboard-layout";
import type { User, UserAttitudeEvaluation, WorkTarget } from "../../types";

type Props = {
	role: string;
	canManageWorkTargets: boolean;
	users: User[];
	workTargets: WorkTarget[];
	staffs: (User & {
		average_first_quarter_score: number;
		average_second_quarter_score: number;
		average_third_quarter_score: number;
		average_fourth_quarter_score: number;
	})[];
	userAttitudeEvaluations: (User &
		UserAttitudeEvaluation & {
			note: string;
		})[];
};

export default function WorkTargetsManagementIndex({
	role,
	canManageWorkTargets,
	users,
	workTargets,
	staffs,
	userAttitudeEvaluations,
}: Props) {
	return (
		<DashboardLayout>
			<Head title={`Kinerja ${role}`} />

			<Tabs defaultValue="work-target">
				<TabsList className="space-x-2">
					<TabsTrigger value="work-target">Target kinerja pegawai</TabsTrigger>
					<TabsTrigger value="attitude">Sikap kerja</TabsTrigger>
				</TabsList>
				<TabsContent value="work-target" className="space-y-4 ">
					{canManageWorkTargets && (
						<WorkTargetsCard
							role={role}
							users={users}
							workTargets={workTargets}
						/>
					)}

					{/* <PerformanceAssessmentsCard role={role} staffs={staffs} /> */}
				</TabsContent>
				<TabsContent value="attitude">
					<StaffsCard
						role={role}
						userAttitudeEvaluations={userAttitudeEvaluations}
					/>
				</TabsContent>
			</Tabs>
		</DashboardLayout>
	);
}
