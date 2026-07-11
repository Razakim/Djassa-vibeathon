import type { MissionStatus, PaymentStatus, VehicleStatus } from "@/types/shared"

export const dashboardStats = {
  vehiculesDisponibles: 18,
  missionsEnCours: 12,
  missionsEnRetard: 3,
  revenusMois: 48_750_000,
  depensesMois: 31_200_000,
  carburantMois: 8_450_000,
  alertes: 7,
  documentsExpirant: 5,
}

export const revenueChart = [
  { mois: "Jan", revenus: 38, depenses: 28 },
  { mois: "Fév", revenus: 42, depenses: 30 },
  { mois: "Mar", revenus: 45, depenses: 29 },
  { mois: "Avr", revenus: 41, depenses: 31 },
  { mois: "Mai", revenus: 48, depenses: 32 },
  { mois: "Juin", revenus: 49, depenses: 31 },
]

export const alerts = [
  { id: "a1", type: "maintenance", message: "CI-4521-BX — vidange due dans 500 km", severity: "warning" },
  { id: "a2", type: "document", message: "Assurance camion CI-8890-AB expire dans 12 jours", severity: "danger" },
  { id: "a3", type: "mission", message: "Mission #M-2047 en retard de 2h30", severity: "danger" },
  { id: "a4", type: "paiement", message: "Client SITAB — facture impayée depuis 45 jours", severity: "warning" },
  { id: "a5", type: "carburant", message: "Surconsommation détectée — CI-3312-CD (+18%)", severity: "info" },
]

export const vehicles = [
  { id: "v1", immatriculation: "CI-4521-BX", type: "Semi-remorque", statut: "en_mission" as VehicleStatus, chauffeur: "Kouassi Jean", km: 245_800, conso: 32.5, disponibilite: 0 },
  { id: "v2", immatriculation: "CI-8890-AB", type: "Camion plateau", statut: "disponible" as VehicleStatus, chauffeur: null, km: 189_400, conso: 28.1, disponibilite: 100 },
  { id: "v3", immatriculation: "CI-3312-CD", type: "Camion frigorifique", statut: "en_mission" as VehicleStatus, chauffeur: "Traoré Moussa", km: 312_600, conso: 35.8, disponibilite: 0 },
  { id: "v4", immatriculation: "CI-7745-EF", type: "Porte-conteneur", statut: "maintenance" as VehicleStatus, chauffeur: null, km: 421_000, conso: 38.2, disponibilite: 0 },
  { id: "v5", immatriculation: "CI-1198-GH", type: "Utilitaire", statut: "immobilise" as VehicleStatus, chauffeur: null, km: 98_200, conso: 12.4, disponibilite: 0 },
  { id: "v6", immatriculation: "CI-5567-IJ", type: "Semi-remorque", statut: "disponible" as VehicleStatus, chauffeur: null, km: 156_300, conso: 31.0, disponibilite: 100 },
]

export const drivers = [
  { id: "d1", nom: "Kouassi Jean", permis: "C/E", categorie: "International", ponctualite: 94, km: 12_400, accidents: 0, statut: "en_mission" },
  { id: "d2", nom: "Traoré Moussa", permis: "C", categorie: "National", ponctualite: 88, km: 9_800, accidents: 1, statut: "en_mission" },
  { id: "d3", nom: "Koné Ibrahim", permis: "C/E", categorie: "International", ponctualite: 97, km: 15_200, accidents: 0, statut: "disponible" },
  { id: "d4", nom: "Bamba Seydou", permis: "C", categorie: "National", ponctualite: 82, km: 7_600, accidents: 0, statut: "disponible" },
  { id: "d5", nom: "Ouattara Ali", permis: "C/E", categorie: "International", ponctualite: 91, km: 11_100, accidents: 0, statut: "congé" },
]

