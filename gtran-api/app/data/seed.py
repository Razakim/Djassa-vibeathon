from __future__ import annotations

from app.domain.mission_workflow import refresh_store_alerts, uid
from app.geo import build_route, get_city_coords, interpolate_route
from app.schemas import (
    AgenceDetail,
    AppStore,
    AuthAccount,
    Document,
    Driver,
    Employee,
    FuelRecord,
    Invoice,
    MaintenanceItem,
    Message,
    Mission,
    Payment,
    Vehicle,
)

DRIVER_MAP = {
    "Kouassi Jean": "d1",
    "Traoré Moussa": "d2",
    "Koné Ibrahim": "d3",
    "Bamba Seydou": "d4",
    "Ouattara Ali": "d5",
}

VEHICLE_MAP = {
    "CI-4521-BX": "v1",
    "CI-8890-AB": "v2",
    "CI-3312-CD": "v3",
    "CI-7745-EF": "v4",
    "CI-1198-GH": "v5",
    "CI-5567-IJ": "v6",
}


def _msg(**kwargs) -> Message:
    return Message(**kwargs)


def create_seed_store() -> AppStore:
    ag1 = "ag-1"
    vehicles = [
        Vehicle(id="v1", immatriculation="CI-4521-BX", type="Semi-remorque", statut="en_mission", driverId="d1", chauffeur="Kouassi Jean", km=245800, conso=32.5, disponibilite=0, agenceId=ag1, position=interpolate_route(build_route("Abidjan", "Bouaké"), 0.5)),
        Vehicle(id="v2", immatriculation="CI-8890-AB", type="Camion plateau", statut="disponible", driverId=None, chauffeur=None, km=189400, conso=28.1, disponibilite=100, agenceId=ag1, position=get_city_coords("Abidjan")),
        Vehicle(id="v3", immatriculation="CI-3312-CD", type="Camion frigorifique", statut="en_mission", driverId="d2", chauffeur="Traoré Moussa", km=312600, conso=35.8, disponibilite=0, agenceId=ag1, position=interpolate_route(build_route("San Pedro", "Abidjan"), 0.45)),
        Vehicle(id="v4", immatriculation="CI-7745-EF", type="Porte-conteneur", statut="maintenance", driverId=None, chauffeur=None, km=421000, conso=38.2, disponibilite=0, agenceId=ag1, position=get_city_coords("Abidjan")),
        Vehicle(id="v5", immatriculation="CI-1198-GH", type="Utilitaire", statut="immobilise", driverId=None, chauffeur=None, km=98200, conso=12.4, disponibilite=0, agenceId=ag1, position=get_city_coords("Abidjan"), immobiliseDepuis="2026-07-05"),
        Vehicle(id="v6", immatriculation="CI-5567-IJ", type="Semi-remorque", statut="disponible", driverId=None, chauffeur=None, km=156300, conso=31.0, disponibilite=100, agenceId=ag1, position=get_city_coords("Abidjan")),
    ]
    drivers = [
        Driver(id="d1", nom="Kouassi Jean", permis="C/E", categorie="International", ponctualite=94, km=12400, accidents=0, statut="en_mission", agenceId=ag1),
        Driver(id="d2", nom="Traoré Moussa", permis="C", categorie="National", ponctualite=88, km=9800, accidents=1, statut="en_mission", agenceId=ag1),
        Driver(id="d3", nom="Koné Ibrahim", permis="C/E", categorie="International", ponctualite=97, km=15200, accidents=0, statut="disponible", agenceId=ag1),
        Driver(id="d4", nom="Bamba Seydou", permis="C", categorie="National", ponctualite=82, km=7600, accidents=0, statut="disponible", agenceId=ag1),
        Driver(id="d5", nom="Ouattara Ali", permis="C/E", categorie="International", ponctualite=91, km=11100, accidents=0, statut="congé", agenceId=ag1),
    ]
    raw_missions = [
        ("M-2047", "SITAB", "Abidjan", "Bouaké", "Cacao", "24 t", "d1", "v1", "Kouassi Jean", "CI-4521-BX", "en_retard", 1850000, 1120000, 0.72),
        ("M-2048", "CFAO Motors", "San Pedro", "Abidjan", "Véhicules", "18 t", "d2", "v3", "Traoré Moussa", "CI-3312-CD", "en_cours", 2400000, 1450000, 0.45),
        ("M-2049", "Nestlé CI", "Abidjan", "Yamoussoukro", "Produits alimentaires", "12 t", "d3", "v6", "Koné Ibrahim", "CI-5567-IJ", "planifiee", 980000, 620000, 0.0),
        ("M-2050", "Bolloré", "Abidjan", "Dakar", "Conteneurs", "32 t", "d4", "v2", "Bamba Seydou", "CI-8890-AB", "planifiee", 4200000, 2800000, 0.0),
        ("M-2045", "SUCRIVOIRE", "Ferkessédougou", "Abidjan", "Sucre", "26 t", "d5", "v4", "Ouattara Ali", "CI-7745-EF", "livree", 2100000, 1380000, 1.0),
    ]
    missions = [
        Mission(
            id=mid, client=c, depart=d, destination=dst, marchandise=m, poids=p,
            driverId=dr, vehicleId=vh, chauffeur=ch, vehicule=ve, statut=st,
            prix=px, cout=co, agenceId=ag1, route=build_route(d, dst), progress=pr,
            createdAt="2026-07-01T08:00:00.000Z",
        )
        for mid, c, d, dst, m, p, dr, vh, ch, ve, st, px, co, pr in raw_missions
    ]

    store = AppStore(
        vehicles=vehicles,
        drivers=drivers,
        missions=missions,
        documents=[
            Document(id="doc1", type="Assurance", entite="CI-8890-AB", expiration="2026-07-23", statut="expire_bientot", agenceId=ag1, vehicleId="v2"),
            Document(id="doc2", type="Visite technique", entite="CI-4521-BX", expiration="2026-09-15", statut="valide", agenceId=ag1, vehicleId="v1"),
            Document(id="doc3", type="Permis de conduire", entite="Kouassi Jean", expiration="2027-03-10", statut="valide", agenceId=ag1, driverId="d1"),
            Document(id="doc4", type="Lettre de voiture", entite="M-2048", expiration="2026-07-12", statut="valide", agenceId=ag1, missionId="M-2048"),
            Document(id="doc5", type="Carte grise", entite="CI-3312-CD", expiration="2028-01-20", statut="valide", agenceId=ag1, vehicleId="v3"),
        ],
        invoices=[
            Invoice(id="F-1089", client="SITAB", montant=1850000, echeance="2026-05-26", statut="en_retard", agenceId=ag1),
            Invoice(id="F-1090", client="CFAO Motors", montant=2400000, echeance="2026-07-25", statut="en_attente", agenceId=ag1, missionId="M-2048"),
            Invoice(id="F-1091", client="Nestlé CI", montant=980000, echeance="2026-07-20", statut="partiel", agenceId=ag1),
            Invoice(id="F-1085", client="Bolloré", montant=4200000, echeance="2026-06-30", statut="paye", agenceId=ag1),
        ],
        payments=[
            Payment(id="p1", reference="WAVE-78234", client="Bolloré", montant=4200000, methode="Wave", statut="paye", date="2026-06-28", agenceId=ag1),
            Payment(id="p2", reference="OM-45123", client="Nestlé CI", montant=500000, methode="Orange Money", statut="partiel", date="2026-07-05", agenceId=ag1),
            Payment(id="p3", reference="ESC-0012", client="CFAO Motors", montant=2400000, methode="Séquestre", statut="en_attente", date="2026-07-10", agenceId=ag1),
        ],
        maintenanceItems=[
            MaintenanceItem(id="m1", vehicleId="v1", vehicule="CI-4521-BX", type="Vidange", echeance="2026-07-20", kmRestant=500, priorite="haute", agenceId=ag1),
            MaintenanceItem(id="m2", vehicleId="v4", vehicule="CI-7745-EF", type="Révision freins", echeance="2026-07-15", kmRestant=0, priorite="critique", agenceId=ag1),
            MaintenanceItem(id="m3", vehicleId="v3", vehicule="CI-3312-CD", type="Pneus avant", echeance="2026-08-01", kmRestant=3000, priorite="moyenne", agenceId=ag1),
        ],
        fuelRecords=[
            FuelRecord(id="f1", vehicleId="v1", vehicule="CI-4521-BX", station="Total Plateau", litres=280, montant=196000, conso=32.5, anomalie=False, date="2026-07-09", agenceId=ag1),
            FuelRecord(id="f2", vehicleId="v3", vehicule="CI-3312-CD", station="Shell Yopougon", litres=320, montant=224000, conso=35.8, anomalie=False, date="2026-07-08", agenceId=ag1),
            FuelRecord(id="f3", vehicleId="v3", vehicule="CI-3312-CD", station="Petroci Bouaké", litres=290, montant=203000, conso=42.1, anomalie=True, date="2026-07-07", agenceId=ag1),
        ],
        employees=[
            Employee(id="e1", nom="Kouassi Jean", poste="Chauffeur", contrat="CDI", conges=12, statut="actif", agenceId=ag1),
            Employee(id="e2", nom="Aya Koné", poste="Comptable", contrat="CDI", conges=8, statut="actif", agenceId=ag1),
            Employee(id="e3", nom="Mamadou Sy", poste="Mécanicien", contrat="CDD", conges=0, statut="actif", agenceId=ag1),
            Employee(id="e4", nom="Fatou Bamba", poste="Dispatcher", contrat="CDI", conges=15, statut="congé", agenceId=ag1),
        ],
        messages=[
            _msg(id="msg1", **{"from": "Fatou Bamba", "subject": "Mission M-2049 — chauffeur assigné", "body": "Mission M-2049 — chauffeur assigné", "time": "08:32", "unread": True, "agenceId": ag1}),
            _msg(id="msg2", **{"from": "Système", "subject": "Alerte maintenance CI-7745-EF", "body": "Alerte maintenance CI-7745-EF", "time": "07:15", "unread": True, "agenceId": ag1}),
            _msg(id="msg3", **{"from": "Aya Koné", "subject": "Relance client SITAB envoyée", "body": "Relance client SITAB envoyée", "time": "Hier", "unread": False, "agenceId": ag1}),
        ],
        agences=[
            AgenceDetail(id="ag-1", nom="Siège Abidjan", employes=45, vehicules=28, ville="Abidjan"),
            AgenceDetail(id="ag-2", nom="Agence Bouaké", employes=12, vehicules=8, ville="Bouaké"),
            AgenceDetail(id="ag-3", nom="Agence San Pedro", employes=8, vehicules=6, ville="San Pedro"),
        ],
        accounts=[
            AuthAccount(id="u-1", nom="Amadou Diallo", email="amadou@transafrique.ci", password="demo123", role="Directeur exploitation", entrepriseId="ent-1"),
        ],
    )

    # Agence Bouaké
    ag2 = "ag-2"
    store.vehicles.extend([
        Vehicle(id="v-b1", immatriculation="CI-2201-BK", type="Camion plateau", statut="disponible", driverId=None, chauffeur=None, km=98000, conso=29.5, disponibilite=100, agenceId=ag2, position=get_city_coords("Bouaké")),
        Vehicle(id="v-b2", immatriculation="CI-2202-BK", type="Semi-remorque", statut="en_mission", driverId="d-b1", chauffeur="Diabaté Oumar", km=201000, conso=31.2, disponibilite=0, agenceId=ag2, position=interpolate_route(build_route("Bouaké", "Abidjan"), 0.35)),
    ])
    store.drivers.extend([
        Driver(id="d-b1", nom="Diabaté Oumar", permis="C/E", categorie="National", ponctualite=90, km=8200, accidents=0, statut="en_mission", agenceId=ag2),
        Driver(id="d-b2", nom="Yao Aka", permis="C", categorie="National", ponctualite=86, km=5400, accidents=0, statut="disponible", agenceId=ag2),
    ])
    store.missions.append(
        Mission(id="M-B201", client="SODECI Nord", depart="Bouaké", destination="Abidjan", marchandise="Tuyaux PVC", poids="14 t",
                driverId="d-b1", vehicleId="v-b2", chauffeur="Diabaté Oumar", vehicule="CI-2202-BK", statut="en_cours",
                prix=1200000, cout=780000, agenceId=ag2, route=build_route("Bouaké", "Abidjan"), progress=0.35, createdAt="2026-07-08T06:00:00.000Z")
    )

    # Agence San Pedro
    ag3 = "ag-3"
    store.vehicles.extend([
        Vehicle(id="v-s1", immatriculation="CI-3301-SP", type="Porte-conteneur", statut="disponible", driverId=None, chauffeur=None, km=145000, conso=33.0, disponibilite=100, agenceId=ag3, position=get_city_coords("San Pedro")),
        Vehicle(id="v-s2", immatriculation="CI-3302-SP", type="Camion frigorifique", statut="maintenance", driverId=None, chauffeur=None, km=267000, conso=34.5, disponibilite=0, agenceId=ag3, position=get_city_coords("San Pedro")),
    ])
    store.drivers.append(Driver(id="d-s1", nom="Gnahoré Paul", permis="C/E", categorie="International", ponctualite=93, km=10100, accidents=0, statut="disponible", agenceId=ag3))
    store.missions.append(
        Mission(id="M-S301", client="Port Autonome SP", depart="San Pedro", destination="Abidjan", marchandise="Conteneur 20 pieds", poids="22 t",
                driverId="d-s1", vehicleId="v-s1", chauffeur="Gnahoré Paul", vehicule="CI-3301-SP", statut="planifiee",
                prix=1650000, cout=1050000, agenceId=ag3, route=build_route("San Pedro", "Abidjan"), progress=0.0, createdAt="2026-07-10T14:00:00.000Z")
    )
    store.documents.extend([
        Document(id="doc-b1", type="Assurance", entite="CI-2201-BK", expiration="2026-07-22", statut="expire_bientot", agenceId=ag2, vehicleId="v-b1"),
        Document(id="doc-s1", type="Visite technique", entite="CI-3302-SP", expiration="2026-07-18", statut="expire_bientot", agenceId=ag3, vehicleId="v-s2"),
    ])
    store.invoices.extend([
        Invoice(id="F-B101", client="SODECI Nord", montant=1200000, echeance="2026-08-01", statut="en_attente", agenceId=ag2, missionId="M-B201"),
        Invoice(id="F-S101", client="Port Autonome SP", montant=1650000, echeance="2026-08-15", statut="en_attente", agenceId=ag3, missionId="M-S301"),
    ])
    store.maintenanceItems.append(
        MaintenanceItem(id="m-b1", vehicleId="v-b1", vehicule="CI-2201-BK", type="Vidange", echeance="2026-07-25", kmRestant=400, priorite="haute", agenceId=ag2)
    )

    return refresh_store_alerts(store)
