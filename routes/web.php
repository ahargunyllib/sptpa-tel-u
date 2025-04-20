<?php

use App\Http\Controllers\FileController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.updatePhoto');
    Route::delete('/profile/photo', [ProfileController::class, 'deletePhoto'])->name('profile.deletePhoto');
});

Route::middleware(['auth'])->group(function (): void {
    Route::get('/dashboard/e-archive', [FolderController::class, 'index'])
        ->name('folders.index');

    // Route to show a specific folder by ID
    Route::get('/dashboard/e-archive/{folderId}', [FolderController::class, 'show'])
        ->name('folders.show');
});

Route::middleware(['auth', 'role:sdm'])->group(function () {
    Route::get('/dashboard/log', [LogController::class, 'index']);
});

require __DIR__ . '/auth.php';
