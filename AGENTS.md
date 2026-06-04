<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project: HouSystem — Couple Cohabitation Tool

### Setup
- Stack: Next.js 16 + Supabase Auth SSR + Prisma 7.8.0 (`@prisma/adapter-pg` + `pg.Pool`)
- Supabase project: `mldniygdvucrqcdfudzg` (free tier)
- DB: Supabase Pooler `aws-1-us-east-1.pooler.supabase.com:6543`, user `postgres.{project_ref}`
- SSL configured via `ssl: { rejectUnauthorized: false }` in pg.Pool (NOT `sslmode=require` in DATABASE_URL)

### Key Architecture Decisions
- `src/lib/db.ts`: `PrismaClient` with `PrismaPg(pool)` adapter, `pg.Pool` with explicit SSL
- `src/lib/auth.ts`: `requireAuth()` + `requirePartnerAuth()` helpers that throw `AuthError(statusCode)`
- `src/lib/api-utils.ts`: `handleApiError(error, context)` catches `AuthError` → 401/400, others → 500
- `src/lib/utils.ts`: Shared utilities — `getRouteId()`, `getWeekStart()`, `EMAIL_REGEX`, `cn()`, `formatCurrency()`
- Prisma schema: 14 models with explicit `@relation()` names

### What's Connected to Real API
- `/login` → `POST /api/auth/login` (redirects to dashboard)
- `/register` → `POST /api/auth/register` (redirects to link-partner)
- `/link-partner` → `POST /api/partner/invite` (shows sent state)
- `/dashboard` → `GET /api/dashboard` (with loading skeleton)
- `/finanzas` → `GET /api/finances?month&year` + `POST /api/expenses` (add expense via BottomSheet)
- `/finanzas/historial` → `GET /api/expenses?month&year`
- `/finanzas/presupuestos` → `GET /api/budgets` + `PUT /api/budgets`
- `/tareas` → `GET /api/tasks` + `POST /api/tasks/[id]/take`
- `/tareas/gestionar` → `GET /api/tasks` + POST/PUT/DELETE `/api/tasks`
- `/metas` → `GET /api/goals`
- `/planes` → `GET /api/events` + `GET /api/recommendations`
- `/notificaciones` → `GET /api/notifications` + `POST /api/notifications/read-all`
- `/perfil` → `GET /api/profile` + `POST /api/partner/unlink` + `POST /api/auth/logout`
- `/ajustes` → `GET /api/settings` + `PUT /api/settings` + `GET/PUT /api/notifications/preferences`

### All Pages Connected
Every page now fetches from real API endpoints with loading skeletons, replaces the mock data that was previously hardcoded.

### Test Accounts
- `jorge@housystem.com` / `test123456` (role: jorge)
- `lorena@housystem.com` / `test123456` (role: lorena)
- Linked as partners with budgets, expenses, tasks, goals, events created
- Password for Supabase admin: `jorgeflorez10/*`

### Build Status
- TypeScript: 0 errors
- Tests: 56/56 passing
