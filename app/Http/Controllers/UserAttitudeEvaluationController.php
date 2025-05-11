<?php

namespace App\Http\Controllers;

use App\Models\UserAttitudeEvaluation;
use App\Models\UserFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserAttitudeEvaluationController extends Controller
{
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

        return Inertia::render('my-user-attitude-evaluation/index', [
            'userAttitudeEvaluation' => $userAttitudeEvaluation,
            'userFeedback' => $userFeedback,
        ]);
    }

    public function indexKaur(Request $request)
    {
        $userRole = $request->user()->role;

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
            ->where('users.role', 'kaur')
            ->leftJoin('user_attitude_evaluations', 'user_attitude_evaluations.user_id', '=', 'users.id')
            ->leftJoin('user_feedbacks', 'user_feedbacks.user_id', '=', 'users.id')
            ->select(...$selectFields)
            ->get();

        return Inertia::render('user-attitude-evaluation-management/index', [
            'role' => 'kaur',
            'userAttitudeEvaluations' => $userAttitudeEvaluations,
        ]);
    }

    public function indexStaf(Request $request)
    {
        $userRole = $request->user()->role;

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
            ->where('users.role', 'tpa')
            ->leftJoin('user_attitude_evaluations', 'user_attitude_evaluations.user_id', '=', 'users.id')
            ->leftJoin('user_feedbacks', 'user_feedbacks.user_id', '=', 'users.id')
            ->select(...$selectFields)
            ->get();

        return Inertia::render('user-attitude-evaluation-management/index', [
            'role' => 'kaur',
            'userAttitudeEvaluations' => $userAttitudeEvaluations,
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(UserAttitudeEvaluation $userAttitudeEvaluation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserAttitudeEvaluation $userAttitudeEvaluation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        try {
            $userId = $request->user()->id;

            $validatedData = $request->validate([
                'evidance' => 'required|string|max:255',
            ]);

            $userAttitudeEvaluation = UserAttitudeEvaluation::where('user_id', $userId)->first();

            if (!$userAttitudeEvaluation) {
                $newEvaluation = new UserAttitudeEvaluation();

                $newEvaluation->user_id = $userId;
                $newEvaluation->evidance = $validatedData['evidance'];

                $newEvaluation->save();

                return back()->with('success', 'User attitude evaluation created successfully.');
            }

            $userAttitudeEvaluation->evidance = $validatedData['evidance'];

            $userAttitudeEvaluation->save();

            return back()->with('success', 'User attitude evaluation updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update user attitude evaluation: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserAttitudeEvaluation $userAttitudeEvaluation)
    {
        //
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

            $userAttitudeEvaluation = UserAttitudeEvaluation::where('user_id', $user_id)->first();

            $userRole = $request->user()->role;

            DB::beginTransaction();

            if (!$userAttitudeEvaluation) {
                $newEvaluation = new UserAttitudeEvaluation();

                $newEvaluation->user_id = $user_id;
                $newEvaluation->communication = $validatedData['communication'];
                $newEvaluation->teamwork = $validatedData['teamwork'];
                $newEvaluation->collaboration = $validatedData['collaboration'];
                $newEvaluation->solidarity = $validatedData['solidarity'];
                $newEvaluation->work_ethic = $validatedData['work_ethic'];
                $newEvaluation->technology_usage = $validatedData['technology_usage'];
                $newEvaluation->work_smart = $validatedData['work_smart'];
                $newEvaluation->initiative = $validatedData['initiative'];
                $newEvaluation->role_model = $validatedData['role_model'];
                $newEvaluation->responsibility = $validatedData['responsibility'];
                $newEvaluation->professional_ethic = $validatedData['professional_ethic'];
                $newEvaluation->image_maintenance = $validatedData['image_maintenance'];
                $newEvaluation->discipline = $validatedData['discipline'];

                $newEvaluation->save();
            } else {
                $userAttitudeEvaluation->communication = $validatedData['communication'];
                $userAttitudeEvaluation->teamwork = $validatedData['teamwork'];
                $userAttitudeEvaluation->collaboration = $validatedData['collaboration'];
                $userAttitudeEvaluation->solidarity = $validatedData['solidarity'];
                $userAttitudeEvaluation->work_ethic = $validatedData['work_ethic'];
                $userAttitudeEvaluation->technology_usage = $validatedData['technology_usage'];
                $userAttitudeEvaluation->work_smart = $validatedData['work_smart'];
                $userAttitudeEvaluation->initiative = $validatedData['initiative'];
                $userAttitudeEvaluation->role_model = $validatedData['role_model'];
                $userAttitudeEvaluation->responsibility = $validatedData['responsibility'];
                $userAttitudeEvaluation->professional_ethic = $validatedData['professional_ethic'];
                $userAttitudeEvaluation->image_maintenance = $validatedData['image_maintenance'];
                $userAttitudeEvaluation->discipline = $validatedData['discipline'];

                $userAttitudeEvaluation->save();
            }

            $userFeedback = UserFeedback::where('user_id', $user_id)->first();

            if (!$userFeedback) {
                $userFeedback = new UserFeedback();
                $userFeedback->user_id = $user_id;

                if ($userRole === 'kaur') {
                    $userFeedback->kaur_feedback = $validatedData['note'];
                } elseif ($userRole === 'wadek') {
                    $userFeedback->wadek_feedback = $validatedData['note'];
                }

                $userFeedback->save();
            } else {
                if ($userRole === 'kaur') {
                    $userFeedback->kaur_feedback = $validatedData['note'];
                } elseif ($userRole === 'wadek') {
                    $userFeedback->wadek_feedback = $validatedData['note'];
                }

                $userFeedback->save();
            }

            DB::commit();

            return back()->with('success', 'User attitude evaluation updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('error', 'Failed to update user attitude evaluation: ' . $e->getMessage());
        }
    }
}
