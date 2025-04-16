<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasUlid
{
  /**
   * Boot function from Laravel.
   */
  protected static function bootHasUlid()
  {
    static::creating(function ($model) {
      if (empty($model->{$model->getKeyName()})) {
        $model->{$model->getKeyName()} = (string) Str::ulid();
      }
    });
  }

  /**
   * Get the value indicating whether the IDs are incrementing.
   *
   * @return bool
   */
  public function getIncrementing()
  {
    return false;
  }

  /**
   * Get the auto-incrementing key type.
   *
   * @return string
   */
  public function getKeyType()
  {
    return 'string';
  }
}
