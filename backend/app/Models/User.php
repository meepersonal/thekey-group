<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\PersonalAccessToken;

class User extends Authenticatable
{
    use HasApiTokens, HasUuids;

    public const ROLES = ['admin', 'manager', 'customer'];

    /** Rôles autorisés à recevoir les notifications internes (rendez-vous, précommandes…). */
    public const NOTIFIED_ROLES = ['admin', 'manager'];

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'role',
        'is_blocked',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'blocked_at' => 'datetime',
        'password' => 'hashed',
        'is_admin' => 'boolean',
        'is_blocked' => 'boolean',
    ];

    public function scopeAdmin($query)
    {
        return $query->where('is_admin', true);
    }

    public function scopeNotified($query)
    {
        return $query->whereIn('role', self::NOTIFIED_ROLES);
    }

    /**
     * Adresses e-mail des utilisateurs autorisés à recevoir les notifications internes.
     *
     * @return array<int, string>
     */
    public static function notificationEmails(): array
    {
        return self::query()
            ->notified()
            ->whereNotNull('email')
            ->pluck('email')
            ->unique()
            ->values()
            ->all();
    }

    public function isAdmin(): bool
    {
        return (bool) $this->is_admin;
    }

    public function isBlocked(): bool
    {
        return (bool) $this->is_blocked;
    }

    public function block(): void
    {
        $this->forceFill([
            'is_blocked' => true,
            'blocked_at' => now(),
        ])->save();

        $this->tokens()->delete();
    }

    public function unblock(): void
    {
        $this->forceFill([
            'is_blocked' => false,
            'blocked_at' => null,
        ])->save();
    }

    public function toArrayForApi(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'is_admin' => (bool) $this->is_admin,
            'role' => $this->role,
            'is_blocked' => (bool) $this->is_blocked,
            'blocked_at' => $this->blocked_at?->toIso8601String(),
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}