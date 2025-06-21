<?php

namespace App\Http\Controllers;

use App\Models\UserAttitudeEvaluation;
use App\Models\UserFeedback;
use App\Traits\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\Uid\Ulid;

class UserAttitudeEvaluationController extends Controller
{
    use Log;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function indexMe(Request $request)
    {
        $user = $request->user();

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
                DB::raw('evidence as evidence'),
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
                'evidence' => null
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

        return Inertia::render('my-user-attitude-evaluation/index', [
            'userAttitudeEvaluation' => $userAttitudeEvaluation,
            'userFeedback' => $userFeedback,
        ]);
    }

    public function indexKaur(Request $request)
    {
        $userRole = $request->user()->role;
        $userDivision = $request->user()->division;

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
            DB::raw('user_attitude_evaluations.evidence as evidence'),
        ];

        if ($userRole === 'wadek1' || $userRole === 'wadek2') {
            $selectFields[] = DB::raw("COALESCE(user_feedbacks.wadek_feedback, '-') as note");
        } else if ($userRole === 'kaur') {
            $selectFields[] = DB::raw("COALESCE(user_feedbacks.kaur_feedback, '-') as note");
        }

        $userAttitudeEvaluations = DB::table('users')
            ->where('users.role', 'kaur');
        // ->where('users.division', $userDivision)

        if ($userRole === 'wadek1') {
            $userAttitudeEvaluations = $userAttitudeEvaluations->whereIn(
                'users.division',
                ['academic_service', 'laboratory']
            );
        } else if ($userRole === 'wadek2') {
            $userAttitudeEvaluations = $userAttitudeEvaluations->whereIn(
                'users.division',
                ['secretary', 'student_affair', 'finance_logistic_resource']
            );
        }

        $userAttitudeEvaluations = $userAttitudeEvaluations->leftJoin('user_attitude_evaluations', 'user_attitude_evaluations.user_id', '=', 'users.id')
            ->leftJoin('user_feedbacks', 'user_feedbacks.user_id', '=', 'users.id')
            ->select(...$selectFields)
            ->get();

        foreach ($userAttitudeEvaluations as $userAttitudeEvaluation) {
            $userAttitudeEvaluation->work_targets = DB::table('work_targets')
                ->where('assigned_id', $userAttitudeEvaluation->id)
                ->get();
        }

