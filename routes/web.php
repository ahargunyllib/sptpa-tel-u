<?php

use App\Http\Controllers\FileController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkTargetController;
use App\Http\Controllers\WorkTargetValueController;
use App\Http\Controllers\TagController;
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
    return Inertia::render('dashboard');
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

    Route::post('/dashboard/e-archive', [FileController::class, 'store'])
        ->name('files.store');
    Route::delete('/dashboard/e-archive/{file}', [FileController::class, 'destroy'])->name('files.destroy');
});

Route::middleware(['auth', 'role:sdm'])->group(function () {
    Route::get('/dashboard/log', [LogController::class, 'index']);
    Route::get('/dashboard/tag', [TagController::class, 'index'])->name('tags.index');
    Route::post('/dashboard/tags', [TagController::class, 'store'])->name('tags.store');
    Route::patch('/dashboard/tags/{tag}', [TagController::class, 'update'])->name('tags.update');
    Route::delete('/dashboard/tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');
});

Route::middleware(['auth', 'role:wadek'])->group(function () {
    Route::get('/dashboard/performance/kaur', [WorkTargetController::class, 'index'])->name('dashboard.performance.kaur');

    Route::get('/dashboard/performance/kaur/{id}', [WorkTargetController::class, 'show'])->name('dashboard.performance.kaur.show');
});

Route::middleware(['auth', 'role:kaur'])->group(function () {
    Route::get('/dashboard/performance/me', [WorkTargetController::class, 'myWorkTargets'])->name('dashboard.performance.me');
    Route::get('/dashboard/performance/me/detail', [WorkTargetValueController::class, 'index'])->name('dashboard.performance.me.index');
    Route::put('/dashboard/performance/me/detail/{id}', [WorkTargetValueController::class, 'update'])->name('dashboard.performance.me.update');
});

Route::middleware(['auth', 'role:kaur,wadek'])->group(function () {
    Route::get('/dashboard/performance/tpa', [WorkTargetController::class, 'index'])->name('dashboard.performance.tpa');

    Route::get('/dashboard/performance/tpa/{id}', [WorkTargetController::class, 'show'])->name('dashboard.performance.tpa.show');

    Route::post('/dashboard/performance/work-target', [WorkTargetController::class, 'store'])->name('dashboard.performance.work-target.store');

    Route::put('/dashboard/performance/work-target/{id}', [WorkTargetController::class, 'update'])->name('dashboard.performance.work-target.update');

    Route::delete('/dashboard/performance/work-target/{id}', [WorkTargetController::class, 'destroy'])->name('dashboard.performance.work-target.destroy');

    Route::put('/dashboard/performance/work-target-value/{id}', [WorkTargetValueController::class, 'updateWorkTargetValueScores'])->name('dashboard.performance.work-target-value.updateWorkTargetValueScores');
});

require __DIR__ . '/auth.php';
