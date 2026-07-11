# Gtran — Arborescence complète

Principes transverses (à ne pas casser en ajoutant des modules) :
1. **Un module = un domaine métier**, isolé, jamais d'import direct entre modules — seulement via `shared/events` (event bus interne).
2. **Multi-tenant partout** : chaque table/entité scoped par `entreprise_id` + `agence_id`, imposé au niveau middleware ET RLS Supabase (pas juste côté app).
3. **`ecosystem/` séparé du cœur ERP** dès le départ : marketplace, financement, assurance vivent dans un dossier à part, vide pour l'instant — pour ne jamais avoir à refactorer le cœur quand tu les actives.
4. **Miroir strict API ↔ App** : chaque module backend a son pendant frontend, même nom, même découpage. Onboarding d'un nouveau module = même geste des deux côtés.

---

## Gtran-api (FastAPI)

```
gtran-api/
├── app/
│   ├── main.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py            # JWT, RBAC
│   │   ├── tenancy.py             # middleware : résout entreprise_id/agence_id, injecte scoping
│   │   ├── database.py            # session Supabase/Postgres
│   │   └── exceptions.py
│   │
│   ├── modules/
│   │   ├── companies/             # entreprises, agences, rôles, permissions, devises
│   │   ├── fleet/                  # véhicules (tous types), état, disponibilité
│   │   ├── drivers/                 # chauffeurs, permis, historique, perf
│   │   ├── missions/                 # création + suivi d'étapes
│   │   ├── tracking/                  # GPS temps réel (ingestion + websocket)
│   │   ├── documents/                  # centralisation docs (assurance, cartes grises, LDV, BL...)
│   │   ├── accounting/                  # revenus/dépenses/marge
│   │   ├── billing/                      # devis, factures, reçus, relances
│   │   ├── payments/                       # Mobile Money (Wave/Orange/CinetPay), séquestre
│   │   ├── maintenance/                     # planification vidange/pneus/révisions + alertes
│   │   ├── fuel/                             # pleins, consommation, anomalies
│   │   ├── analytics/                         # rentabilité par camion/chauffeur/client/ligne
│   │   ├── hr/                                 # contrats, congés, paie, sanctions
│   │   ├── communication/                       # messagerie interne, notifications, consignes
│   │   └── ai_assist/                            # transcription vocale, remplissage auto, résumé, Q&A
│   │       # chaque dossier module suit ce squelette :
│   │       #   router.py       — endpoints
│   │       #   schemas.py      — Pydantic in/out
│   │       #   models.py       — ORM
│   │       #   service.py      — logique métier
│   │       #   repository.py   — accès données
│   │       #   events.py       — événements émis/écoutés par ce module
│   │
│   ├── ecosystem/                 # V2+, isolé, ne touche jamais aux modules ci-dessus
│   │   ├── marketplace/            # groupage, mise en relation chargeurs
│   │   ├── financing/               # avance sur facture, crédit véhicule
│   │   └── insurance/                # souscription, sinistres
│   │
│   ├── integrations/
│   │   ├── mobile_money/           # adaptateurs Wave / Orange Money / CinetPay
│   │   ├── storage/                 # Supabase storage
│   │   ├── notifications/            # SMS, push, email
│   │   └── ai_provider/               # appel LLM
│   │
│   ├── shared/
│   │   ├── pagination.py
│   │   ├── permissions.py          # décorateurs RBAC réutilisables
│   │   └── events.py                # event bus interne — ex: mission.delivered → billing génère facture
│   │
│   └── websockets/
│       └── realtime.py             # canal unique flotte + missions
│
├── migrations/                     # Alembic / migrations Supabase
├── tests/
│   └── modules/                    # miroir exact de app/modules
└── pyproject.toml
```

**Pourquoi l'event bus interne** : `missions.delivered` déclenche `billing` (facture) et `communication` (notif client) sans que `missions` importe `billing`. Ça évite le plat de spaghetti au module 10.

---

## Gtran-app (Vite + React)

```gtran-app/
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── router.tsx
│   │   └── providers.tsx          # QueryClient, AuthProvider, TenantProvider — pas de MotionProvider
│   │
│   ├── modules/                    # inchangé, miroir exact de l'API
│   │   ├── companies/ ... ai-assist/
│   │       # components/, hooks/, api.ts, types.ts, routes.tsx
│   │
│   ├── ecosystem/                  # inchangé
│   │   ├── marketplace/ financing/ insurance/
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn pur — généré via `npx shadcn add <component>`
│   │   └── layout/                 # Sidebar, Topbar, EntitySwitcher — assemblages de ui/, écrits à la main
│   │
│   ├── lib/
│   │   ├── utils.ts                # cn() — standard shadcn, généré à l'init
│   │   ├── api/client.ts
│   │   ├── realtime/ws.ts
│   │   ├── auth/
│   │   └── tenant/
│   │
│   ├── styles/
│   │   └── globals.css             # variables CSS par défaut shadcn (style "new-york"), zero override
│   │
│   ├── hooks/                      # use-mobile, use-toast — génériques, pas liés à un module
│   └── types/shared.ts
│
├── components.json                 # config shadcn (aliases @/components, @/lib, style, baseColor)
├── vercel.json                     # rewrites SPA (obligatoire, Vite ne le fait pas seul)
└── vite.config.ts

## Scalabilité — points qui comptent vraiment à 15+ modules

- **Pas de "God context"** : `TenantProvider` ne porte que l'entreprise/agence active, rien d'autre. Chaque module gère son propre state via ses hooks React Query — aucun store global monolithique.
- **`ecosystem/` vide dès le jour 1** : le simple fait que le dossier existe (des deux côtés) t'oblige à garder le cœur ERP propre, sans logique marketplace/fintech qui s'y infiltre "en attendant".
- **RLS Supabase, pas juste du code** : la scoping tenant doit être appliquée en base, sinon un bug applicatif = fuite de données entre entreprises clientes. Non négociable vu que c'est du B2B multi-tenant dès la V1.
- **`websockets/realtime.py` unique** : un seul canal pour flotte + missions, pas un par module — sinon tu multiplies les connexions ouvertes côté chauffeur mobile, mauvais pour la batterie/data.
