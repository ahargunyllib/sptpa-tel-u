<?php

namespace App\Traits;

use App\Models\Log as ModelsLog;
use Illuminate\Support\Facades\Auth;

trait Log
{
  public function log($description = null)
  {
    ModelsLog::create([
      'user_id' => Auth::id(),
      'description' => $description,
      'ip_address' => request()->ip() ?? 'system',
    ]);
  }
}
