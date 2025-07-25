<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ActivityController extends Controller
{
    private function getScopedUsers($auth)
    {
        if ($auth->role === 'wadek1') {
            $divisions = ['academic_service', 'laboratory'];
            return User::whereIn('role', ['staf', 'kaur'])
                ->whereIn('division', $divisions)
                ->get();
        }

        if ($auth->role === 'wadek2') {
            $divisions = ['secretary', 'student_affair', 'finance_logistic_resource'];
            return User::whereIn('role', ['staf', 'kaur'])
                ->whereIn('division', $divisions)
                ->get();
        }

        if ($auth->role === 'kaur') {
            return User::where('role', 'staf')
                ->where('division', $auth->division)
                ->get();
        }

        return collect(); // kosongkan jika bukan wadek atau kaur
    }

    public function index(Request $request)
    {
        $user = Auth::user();

        $sortField = $request->get('sort_field', 'start_date');
        $sortOrder = $request->get('sort_order', 'desc');

        $period = $request->query('period');
        $period = $period ? $period : date('Y');

        $activities = Activity::with('user')
            ->where('user_id', $user->id)
            ->when($sortField === 'user', function ($query) use ($sortOrder) {
                $query->join('users', 'activities.user_id', '=', 'users.id')
                    ->orderBy('activities.title', $sortOrder)
                    ->select('activities.*'); // penting untuk menghindari konflik kolom
            }, function ($query) use ($sortField, $sortOrder, $period) {
                $query->orderBy($sortField, $sortOrder)
                    ->whereYear('activities.created_at', $period);
            })
            ->get();

        return Inertia::render('activities/index', [
            'activities' => $activities,
        ]);
    }

    public function wadekIndex(Request $request)
    {
        $user = Auth::user();

        $divisions = $user->role === 'wadek1'
            ? ['academic_service', 'laboratory']
            : ['secretary', 'student_affair', 'finance_logistic_resource'];

        $sortField = $request->get('sort_field', 'start_date');
        $sortOrder = $request->get('sort_order', 'desc');
        $filterUserIds = $request->get('user_ids');

        $staffList = User::where('role', 'staf')
            ->whereIn('division', $divisions)
            ->select('id', 'name')
            ->get();

        $staffIds = $staffList->pluck('id');

        $period = $request->query('period');
        $period = $period ? $period : date('Y');

        $activities = Activity::with('user')
            ->whereHas('user', function ($query) use ($divisions, $filterUserIds) {
                $query->where('role', 'staf')
                    ->whereIn('division', $divisions);

                if (is_array($filterUserIds) && count($filterUserIds) > 0) {
                    $query->whereIn('id', $filterUserIds);
                }
            })
            ->when($sortField === 'user', function ($query) use ($sortOrder) {
                $query->join('users', 'activities.user_id', '=', 'users.id')
                    ->orderBy('users.name', $sortOrder)
                    ->select('activities.*');
            }, function ($query) use ($sortField, $sortOrder, $period) {
                $query->orderBy($sortField, $sortOrder)
                    ->whereYear('activities.created_at', $period);
            })
            ->get();

        return Inertia::render('activities/index', [
            'activities' => $activities,
            'staffList' => $staffList,
        ]);
    }

    public function kaurIndex(Request $request)
    {
        $user = Auth::user();

        $sortField = $request->get('sort_field', 'start_date');
        $sortOrder = $request->get('sort_order', 'desc');
        $filterUserIds = $request->get('user_ids'); // array dari frontend

        // Ambil daftar staf dari divisi yang sama
        $staffList = User::where('role', 'staf')
            ->where('division', $user->division)
            ->select('id', 'name')
            ->get();

        // Query utama untuk data aktivitas
        $period = $request->query('period');
        $period = $period ? $period : date('Y');

        $activities = Activity::with('user')
            ->whereHas('user', function ($query) use ($user, $filterUserIds) {
                $query->where('role', 'staf')
                    ->where('division', $user->division);

                if (is_array($filterUserIds) && count($filterUserIds) > 0) {
                    $query->whereIn('id', $filterUserIds);
                }
            })
            ->when($sortField === 'user', function ($query) use ($sortOrder) {
                // Sort berdasarkan nama user (join ke tabel users)
                $query->join('users', 'activities.user_id', '=', 'users.id')
                    ->orderBy('users.name', $sortOrder)
                    ->select('activities.*');
            }, function ($query) use ($sortField, $sortOrder, $period) {
                // Sort berdasarkan kolom dari tabel activities
                $query->orderBy($sortField, $sortOrder)
                    ->whereYear('activities.created_at', $period);
            })
            ->get();

        return Inertia::render('activities/index', [
            'activities' => $activities,
            'staffList' => $staffList,
        ]);
    }

    public function kaurByWadekIndex(Request $request)
    {
        $auth = Auth::user();

        // Hanya untuk role wadek1 atau wadek2
        if (!in_array($auth->role, ['wadek1', 'wadek2'])) {
            abort(403, 'Unauthorized');
        }

        // Divisi yang diampu berdasarkan peran
        $divisions = $auth->role === 'wadek1'
            ? ['academic_service', 'laboratory']
            : ['secretary', 'student_affair', 'finance_logistic_resource'];

        // Parameter sort & filter dari request
        $sortField = $request->get('sort_field', 'start_date');
        $sortOrder = $request->get('sort_order', 'desc');

        $period = $request->query('period');
        $period = $period ? $period : date('Y');
        $filterUserIds = $request->get('user_ids');

        // Ambil semua user kaur dari divisi yang bersangkutan
        $kaurUsers = User::where('role', 'kaur')
            ->whereIn('division', $divisions)
            ->select('id', 'name')
            ->get();

        // Ambil ID user kaur
        $kaurUserIds = $kaurUsers->pluck('id');

        $activities = Activity::with('user')
            ->whereIn('user_id', $kaurUserIds)
            ->when(is_array($filterUserIds) && count($filterUserIds) > 0, function ($query) use ($filterUserIds) {
                $query->whereIn('user_id', $filterUserIds);
            })
            ->when($sortField === 'user', function ($query) use ($sortOrder) {
                $query->join('users', 'activities.user_id', '=', 'users.id')
                    ->orderBy('users.name', $sortOrder)
                    ->select('activities.*');
            }, function ($query) use ($sortField, $sortOrder, $period) {
                $query->orderBy($sortField, $sortOrder)
                    ->whereYear('activities.created_at', $period);
            })
            ->get();

        return Inertia::render('activities/index', [
            'activities' => $activities,
            'kaurList' => $kaurUsers,
        ]);
    }

    public function create()
    {
        $auth = Auth::user();

        $users = $this->getScopedUsers($auth);

        return Inertia::render('activities/create', [
            'users' => $users,
        ]);
    }

    public function createSelf()
    {
        $auth = Auth::user();

        $users = $this->getScopedUsers($auth);

        return Inertia::render('activities/create-self', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'title' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'method' => 'required|in:Online,Offline',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'file' => 'nullable|file',
                'user_id' => 'required|exists:users,id',
            ]);

            if ($request->hasFile('file')) {
                $data['file'] = $request->file('file')->store('activities', 'public');
            }

            Activity::create($data);
            $user = Auth::user();
            return redirect()->route('activities.index')->with('success', 'Activity created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to create activity: ' . $e->getMessage()]);
        }
    }

    public function edit(Activity $activity)
    {
        $auth = Auth::user();

        $users = $this->getScopedUsers($auth);

        return Inertia::render('activities/edit', [
            'activity' => $activity,
            'users' => $users,
        ]);
    }

    public function editSelf(Activity $activity)
    {
        $auth = Auth::user();

        $users = $this->getScopedUsers($auth);

        return Inertia::render('activities/edit-self', [
            'activity' => $activity,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Activity $activity)
    {
        try {
            $data = $request->validate([
                'title' => 'required|string|max:255',
                'type' => 'required|string|max:255',
                'method' => 'required|in:Online,Offline',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'file' => 'nullable|file',
                'user_id' => 'required|exists:users,id',
            ]);

            if ($request->hasFile('file')) {
                if ($activity->file) {
                    Storage::delete($activity->file);
                }
                $data['file'] = $request->file('file')->store('activities', 'public');
            }

            $activity->update($data);
            $user = Auth::user();
            return redirect()->route('activities.index')->with('success', 'Activity updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update activity: ' . $e->getMessage()]);
        }
    }

    public function destroy(Activity $activity)
    {
        try {
            if ($activity->file) {
                Storage::delete($activity->file);
            }

            $activity->delete();

            return redirect()->back()->with('success', 'Activity deleted.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to delete activity: ' . $e->getMessage()]);
        }
    }
}
