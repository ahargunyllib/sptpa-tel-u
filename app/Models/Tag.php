<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasUlids;

    protected $fillable = ['name'];

    public function weeklyReports(): BelongsToMany
    {
        return $this->belongsToMany(WeeklyReport::class, 'tag_weekly_reports', 'tag_id', 'weekly_report_id')
            ->withTimestamps();
    }
}
