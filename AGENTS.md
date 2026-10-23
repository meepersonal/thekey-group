# AGENTS.md — The Key Group

Monorepo: `backend/` (Laravel 13 API) + `frontend/` (Vite + React 18, TypeScript).

## Lovable lifecycle (root `lovable.toml`)

- The Lovable platform runs `dev` / `build` / `build:dev` from the repo root, where there is
  no `package.json`; these tasks are defined in root `lovable.toml` and delegate to
  `npm run … --prefix frontend`. The `dev` task forces Vite onto port 8080 (`--strictPort`)
  because the Lovable preview proxies to 8080, not the Vite default 8081.
- TOML bare keys cannot contain `:` — quote `"build:dev"` in `lovable.toml`, or the whole
  file fails to parse and every lifecycle task reports "no command found".

## Prerequisites

- **Backend**: PHP 8.3+, Composer, MySQL (default) or SQLite. See `backend/.env`.
- **Frontend**: Node.js 20+, `node_modules` installed (`npm install` in `frontend/`).
- **Dev servers**:
  - Backend API: `cd backend && php artisan dev` (PHP built-in on `:8000`)
  - Frontend dev (port `:8081`, proxies `/api` → `:8000`): `cd frontend && npm run dev`
  - Vite config: `frontend/vite.config.ts` (`host: 0.0.0.0`, port 8081, proxy `/api`).

## Build & verification commands

### Frontend (`frontend/`)
- **Typecheck**: `npx tsc --noEmit`
  - Pre-existing type errors exist in `src/setupTests.ts` (test-only); changed source under `src/routes`, `src/data`, `src/lib` must stay clean.
- **Lint**: `npm run lint` (`eslint .`)
  - **NOTE**: no `eslint.config.*` is committed yet — linting is not configured. `npm run lint` will fail until an ESLint config is added. `prettier --check .` is the available style check.
- **Format**: `npx prettier --write .`
- **Build**: `npx vite build`
- **Tests**: `npx vitest run` (config: `frontend/vitest.config.ts`)

### Backend (`backend/`)
- **Syntax check**: `php -l <file>` for each PHP file.
- **Full check**:
  - `php artisan config:clear` (cache clear)
  - `php artisan migrate:fresh --seed --force` (or `php artisan migrate` then `php artisan db:seed`)
  - `php artisan route:list` (verify route registration)
  - `php artisan test` (PHPUnit; config: `backend/phpunit.xml`)
- **Migrate** (after adding a migration): `php artisan migrate`
- **Seed** (targeted): `php artisan db:seed --class=<Class> --force`

## Key conventions

- **API**: Laravel Sanctum token auth for `/api/v1/admin/*`. Bearer token stored in
  frontend `localStorage` (`admin_token`). Public read endpoints are under
  `/api/v1/brands`, `/api/v1/categories`, `/api/v1/vehicles`, etc.
- **Frontend data layer**: `@/lib/api.ts` (raw `fetch` + endpoints), `@/data/admin-store.tsx`
  (`@tanstack/react-query` hooks + re-exported types). New entities follow the same pattern:
  add a type + `api.*` method, then `use<Entity>`, `useCreate<Entity>`, `useUpdate<Entity>`,
  `useDelete<Entity>` hooks.
- **Routes**: frontend routes are registered in `src/App.tsx` (`renderAdminContent` /
  `renderPublicContent`), not a router library. Admin pages live in `src/routes/admin.*.tsx`.
- **Models**: `toArrayForApi()` is the canonical API output shape on every Eloquent model.
- **Controllers**: REST controllers live in `app/Http/Controllers/Api/V1/`. Admin (mutating)
  controllers are prefixed `Admin*` and protected by `auth:sanctum`. Resource routes use
  `Route::apiResource(...)->except(['create','edit'])` for JSON APIs.
- **Settings**: site-wide values live in the `admin_settings` table (key/value, `value` cast to
  `array`) accessed via `AdminSetting::get($key, $default)` / `AdminSetting::set($key, $value)`.
  API: `GET /admin/settings` (all) and `PATCH /admin/settings` (batch update).
- **Media**: uploaded logo/favicon are stored on the `public` disk (`storage/app/public/media`)
  via `POST /admin/media/upload` (`file` + `type` of `logo|favicon`); the returned URL is also
  persisted to `site_logo` / `site_favicon`. Run `php artisan storage:link` so the public disk is
  web-reachable.
- **Migrations**: `database/migrations/`. Seeders: `database/seeders/` (registered in
  `DatabaseSeeder.php`).
- **Style**: Tailwind CSS v4 with custom `oklch` design tokens (`frontend/src/styles.css`).
  Utility classes use `surface-card`, `bg-gradient-navy`, `shadow-glow`, etc. No raw CSS
  edits outside `styles.css` unless requested.
- **Comments**: avoid adding code comments; keep changes self-explanatory.
