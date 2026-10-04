<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Mail\AccountCreatedMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'role' => 'nullable|string',
            'status' => 'nullable|in:active,blocked',
            'per_page' => 'nullable|integer|min:1|max:100',
            'page' => 'nullable|integer|min:1',
        ]);

        $query = User::query()
            ->when($validated['search'] ?? null, function ($q, $term) {
                $q->where(function ($sub) use ($term) {
                    $sub->where('name', 'like', "%{$term}%")
                        ->orWhere('email', 'like', "%{$term}%");
                });
            })
            ->when($validated['role'] ?? null, fn ($q, $role) => $q->where('role', $role))
            ->when(($validated['status'] ?? null) === 'blocked', fn ($q) => $q->where('is_blocked', true))
            ->when(($validated['status'] ?? null) === 'active', fn ($q) => $q->where('is_blocked', false));

        $perPage = (int) ($validated['per_page'] ?? 20);
        $page = (int) ($validated['page'] ?? 1);
        $paginated = $query->orderBy('id')->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => collect($paginated->items())->map(fn ($u) => $u->toArrayForApi()),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150|unique:users,email',
            'password' => 'required|string|min:8|max:100',
            'role' => 'nullable|string|in:' . implode(',', User::ROLES),
            'is_admin' => 'nullable|boolean',
            'send_credentials' => 'nullable|boolean',
        ]);

        $role = $validated['role'] ?? 'customer';
        $isAdmin = (bool) ($validated['is_admin'] ?? false) || $role === 'admin';

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $isAdmin ? 'admin' : $role,
            'is_admin' => $isAdmin,
        ]);

        $shouldSend = $request->boolean('send_credentials', false);
        $credentialsSent = $shouldSend && $this->sendCredentials($user, $validated['password'], $request->user());

        return response()->json([
            'data' => $user->toArrayForApi(),
            'credentials_sent' => $credentialsSent,
        ], 201);
    }

    /**
     * Envoie les identifiants du nouveau compte à son adresse e-mail.
     */
    private function sendCredentials(User $user, string $plainPassword, ?User $createdBy): bool
    {
        try {
            Mail::to($user->email)->send(
                new AccountCreatedMail($user, $plainPassword, $createdBy?->name)
            );

            Log::info('Identifiants envoyés', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            return true;
        } catch (\Throwable $e) {
            Log::error('Échec de l\'envoi des identifiants : '.$e->getMessage(), [
                'user_id' => $user->id,
            ]);

            return false;
        }
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => [
                'sometimes',
                'email',
                'max:150',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8|max:100',
            'role' => 'nullable|string|in:' . implode(',', User::ROLES),
            'is_admin' => 'nullable|boolean',
        ]);

        $isSelf = $request->user()?->id === $user->id;

        if ($isSelf && array_key_exists('is_admin', $validated) && ! $validated['is_admin']) {
            return response()->json([
                'message' => 'Vous ne pouvez pas retirer votre propre accès administrateur.',
            ], 422);
        }

        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
            unset($validated['password']);
        }

        $role = $validated['role'] ?? $user->role;
        $isAdmin = (bool) ($validated['is_admin'] ?? $user->is_admin) || $role === 'admin';

        $user->fill([
            'name' => $validated['name'] ?? $user->name,
            'email' => $validated['email'] ?? $user->email,
            'role' => $isAdmin ? 'admin' : $role,
            'is_admin' => $isAdmin,
        ])->save();

        if (isset($validated['password']) || $user->wasChanged(['email', 'role', 'is_admin'])) {
            $user->tokens()->where('id', '!=', $request->user()?->currentAccessToken()?->id)->delete();
        }

        return response()->json(['data' => $user->fresh()->toArrayForApi()]);
    }

    public function toggleBlock(Request $request, User $user): JsonResponse
    {
        if ($request->user()?->id === $user->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas bloquer votre propre compte.',
            ], 422);
        }

        if ($user->isBlocked()) {
            $user->unblock();
        } else {
            $user->block();
        }

        return response()->json(['data' => $user->fresh()->toArrayForApi()]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()?->id === $user->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.',
            ], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(null, 204);
    }

    public function roles(): JsonResponse
    {
        return response()->json(['data' => User::ROLES]);
    }
}
