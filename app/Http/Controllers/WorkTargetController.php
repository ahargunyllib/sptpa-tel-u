<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\WorkTarget;
use App\Models\WorkTargetValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WorkTargetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $role = $request->route()->getName() === 'dashboard.performance.tpa' ? 'tpa' : ( request()->route()->getName() === 'dashboard.performance.kaur' ? 'kaur' : null);

        if (!$role) {
            abort(404);
        }

        $userRole = $request->user()->role;

        $canManageWorkTargets = true;
        if ($userRole === 'wadek' && $role === 'tpa'){
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
        $workTargets = WorkTarget::with(['workTargetValues' => function($query) use ($role) {
            // This only filters the loaded relationships, not the main query
            $query->whereHas('user', function($q) use ($role) {
                $q->where('role', $role);
            });
        }])
        ->orderByDesc('created_at')
        ->get();

        $workTargets = WorkTarget::query()->orderByDesc('created_at')->get();

        // Format the work targets to include the work target values
        $workTargets = $workTargets->map(function ($workTarget) {
            $staffs = $workTarget->workTargetValues->map(function ($workTargetValue) {
                return [
                    'id' => $workTargetValue->user->id,
                    'name' => $workTargetValue->user->name,
                    'nip' => $workTargetValue->user->nip,
                ];
            });

            return [
                'id' => $workTarget->id,
                'name' => $workTarget->name,
                'unit' => $workTarget->unit,
                'staffs' => $staffs,
                'comparator' => $workTarget->comparator,
                'first_quarter_target' => $workTarget->first_quarter_target,
                'second_quarter_target' => $workTarget->second_quarter_target,
                'third_quarter_target' => $workTarget->third_quarter_target,
                'fourth_quarter_target' => $workTarget->fourth_quarter_target,
            ];
        });

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

        return Inertia::render('work-targets-management/index', [
            'role' => $role,
            'canManageWorkTargets' => $canManageWorkTargets,
            'users' => $users,
            'workTargets' => $workTargets,
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
              'name' => 'required|string|max:255'
          ]);

          $userId = $request->user()->id;

          // Begin a database transaction
          DB::beginTransaction();

          // Create a new work target
          $workTarget = new WorkTarget();
          $workTarget->name = $validatedData['name'];
          $workTarget->user_id = $userId;

          // Save the work target to the database
          $workTarget->save();

          DB::commit();

          return back();
        } catch (\Exception $e) {
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
      $role = $request->route()->getName() === 'dashboard.performance.tpa.show' ? 'tpa' : ( request()->route()->getName() === 'dashboard.performance.kaur.show' ? 'kaur' : null);

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

      return Inertia::render('work-targets-management/show', [
          'role' => $role,
          'workTargets' => $workTargets,
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
                'staffIds' => 'array',
                'unit' => 'required|in:week,total,day,minute',
                'comparator' => 'required|in:eq,lte,gte,gt,lt',
                'first_quarter_target' => 'required|integer',
                'second_quarter_target' => 'required|integer',
                'third_quarter_target' => 'required|integer',
                'fourth_quarter_target' => 'required|integer',
            ]);

            // Begin a database transaction
            DB::beginTransaction();

            // Find the work target by ID
            $workTarget = WorkTarget::findOrFail($id);

            // Update the work target's name
            $workTarget->name = $validatedData['name'];
            $workTarget->unit = $validatedData['unit'];
            $workTarget->comparator = $validatedData['comparator'];
            $workTarget->first_quarter_target = $validatedData['first_quarter_target'];
            $workTarget->second_quarter_target = $validatedData['second_quarter_target'];
            $workTarget->third_quarter_target = $validatedData['third_quarter_target'];
            $workTarget->fourth_quarter_target = $validatedData['fourth_quarter_target'];

            // Save the changes to the database
            $workTarget->save();

            // Delete existing work target values that are not in the request
            $existingStaffIds = $workTarget->workTargetValues()->pluck('user_id')->toArray();
            $staffIdsToDelete = array_diff($existingStaffIds, $validatedData['staffIds']);

            WorkTargetValue::whereIn('user_id', $staffIdsToDelete)
              ->where('work_target_id', $workTarget->id)
              ->delete();

            // Create work target values for each staff that is not already in the database
            foreach ($validatedData['staffIds'] as $staffId) {
                if (!in_array($staffId, $existingStaffIds)) {
                    $workTargetValue = new WorkTargetValue();
                    $workTargetValue->user_id = $staffId;
                    $workTargetValue->work_target_id = $workTarget->id;

                    $workTargetValue->save();
                }
            }

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
            // Find the work target by ID
            $workTarget = WorkTarget::findOrFail($id);

            // Begin a database transaction
            DB::beginTransaction();

            // Delete the work target
            $workTarget->delete();

            // Commit the transaction
            DB::commit();

            return back();
        } catch (\Exception $e) {
            // Rollback the transaction if an error occurs
            DB::rollBack();

            return back();
        }
    }
}
