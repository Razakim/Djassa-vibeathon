# Gtran Mobile — Arborescence

App **terrain** DjassaOS — complément nomade de `gtran-app`, pas un portage desktop.

---

## Philosophie

| Éviter | Préférer |
|--------|----------|
| Tabs génériques `(tabs)` | Shells par persona `(chauffeur)` / `(exploitant)` |
| StyleSheet inline partout | `src/design-system/` tokens + primitives |
| `screens/` dupliqués par module | Routes dans `app/`, data dans `modules/` |
| Blanc/gris neutre | Palette ivoirienne (émeraude, orange, or) |

---

## Structure

```
gtran-mobile/
├── app/
│   ├── (onboarding)/          # login, register — AuthCover brandé
│   ├── (chauffeur)/           # Shell terrain + FieldDock
│   │   ├── index.tsx          # Course du jour
│   │   ├── courses.tsx
│   │   ├── gps.tsx
│   │   ├── messages.tsx
│   │   ├── compte.tsx
│   │   └── livraison/[id].tsx
│   └── (exploitant)/          # Shell pulse nomade
│       ├── index.tsx          # KPIs opérationnels
│       ├── flotte.tsx
│       ├── alertes.tsx
│       ├── missions.tsx
│       └── compte.tsx
│
├── src/
│   ├── design-system/
│   │   ├── tokens/            # colors, typography, spacing
│   │   ├── brand/             # BrandMark, BrandWordmark, AuthCover
│   │   └── primitives/        # GooeyField, DjassaButton, FieldDock, MissionCorridorCard
│   ├── shells/                # ChauffeurShell, ExploitantShell
│   ├── navigation/            # resolve-home, dock-config
│   ├── modules/               # api.ts, types.ts, hooks/ — miroir gtran-api
│   └── lib/                   # auth, tenant, api, geo, camera, notifications
```

---

## Composants signature

- **AuthCover** — panneau émeraude, blobs orange, motif corridor
- **GooeyField** — halo focus émeraude/orange (équivalent mobile du web)
- **MissionCorridorCard** — visualise Abidjan → Bamako avec statut
- **FieldDock** — navigation terrain flottante (inspirée Floating Dock)

---

## Routing par rôle

`src/navigation/resolve-home.ts` redirige :
- `chauffeur` → `/(chauffeur)`
- `gestionnaire` / `admin` → `/(exploitant)`
- non connecté → `/(onboarding)/login`