export const missions = [
  { id: "M-2047", client: "SITAB", depart: "Abidjan", destination: "Bouaké", marchandise: "Cacao", poids: "24 t", chauffeur: "Kouassi Jean", vehicule: "CI-4521-BX", statut: "en_retard" as MissionStatus, prix: 1_850_000, cout: 1_120_000 },
  { id: "M-2048", client: "CFAO Motors", depart: "San Pedro", destination: "Abidjan", marchandise: "Véhicules", poids: "18 t", chauffeur: "Traoré Moussa", vehicule: "CI-3312-CD", statut: "en_cours" as MissionStatus, prix: 2_400_000, cout: 1_450_000 },
  { id: "M-2049", client: "Nestlé CI", depart: "Abidjan", destination: "Yamoussoukro", marchandise: "Produits alimentaires", poids: "12 t", chauffeur: "Koné Ibrahim", vehicule: "CI-5567-IJ", statut: "planifiee" as MissionStatus, prix: 980_000, cout: 620_000 },
  { id: "M-2050", client: "Bolloré", depart: "Abidjan", destination: "Dakar", marchandise: "Conteneurs", poids: "32 t", chauffeur: "Bamba Seydou", vehicule: "CI-8890-AB", statut: "planifiee" as MissionStatus, prix: 4_200_000, cout: 2_800_000 },
  { id: "M-2045", client: "SUCRIVOIRE", depart: "Ferkessédougou", destination: "Abidjan", marchandise: "Sucre", poids: "26 t", chauffeur: "Ouattara Ali", vehicule: "CI-7745-EF", statut: "livree" as MissionStatus, prix: 2_100_000, cout: 1_380_000 },
]

export const documents = [
  { id: "doc1", type: "Assurance", entite: "CI-8890-AB", expiration: "2026-07-23", statut: "expire_bientot" },
  { id: "doc2", type: "Visite technique", entite: "CI-4521-BX", expiration: "2026-09-15", statut: "valide" },
  { id: "doc3", type: "Permis de conduire", entite: "Kouassi Jean", expiration: "2027-03-10", statut: "valide" },
  { id: "doc4", type: "Lettre de voiture", entite: "M-2048", expiration: "2026-07-12", statut: "valide" },
  { id: "doc5", type: "Carte grise", entite: "CI-3312-CD", expiration: "2028-01-20", statut: "valide" },
]

export const invoices = [
  { id: "F-1089", client: "SITAB", montant: 1_850_000, echeance: "2026-05-26", statut: "en_retard" as PaymentStatus },
  { id: "F-1090", client: "CFAO Motors", montant: 2_400_000, echeance: "2026-07-25", statut: "en_attente" as PaymentStatus },
  { id: "F-1091", client: "Nestlé CI", montant: 980_000, echeance: "2026-07-20", statut: "partiel" as PaymentStatus },
  { id: "F-1085", client: "Bolloré", montant: 4_200_000, echeance: "2026-06-30", statut: "paye" as PaymentStatus },
]

export const payments = [
  { id: "p1", reference: "WAVE-78234", client: "Bolloré", montant: 4_200_000, methode: "Wave", statut: "paye" as PaymentStatus, date: "2026-06-28" },
  { id: "p2", reference: "OM-45123", client: "Nestlé CI", montant: 500_000, methode: "Orange Money", statut: "partiel" as PaymentStatus, date: "2026-07-05" },
  { id: "p3", reference: "ESC-0012", client: "CFAO Motors", montant: 2_400_000, methode: "Séquestre", statut: "en_attente" as PaymentStatus, date: "2026-07-10" },
]

export const maintenanceItems = [
  { id: "m1", vehicule: "CI-4521-BX", type: "Vidange", echeance: "2026-07-20", kmRestant: 500, priorite: "haute" },
  { id: "m2", vehicule: "CI-7745-EF", type: "Révision freins", echeance: "2026-07-15", kmRestant: 0, priorite: "critique" },
  { id: "m3", vehicule: "CI-3312-CD", type: "Pneus avant", echeance: "2026-08-01", kmRestant: 3000, priorite: "moyenne" },
]

