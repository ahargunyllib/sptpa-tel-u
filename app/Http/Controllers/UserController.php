<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UserController extends Controller
{
    
    use Log;

    
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $username = $request->input('username', '');
        $division = $request->input('division', '');

        $query = User::query()->orderByDesc('created_at');

        // Filter by username
        if (!empty($username)) {
            $query->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($username) . '%']);
        }

        // Filter by division
        if (!empty($division)) {
            $query->whereRaw('LOWER(division) LIKE ?', ['%' . strtolower($division) . '%']);
        }

        $users = $query->paginate($perPage)->withQueryString();

        // Format pagination metadata
        $paginationMeta = [
            'total_data' => $users->total(),
            'total_page' => $users->lastPage(),
            'page' => $users->currentPage(),
            'limit' => $users->perPage(),
        ];
        

        return Inertia::render('user/index', [
            'users' => [
                'data' => $users->items(),
                'meta' => $paginationMeta,
            ],
            'filters' => [
                'per_page' => $perPage,
                'username' => $username,
                'division' => $division,
            ],
        ]);
    }


    public function create()
    {
        return Inertia::render('user/create');
    }

    // Create a new user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'nip' => 'required|string|unique:users',
            'division' => 'required',
            'role' => 'required',
            'password' => 'required|min:3',
        ]);

        $validated['id'] = Str::uuid();
        $validated['password'] = bcrypt($validated['password']);

        User::create($validated);
        $this->log("Membuat user dengan nama : {$validated['name']}");

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit($id)
    {
        $user = User::findOrFail($id);
        return Inertia::render('User/Edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'nip' => ['required', 'string', Rule::unique('users')->ignore($user->id)],
            'division' => 'required',
            'role' => 'required',
            'password' => 'nullable|min:3',
        ]);

        if ($validated['password']) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        $this->log("Mengubah user dengan ID: {$id}");

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        $this->log("Menghapus user dengan ID: {$id}");

        return redirect()->route('users.index')->with('success', 'User deleted.');
    }
}
