<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AdminSetting extends Model
{
    use HasUuids;

    protected $table = 'admin_settings';

    protected $fillable = ['key', 'value'];

    protected $casts = ['value' => 'array'];

    public static function get(string $key, $default = null)
    {
        $row = self::where('key', $key)->first();
        if (!$row) {
            return $default;
        }
        return $row->value ?? $default;
    }

    public static function set(string $key, $value): void
    {
        self::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
}