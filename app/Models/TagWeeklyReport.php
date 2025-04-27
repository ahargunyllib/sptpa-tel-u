<?php

namespace App\Models;

use App\Traits\HasUlid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TagWeeklyReport extends Model
{
    use HasUlid;

    protected $fillable = [
        'weekly_report_id',
        'tag_id',
    ];

    public function tags(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }

    public function weeklyReports(): BelongsTo
    {
        return $this->belongsTo(WeeklyReport::class);
    }
}
