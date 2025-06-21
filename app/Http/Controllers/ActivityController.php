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


    public function index()
    {
        $user = Auth::user();

        $activities = Activity::with('user')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return Inertia::render('activities/index', [
            'activities' => $activities,
        ]);
    }


    public function wadekIndex()
    {
        $user = Auth::user();


        $divisions = $user->role === 'wadek1'
            ? ['academic_service', 'laboratory']
            : ['secretary', 'student_affair', 'finance_logistic_resource'];

        $activities = Activity::with('user')
            ->whereHas('user', function ($query) use ($divisions) {
                $query->whereIn('role', ['staf', 'kaur'])
                    ->whereIn('division', $divisions);
            })
            ->latest()
            ->get();

        return Inertia::render('activities/index', [
            'activities' => $activities,
        ]);
    }

    public function kaurIndex()
    {
        $user = Auth::user();


        $activities = Activity::with('user')
            ->whereHas('user', function ($query) use ($user) {
                $query->where('role', 'staf')
                    ->where('division', $user->division);
            })
            ->latest()
            ->get();

        return Inertia::render('activities/index', [
            'activities' => $activities,
        ]);
    }

    public function kaurByWadekIndex()
    {
        $auth = Auth::user();

        if (!in_array($auth->role, ['wadek1', 'wadek2'])) {
            abort(403, 'Unauthorized');
        }

        $divisions = $auth->role === 'wadek1'
            ? ['academic_service', 'laboratory']
            : ['secretary', 'student_affair', 'finance_logistic_resource'];

        $kaurUsers = User::where('role', 'kaur')
            ->whereIn('division', $divisions)
            ->pluck('id');

        $activities = Activity::with('user')
            ->whereIn('user_id', $kaurUsers)
            ->latest()
            ->get();

        return Inertia::render('activities/index', [
            'activities' => $activities,
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
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'method' => 'required|in:Online,Offline',
            'implementation_date' => 'required|date',
            'file' => 'nullable|file',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($request->hasFile('file')) {
            $data['file'] = $request->file('file')->store('activities', 'public');
        }

        Activity::create($data);
        $user = Auth::user();
        if ($user->role === 'wadek1' || $user->role === 'wadek2') {
            return redirect()->back()->with('success', 'Activity updated.');
        } else {
            return redirect()->back()->with('success', 'Activity updated.');
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
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'method' => 'required|in:Online,Offline',
            'implementation_date' => 'required|date',
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
        if ($user->role === 'wadek1' || $user->role === 'wadek2') {
            return redirect()->back()->with('success', 'Activity updated.');
        } else {
            return redirect()->back()->with('success', 'Activity updated.');
        }
    }

    public function destroy(Activity $activity)
    {
        if ($activity->file_pendukung) {
            Storage::delete($activity->file_pendukung);
        }

        $activity->delete();

        return redirect()->back()->with('success', 'Activity deleted.');
    }
}
