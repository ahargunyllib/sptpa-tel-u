<?php

use App\Http\Controllers\FileController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserAttitudeEvaluationController;
use App\Http\Controllers\WorkTargetController;
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

    Route::get('/dashboard/e-archive/{folderId}', [FolderController::class, 'show'])
        ->name('folders.show');

    Route::post('/dashboard/e-archive', [FileController::class, 'store'])
        ->name('files.store');
    Route::delete('/dashboard/e-archive/{file}', [FileController::class, 'destroy'])->name('files.destroy');
    // Route::get('/dashboard/weekly-report', [WeeklyReportController::class, 'index'])->name('weekly-report.index');
    // Route::post('/dashboard/weekly-report', [WeeklyReportController::class, 'store'])->name('weekly-report.store');
    // Route::put('/dashboard/weekly-report/{weeklyReport}', [WeeklyReportController::class, 'update'])->name('weekly-report.update');
    // Route::delete('/dashboard/weekly-report/{weeklyReport}', [WeeklyReportController::class, 'destroy'])->name('weekly-report.destroy');

});

Route::middleware(['auth', 'role:sdm'])->group(function () {
    Route::get('/dashboard/log', [LogController::class, 'index']);
    // Route::get('/dashboard/tag', [TagController::class, 'index'])->name('tags.index');
    // Route::post('/dashboard/tags', [TagController::class, 'store'])->name('tags.store');
    // Route::patch('/dashboard/tags/{tag}', [TagController::class, 'update'])->name('tags.update');
    // Route::delete('/dashboard/tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');
});

Route::middleware(['auth', 'role:wadek'])->group(function () {
    Route::get('/dashboard/work-target/kaur', [WorkTargetController::class, 'indexKaur'])->name('dashboard.work-target.kaur');

    Route::get('/dashboard/user-attitude-evaluation/kaur', [UserAttitudeEvaluationController::class, 'indexKaur'])->name('dashboard.user-attitude-evaluation.kaur');

    Route::get(
        '/dashboard/work-report/kaur',
        [WorkTargetController::class, 'indexKaur'] // TODO:
    )->name('dashboard.work-report.kaur');

    // Route::get('/dashboard/performance/kaur/{id}', [WorkTargetController::class, 'show'])->name('dashboard.performance.kaur.show');
});

Route::middleware(['auth', 'role:kaur,staf'])->group(function () {
    Route::get('/dashboard/work-target/me', [WorkTargetController::class, 'indexMe'])->name('dashboard.work-target.me');
    Route::post('/dashboard/work-target/{id}/submit', [WorkTargetController::class, 'submit'])->name('dashboard.work-target.submit');

    Route::get('/dashboard/user-attitude-evaluation/me', [UserAttitudeEvaluationController::class, 'indexMe'])->name('dashboard.user-attitude-evaluation.me');

    Route::get(
        '/dashboard/work-report/me',
        [WorkTargetController::class, 'indexMe'] // TODO:
    )->name('dashboard.work-report.me');

    // Route::get('/dashboard/performance/me', [WorkTargetController::class, 'myWorkTargets'])->name('dashboard.performance.me');
    // Route::get('/dashboard/performance/me/detail', [WorkTargetValueController::class, 'index'])->name('dashboard.performance.me.index');
    // Route::put('/dashboard/performance/me/detail/{id}', [WorkTargetValueController::class, 'update'])->name('dashboard.performance.me.update');
    Route::put('/dashboard/user-attitude-evaluation/me', [UserAttitudeEvaluationController::class, 'update'])->name('dashboard.performance.me.user-attitude-evaluation.update');
});

Route::middleware(['auth', 'role:kaur,wadek'])->group(function () {
    Route::post('/dashboard/work-target', [WorkTargetController::class, 'store'])->name('dashboard.work-target.store');
    Route::put('/dashboard/work-target/{id}', [WorkTargetController::class, 'update'])->name('dashboard.work-target.update');
    Route::post('/dashboard/work-target/{id}/assess', [WorkTargetController::class, 'assess'])->name('dashboard.work-target.assess');
    Route::delete('/dashboard/work-target/{id}', [WorkTargetController::class, 'destroy'])->name('dashboard.work-target.destroy');

    Route::get('/dashboard/work-target/staf', [WorkTargetController::class, 'indexStaf'])->name('dashboard.work-target.staf');

    Route::get('/dashboard/user-attitude-evaluation/staf', [UserAttitudeEvaluationController::class, 'indexStaf'])->name('dashboard.user-attitude-evaluation.staf');

    Route::get(
        '/dashboard/work-report/staf',
        [WorkTargetController::class, 'indexStaf'] // TODO:
    )->name('dashboard.work-report.staf');

    // Route::get('/dashboard/performance/tpa', [WorkTargetController::class, 'index'])->name('dashboard.performance.tpa');

    // Route::get('/dashboard/performance/tpa/{id}', [WorkTargetController::class, 'show'])->name('dashboard.performance.tpa.show');

    // Route::post('/dashboard/performance/work-target', [WorkTargetController::class, 'store'])->name('dashboard.performance.work-target.store');

    // Route::put('/dashboard/performance/work-target/{id}', [WorkTargetController::class, 'update'])->name('dashboard.performance.work-target.update');

    // Route::delete('/dashboard/performance/work-target/{id}', [WorkTargetController::class, 'destroy'])->name('dashboard.performance.work-target.destroy');

    // Route::put('/dashboard/performance/work-target-value/{id}', [WorkTargetValueController::class, 'updateWorkTargetValueScores'])->name('dashboard.performance.work-target-value.updateWorkTargetValueScores');

    Route::put('/dashboard/user-attitude-evaluation/{user_id}', [UserAttitudeEvaluationController::class, 'updateUserAttitudeEvaluation'])->name('dashboard.performance.user-attitude-evaluation.updateUserAttitudeEvaluation');
});

require __DIR__ . '/auth.php';