export const fuelRecords = [
  { id: "f1", vehicule: "CI-4521-BX", station: "Total Plateau", litres: 280, montant: 196_000, conso: 32.5, anomalie: false, date: "2026-07-09" },
  { id: "f2", vehicule: "CI-3312-CD", station: "Shell Yopougon", litres: 320, montant: 224_000, conso: 35.8, anomalie: false, date: "2026-07-08" },
  { id: "f3", vehicule: "CI-3312-CD", station: "Petroci Bouaké", litres: 290, montant: 203_000, conso: 42.1, anomalie: true, date: "2026-07-07" },
]

export const analytics = {
  topVehicules: [
    { nom: "CI-5567-IJ", marge: 18_400_000 },
    { nom: "CI-4521-BX", marge: 15_200_000 },
    { nom: "CI-3312-CD", marge: 12_800_000 },
  ],
  topChauffeurs: [
    { nom: "Koné Ibrahim", marge: 9_800_000 },
    { nom: "Kouassi Jean", marge: 8_400_000 },
    { nom: "Traoré Moussa", marge: 7_200_000 },
  ],
  topClients: [
    { nom: "Bolloré", marge: 22_500_000 },
    { nom: "CFAO Motors", marge: 18_200_000 },
    { nom: "SITAB", marge: 14_600_000 },
  ],
  topLignes: [
    { nom: "Abidjan → Dakar", marge: 28_400_000 },
    { nom: "San Pedro → Abidjan", marge: 19_800_000 },
    { nom: "Abidjan → Bouaké", marge: 12_300_000 },
  ],
}

export const employees = [
  { id: "e1", nom: "Kouassi Jean", poste: "Chauffeur", contrat: "CDI", conges: 12, statut: "actif" },
  { id: "e2", nom: "Aya Koné", poste: "Comptable", contrat: "CDI", conges: 8, statut: "actif" },
  { id: "e3", nom: "Mamadou Sy", poste: "Mécanicien", contrat: "CDD", conges: 0, statut: "actif" },
  { id: "e4", nom: "Fatou Bamba", poste: "Dispatcher", contrat: "CDI", conges: 15, statut: "congé" },
]

export const messages = [
  { id: "msg1", from: "Fatou Bamba", subject: "Mission M-2049 — chauffeur assigné", time: "08:32", unread: true },
  { id: "msg2", from: "Système", subject: "Alerte maintenance CI-7745-EF", time: "07:15", unread: true },
  { id: "msg3", from: "Aya Koné", subject: "Relance client SITAB envoyée", time: "Hier", unread: false },
]

export const trackingVehicles = [
  { id: "t1", immatriculation: "CI-4521-BX", chauffeur: "Kouassi Jean", vitesse: 72, position: "Bouaké (PK 142)", statut: "en_route", arret: "12 min" },
  { id: "t2", immatriculation: "CI-3312-CD", chauffeur: "Traoré Moussa", vitesse: 0, position: "San Pedro (port)", statut: "arret", arret: "45 min" },
  { id: "t3", immatriculation: "CI-5567-IJ", chauffeur: "Koné Ibrahim", vitesse: 0, position: "Abidjan (garage)", statut: "disponible", arret: "—" },
]

export const agences = [
  { id: "ag-1", nom: "Siège Abidjan", employes: 45, vehicules: 28 },
  { id: "ag-2", nom: "Agence Bouaké", employes: 12, vehicules: 8 },
  { id: "ag-3", nom: "Agence San Pedro", employes: 8, vehicules: 6 },
]

export const aiSuggestions = [
  "Quels camions ont coûté le plus cher ce mois-ci ?",
  "Quels clients paient systématiquement en retard ?",
  "Résume les missions en retard aujourd'hui",
  "Quel est le bénéfice de la mission M-2048 ?",
]
