import { buildRoute, getCityCoords, interpolateRoute } from "@/lib/geo/cities"
import type { AppStore } from "@/types/entities"
import {
  drivers,
  employees,
  fuelRecords,
  invoices,
  maintenanceItems,
  messages,
  missions,
  payments,
  vehicles,
  documents,
  agences,
} from "@/lib/mock-data"
import { refreshStoreAlerts } from "./mission-workflow"

const DRIVER_MAP: Record<string, string> = {
  "Kouassi Jean": "d1",
  "Traoré Moussa": "d2",
  "Koné Ibrahim": "d3",
  "Bamba Seydou": "d4",
  "Ouattara Ali": "d5",
}

const VEHICLE_MAP: Record<string, string> = {
  "CI-4521-BX": "v1",
  "CI-8890-AB": "v2",
  "CI-3312-CD": "v3",
  "CI-7745-EF": "v4",
  "CI-1198-GH": "v5",
  "CI-5567-IJ": "v6",
}

function withMissionIds(m: (typeof missions)[0], agenceId: string) {
  const route = buildRoute(m.depart, m.destination)
  const progress =
    m.statut === "livree" ? 1 : m.statut === "planifiee" ? 0 : m.statut === "en_retard" ? 0.72 : 0.45
  return {
    ...m,
    agenceId,
    driverId: DRIVER_MAP[m.chauffeur] ?? "d1",
    vehicleId: VEHICLE_MAP[m.vehicule] ?? "v1",
    route,
    progress,
    createdAt: "2026-07-01T08:00:00.000Z",
  }
}

function seedAgence1(): Pick<
  AppStore,
  "vehicles" | "drivers" | "missions" | "documents" | "invoices" | "payments" | "maintenanceItems" | "fuelRecords" | "employees" | "messages"
> {
  const agenceId = "ag-1"

  return {
    vehicles: vehicles.map((v) => ({
      ...v,
      agenceId,
      driverId: v.chauffeur ? (DRIVER_MAP[v.chauffeur] ?? null) : null,
      position:
        v.statut === "en_mission"
          ? interpolateRoute(buildRoute("Abidjan", "Bouaké"), 0.5)
          : getCityCoords("Abidjan"),
      immobiliseDepuis: v.statut === "immobilise" ? "2026-07-05" : undefined,
    })),
    drivers: drivers.map((d) => ({ ...d, agenceId })),
    missions: missions.map((m) => withMissionIds(m, agenceId)),
    documents: documents.map((d) => ({
      ...d,
      agenceId,
      vehicleId: VEHICLE_MAP[d.entite],
      missionId: d.entite.startsWith("M-") ? d.entite : undefined,
    })),
    invoices: invoices.map((i) => ({
      ...i,
      agenceId,
      missionId: missions.find((m) => m.client === i.client)?.id,
    })),
    payments: payments.map((p) => ({ ...p, agenceId })),
    maintenanceItems: maintenanceItems.map((m) => ({
      ...m,
      agenceId,
      vehicleId: VEHICLE_MAP[m.vehicule] ?? "v1",
    })),
    fuelRecords: fuelRecords.map((f) => ({
      ...f,
      agenceId,
      vehicleId: VEHICLE_MAP[f.vehicule] ?? "v1",
    })),
    employees: employees.map((e) => ({ ...e, agenceId })),
    messages: messages.map((m) => ({
      ...m,
      body: m.subject,
      agenceId,
    })),
  }
}

function seedAgence2(): Pick<AppStore, "vehicles" | "drivers" | "missions"> {
  const agenceId = "ag-2"
  return {
    vehicles: [
      {
        id: "v-b1",
        immatriculation: "CI-2201-BK",
        type: "Camion plateau",
        statut: "disponible",
        driverId: null,
        chauffeur: null,
        km: 98_000,
        conso: 29.5,
        disponibilite: 100,
        agenceId,
        position: getCityCoords("Bouaké"),
      },
      {
        id: "v-b2",
        immatriculation: "CI-2202-BK",
        type: "Semi-remorque",
        statut: "en_mission",
        driverId: "d-b1",
        chauffeur: "Diabaté Oumar",
        km: 201_000,
        conso: 31.2,
        disponibilite: 0,
        agenceId,
        position: interpolateRoute(buildRoute("Bouaké", "Abidjan"), 0.35),
      },
    ],
    drivers: [
      {
        id: "d-b1",
        nom: "Diabaté Oumar",
        permis: "C/E",
        categorie: "National",
        ponctualite: 90,
        km: 8_200,
        accidents: 0,
        statut: "en_mission",
        agenceId,
      },
      {
        id: "d-b2",
        nom: "Yao Aka",
        permis: "C",
        categorie: "National",
        ponctualite: 86,
        km: 5_400,
        accidents: 0,
        statut: "disponible",
        agenceId,
      },
    ],
    missions: [
      {
        id: "M-B201",
        client: "SODECI Nord",
        depart: "Bouaké",
        destination: "Abidjan",
        marchandise: "Tuyaux PVC",
        poids: "14 t",
        driverId: "d-b1",
        vehicleId: "v-b2",
        chauffeur: "Diabaté Oumar",
        vehicule: "CI-2202-BK",
        statut: "en_cours",
        prix: 1_200_000,
        cout: 780_000,
        agenceId,
        route: buildRoute("Bouaké", "Abidjan"),
        progress: 0.35,
        createdAt: "2026-07-08T06:00:00.000Z",
      },
    ],
  }
}

