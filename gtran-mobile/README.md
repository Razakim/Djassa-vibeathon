# Gtran Mobile — DjassaOS Terrain

App mobile **terrain** pour chauffeurs et exploitants nomades. Complète `gtran-app` (bureau) — pas un clone responsive.

## Identité

- **Marque** : DjassaOS (palette ivoirienne — émeraude `#00563B`, orange `#E25822`, or `#FFBF00`)
- **Typo** : Plus Jakarta Sans (titres) + DM Sans (corps) — miroir web
- **Signature UX** : `MissionCorridorCard`, `GooeyField`, `FieldDock`

## Architecture (pas du boilerplate Expo)

```
app/                    # Routes Expo Router uniquement
  (onboarding)/         # Auth brandée
  (chauffeur)/          # Shell terrain + dock
  (exploitant)/         # Shell pulse nomade

src/
  design-system/        # Tokens + primitives + brand (source de vérité visuelle)
  shells/               # ChauffeurShell, ExploitantShell — navigation persona
  navigation/           # resolve-home, dock-config
  modules/              # Couche data (api, types, hooks) — miroir gtran-api
  features/             # (V2) slices verticales métier
```

**Principe** : les écrans vivent dans `app/`, la logique UI métier dans `design-system/` + `shells/`, les données dans `modules/`. Pas de duplication `screens/` dans chaque module.

## Personas

| Persona | Shell | Dock |
|---------|-------|------|
| Chauffeur | `(chauffeur)` | Terrain · Courses · **GPS** · Radio · Moi |
| Exploitant | `(exploitant)` | Pulse · Flotte · **Alertes** · Missions · Moi |

## Démarrage

```bash
cd gtran-mobile
cp .env.example .env
npm install
npx expo start
```

**Démo chauffeur** : `kouame@gtran.ci` / `demo123`  
**Démo exploitant** : `amadou@transafrique.ci` / `demo123`

## V1 prioritaire

1. Auth + routing par rôle
2. Mission corridor + actions terrain
3. GPS live → `gtran-api`
4. Livraison photo + signature
5. Push notifications dispatch
