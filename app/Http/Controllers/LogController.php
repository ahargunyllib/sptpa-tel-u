<?php

namespace App\Http\Controllers;

use App\Models\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LogController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $username = $request->input('username', '');
        $description = $request->input('description', '');
        $startDate = $request->input('start_date', '');
        $endDate = $request->input('end_date', '');

        $query = Log::with('user')->orderByDesc('created_at');

        // Filter by username
        if (!empty($username)) {
            $query->whereHas('user', function ($q) use ($username) {
                $q->where('name', 'like', "%{$username}%");
            $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($username) . '%']);
        });
        }

        // Filter by description
        if (!empty($description)) {
            $query->whereRaw('LOWER(description) LIKE ?', ['%' . strtolower($description) . '%']);
        }

        // Filter by date range
        if (!empty($startDate)) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if (!empty($endDate)) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        $logs = $query->paginate($perPage)->withQueryString();

        // Format pagination metadata to match our component's expected structure
        $paginationMeta = [
            'total_data' => $logs->total(),
            'total_page' => $logs->lastPage(),
            'page' => $logs->currentPage(),
            'limit' => $logs->perPage(),
        ];

        return Inertia::render('logs/index', [
            'logs' => [
                'data' => $logs->items(),
                'meta' => $paginationMeta,
            ],
            'filters' => [
                'per_page' => $perPage,
                'username' => $username,
                'description' => $description,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }
}
