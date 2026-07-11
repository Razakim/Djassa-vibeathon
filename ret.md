# Gtran-app Frontend — Codebase Audit

**Stack:** React 19 + Vite 7 + TypeScript + React Router 7 + TanStack Query 5 + Tailwind CSS 4 + shadcn/ui (Radix) + Motion + Leaflet/react-leaflet + Recharts + Sonner.

The app is labeled **“Socle 02 — interactif”** in the sidebar: a working UI prototype with **localStorage-backed mock data**, not a production backend integration yet.

---

## 1. Project Structure

```
c:\Users\User\Downloads\Djassa\gtran-app\
├── index.html                    # lang=fr, class="dark" hardcoded
├── package.json
├── components.json               # shadcn "new-york" / zinc
├── vite.config.ts                # @ alias → src/
├── vercel.json                   # SPA rewrites
└── src/
    ├── main.tsx                  # Entry: Providers + RouterProvider
    ├── app/
    │   ├── providers.tsx         # QueryClient, Auth, Tenant, Toaster
    │   └── router.tsx            # All routes (central, flat)
    ├── components/
    │   ├── auth/protected-route.tsx
    │   ├── layout/               # AppLayout, Sidebar, Topbar, EntitySwitcher
    │   ├── map/                  # TransportMap + map.css
    │   ├── shared/               # PageHeader, StatCard, badges, motion helpers
    │   └── ui/                   # 17 shadcn components
    ├── hooks/
    │   ├── use-data.ts           # Primary data layer (React Query → mock-api)
    │   └── use-mobile.ts         # Defined but unused
    ├── lib/
    │   ├── auth/index.tsx
    │   ├── tenant/index.tsx
    │   ├── navigation.ts
    │   ├── utils.ts
    │   ├── mock-data.ts          # Static seed constants
    │   ├── mock-api/             # localStorage CRUD store
    │   ├── api/client.ts         # fetch wrapper — unused
    │   ├── geo/cities.ts
    │   └── realtime/ws.ts        # WebSocket stub — unused
    ├── modules/                  # Feature folders (see below)
    ├── styles/globals.css
    └── types/
        ├── entities.ts
        └── shared.ts
```

### Module folder pattern

Each business module follows:

```
modules/<name>/
├── components/<name>-page.tsx   ← actually used
├── api.ts                       ← stub (`export {}`) except companies
├── types.ts                     ← stub (`export {}`) except companies
└── routes.tsx                   ← stub RouteObject[] — NOT wired into router
```

**Exceptions:** `auth/` and `dashboard/` only have `components/` (no api/types/routes).

**16 routed modules:** dashboard, companies, fleet, drivers, missions, tracking, documents, accounting, billing, payments, maintenance, fuel, analytics, hr, communication, ai-assist.

---

## 2. Router & Auth Flow

### Key files

| File | Path |
|------|------|
| Router | `c:\Users\User\Downloads\Djassa\gtran-app\src\app\router.tsx` |
| Providers | `c:\Users\User\Downloads\Djassa\gtran-app\src\app\providers.tsx` |
| Entry | `c:\Users\User\Downloads\Djassa\gtran-app\src\main.tsx` |
| Auth context | `c:\Users\User\Downloads\Djassa\gtran-app\src\lib\auth\index.tsx` |
| Route guards | `c:\Users\User\Downloads\Djassa\gtran-app\src\components\auth\protected-route.tsx` |
| Login | `c:\Users\User\Downloads\Djassa\gtran-app\src\modules\auth\components\login-page.tsx` |
| Register | `c:\Users\User\Downloads\Djassa\gtran-app\src\modules\auth\components\register-page.tsx` |

### Route tree

```
/login, /register     → GuestRoute (redirect to / if authenticated)
/                     → ProtectedRoute → AppLayout
  ├── /               → DashboardPage
  ├── /companies      → CompaniesPage
  ├── /fleet          → FleetPage
  ├── /drivers        → DriversPage
  ├── /missions       → MissionsPage
  ├── /tracking       → TrackingPage
  ├── /documents      → DocumentsPage
  ├── /accounting     → AccountingPage
  ├── /billing        → BillingPage
  ├── /payments       → PaymentsPage
  ├── /maintenance    → MaintenancePage
  ├── /fuel           → FuelPage
  ├── /analytics      → AnalyticsPage
  ├── /hr             → HrPage
  ├── /communication  → CommunicationPage
  └── /ai-assist      → AiAssistPage
*                     → Navigate to /
```