        return Inertia::render('user-attitude-evaluation-management/index', [
            'role' => 'kaur',
            'userAttitudeEvaluations' => $userAttitudeEvaluations,
        ]);
    }

    public function indexStaf(Request $request)
    {
        $userRole = $request->user()->role;
        $userDivision = $request->user()->division;

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
            DB::raw('user_attitude_evaluations.evidence as evidence'),
        ];

        if ($userRole === 'wadek') {
            $selectFields[] = DB::raw("COALESCE(user_feedbacks.wadek_feedback, '-') as note");
        } else if ($userRole === 'kaur') {
            $selectFields[] = DB::raw("COALESCE(user_feedbacks.kaur_feedback, '-') as note");
        }

        $userAttitudeEvaluations = DB::table('users')
            ->where('users.role', 'staf');

        if ($userRole === 'kaur') {
            $userAttitudeEvaluations = $userAttitudeEvaluations->where('users.division', $userDivision);
        } else if ($userRole === 'wadek1') {
            $userAttitudeEvaluations = $userAttitudeEvaluations->whereIn(
                'users.division',
                ['academic_service', 'laboratory']
            );
        } else if ($userRole === 'wadek2') {
            $userAttitudeEvaluations = $userAttitudeEvaluations->whereIn(
                'users.division',
                ['secretary', 'student_affair', 'finance_logistic_resource']
            );
        }

        $userAttitudeEvaluations = $userAttitudeEvaluations->leftJoin('user_attitude_evaluations', 'user_attitude_evaluations.user_id', '=', 'users.id')
            ->leftJoin('user_feedbacks', 'user_feedbacks.user_id', '=', 'users.id')
            ->select(...$selectFields)
            ->get();

        foreach ($userAttitudeEvaluations as $userAttitudeEvaluation) {
            $userAttitudeEvaluation->work_targets = DB::table('work_targets')
                ->where('assigned_id', $userAttitudeEvaluation->id)
                ->get();
        }

        return Inertia::render('user-attitude-evaluation-management/index', [
            'role' => 'staf',
            'userAttitudeEvaluations' => $userAttitudeEvaluations,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        try {
            $userId = $request->user()->id;

            $validatedData = $request->validate([
                'evidence' => 'required|string|max:255',
            ]);

            $userAttitudeEvaluation = DB::table('user_attitude_evaluations')
                ->where('user_id', $userId)
                ->first();

            if (!$userAttitudeEvaluation) {
                DB::table('user_attitude_evaluations')->insert([
                    'id' => Ulid::generate(),
                    'user_id' => $userId,
                    'evidence' => $validatedData['evidence'],
                ]);
                $this->log("Membuat evaluasi sikap pengguna dengan ID: {$userId}");
                return back()->with('success', 'User attitude evaluation created successfully.');
            }

            $userAttitudeEvaluation->evidance = $validatedData['evidance'];

            $userAttitudeEvaluation->save();
            $this->log("Mengupdate evaluasi sikap pengguna dengan ID: {$userId}");
            return back()->with('success', 'User attitude evaluation updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update user attitude evaluation: ' . $e->getMessage());
        }
    }

    public function updateUserAttitudeEvaluation(Request $request, string $user_id)
    {
        try {
            $validatedData = $request->validate([
                'communication' => 'required|integer|min:0|max:100',
                'teamwork' => 'required|integer|min:0|max:100',
                'collaboration' => 'required|integer|min:0|max:100',
                'solidarity' => 'required|integer|min:0|max:100',
                'work_ethic' => 'required|integer|min:0|max:100',
                'technology_usage' => 'required|integer|min:0|max:100',
                'work_smart' => 'required|integer|min:0|max:100',
                'initiative' => 'required|integer|min:0|max:100',
                'role_model' => 'required|integer|min:0|max:100',
                'responsibility' => 'required|integer|min:0|max:100',
                'professional_ethic' => 'required|integer|min:0|max:100',
                'image_maintenance' => 'required|integer|min:0|max:100',
                'discipline' => 'required|integer|min:0|max:100',
                'note' => 'nullable|string|max:255',
            ]);

            $userAttitudeEvaluation = DB::table('user_attitude_evaluations')
                ->where('user_id', $user_id)
                ->first();

            $userRole = $request->user()->role;

            DB::beginTransaction();

            if (!$userAttitudeEvaluation) {
                DB::table('user_attitude_evaluations')->insert([
                    'id' => Ulid::generate(),
                    'user_id' => $user_id,
                    'communication' => $validatedData['communication'],
                    'teamwork' => $validatedData['teamwork'],
                    'collaboration' => $validatedData['collaboration'],
                    'solidarity' => $validatedData['solidarity'],
                    'work_ethic' => $validatedData['work_ethic'],
                    'technology_usage' => $validatedData['technology_usage'],
                    'work_smart' => $validatedData['work_smart'],
                    'initiative' => $validatedData['initiative'],
                    'role_model' => $validatedData['role_model'],
                    'responsibility' => $validatedData['responsibility'],
                    'professional_ethic' => $validatedData['professional_ethic'],
                    'image_maintenance' => $validatedData['image_maintenance'],
                    'discipline' => $validatedData['discipline'],
                ]);
            } else {
                DB::table('user_attitude_evaluations')
                    ->where('id', $userAttitudeEvaluation->id)
                    ->update([
                        'communication' => $validatedData['communication'],
                        'teamwork' => $validatedData['teamwork'],
                        'collaboration' => $validatedData['collaboration'],
                        'solidarity' => $validatedData['solidarity'],
                        'work_ethic' => $validatedData['work_ethic'],
                        'technology_usage' => $validatedData['technology_usage'],
                        'work_smart' => $validatedData['work_smart'],
                        'initiative' => $validatedData['initiative'],
                        'role_model' => $validatedData['role_model'],
                        'responsibility' => $validatedData['responsibility'],
                        'professional_ethic' => $validatedData['professional_ethic'],
                        'image_maintenance' => $validatedData['image_maintenance'],
                        'discipline' => $validatedData['discipline'],
                    ]);
            }

            $userFeedback = DB::table('user_feedbacks')
                ->where('user_id', $user_id)
                ->first();

            if (!$userFeedback) {
                DB::table('user_feedbacks')->insert([
                    'id' => Ulid::generate(),
                    'user_id' => $user_id,
                    'kaur_feedback' => $userRole === 'kaur' ? $validatedData['note'] : null,
                    'wadek_feedback' => $userRole === 'wadek' ? $validatedData['note'] : null,
                ]);
            } else {
                DB::table('user_feedbacks')
                    ->where('id', $userFeedback->id)
                    ->update([
                        'kaur_feedback' => $userRole === 'kaur' ? $validatedData['note'] : null,
                        'wadek_feedback' => $userRole === 'wadek' ? $validatedData['note'] : null,
                    ]);
            }

            DB::commit();
            $this->log("Mengupdate evaluasi sikap pengguna dengan ID: {$user_id}");
            return back()->with('success', 'User attitude evaluation updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Failed to update user attitude evaluation: ' . $e->getMessage());
        }
    }
}
