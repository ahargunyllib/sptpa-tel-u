<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWeeklyReportRequest;
use App\Http\Requests\UpdateWeeklyReportRequest;
use App\Models\Tag;
use App\Models\TagWeeklyReport;
use App\Models\WeeklyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WeeklyReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $search = request('search');
        $perPage = request('per_page', 9999);
        $startDate = request('start_date');
        $endDate = request('end_date');
        $tagIds = request('tag_ids'); 

        $weeklyReportsQuery = WeeklyReport::with('tags', 'user')
            ->when($search, function ($query, $search) {
                $query->where('content', 'like', "%{$search}%");
            })
            ->when($startDate && $endDate, function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->when($tagIds, function ($query) use ($tagIds) {
                $tagIds = is_array($tagIds) ? $tagIds : explode(',', $tagIds);
                $query->whereHas('tags', function ($q) use ($tagIds) {
                    $q->whereIn('tags.id', $tagIds);
                });
            });

        $weeklyReports = $weeklyReportsQuery->paginate($perPage);
        $tags = Tag::all();
        $paginationMeta = [
            'current_page' => $weeklyReports->currentPage(),
            'last_page' => $weeklyReports->lastPage(),
            'per_page' => $weeklyReports->perPage(),
            'total' => $weeklyReports->total(),
        ];

        return Inertia::render('weekly-report/index', [
            'weeklyReports' => [
                'data' => $weeklyReports->items(),
                'meta' => $paginationMeta,
            ],
            'tags' => $tags,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'tag_ids' => $tagIds ? (is_array($tagIds) ? $tagIds : explode(',', $tagIds)) : [],
            ],
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

    public function store(StoreWeeklyReportRequest $request)
    {
        DB::beginTransaction();
        try {
            $report = WeeklyReport::create([
                'content' => $request->report,
                'user_id' => auth()->id(),
            ]);
            foreach ($request->tags as $tagId) {
                TagWeeklyReport::create([
                    'tag_id' => $tagId,
                    'weekly_report_id' => $report->id,
                ]);
            }
            DB::commit();

            return redirect()->back()->with('success', 'Weekly report created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to create weekly report: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(WeeklyReport $weeklyReport)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WeeklyReport $weeklyReport)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWeeklyReportRequest $request, WeeklyReport $weeklyReport)
    {
        DB::beginTransaction();
        try {
            $weeklyReport->update([
                'content' => $request->report,
            ]);

            TagWeeklyReport::where('weekly_report_id', $weeklyReport->id)->delete();

            foreach ($request->tags as $tagId) {
                TagWeeklyReport::create([
                    'tag_id' => $tagId,
                    'weekly_report_id' => $weeklyReport->id,
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Weekly report updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to update weekly report: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WeeklyReport $weeklyReport)
    {
        DB::beginTransaction();
        try {
            TagWeeklyReport::where('weekly_report_id', $weeklyReport->id)->delete();

            $weeklyReport->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Weekly report deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to delete weekly report: ' . $e->getMessage());
        }
    }
}