### Auth behavior (functional, mock-backed)

- **Session:** `localStorage` key `gtran-auth` stores `{ id, nom, email, role }`.
- **Login/register:** calls `loginAccount` / `registerAccount` from `lib/mock-api` (password stored in plain text in mock store).
- **Demo credentials:** `amadou@transafrique.ci` / `demo123` (pre-filled on login page).
- **ProtectedRoute:** spinner while loading, redirect to `/login` if unauthenticated.
- **GuestRoute:** redirect to `/` if already logged in.
- **Logout:** topbar clears session + toast + navigate to `/login`.
- **No JWT, no refresh tokens, no role-based route restrictions** — role is display-only.

### Tenant context

- `TenantProvider` (`lib/tenant/index.tsx`) holds hardcoded enterprise + 3 agencies.
- `EntitySwitcher` in topbar switches `agenceId`; React Query keys include `agenceId`.
- **Gap:** most seeded data is `ag-1` only; `fetchTracking` does not filter by agency (returns all tracking vehicles regardless of selection).

---

## 3. Data Layer — What’s Real vs Mock

| Layer | Status |
|-------|--------|
| `lib/mock-api/` + `localStorage` (`gtran-store-v1`) | **Active** — full CRUD for all entities |
| `hooks/use-data.ts` | **Active** — React Query hooks wrapping mock-api |
| `lib/api/client.ts` | **Stub** — never imported |
| `modules/*/api.ts` | **Stubs** — placeholder comments “connecter au backend FastAPI” |
| `lib/realtime/ws.ts` | **Stub** — never used |
| `lib/mock-data.ts` | **Seed source** — static Ivorian transport demo data |

Persistence survives page refresh. Mutations invalidate queries and update localStorage.

**Unused deps in package.json:** `react-hook-form`, `@hookform/resolvers`, `zod`, `@radix-ui/react-checkbox` (no checkbox UI component installed).

---

## 4. Leaflet / Map Components

### Key files

| File | Purpose |
|------|---------|
| `c:\Users\User\Downloads\Djassa\gtran-app\src\components\map\transport-map.tsx` | Main map component |
| `c:\Users\User\Downloads\Djassa\gtran-app\src\components\map\map.css` | Leaflet theming |
| `c:\Users\User\Downloads\Djassa\gtran-app\src\lib\geo\cities.ts` | City coords, route building, interpolation |

### `TransportMap` features (functional)

- CARTO dark tiles (`cartocdn.com/dark_all`)
- Mission **polylines** colored by status (`planifiee`, `en_cours`, `en_retard`, etc.)
- **Truck markers** via custom `L.divIcon` (emoji 🚛)
- Click polylines → `onMissionSelect`
- `FlyTo` when a mission is selected
- `MapResizer` for layout invalidation
- Props: `center`, `zoom`, `height`, `missions`, `vehicles`, `showRoutes`

### Used on

- **Dashboard** — mini map (220px) with active missions + live tracking vehicles
- **Missions** — full map with selection sync to table
- **Tracking** — large map (480px) + fleet sidebar list

Routes are **synthetic curves** between West African cities (Abidjan, Bouaké, San Pedro, etc.), not real road geometry. GPS is **simulated** from mission `progress` on routes.

---

## 5. UI Components

### shadcn/ui (`components/ui/`) — 17 components

