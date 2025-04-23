<?php

namespace App\Http\Controllers;

use App\Models\WorkTargetValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkTargetValueController extends Controller
{
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
    //
  }

  /**
   * Display the specified resource.
   */
  public function show(WorkTargetValue $workTargetValue)
  {
    //
  }

  /**
   * Show the form for editing the specified resource.
   */
  public function edit(WorkTargetValue $workTargetValue)
  {
    //
  }

  /**
   * Update the specified resource in storage.
   */
  public function update(Request $request, String $id)
  {
    //
  }

  /**
   * Update the work target value scores.
   */
  public function updateWorkTargetValueScores(Request $request, String $id)
  {
    try {
      // Validate the request data
      $validatedData = $request->validate([
        'first_quarter_score' => 'required|numeric|min:0|max:100',
        'second_quarter_score' => 'required|numeric|min:0|max:100',
        'third_quarter_score' => 'required|numeric|min:0|max:100',
        'fourth_quarter_score' => 'required|numeric|min:0|max:100',
      ]);

      // Start a database transaction
      DB::beginTransaction();

      // Find the work target value by ID
      $workTargetValue = WorkTargetValue::where('id', $id)->firstOrFail();

      // Update the work target value scores
      $workTargetValue->update([
        'first_quarter_score' => $validatedData['first_quarter_score'],
        'second_quarter_score' => $validatedData['second_quarter_score'],
        'third_quarter_score' => $validatedData['third_quarter_score'],
        'fourth_quarter_score' => $validatedData['fourth_quarter_score'],
      ]);

      // Commit the transaction
      DB::commit();

      // Redirect back with a success message
      return back();
    } catch (\Exception $e) {
      // Rollback the transaction in case of an error
      DB::rollBack();

      // Handle the exception and return an error message
      return back()->with('error', 'Failed to update work target value scores: ' . $e->getMessage());
    }
  }


  /**
   * Remove the specified resource from storage.
   */
  public function destroy(WorkTargetValue $workTargetValue)
  {
    //
  }
}
