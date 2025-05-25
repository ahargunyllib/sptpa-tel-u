<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\WorkTarget;
use App\Models\WorkTargetValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\Uid\Ulid;

class WorkTargetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $role = $request->route()->getName() === 'dashboard.performance.tpa' ? 'tpa' : (request()->route()->getName() === 'dashboard.performance.kaur' ? 'kaur' : null);

        if (!$role) {
            abort(404);
        }

        $userRole = $request->user()->role;

        $canManageWorkTargets = true;
        if ($userRole === 'wadek' && $role === 'tpa') {
            $canManageWorkTargets = false;
        }

        $search = $request->input('search', '');

        $users = [];
        if (!empty($search)) {
            $users = User::query()
                ->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })
                ->where('role', $role)
                ->get()->toArray();
        }

        // Get all work targets for the given role but don't filter out work targets with no values
        // $rawWorkTargets = WorkTarget::with(['workTargetValues' => function ($query) use ($role) {
        //     // This only filters the loaded relationships, not the main query
        //     $query->whereHas('user', function ($q) use ($role) {
        //         $q->where('role', $role);
        //     });
        // }])
        //     ->orderByDesc('created_at')
        //     ->get();

        // $rawWorkTargets = DB::table('work_target_values')
        //     ->join('work_targets', 'work_targets.id', '=', 'work_target_values.work_target_id')
        //     ->join('users', 'users.id', '=', 'work_target_values.user_id')
        //     ->where('users.role', $role)
        //     ->select(
        //         'work_targets.*',
        //         'users.id as user_id',
        //         'users.name as user_name',
        //         'users.nip as nip',
        //     )
        //     ->get();

        $rawWorkTargets = DB::table('work_targets')
            ->leftJoin('work_target_values', 'work_target_values.work_target_id', '=', 'work_targets.id')
            ->leftJoin('users', function ($join) use ($role) {
                $join->on('users.id', '=', 'work_target_values.user_id')
                    ->where(function ($q) use ($role) {
                        $q->whereNull('users.role')
                            ->orWhere('users.role', '=', $role);
                    });
            })
            ->select(
                'work_targets.*',
                'users.id as user_id',
                'users.name as user_name',
                'users.nip as nip',
                'users.role as user_role',
            )
            ->get();

        $workTargets = [];

        foreach ($rawWorkTargets as $rowWorkTarget) {
            $id = $rowWorkTarget->id;

            if (!isset($workTargets[$id])) {
                $workTargets[$id] = [
                    'id' => $rowWorkTarget->id,
                    'name' => $rowWorkTarget->name,
                    'unit' => $rowWorkTarget->unit,
                    'comparator' => $rowWorkTarget->comparator,
                    'first_quarter_target' => $rowWorkTarget->first_quarter_target,
                    'second_quarter_target' => $rowWorkTarget->second_quarter_target,
                    'third_quarter_target' => $rowWorkTarget->third_quarter_target,
                    'fourth_quarter_target' => $rowWorkTarget->fourth_quarter_target,
                    'staffs' => [],
                ];
            }

            if ($rowWorkTarget->user_id === null) {
                continue;
            }

            $workTargets[$id]['staffs'][] = [
                'id' => $rowWorkTarget->user_id,
                'name' => $rowWorkTarget->user_name,
                'nip' => $rowWorkTarget->nip,
            ];
        }

        // Convert the associative array back to a numerically indexed array
        $workTargets = array_values($workTargets);

        $staffs = DB::table('work_target_values')
            ->rightJoin('users', 'users.id', '=', 'work_target_values.user_id')
            ->where('users.role', $role)
            ->select(
                'users.*',
                DB::raw('CEIL(COALESCE(AVG(first_quarter_score), 0)) as average_first_quarter_score'),
                DB::raw('CEIL(COALESCE(AVG(second_quarter_score), 0)) as average_second_quarter_score'),
                DB::raw('CEIL(COALESCE(AVG(third_quarter_score), 0)) as average_third_quarter_score'),
                DB::raw('CEIL(COALESCE(AVG(fourth_quarter_score), 0)) as average_fourth_quarter_score'),
            )
            ->groupBy('users.id')
            ->get();

        $selectFields = [
            'users.*',
            DB::raw('COALESCE(user_attitude_evaluations.communication, 0) as communication'),
            DB::raw('COALESCE(user_attitude_evaluations.teamwork, 0) as teamwork'),
            DB::raw('COALESCE(user_attitude_evaluations.collaboration, 0) as collaboration'),
            DB::raw('COALESCE(user_attitude_evaluations.solidarity, 0) as solidarity'),
            DB::raw('COALESCE(user_attitude_evaluations.work_ethic, 0) as work_ethic'),
            DB::raw('COALESCE(user_attitude_evaluations.technology_usage, 0) as technology_usage'),
            DB::raw('COALESCE(user_attitude_evaluations.work_smart, 0) as work_smart'),
            DB::raw('COALESCE(user_attitude_evaluations.initiative, 0) as initiative'),
            DB::raw('COALESCE(user_attitude_evaluations.role_model, 0) as role_model'),
            DB::raw('COALESCE(user_attitude_evaluations.responsibility, 0) as responsibility'),
            DB::raw('COALESCE(user_attitude_evaluations.professional_ethic, 0) as professional_ethic'),
            DB::raw('COALESCE(user_attitude_evaluations.image_maintenance, 0) as image_maintenance'),
            DB::raw('COALESCE(user_attitude_evaluations.discipline, 0) as discipline'),
            DB::raw('user_attitude_evaluations.evidance as evidance'),
        ];

        if ($userRole === 'wadek') {
            $selectFields[] = DB::raw("COALESCE(user_feedbacks.wadek_feedback, '-') as note");
        } else if ($userRole === 'kaur') {
            $selectFields[] = DB::raw("COALESCE(user_feedbacks.kaur_feedback, '-') as note");
        }

        $userAttitudeEvaluations = DB::table('users')
            ->where('users.role', $role)
            ->leftJoin('user_attitude_evaluations', 'user_attitude_evaluations.user_id', '=', 'users.id')
            ->leftJoin('user_feedbacks', 'user_feedbacks.user_id', '=', 'users.id')
            ->select(...$selectFields)
            ->get();

        return Inertia::render('work-targets-management/index', [
            'role' => $role,
            'canManageWorkTargets' => $canManageWorkTargets,
            'users' => $users,
            'workTargets' => $workTargets,
            'staffs' => $staffs,
            'userAttitudeEvaluations' => $userAttitudeEvaluations,
        ]);
    }

    public function indexMe(Request $request)
    {
        $user = $request->user();

        $workTargets = DB::table('work_targets')
            ->where('work_targets.assigned_id', $user->id)
            ->select(
                'work_targets.*',
            )
            ->get();

        return Inertia::render('my-work-targets/index', [
            'workTargets' => $workTargets,
        ]);
    }

    public function indexKaur(Request $request)
    {
        $user = $request->user();
        $role = "kaur";

        $staffs = DB::table('work_targets')
            ->rightJoin('users as assigned', 'assigned.id', '=', 'work_targets.assigned_id')
            ->leftJoin('users as creator', 'creator.id', '=', 'work_targets.creator_id')
            ->where('assigned.role', $role);

        if ($user->role === 'wadek1') {
            $staffs = $staffs->whereIn('assigned.division', ['academic_service', 'laboratory']);
        } else if ($user->role === 'wadek2') {
            $staffs = $staffs->whereIn('assigned.division', ['secretary', 'student_affair', 'finance_logistic_resource']);
        }

        $staffs = $staffs->select(
            'assigned.*',
            DB::raw('COALESCE(CEIL(AVG(first_quarter_score)), 0) as average_first_quarter_score'),
            DB::raw('COALESCE(CEIL(AVG(second_quarter_score)), 0) as average_second_quarter_score'),
            DB::raw('COALESCE(CEIL(AVG(third_quarter_score)), 0) as average_third_quarter_score'),
            DB::raw('COALESCE(CEIL(AVG(fourth_quarter_score)), 0) as average_fourth_quarter_score'),
        )
            ->groupBy('assigned.id')
            ->get();

        foreach ($staffs as $staff) {
            $staff->work_targets = DB::table('work_targets')
                ->where('assigned_id', $staff->id)
                ->select(
                    'work_targets.*',
                )
                ->get();
        }

        return Inertia::render('work-targets-management/index', [
            'role' => $role,
            'staffs' => $staffs,
        ]);
    }

    public function indexStaf(Request $request)
    {
        $user = $request->user();
        $role = "staf";

        $staffs = DB::table('work_targets')
            ->rightJoin('users as assigned', 'assigned.id', '=', 'work_targets.assigned_id')
            ->leftJoin('users as creator', 'creator.id', '=', 'work_targets.creator_id')
            ->where('assigned.role', $role);

        if ($user->role === 'kaur') {
            $staffs = $staffs->where('assigned.division', $user->division);
        } else if ($user->role === 'wadek1') {
            $staffs = $staffs->whereIn('assigned.division', ['academic_service', 'laboratory']);
        } else if ($user->role === 'wadek2') {
            $staffs = $staffs->whereIn('assigned.division', ['secretary', 'student_affair', 'finance_logistic_resource']);
        }

        $staffs = $staffs->select(
            'assigned.*',
            DB::raw('COALESCE(CEIL(AVG(first_quarter_score)), 0) as average_first_quarter_score'),
            DB::raw('COALESCE(CEIL(AVG(second_quarter_score)), 0) as average_second_quarter_score'),
            DB::raw('COALESCE(CEIL(AVG(third_quarter_score)), 0) as average_third_quarter_score'),
            DB::raw('COALESCE(CEIL(AVG(fourth_quarter_score)), 0) as average_fourth_quarter_score'),
        )
            ->groupBy('assigned.id')
            ->get();

        foreach ($staffs as $staff) {
            $staff->work_targets = DB::table('work_targets')
                ->where('assigned_id', $staff->id)
                ->select(
                    'work_targets.*',
                )
                ->get();
        }

        return Inertia::render('work-targets-management/index', [
            'role' => $role,
            'staffs' => $staffs,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        try {
            // Validate the request data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'assigned_id' => 'required|exists:users,id',
            ]);

            $userId = $request->user()->id;

            // Begin a database transaction
            DB::beginTransaction();

            // Create a new work target
            DB::table('work_targets')->insert([
                'id' => Ulid::generate(),
                'name' => $validatedData['name'],
                'creator_id' => $userId,
                'assigned_id' => $validatedData['assigned_id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();

            return back();
        } catch (\Exception $e) {
            dd($e);

            // Rollback the transaction if an error occurs
            DB::rollBack();

            return back();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(String $id, Request $request)
    {
        $role = $request->route()->getName() === 'dashboard.performance.tpa.show' ? 'tpa' : (request()->route()->getName() === 'dashboard.performance.kaur.show' ? 'kaur' : null);

        if (!$role) {
            abort(404);
        }

        $workTargets = DB::table('work_target_values')
            ->rightJoin('work_targets', 'work_targets.id', '=', 'work_target_values.work_target_id')
            ->where('work_target_values.user_id', $id)
            ->select(
                "work_targets.*",
                "work_target_values.*",
            )
            ->groupBy('work_targets.id')
            ->groupBy('work_target_values.id')
            ->get();

        $user = User::findOrFail($id);

        return Inertia::render('work-targets-management/show', [
            'role' => $role,
            'workTargets' => $workTargets,
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'unit' => 'required|in:at_week,work_day,total,percentage',
                'first_quarter_target' => 'required|integer',
                'second_quarter_target' => 'required|integer',
                'third_quarter_target' => 'required|integer',
                'fourth_quarter_target' => 'required|integer',
            ]);

            // Begin a database transaction
            DB::beginTransaction();

            DB::table('work_targets')
                ->where('id', $id)
                ->update([
                    'name' => $validatedData['name'],
                    'unit' => $validatedData['unit'],
                    'first_quarter_target' => $validatedData['first_quarter_target'],
                    'second_quarter_target' => $validatedData['second_quarter_target'],
                    'third_quarter_target' => $validatedData['third_quarter_target'],
                    'fourth_quarter_target' => $validatedData['fourth_quarter_target'],
                    'updated_at' => now(),
                ]);

            // Commit the transaction
            DB::commit();

            return back();
        } catch (\Exception $e) {
            dd($e);

            // Rollback the transaction if an error occurs
            DB::rollBack();

            return back();
        }
    }

    public function assess(Request $request, string $id)
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'first_quarter_score' => 'required|integer',
                'second_quarter_score' => 'required|integer',
                'third_quarter_score' => 'required|integer',
                'fourth_quarter_score' => 'required|integer',
                'final_score' => 'required|integer',
            ]);


            // Begin a database transaction
            DB::beginTransaction();

            DB::table('work_targets')
                ->where('id', $id)
                ->update([
                    'first_quarter_score' => $validatedData['first_quarter_score'],
                    'second_quarter_score' => $validatedData['second_quarter_score'],
                    'third_quarter_score' => $validatedData['third_quarter_score'],
                    'fourth_quarter_score' => $validatedData['fourth_quarter_score'],
                    'final_score' => $validatedData['final_score'],
                    'updated_at' => now(),
                ]);

            // Commit the transaction
            DB::commit();

            return back();
        } catch (\Exception $e) {
            // Rollback the transaction if an error occurs
            DB::rollBack();

            return back();
        }
    }

    public function submit(Request $request, string $id)
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'first_quarter_value' => 'required|integer',
                'second_quarter_value' => 'required|integer',
                'third_quarter_value' => 'required|integer',
                'fourth_quarter_value' => 'required|integer',
                'category' => 'required|in:light,medium,heavy',
            ]);

            // Begin a database transaction
            DB::beginTransaction();

            DB::table('work_targets')
                ->where('id', $id)
                ->update([
                    'first_quarter_value' => $validatedData['first_quarter_value'],
                    'second_quarter_value' => $validatedData['second_quarter_value'],
                    'third_quarter_value' => $validatedData['third_quarter_value'],
                    'fourth_quarter_value' => $validatedData['fourth_quarter_value'],
                    'category' => $validatedData['category'],
                    'updated_at' => now(),
                ]);

            // Commit the transaction
            DB::commit();

            return back();
        } catch (\Exception $e) {
            // Rollback the transaction if an error occurs
            DB::rollBack();

            return back();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {

        try {
            // Begin a database transaction
            DB::beginTransaction();

            DB::table('work_targets')
                ->where('id', $id)
                ->delete();

            // Commit the transaction
            DB::commit();

            return back();
        } catch (\Exception $e) {
            // Rollback the transaction if an error occurs
            DB::rollBack();

            return back();
        }
    }

    public function myWorkTargets(Request $request)
    {
        $user = $request->user();

        $workTargets = DB::table('work_target_values')
            ->rightJoin('work_targets', 'work_targets.id', '=', 'work_target_values.work_target_id')
            ->where('work_target_values.user_id', $user->id)
            ->select(
                "work_targets.*",
                "work_target_values.*",
            )
            ->groupBy('work_targets.id')
            ->groupBy('work_target_values.id')
            ->get();

        $userAttitudeEvaluation = DB::table('user_attitude_evaluations')
            ->where('user_id', $user->id)
            ->select(
                DB::raw('COALESCE(communication, 0) as communication'),
                DB::raw('COALESCE(teamwork, 0) as teamwork'),
                DB::raw('COALESCE(collaboration, 0) as collaboration'),
                DB::raw('COALESCE(solidarity, 0) as solidarity'),
                DB::raw('COALESCE(work_ethic, 0) as work_ethic'),
                DB::raw('COALESCE(technology_usage, 0) as technology_usage'),
                DB::raw('COALESCE(work_smart, 0) as work_smart'),
                DB::raw('COALESCE(initiative, 0) as initiative'),
                DB::raw('COALESCE(role_model, 0) as role_model'),
                DB::raw('COALESCE(responsibility, 0) as responsibility'),
                DB::raw('COALESCE(professional_ethic, 0) as professional_ethic'),
                DB::raw('COALESCE(image_maintenance, 0) as image_maintenance'),
                DB::raw('COALESCE(discipline, 0) as discipline'),
                DB::raw('evidance as evidance'),
            )
            ->first();

        if (!$userAttitudeEvaluation) {
            $userAttitudeEvaluation = [
                'communication' => 0,
                'teamwork' => 0,
                'collaboration' => 0,
                'solidarity' => 0,
                'work_ethic' => 0,
                'technology_usage' => 0,
                'work_smart' => 0,
                'initiative' => 0,
                'role_model' => 0,
                'responsibility' => 0,
                'professional_ethic' => 0,
                'image_maintenance' => 0,
                'discipline' => 0,
                'evidance' => null
            ];
        }

        $userFeedback = DB::table('user_feedbacks')
            ->where('user_id', $user->id)
            ->select(
                DB::raw("COALESCE(kaur_feedback, '-') as kaur_feedback"),
                DB::raw("COALESCE(wadek_feedback, '-') as wadek_feedback"),
            )
            ->first();

        if (!$userFeedback) {
            $userFeedback = [
                'kaur_feedback' => '-',
                'wadek_feedback' => '-'
            ];
        }

        return Inertia::render('work-targets-management/my-work-targets', [
            'workTargets' => $workTargets,
            'userAttitudeEvaluation' => $userAttitudeEvaluation,
            'userFeedback' => $userFeedback,
        ]);
    }
}