`avatar`, `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `progress`, `scroll-area`, `select`, `separator`, `sonner`, `table`, `tabs`, `textarea`, `tooltip`

Configured via `components.json` (style: **new-york**, base: **zinc**, Lucide icons). Custom badge variants: `success`, `warning`, `info`.

### Motion (`motion/react`) — used, not Aceternity

- Page transitions: `AnimatedPage`, `StaggerList`, `StaggerItem`
- Sidebar width animation
- Login/register background blobs + card entrance
- `GooeyInput` focus glow (custom, Aceternity-inspired but hand-rolled)

### Aceternity UI

**Not present** — no imports, no aceternity package, no aceternity component folder.

### Shared components (`components/shared/`)

| Component | Role |
|-----------|------|
| `page-header.tsx` | Title + description + optional action button |
| `stat-card.tsx` | KPI cards |
| `status-badge.tsx` | Mission/Vehicle/Payment status badges |
| `animated-page.tsx` | Motion wrappers |
| `gooey-input.tsx` | Auth form inputs |
| `confirm-dialog.tsx` | Delete confirmations |

### Layout (`components/layout/`)

| Component | Role |
|-----------|------|
| `app-layout.tsx` | Sidebar + Topbar + animated `<Outlet />` |
| `sidebar.tsx` | Grouped nav from `lib/navigation.ts`, collapsible (desktop only, `hidden lg:flex`) |
| `topbar.tsx` | Entity switcher, global search, alerts bell, user menu |
| `entity-switcher.tsx` | Agency dropdown |
| `sidebar-context.tsx` | Collapse state persisted to localStorage |

**Mobile gap:** sidebar hidden below `lg`; no hamburger/mobile nav. `useIsMobile` hook exists but is unused.

---

## 6. Package.json Dependencies

### Runtime

| Package | Used for |
|---------|----------|
| `react`, `react-dom` ^19.1 | UI |
| `react-router-dom` ^7.6 | Routing |
| `@tanstack/react-query` ^5.83 | Data fetching/caching |
| `leaflet` + `react-leaflet` ^5 | Maps |
| `motion` ^12.42 | Animations |
| `recharts` ^3.1 | Dashboard bar chart |
| `sonner` ^2.0 | Toasts |
| Radix UI packages | shadcn primitives |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Styling utilities |
| `lucide-react` | Icons |
| `react-hook-form`, `@hookform/resolvers`, `zod` | **Installed, not used** |

### Dev

`vite` ^7, `@vitejs/plugin-react`, `tailwindcss` ^4 + `@tailwindcss/vite`, `tw-animate-css`, `typescript` ~5.8

---

## 7. Login / Register Pages

Both are **fully functional** against the mock auth store.

| Page | Path | Features |
|------|------|----------|
| Login | `modules/auth/components/login-page.tsx` | Email/password, demo pre-fill, motion UI, `GooeyInput`, link to register |
| Register | `modules/auth/components/register-page.tsx` | nom/email/password (min 6), auto-login after register, assigns role `"Administrateur"` + `entrepriseId: "ent-1"` |

Missing: password reset, email verification, OAuth, remember-me, form validation library.

---

## 8. Module Page Status (Functional vs Stub)

Legend: **Full** = CRUD/list UI wired to mock-api | **Read** = display/derived data only | **Partial** = mix of real UI + toast-only actions | **Mock** = hardcoded/fake responses

| Module | Route | Status | Notes |
|--------|-------|--------|-------|
| **Dashboard** | `/` | **Full/Partial** | Live stats from missions/vehicles/fuel/alerts; chart uses static `revenueChart` from mock-data; embedded map works |
| **Companies** | `/companies` | **Partial** | Agency cards + employee table; add employee works; Roles tab is text placeholder; settings save = toast only |
| **Fleet** | `/fleet` | **Full** | Search, create/edit/delete vehicles, status badges, progress bars |
| **Drivers** | `/drivers` | **Partial** | List + create; no edit/delete; stats computed live |
| **Missions** | `/missions` | **Full** | Map + table, create, status transitions (start/deliver), delete; hardcoded default chauffeur/véhicule in form |
| **Tracking** | `/tracking` | **Read** | Map + fleet list from mock tracking data; no live WebSocket; toggle routes works |
| **Documents** | `/documents` | **Full/Partial** | CRUD minus edit; export PDF = toast stub |
| **Accounting** | `/accounting` | **Read** | Derived from missions + fuel; export CSV = toast stub |
| **Billing** | `/billing` | **Full/Partial** | Invoice CRUD (create, mark paid); reminders = toast only; no real email |
| **Payments** | `/payments` | **Partial** | Record payments; Mobile Money “Test” buttons = toast; escrow release = toast only |
| **Maintenance** | `/maintenance` | **Partial** | Plan interventions; validate/report = toast stubs; no edit/delete |
| **Fuel** | `/fuel` | **Partial** | Record fill-ups with anomaly detection (conso > 38); no edit/delete |
| **Analytics** | `/analytics` | **Read** | Rankings computed from mission margins; export PDF = toast |
| **HR** | `/hr` | **Partial** | Employee list + create; leave approval/payroll = toast stubs; hardcoded payroll figure |
| **Communication** | `/communication` | **Full/Partial** | Inbox, read/unread, reply creates message; no threads/attachments |
| **AI Assist** | `/ai-assist` | **Mock** | Local `getMockResponse()` keyword matching; Mic button inert; explicitly says “Connectez l'API backend” |

---

## 9. Patterns & Conventions

1. **Central router** — all routes in `app/router.tsx`; per-module `routes.tsx` files are dead scaffolding.
2. **Central data hooks** — pages use `@/hooks/use-data`, not `modules/*/api.ts`.
3. **Page structure** — `PageHeader` + Cards/Tables + Dialog forms + `toast` feedback + `ConfirmDialog` for deletes.
4. **French UI** — all labels, toasts, formatting (`fr-FR`, XOF currency).
5. **Tenant scoping** — `agenceId` on entities and query keys; incomplete for tracking/agency-specific seeds.
6. **Path alias** — `@/` → `src/`.
7. **Dark theme** — hardcoded on `<html class="dark">`; CSS variables in `globals.css`; no theme toggle.
8. **Status enums** — shared in `types/shared.ts`; badges in `status-badge.tsx`.
9. **Animation** — `AnimatePresence mode="wait"` on route changes in `AppLayout`.
10. **Forms** — local `useState` per dialog; no shared form schema/validation.

---

## 10. What Needs to Be Built Next (Priority Order)

### Backend integration (highest impact)

1. Wire `lib/api/client.ts` to FastAPI (`VITE_API_URL`, auth headers).
2. Implement `modules/*/api.ts` and swap `use-data.ts` from mock-api to real APIs.
3. Replace localStorage auth with secure tokens; add role-based access control (Roles tab is empty today).

### Real-time & maps

4. Connect `lib/realtime/ws.ts` for live GPS updates on Tracking/Dashboard maps.
5. Optional: real routing (OSRM/Google) instead of `buildRoute()` curves.

### Feature completion gaps

6. **Mobile navigation** — sidebar is desktop-only; wire `useIsMobile`.
7. **Driver CRUD** — edit/delete missing.
8. **Mission form** — pick chauffeur/véhicule from live lists instead of hardcoded defaults.
9. **Tenant isolation** — seed data per agency; fix `fetchTracking` agency filter.
10. **RBAC** — enforce roles on routes/actions (Companies “Roles” tab).
11. **Profile page** — topbar shows “Profil — bientôt disponible”.
12. **Exports** — PDF/CSV currently toast-only (documents, accounting, analytics).
13. **Payment gateways** — Wave/Orange/CinetPay are UI placeholders.
14. **AI Assist** — replace `getMockResponse` with backend LLM; wire Mic button.

### DX / unused deps

15. Adopt `react-hook-form` + `zod` for forms, or remove unused packages.
16. Either use per-module `routes.tsx` for code-splitting lazy routes, or delete dead files.
17. Add checkbox shadcn component if needed (Radix dep already installed).

### Aceternity (if desired)

18. **Not started** — would need explicit installation/port of Aceternity components; current aesthetic uses shadcn + custom Motion effects (`GooeyInput`, animated sidebar).

---

## 11. Quick Reference — Key File Paths

| Concern | Absolute path |
|---------|---------------|
| Entry | `c:\Users\User\Downloads\Djassa\gtran-app\src\main.tsx` |
| Router | `c:\Users\User\Downloads\Djassa\gtran-app\src\app\router.tsx` |
| Providers | `c:\Users\User\Downloads\Djassa\gtran-app\src\app\providers.tsx` |
| Auth | `c:\Users\User\Downloads\Djassa\gtran-app\src\lib\auth\index.tsx` |
| Mock store | `c:\Users\User\Downloads\Djassa\gtran-app\src\lib\mock-api\` |
| Data hooks | `c:\Users\User\Downloads\Djassa\gtran-app\src\hooks\use-data.ts` |
| Map | `c:\Users\User\Downloads\Djassa\gtran-app\src\components\map\transport-map.tsx` |
| Navigation config | `c:\Users\User\Downloads\Djassa\gtran-app\src\lib\navigation.ts` |
| Entity types | `c:\Users\User\Downloads\Djassa\gtran-app\src\types\entities.ts` |
| shadcn config | `c:\Users\User\Downloads\Djassa\gtran-app\components.json` |
| Global styles | `c:\Users\User\Downloads\Djassa\gtran-app\src\styles\globals.css` |

---

**Bottom line:** Gtran-app is a polished **interactive demo shell** (“Socle 02”) with working auth, layout, mock CRUD across most modules, and a reusable Leaflet map. The main gap is **backend wiring** — `apiClient`, module `api.ts` files, WebSocket, payment/AI integrations, and several UX stubs (mobile nav, exports, RBAC, profile) remain to be built.