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
        $folderId = null;

        if (!$folderId) {
            $folder = Folder::where('user_id', $user->id)
                ->where('type', 'user')
                ->first();

            if (!$folder) {
                return response()->json([
                    'error' => 'Root folder not found'
                ], 404);
            }

            $folderId = $folder->id;
        } else {
            $folder = Folder::where('id', $folderId)
                ->where('user_id', $user->id)
                ->first();

            if (!$folder) {
                return response()->json([
                    'error' => 'Folder not found or access denied'
                ], 404);
            }
        }

        $subfolders = Folder::where('parent_id', $folderId)
            ->where('user_id', $user->id)
            ->get();

        $files = File::where('folder_id', $folderId)
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

        if (!$folderId) {
            // Ambil root folder milik user
            $folder = Folder::where('user_id', $user->id)
                ->where('type', 'user')
                ->first();

            if (!$folder) {
                return response()->json([
                    'error' => 'Root folder not found'
                ], 404);
            }

            $folderId = $folder->id;
        } else {
            // Ambil folder berdasarkan id dan user
            $folder = Folder::where('id', $folderId)
                ->where('user_id', $user->id)
                ->first();

            if (!$folder) {
                return response()->json([
                    'error' => 'Folder not found or access denied'
                ], 404);
            }
        }

        $subfolders = Folder::where('parent_id', $folderId)
            ->where('user_id', $user->id)
            ->get();

        $files = File::where('folder_id', $folderId)
            ->where('user_id', $user->id)
            ->get();

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
