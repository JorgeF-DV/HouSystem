# HouSystem 🏠

Herramienta de convivencia para parejas: finanzas compartidas, tareas del hogar, metas de ahorro y planes.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, Tabler Icons |
| DB | PostgreSQL (Supabase) |
| ORM | Prisma 7 (`@prisma/adapter-pg`) |
| Auth | Supabase Auth SSR |
| Testing | Vitest 4 + RTL |

## Setup rápido

```bash
npm install
cp .env.example .env.local
# Editar .env.local con credenciales de Supabase
npm run db:generate
npm run dev
```

> `DATABASE_URL` debe usar el **connection pooler** (puerto `6543`) sin `sslmode=require`. SSL se configura vía adapter.

## Arquitectura

```
src/
├── app/
│   ├── api/          # 33 endpoints REST (auth, finanzas, tareas, metas, planes...)
│   ├── (onboarding)/ # Login, registro, vincular pareja
│   └── (main)/       # 14 páginas protegidas (dashboard, finanzas, tareas...)
├── components/ui/    # 14 componentes de diseño (Card, Button, BottomSheet...)
├── hooks/            # useApi() — fetch + loading + error + redirect
├── lib/
│   ├── auth.ts       # requireAuth(), requirePartnerAuth()
│   ├── api-utils.ts  # apiSuccess(), apiError(), handleApiError()
│   ├── db.ts         # PrismaClient singleton con PrismaPg adapter
│   └── utils.ts      # formatCurrency(), getRouteId(), cn()...
└── middleware.ts     # Protege rutas main, redirige a /login
```

## API — resumen

| Recurso | Endpoints clave |
|---|---|
| Auth | `POST /api/auth/{login,register,logout}`, `GET /api/auth/me` |
| Dashboard | `GET /api/dashboard` — resumen del mes |
| Finanzas | `GET /api/finances`, `GET/PUT /api/budgets`, `GET/POST /api/expenses`, `PUT/DELETE /api/expenses/[id]` |
| Tareas | CRUD `/api/tasks`, `POST /api/tasks/[id]/{take,complete,reopen}` |
| Metas | CRUD `/api/goals`, `GET/POST /api/goals/[id]/contributions` |
| Planes | CRUD `/api/events`, `GET /api/recommendations`, `GET/PUT /api/preferences` |
| Pareja | `POST /api/partner/{invite,accept,unlink}`, `GET /api/partner/status` |
| Notificaciones | `GET /api/notifications`, `POST /api/notifications/read-all`, `GET/PUT /api/notifications/preferences` |
| Perfil | `GET/PUT /api/profile`, `GET/PUT /api/settings` |

## Frontend — páginas

### Onboarding
`/welcome` → `/login` → `/register` → `/link-partner`

### Main (autenticado)
`/dashboard`, `/finanzas` + `/historial` + `/presupuestos`,
`/tareas` + `/gestionar`, `/metas` + `/agregar` + `/[id]`,
`/planes` + `/[id]` + `/preferencias`,
`/notificaciones`, `/perfil`, `/ajustes`

Todas las páginas se conectan a APIs reales con loading skeletons y manejo de errores.

## Testing

```bash
npm run test           # 56 tests, 13 suites
npm run test:watch     # Modo watch
```

## Cuentas de prueba

| Email | Password | Rol |
|---|---|---|
| `jorge@housystem.com` | `test123456` | jorge |
| `lorena@housystem.com` | `test123456` | lorena |

Vinculadas como pareja con presupuestos, gastos, tareas, metas y eventos creados.
