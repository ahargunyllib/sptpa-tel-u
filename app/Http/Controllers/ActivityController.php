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
        $activities = Activity::with('user')->latest()->get();

        return Inertia::render('Activities/Index', [
            'activities' => $activities,
        ]);
    }

    public function wadekIndex()
    {
        $user = Auth::user();

        if (!in_array($user->role, ['wadek1', 'wadek2'])) {
            abort(403, 'Unauthorized');
        }

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

        return Inertia::render('Activities/WadekIndex', [
            'activities' => $activities,
        ]);
    }

    public function kaurIndex()
    {
        $user = Auth::user();

        if ($user->role !== 'kaur') {
            abort(403, 'Unauthorized');
        }

        $activities = Activity::with('user')
            ->whereHas('user', function ($query) use ($user) {
                $query->where('role', 'staf')
                    ->where('division', $user->division);
            })
            ->latest()
            ->get();

        return Inertia::render('Activities/KaurIndex', [
            'activities' => $activities,
        ]);
    }

    public function create()
    {
        $auth = Auth::user();

        $users = $this->getScopedUsers($auth);

        return Inertia::render('Activities/Create', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'metode' => 'required|in:Online,Offline',
            'implementation_date' => 'required|date',
            'file_pendukung' => 'nullable|file',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($request->hasFile('file_pendukung')) {
            $data['file_pendukung'] = $request->file('file_pendukung')->store('activities');
        }

        Activity::create($data);

        return redirect()->route('activities.index')->with('success', 'Activity created.');
    }

    public function edit(Activity $activity)
    {
        $auth = Auth::user();

        $users = $this->getScopedUsers($auth);

        return Inertia::render('Activities/Edit', [
            'activity' => $activity,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Activity $activity)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'metode' => 'required|in:Online,Offline',
            'implementation_date' => 'required|date',
            'file_pendukung' => 'nullable|file',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($request->hasFile('file_pendukung')) {
            if ($activity->file_pendukung) {
                Storage::delete($activity->file_pendukung);
            }
            $data['file_pendukung'] = $request->file('file_pendukung')->store('activities');
        }

        $activity->update($data);

        return redirect()->route('activities.index')->with('success', 'Activity updated.');
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