function seedAgence3(): Pick<AppStore, "vehicles" | "drivers" | "missions"> {
  const agenceId = "ag-3"
  return {
    vehicles: [
      {
        id: "v-s1",
        immatriculation: "CI-3301-SP",
        type: "Porte-conteneur",
        statut: "disponible",
        driverId: null,
        chauffeur: null,
        km: 145_000,
        conso: 33.0,
        disponibilite: 100,
        agenceId,
        position: getCityCoords("San Pedro"),
      },
      {
        id: "v-s2",
        immatriculation: "CI-3302-SP",
        type: "Camion frigorifique",
        statut: "maintenance",
        driverId: null,
        chauffeur: null,
        km: 267_000,
        conso: 34.5,
        disponibilite: 0,
        agenceId,
        position: getCityCoords("San Pedro"),
      },
    ],
    drivers: [
      {
        id: "d-s1",
        nom: "Gnahoré Paul",
        permis: "C/E",
        categorie: "International",
        ponctualite: 93,
        km: 10_100,
        accidents: 0,
        statut: "disponible",
        agenceId,
      },
    ],
    missions: [
      {
        id: "M-S301",
        client: "Port Autonome SP",
        depart: "San Pedro",
        destination: "Abidjan",
        marchandise: "Conteneur 20 pieds",
        poids: "22 t",
        driverId: "d-s1",
        vehicleId: "v-s1",
        chauffeur: "Gnahoré Paul",
        vehicule: "CI-3301-SP",
        statut: "planifiee",
        prix: 1_650_000,
        cout: 1_050_000,
        agenceId,
        route: buildRoute("San Pedro", "Abidjan"),
        progress: 0,
        createdAt: "2026-07-10T14:00:00.000Z",
      },
    ],
  }
}

export function createSeedStore(): AppStore {
  const ag1 = seedAgence1()
  const ag2 = seedAgence2()
  const ag3 = seedAgence3()

  const base: AppStore = {
    vehicles: [...ag1.vehicles, ...ag2.vehicles, ...ag3.vehicles],
    drivers: [...ag1.drivers, ...ag2.drivers, ...ag3.drivers],
    missions: [...ag1.missions, ...ag2.missions, ...ag3.missions],
    documents: [
      ...ag1.documents,
      {
        id: "doc-b1",
        type: "Assurance",
        entite: "CI-2201-BK",
        expiration: "2026-07-22",
        statut: "expire_bientot",
        agenceId: "ag-2",
        vehicleId: "v-b1",
      },
      {
        id: "doc-s1",
        type: "Visite technique",
        entite: "CI-3302-SP",
        expiration: "2026-07-18",
        statut: "expire_bientot",
        agenceId: "ag-3",
        vehicleId: "v-s2",
      },
    ],
    invoices: [
      ...ag1.invoices,
      {
        id: "F-B101",
        client: "SODECI Nord",
        montant: 1_200_000,
        echeance: "2026-08-01",
        statut: "en_attente",
        agenceId: "ag-2",
        missionId: "M-B201",
      },
      {
        id: "F-S101",
        client: "Port Autonome SP",
        montant: 1_650_000,
        echeance: "2026-08-15",
        statut: "en_attente",
        agenceId: "ag-3",
        missionId: "M-S301",
      },
    ],
    payments: ag1.payments,
    maintenanceItems: [
      ...ag1.maintenanceItems,
      {
        id: "m-b1",
        vehicleId: "v-b1",
        vehicule: "CI-2201-BK",
        type: "Vidange",
        echeance: "2026-07-25",
        kmRestant: 400,
        priorite: "haute",
        agenceId: "ag-2",
      },
    ],
    fuelRecords: ag1.fuelRecords,
    employees: ag1.employees,
    messages: ag1.messages,
    alerts: [],
    agences: agences.map((a, i) => ({
      ...a,
      ville: ["Abidjan", "Bouaké", "San Pedro"][i] ?? "Abidjan",
    })),
    accounts: [
      {
        id: "u-1",
        nom: "Amadou Diallo",
        email: "amadou@transafrique.ci",
        password: "demo123",
        role: "Directeur exploitation",
        entrepriseId: "ent-1",
      },
    ],
  }

  return refreshStoreAlerts(base)
}
