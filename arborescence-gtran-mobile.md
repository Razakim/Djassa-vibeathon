# Gtran Mobile — Arborescence

Application mobile terrain, miroir de `gtran-api` et complément de `gtran-app` (web).

Référence produit : `vue_g.md`

---

## Structure

```
gtran-mobile/
├── app/                          # Expo Router — écrans uniquement
│   ├── _layout.tsx               # Root + Providers
│   ├── index.tsx                 # Redirect → login
│   ├── (auth)/                   # Login, register
│   ├── (tabs)/                   # Navigation principale gestionnaire
│   └── (driver)/                 # Flux chauffeur (stack)
│
├── src/
│   ├── app/providers.tsx
│   ├── modules/                  # Miroir strict gtran-api / gtran-app
│   ├── ecosystem/                # V2+ isolé
│   ├── components/               # ui, layout, shared, map
│   ├── lib/                      # api, auth, tenant, realtime, geo, camera, notifications
│   ├── hooks/
│   ├── types/
│   ├── constants/
│   └── styles/
│
├── assets/
├── app.json
├── package.json
└── .env.example
```

Voir `gtran-mobile/README.md` pour le détail complet.
