<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\Uid\Ulid;

class WorkReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function indexMe(Request $request)
    {
        $user = $request->user();

        $workTargets = DB::table('work_targets')
            ->where('work_targets.assigned_id', $user->id)
            ->select(
                'work_targets.*',
            )
            ->get();

        $workReports = DB::table('work_reports')
            ->where('work_reports.creator_id', $user->id)
            ->select(
                'work_reports.*',
            )
            ->get();

        $workTargetMap = [];
        foreach ($workTargets as $target) {
            $target = (array) $target;
            $target['quarters'] = [
                1 => ['target' => $target['first_quarter_target'], 'progress' => ceil($target['first_quarter_value'] / $target['first_quarter_target']), 'work_reports' => []],
                2 => ['target' => $target['second_quarter_target'], 'progress' => ceil($target['second_quarter_value'] / $target['second_quarter_target']), 'work_reports' => []],
                3 => ['target' => $target['third_quarter_target'], 'progress' => ceil($target['third_quarter_value'] / $target['third_quarter_target']), 'work_reports' => []],
                4 => ['target' => $target['fourth_quarter_target'], 'progress' => ceil($target['fourth_quarter_value'] / $target['fourth_quarter_target']), 'work_reports' => []],
            ];
            unset(
                $target['first_quarter_target'],
                $target['second_quarter_target'],
                $target['third_quarter_target'],
                $target['fourth_quarter_target']
            );
            $workTargetMap[$target['id']] = $target;

            // $staffMap[$target['assigned_id']]['work_targets'][] = &$workTargetMap[$target['id']];
        }

        foreach ($workReports as $report) {
            $report = (array) $report;
            $month = date('n', strtotime($report['created_at']));
            $quarter = 0;
            if ($month >= 1 && $month <= 3) $quarter = 1;
            if ($month >= 4 && $month <= 6) $quarter = 2;
            if ($month >= 7 && $month <= 9) $quarter = 3;
            if ($month >= 10 && $month <= 12) $quarter = 4;
            if ($quarter === 0) continue; // Skip if not in a valid quarter

            $targetId = $report['work_target_id'];
            if (!isset($workTargetMap[$targetId])) continue;

            $workTargetMap[$targetId]['quarters'][$quarter]['work_reports'][] = $report;
        }

        $result = [];

        foreach ($workTargetMap as $target) {
            $quarters = [];
            foreach ($target['quarters'] as $qnum => $qdata) {
                $quarters[] = [
                    'quarter' => $qnum,
                    'target' => $qdata['target'],
                    'progress' => $qdata['progress'],
                    'work_reports' => $qdata['work_reports'],
                ];
            }

            $result[] = [
                'id' => $target['id'],
                'name' => $target['name'],
                'quarters' => $quarters,
            ];
        }

        return Inertia::render('my-work-reports/index', [
            'work_targets' => $result,
        ]);
    }

    public function indexStaf(Request $request)
    {
        $user = $request->user();
        $division = $user->division;
        $role = 'staf';

        $staffs = DB::table('users')
            ->where('users.division', $division)
            ->where('users.role', $role)
            ->select(
                'users.*'
            )
            ->get();

        $workTargets = DB::table('work_targets')
            ->leftJoin('users as creator', 'creator.id', '=', 'work_targets.creator_id')
            ->leftJoin('users as assigned', 'assigned.id', '=', 'work_targets.assigned_id')
            ->where('assigned.role', $role)
            ->where('creator.division', $division)
            ->select(
                'work_targets.*',
            )
            ->get();

        $workReports = DB::table('work_reports')
            ->leftJoin('users as creator', 'creator.id', '=', 'work_reports.creator_id')
            ->where('creator.division', $division)
            ->where('creator.role', $role)
            ->select(
                'work_reports.*',
            )
            ->get();

        $staffMap = [];
        foreach ($staffs as $staff) {
            $staffMap[$staff->id] = (array) $staff;
            $staffMap[$staff->id]['work_targets'] = [];
        }

        $workTargetMap = [];
        foreach ($workTargets as $target) {
            $target = (array) $target;
            $target['quarters'] = [
                1 => ['target' => $target['first_quarter_target'], 'progress' => ceil($target['first_quarter_value'] / $target['first_quarter_target']), 'work_reports' => []],
                2 => ['target' => $target['second_quarter_target'], 'progress' => ceil($target['second_quarter_value'] / $target['second_quarter_target']), 'work_reports' => []],
                3 => ['target' => $target['third_quarter_target'], 'progress' => ceil($target['third_quarter_value'] / $target['third_quarter_target']), 'work_reports' => []],
                4 => ['target' => $target['fourth_quarter_target'], 'progress' => ceil($target['fourth_quarter_value'] / $target['fourth_quarter_target']), 'work_reports' => []],
            ];
            unset(
                $target['first_quarter_target'],
                $target['second_quarter_target'],
                $target['third_quarter_target'],
                $target['fourth_quarter_target']
            );
            $workTargetMap[$target['id']] = $target;

            $staffMap[$target['assigned_id']]['work_targets'][] = &$workTargetMap[$target['id']];
        }

        foreach ($workReports as $report) {
            $report = (array) $report;
            $month = date('n', strtotime($report['created_at']));
            $quarter = 0;
            if ($month >= 1 && $month <= 3) $quarter = 1;
            if ($month >= 4 && $month <= 6) $quarter = 2;
            if ($month >= 7 && $month <= 9) $quarter = 3;
            if ($month >= 10 && $month <= 12) $quarter = 4;
            if ($quarter === 0) continue; // Skip if not in a valid quarter

            $targetId = $report['work_target_id'];
            if (!isset($workTargetMap[$targetId])) continue;

            $workTargetMap[$targetId]['quarters'][$quarter]['work_reports'][] = $report;
        }

        $result = [];
        foreach ($staffMap as $staff) {
            $staffData = [
                'id' => $staff['id'],
                'name' => $staff['name'],
                'email' => $staff['email'],
                'work_targets' => [],
            ];

            foreach ($staff['work_targets'] as $target) {
                $quarters = [];
                foreach ($target['quarters'] as $qnum => $qdata) {
                    $quarters[] = [
                        'quarter' => $qnum,
                        'target' => $qdata['target'],
                        'progress' => $qdata['progress'],
                        'work_reports' => $qdata['work_reports'],
                    ];
                }

                $staffData['work_targets'][] = [
                    'id' => $target['id'],
                    'name' => $target['name'],
                    'quarters' => $quarters,
                ];
            }

            $result[] = $staffData;
        }

        return Inertia::render('work-reports-management/index', [
            'staffs' => $result
        ]);
    }

    public function indexKaur(Request $request)
    {
        $user = $request->user();
        $division = $user->division;
        $role = 'kaur';

        $staffs = DB::table('users')
            ->where('users.division', $division)
            ->where('users.role', $role)
            ->select(
                'users.*'
            )
            ->get();

        $workTargets = DB::table('work_targets')
            ->leftJoin('users as creator', 'creator.id', '=', 'work_targets.creator_id')
            ->leftJoin('users as assigned', 'assigned.id', '=', 'work_targets.assigned_id')
            ->where('assigned.role', $role)
            ->where('creator.division', $division)
            ->select(
                'work_targets.*',
            )
            ->get();

        $workReports = DB::table('work_reports')
            ->leftJoin('users as creator', 'creator.id', '=', 'work_reports.creator_id')
            ->where('creator.division', $division)
            ->where('creator.role', $role)
            ->select(
                'work_reports.*',
            )
            ->get();

        $staffMap = [];
        foreach ($staffs as $staff) {
            $staffMap[$staff->id] = (array) $staff;
            $staffMap[$staff->id]['work_targets'] = [];
        }

        $workTargetMap = [];
        foreach ($workTargets as $target) {
            $target = (array) $target;
            $target['quarters'] = [
                1 => ['target' => $target['first_quarter_target'], 'progress' => ceil($target['first_quarter_value'] / $target['first_quarter_target']), 'work_reports' => []],
                2 => ['target' => $target['second_quarter_target'], 'progress' => ceil($target['second_quarter_value'] / $target['second_quarter_target']), 'work_reports' => []],
                3 => ['target' => $target['third_quarter_target'], 'progress' => ceil($target['third_quarter_value'] / $target['third_quarter_target']), 'work_reports' => []],
                4 => ['target' => $target['fourth_quarter_target'], 'progress' => ceil($target['fourth_quarter_value'] / $target['fourth_quarter_target']), 'work_reports' => []],
            ];
            unset(
                $target['first_quarter_target'],
                $target['second_quarter_target'],
                $target['third_quarter_target'],
                $target['fourth_quarter_target']
            );
            $workTargetMap[$target['id']] = $target;

            $staffMap[$target['assigned_id']]['work_targets'][] = &$workTargetMap[$target['id']];
        }

        foreach ($workReports as $report) {
            $report = (array) $report;
            $month = date('n', strtotime($report['created_at']));
            $quarter = 0;
            if ($month >= 1 && $month <= 3) $quarter = 1;
            if ($month >= 4 && $month <= 6) $quarter = 2;
            if ($month >= 7 && $month <= 9) $quarter = 3;
            if ($month >= 10 && $month <= 12) $quarter = 4;
            if ($quarter === 0) continue; // Skip if not in a valid quarter

            $targetId = $report['work_target_id'];
            if (!isset($workTargetMap[$targetId])) continue;

            $workTargetMap[$targetId]['quarters'][$quarter]['work_reports'][] = $report;
        }

        $result = [];
        foreach ($staffMap as $staff) {
            $staffData = [
                'id' => $staff['id'],
                'name' => $staff['name'],
                'email' => $staff['email'],
                'work_targets' => [],
            ];

            foreach ($staff['work_targets'] as $target) {
                $quarters = [];
                foreach ($target['quarters'] as $qnum => $qdata) {
                    $quarters[] = [
                        'quarter' => $qnum,
                        'target' => $qdata['target'],
                        'progress' => $qdata['progress'],
                        'work_reports' => $qdata['work_reports'],
                    ];
                }

                $staffData['work_targets'][] = [
                    'id' => $target['id'],
                    'name' => $target['name'],
                    'quarters' => $quarters,
                ];
            }

            $result[] = $staffData;
        }

        return Inertia::render('work-reports-management/index', [
            'staffs' => $result
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'work_target_id' => 'required|exists:work_targets,id',
                'content' => 'required|string|max:65535',
            ]);

            $user = $request->user();

            DB::table('work_reports')->insert([
                'id' => Ulid::generate(),
                'work_target_id' => $validatedData['work_target_id'],
                'creator_id' => $user->id,
                'content' => $validatedData['content'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Laporan kerja berhasil dibuat.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal membuat laporan kerja: ' . $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validatedData = $request->validate([
                'content' => 'required|string|max:65535',
            ]);

            $user = $request->user();

            DB::table('work_reports')
                ->where('id', $id)
                ->where('creator_id', $user->id)
                ->update([
                    'content' => $validatedData['content'],
                    'updated_at' => now(),
                ]);

            return redirect()->back()->with('success', 'Laporan kerja berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal memperbarui laporan kerja: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $user = $request->user();

            DB::table('work_reports')
                ->where('id', $id)
                ->where('creator_id', $user->id)
                ->delete();

            return redirect()->back()->with('success', 'Laporan kerja berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menghapus laporan kerja: ' . $e->getMessage()]);
        }
    }
}
