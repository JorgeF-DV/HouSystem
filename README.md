# HouSystem

Herramienta de convivencia para parejas. Finanzas compartidas, tareas, metas de ahorro y planes.

**Stack:** Next.js 16 + Tailwind v4 + TypeScript + Tabler Icons

---

## Arquitectura

```
src/
├── app/
│   ├── (onboarding)/   # Welcome, Register, Login, Link partner
│   ├── (main)/         # Dashboard, Finanzas, Tareas, Metas, Planes, Perfil, Ajustes
│   ├── layout.tsx      # Root layout (fonts Syne + DM Sans)
│   └── globals.css     # Design system tokens (@theme)
├── components/
│   └── ui/             # Card, Button, Input, Avatar, ProgressBar, BottomSheet, etc.
└── lib/
    └── utils.ts        # cn(), formatCurrency(), getProgressColor(), etc.
```

### Diseño
- **Mobile-first:** 390px base, bottom nav. ≥768px: sidebar 240px. ≥1280px: grid 3 cols.
- **Colores semánticos:** Verde ≤70% → Ámbar 71-89% → Coral ≥90% en progress bars.
- **Tipografía:** Syne (títulos/números), DM Sans (cuerpo/UI). Ambas self-hosted via `next/font`.
- **Safe areas:** `env(safe-area-inset-bottom)` en bottom nav y bottom sheets.

### Decisiones registradas
| Decisión | Opción descartada | Motivo |
|---|---|---|
| App Router (no Pages) | Pages Router | Ya venía por defecto con create-next-app |
| Tailwind v4 CSS-first | tailwind.config.js | Versión del template; `@theme` en CSS |
| `cn()` casero | clsx | Evitar dependencia extra; implementación trivial |
| `"use client"` en cada página | Server Components | Toda página usa interactividad (estados, efectos) |
| Datos mock inline | API / DB | Fase inicial; pendiente backend |

---

## Estado del proyecto

### ✅ Implementado
- **21 rutas** cubriendo todos los módulos del spec
- Sistema de diseño completo (colores, tipografía, espaciado, componentes)
- Layout responsive (bottom nav mobile / sidebar desktop)
- Onboarding: Welcome, Register, Login, Vincular pareja
- Dashboard con widgets de salud financiera, día de hoy, tareas, eventos
- Finanzas: principal con selector de mes, aportes, pozo, categorías, FAB + bottom sheet registro, historial, presupuestos editables
- Tareas: kanban (disponibles/progreso/completadas), gestión CRUD con bottom sheet
- Metas: grid, detalle con abono e historial, formulario de creación con preview
- Planes: mini calendario, eventos, recomendaciones con match %, preferencias
- Globales: notificaciones, perfil (desvincular), ajustes (tema, toggles, export)
- Linting y build pasan sin errores ni warnings

### ❌ Pendiente (backend)
- Autenticación real (JWT/sessions)
- Vínculo de pareja con invitaciones reales
- API routes o backend server
- Base de datos (SQLite / PostgreSQL / Supabase)
- Persistencia (al menos localStorage mientras tanto)

### ❌ Pendiente (frontend)
- Tiempo real en tareas (WebSocket/SSE para evitar conflictos de selección)
- Optimistic updates con rollback en error
- Toast de confirmación conectado a acciones
- Sheet → modal centrado en desktop (≥768px)
- Grid responsivo completo (dashboard 3 cols en ≥1280px, metas 2 cols)
- Badge de alerta de precio en metas (↑/↓)
- Swipe left para eliminar en notificaciones e historial
- Breadcrumbs en pantallas secundarias
- Toggle mostrar/ocultar contraseña en Login
- Safe area testing en iOS
- Estados vacíos y de error completos
- Animaciones de entrada/transición

---

## Comandos

```bash
npm run dev         # Dev server
npm run build       # Build production
npm run lint        # ESLint
npm run test        # Tests (Vitest)
npm run test:watch  # Tests en watch mode
```

## Tests

**Framework:** Vitest + React Testing Library + jsdom

### Qué cubren
| Archivo | Tests | Lo que detectan |
|---|---|---|
| `utils.test.ts` | 8 | `cn()` filtra falsy, `formatCurrency()` formato ARS, `getProgressColor()` boundaries semánticos |
| `ProgressBar.test.tsx` | 7 | Ancho, clamping 0-100%, colores semánticos por rango, className |
| `Avatar.test.tsx` | 3 | Iniciales correctas (J/L), tamaño custom |
| `Card.test.tsx` | 3 | Render children, skeleton loading, hover state |
| `StatusPill.test.tsx` | 4 | Variantes positive/alerta/critico con colores correctos |
| `Button.test.tsx` | 6 | Click, disabled, loading spinner, no click cuando disabled |
| `AlertBanner.test.tsx` | 3 | Render message, action button, sin action si no hay label |

### Reglas
- Test por componente en `src/components/ui/__tests__/`. Tests de utilidades en `src/lib/__tests__/`.
- No usar `toHaveStyle()` con valores de unidad — jsdom no computa inline styles con unidades correctamente. Usar `.style.width` directamente.
- jsdom devuelve colores en formato `rgb()`. Usar `rgb(0, 200, 150)` en vez de `#00C896`.
- Antes de commitear: `npm run test && npm run lint && npm run build`

## Convenciones

- **Componentes:** `"use client"` en páginas con interactividad. UI components en `src/components/ui/`.
- **Estilos:** Tailwind utility classes + `@theme` tokens. Sin CSS modules ni archivos .css adicionales.
- **Iconos:** `@tabler/icons-react`. Importar solo los que se usan.
- **Colores semánticos:** Usar `getProgressColor(percent)` de `src/lib/utils.ts` para progress bars.
- **Nuevo feature:** Documentar en este README bajo "Decisiones registradas" + agregar al checklist de estado.
