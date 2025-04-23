<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $role = $user->role;

        if ($role === 'wadek') {
            // Wadek bisa lihat semua folder user
            $subfolders = Folder::where('type', 'user')->get();

            return Inertia::render('e-archive/index', [
                'currentFolder' => null,
                'breadcrumbs' => [],
                'subfolders' => $subfolders,
                'files' => []
            ]);
        }

        if ($role === 'kaur') {
            // Kaur bisa lihat semua folder user dalam satu divisi
            $subfolders = Folder::where('type', 'user')
                ->whereHas('user', function ($query) use ($user) {
                    $query->where('division', $user->division);
                })
                ->get();

            return Inertia::render('e-archive/index', [
                'currentFolder' => null,
                'breadcrumbs' => [],
                'subfolders' => $subfolders,
                'files' => []
            ]);
        }

        // Default: role biasa, lihat folder sendiri
        $folder = Folder::where('user_id', $user->id)
            ->where('type', 'user')
            ->first();

        if (!$folder) {
            return response()->json([
                'error' => 'Root folder not found'
            ], 404);
        }

        $subfolders = Folder::where('parent_id', $folder->id)
            ->where('user_id', $user->id)
            ->get();

        $files = File::where('folder_id', $folder->id)
            ->where('user_id', $user->id)
            ->get();

        $breadcrumbs = $this->getBreadcrumbs($folder);

        return Inertia::render('e-archive/index', [
            'currentFolder' => $folder,
            'breadcrumbs' => $breadcrumbs,
            'subfolders' => $subfolders,
            'files' => $files
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
    public function show(Request $request, $folderId = null)
    {
        $user = Auth::user();
        $role = $user->role;

        if (!$folderId) {
            return response()->json([
                'error' => 'Folder ID is required'
            ], 400);
        }

        $folder = Folder::find($folderId);

        if (!$folder) {
            return response()->json([
                'error' => 'Folder not found'
            ], 404);
        }

        // Cek akses berdasarkan role
        if ($role === 'wadek') {
            // Wadek bisa akses semua folder
        } elseif ($role === 'kaur') {
            // Kaur hanya bisa akses folder user satu divisi
            if ($folder->user->division !== $user->division) {
                return response()->json([
                    'error' => 'Access denied'
                ], 403);
            }
        } else {
            // User biasa hanya bisa akses folder sendiri
            if ($folder->user_id !== $user->id) {
                return response()->json([
                    'error' => 'Access denied'
                ], 403);
            }
        }

        $subfolders = Folder::where('parent_id', $folder->id)->get();
        $files = File::where('folder_id', $folder->id)->get();
        $breadcrumbs = $this->getBreadcrumbs($folder);

        return Inertia::render('e-archive/show', [
            'currentFolder' => $folder,
            'breadcrumbs' => $breadcrumbs,
            'subfolders' => $subfolders,
            'files' => $files
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Folder $folder)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Folder $folder)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        //
    }

    private function getBreadcrumbs(Folder $folder)
    {
        $breadcrumbs = [];
        $current = $folder;

        // Add the current folder
        $breadcrumbs[] = [
            'id' => $current->id,
            'name' => $current->name,
            'type' => $current->type
        ];

        // Add parent folders in reverse order (will be reversed at the end)
        while ($current->parent_id) {
            $current = Folder::find($current->parent_id);
            if (!$current) break;

            $breadcrumbs[] = [
                'id' => $current->id,
                'name' => $current->name,
                'type' => $current->type
            ];
        }

        // Reverse the array to get the correct order (root → current)
        return array_reverse($breadcrumbs);
    }
}
