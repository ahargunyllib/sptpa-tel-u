<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Folder;
use App\Traits\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FileController extends Controller
{

    use Log;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|max:10240', // Max 10MB
                'folder_id' => 'required|exists:folders,id',
            ]);

            if ($validator->fails()) {
                redirect()->back()->with('error', 'File Format not supported.');
            }

            $folder = Folder::where('id', $request->folder_id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$folder) {
                redirect()->back()->with('error', 'Folder not found.');
            }

            $uploadedFile = $request->file('file');
            $fileName = $uploadedFile->getClientOriginalName();
            $fileType = $uploadedFile->getMimeType();
            $fileSize = $uploadedFile->getSize();

            $path = $uploadedFile->store('files/' . Auth::id(), 'public');

            $thumbnail = null;
            if (str_starts_with($fileType, 'image/')) {
            }

            $file = File::create([
                'name' => $fileName,
                'type' => $fileType,
                'size' => $fileSize,
                'path' => $path,
                'thumbnail' => $thumbnail,
                'folder_id' => $request->folder_id,
                'user_id' => Auth::id(),
            ]);
            $this->log("Mengunggah file dengan nama: {$fileName} ke folder: {$folder->name}");
            return redirect()->back()->with('success', 'File berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'File gagal ditambahkan.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(File $file)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(File $file)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, File $file)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(File $file)
    {
        try {
            // Find the file
            $file = File::where('id', $file->id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$file) {
                return redirect()->back()->with('error', 'File not found');
            }

            if (Storage::disk('public')->exists($file->path)) {
                Storage::disk('public')->delete($file->path);
            }

            if ($file->thumbnail && Storage::disk('public')->exists($file->thumbnail)) {
                Storage::disk('public')->delete($file->thumbnail);
            }

            $file->delete();

            $this->log("Menghapus file dengan nama: {$file->name}");
            return redirect()->back()->with('success', 'File deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'File gagal ditambahkan.');
        }
    }


    public function rubrikasiIndex()
    {
        $file = File::whereHas('folder', function ($query) {
            $query->where('name', 'Rubrikasi');
        })->first();

        $rubrikasiUrl = $file ? Storage::url($file->path) : null;

        return Inertia::render('rubrik/index', [
            'rubrikasi' => $rubrikasiUrl,
        ]);
    }

    public function panduanIndex()
    {
        $file = File::whereHas('folder', function ($query) {
            $query->where('name', 'Panduan');
        })->first();

        $panduanUrl = $file ? Storage::url($file->path) : null;

        return Inertia::render('panduan/index', [
            'panduan' => $panduanUrl,
        ]);
    }


    public function getSidebarLinkFile()
    {
        $file = File::whereHas('folder', function ($query) {
            $query->where('name', 'Rubrikasi');
        })->first();

        $file = File::whereHas('folder', function ($query) {
            $query->where('name', 'Panduan');
        })->first();

        $panduanUrl = $file ? Storage::url($file->path) : null;

        $rubrikasiUrl = $file ? Storage::url($file->path) : null;
    }


    public function rubrikasiUpload(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|max:10240',
            ]);

            if ($validator->fails()) {
                return redirect()->back()->with('error', 'Format file tidak sesuai.');
            }

            $folder = Folder::firstOrCreate(
                ['name' => 'Rubrikasi', 'user_id' => Auth::id()],
                ['parent_id' => null]
            );

            $uploadedFile = $request->file('file');
            $fileName = $uploadedFile->getClientOriginalName();
            $fileType = $uploadedFile->getMimeType();
            $fileSize = $uploadedFile->getSize();
            $path = $uploadedFile->store('files/' . Auth::id(), 'public');

            $thumbnail = null;
            if (str_starts_with($fileType, 'image/')) {
            }

            $existingFile = File::where('folder_id', $folder->id)
                ->where('user_id', Auth::id())
                ->first();

            if ($existingFile) {
                if (Storage::disk('public')->exists($existingFile->path)) {
                    Storage::disk('public')->delete($existingFile->path);
                }
                if ($existingFile->thumbnail && Storage::disk('public')->exists($existingFile->thumbnail)) {
                    Storage::disk('public')->delete($existingFile->thumbnail);
                }

                $existingFile->update([
                    'name' => $fileName,
                    'type' => $fileType,
                    'size' => $fileSize,
                    'path' => $path,
                    'thumbnail' => $thumbnail,
                ]);

                return redirect()->back()->with('success', 'File rubrikasi berhasil diperbarui.');
            } else {
                File::create([
                    'name' => $fileName,
                    'type' => $fileType,
                    'size' => $fileSize,
                    'path' => $path,
                    'thumbnail' => $thumbnail,
                    'folder_id' => $folder->id,
                    'user_id' => Auth::id(),
                ]);
                $this->log("Mengunggah file rubrikasi dengan nama: {$fileName}");
                return redirect()->back()->with('success', 'File rubrikasi berhasil ditambahkan.');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengunggah file rubrikasi.');
        }
    }

    public function rubrikasiApi(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|max:10240',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Format file tidak sesuai.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $folder = Folder::firstOrCreate(
                ['name' => 'Rubrikasi', 'user_id' => Auth::id()],
                [
                    'parent_id' => null,
                    'type' => 'rubrik',
                ]
            );

            $uploadedFile = $request->file('file');
            $fileName = $uploadedFile->getClientOriginalName();
            $fileType = $uploadedFile->getMimeType();
            $fileSize = $uploadedFile->getSize();
            $path = $uploadedFile->store('files/' . Auth::id(), 'public');

            $thumbnail = null;
            if (str_starts_with($fileType, 'image/')) {
                // Tambahkan logika pembuatan thumbnail di sini jika diperlukan
            }

            $existingFile = File::where('folder_id', $folder->id)
                ->where('user_id', Auth::id())
                ->first();

            if ($existingFile) {
                if (Storage::disk('public')->exists($existingFile->path)) {
                    Storage::disk('public')->delete($existingFile->path);
                }
                if ($existingFile->thumbnail && Storage::disk('public')->exists($existingFile->thumbnail)) {
                    Storage::disk('public')->delete($existingFile->thumbnail);
                }

                $existingFile->update([
                    'name' => $fileName,
                    'type' => $fileType,
                    'size' => $fileSize,
                    'path' => $path,
                    'thumbnail' => $thumbnail,
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'File rubrikasi berhasil diperbarui.',
                    'file' => $existingFile,
                ]);
            } else {
                $newFile = File::create([
                    'name' => $fileName,
                    'type' => $fileType,
                    'size' => $fileSize,
                    'path' => $path,
                    'thumbnail' => $thumbnail,
                    'folder_id' => $folder->id,
                    'user_id' => Auth::id(),
                ]);

                $this->log("Mengunggah file rubrikasi dengan nama: {$fileName}");

                return response()->json([
                    'status' => 'success',
                    'message' => 'File rubrikasi berhasil ditambahkan.',
                    'file' => $newFile,
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengunggah file rubrikasi.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }




    public function panduanUpload(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|max:10240',
            ]);

            if ($validator->fails()) {
                return redirect()->back()->with('error', 'Format file tidak sesuai.');
            }

            $folder = Folder::firstOrCreate(
                ['name' => 'Panduan', 'user_id' => Auth::id()],
                [
                    'parent_id' => null,
                    'type' => 'panduan',
                ]
            );


            $uploadedFile = $request->file('file');
            $fileName = $uploadedFile->getClientOriginalName();
            $fileType = $uploadedFile->getMimeType();
            $fileSize = $uploadedFile->getSize();
            $path = $uploadedFile->store('files/' . Auth::id(), 'public');

            $thumbnail = null;
            if (str_starts_with($fileType, 'image/')) {
            }

            $existingFile = File::where('folder_id', $folder->id)
                ->where('user_id', Auth::id())
                ->first();

            if ($existingFile) {
                if (Storage::disk('public')->exists($existingFile->path)) {
                    Storage::disk('public')->delete($existingFile->path);
                }
                if ($existingFile->thumbnail && Storage::disk('public')->exists($existingFile->thumbnail)) {
                    Storage::disk('public')->delete($existingFile->thumbnail);
                }

                $existingFile->update([
                    'name' => $fileName,
                    'type' => $fileType,
                    'size' => $fileSize,
                    'path' => $path,
                    'thumbnail' => $thumbnail,
                ]);
                $this->log("Mengunggah file panduan dengan nama: {$fileName}");
                return redirect()->back()->with('success', 'File panduan berhasil diperbarui.');
            } else {
                File::create([
                    'name' => $fileName,
                    'type' => $fileType,
                    'size' => $fileSize,
                    'path' => $path,
                    'thumbnail' => $thumbnail,
                    'folder_id' => $folder->id,
                    'user_id' => Auth::id(),
                ]);
                $this->log("Mengunggah file panduan dengan nama: {$fileName}");
                return redirect()->back()->with('success', 'File panduan berhasil ditambahkan.');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal mengunggah file panduan.');
        }
    }

    public function panduanApi(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|max:10240',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Format file tidak sesuai.',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $folder = Folder::firstOrCreate(
                ['name' => 'Panduan', 'user_id' => Auth::id()],
                [
                    'parent_id' => null,
                    'type' => 'panduan',
                ]
            );

            $uploadedFile = $request->file('file');
            $fileName = $uploadedFile->getClientOriginalName();
            $fileType = $uploadedFile->getMimeType();
            $fileSize = $uploadedFile->getSize();
            $path = $uploadedFile->store('files/' . Auth::id(), 'public');

            $thumbnail = null;
            if (str_starts_with($fileType, 'image/')) {
                // Logic thumbnail kalau perlu
            }

            $existingFile = File::where('folder_id', $folder->id)
                ->where('user_id', Auth::id())
                ->first();

            if ($existingFile) {
                if (Storage::disk('public')->exists($existingFile->path)) {
                    Storage::disk('public')->delete($existingFile->path);
                }
                if ($existingFile->thumbnail && Storage::disk('public')->exists($existingFile->thumbnail)) {
                    Storage::disk('public')->delete($existingFile->thumbnail);
                }

                $existingFile->update([
                    'name' => $fileName,
                    'type' => $fileType,
                    'size' => $fileSize,
                    'path' => $path,
                    'thumbnail' => $thumbnail,
                ]);

                $this->log("Mengunggah file panduan dengan nama: {$fileName}");

                return response()->json([
                    'status' => 'success',
                    'message' => 'File panduan berhasil diperbarui.',
                    'file' => $existingFile,
                ]);
            } else {
                $newFile = File::create([
                    'name' => $fileName,
                    'type' => $fileType,
                    'size' => $fileSize,
                    'path' => $path,
                    'thumbnail' => $thumbnail,
                    'folder_id' => $folder->id,
                    'user_id' => Auth::id(),
                ]);

                $this->log("Mengunggah file panduan dengan nama: {$fileName}");

                return response()->json([
                    'status' => 'success',
                    'message' => 'File panduan berhasil ditambahkan.',
                    'file' => $newFile,
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengunggah file panduan.',
                'error' => $e->getMessage(), // opsional, bisa dihapus di production
            ], 500);
        }
    }


    public function rubrikasiShow()
    {
        $file = File::whereHas('folder', function ($query) {
            $query->where('name', 'Rubrikasi');
        })->first();

        $rubrikasiUrl = $file ? Storage::url($file->path) : null;

        return Inertia::render('rubrik/show', [
            'rubrikasi' => $rubrikasiUrl,
        ]);
    }

    public function panduanShow()
    {
        $file = File::whereHas('folder', function ($query) {
            $query->where('name', 'Panduan');
        })->first();

        $panduanUrl = $file ? Storage::url($file->path) : null;

        return Inertia::render('panduan/show', [
            'panduan' => $panduanUrl,
        ]);
    }
}
