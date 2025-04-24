<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        // ->with('user')
        // ->when($search, function ($q) use ($search) {
        //     $q->whereHas('user', fn($q) => $q->where('name', 'like', "%{$search}%"))
        //         ->orWhere('title', 'like', "%{$search}%");
        // })
        $query = Tag::query()
            ->when($startDate, function ($q) use ($startDate) {
                $q->whereDate('created_at', '>=', $startDate);
            })
            ->when($endDate, function ($q) use ($endDate) {
                $q->whereDate('created_at', '<=', $endDate);
            })
            ->orderByDesc('created_at');

        $tags = $query->paginate($perPage)->withQueryString();
        $paginationMeta = [
            'total_data' => $tags->total(),
            'total_page' => $tags->lastPage(),
            'page' => $tags->currentPage(),
            'limit' => $tags->perPage(),
        ];
        return Inertia::render('weekly-report/tag/index', [
            'tags' => [
                'data' => $tags->items(),
                'meta' => $paginationMeta,
            ],
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
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
        $validated = $request->validate([
            'name' => 'required|string|min:3',
        ]);

        try {
            Tag::create($validated);
            return redirect()->back()->with('success', 'Tag berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menambahkan tag.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tag $tag)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:3',
        ]);

        try {
            if ($tag->name === $validated['name']) {
                return redirect()->back()->with('info', 'Tidak ada perubahan pada tag.');
            }

            $tag->name = $validated['name'];
            $tag->save();

            return redirect()->back()->with('success', 'Tag berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal memperbarui tag: ' . $e->getMessage());
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag)
    {
        try {
            $tag->delete();
            return redirect()->back()->with('success', 'Tag berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus tag.');
        }
    }
}
