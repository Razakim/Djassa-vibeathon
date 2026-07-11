# Gtran Mobile

Application mobile (Expo + React Native) pour les acteurs terrain : **chauffeurs**, **gestionnaires nomades**, **clients** (signature livraison).

Complète `gtran-app` (web/desktop) et consomme la même API `gtran-api`.

## Stack

- **Expo SDK 53** + **Expo Router** (navigation fichier)
- **React Native** + **TypeScript**
- **TanStack Query** (données)
- **expo-location** (GPS), **expo-camera** (preuves), **expo-notifications** (push)

## Démarrage

```bash
cd gtran-mobile
cp .env.example .env
npm install
npx expo start
```

## Personas V1

| Persona | Écrans prioritaires |
|---------|---------------------|
| Chauffeur | Missions, suivi GPS, livraison (photo + signature), messages |
| Gestionnaire | Dashboard lite, alertes, flotte, missions |
| Client | Notification livraison, signature (V2) |

## Arborescence

Voir `arborescence-gtran-mobile.md` à la racine du monorepo.

## Principes

1. **Miroir API** — chaque module backend a son pendant dans `src/modules/`
2. **Un canal WebSocket** — `lib/realtime/ws.ts` (batterie/data)
3. **Multi-tenant** — `TenantProvider` scope toutes les requêtes
4. **Offline-first V2** — file d'attente GPS et actions chauffeur
