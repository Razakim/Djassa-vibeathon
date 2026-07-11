import sys
import os
from pathlib import Path

# Ajouter le répertoire racine au PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.store import get_supabase
from app.data.seed import create_seed_store
from app.auth import hash_password

def seed_database():
    print("Initialisation du client Supabase...")
    try:
        supabase = get_supabase()
    except RuntimeError as e:
        print(f"Erreur: {e}")
        print("Assurez-vous que SUPABASE_URL et SUPABASE_KEY sont définis.")
        return

    print("Génération des données de démonstration...")
    store = create_seed_store()

    # 1. Agences
    print("Insertion des agences...")
    for ag in store.agences:
        supabase.table("agences").upsert(ag.model_dump(by_alias=True)).execute()

    # 2. Accounts
    print("Insertion des comptes utilisateurs...")
    for acc in store.accounts:
        data = acc.model_dump(by_alias=True)
        # Hacher le mot de passe pour la compatibilité avec l'API
        data["password"] = hash_password(data["password"])
        supabase.table("accounts").upsert(data).execute()

    # 3. Drivers
    print("Insertion des chauffeurs...")
    for dr in store.drivers:
        supabase.table("drivers").upsert(dr.model_dump(by_alias=True)).execute()

    # 4. Vehicles
    print("Insertion des véhicules...")
    for vh in store.vehicles:
        # Pydantic json export handles list/tuple for JSONB correctly usually, but we ensure it's a dict
        data = vh.model_dump(by_alias=True)
        supabase.table("vehicles").upsert(data).execute()

    # 5. Missions
    print("Insertion des missions...")
    for m in store.missions:
        supabase.table("missions").upsert(m.model_dump(by_alias=True)).execute()

    # 6. Invoices
    print("Insertion des factures...")
    for inv in store.invoices:
        supabase.table("invoices").upsert(inv.model_dump(by_alias=True)).execute()

    # 7. Payments
    print("Insertion des paiements...")
    for pay in store.payments:
        supabase.table("payments").upsert(pay.model_dump(by_alias=True)).execute()

    # 8. Documents
    print("Insertion des documents...")
    for doc in store.documents:
        supabase.table("documents").upsert(doc.model_dump(by_alias=True)).execute()

    # 9. Maintenance
    print("Insertion de la maintenance...")
    for maint in store.maintenanceItems:
        supabase.table("maintenanceItems").upsert(maint.model_dump(by_alias=True)).execute()

    # 10. Fuel Records
    print("Insertion des enregistrements de carburant...")
    for fuel in store.fuelRecords:
        supabase.table("fuelRecords").upsert(fuel.model_dump(by_alias=True)).execute()

    # 11. Employees
    print("Insertion des employés...")
    for emp in store.employees:
        supabase.table("employees").upsert(emp.model_dump(by_alias=True)).execute()

    # 12. Messages
    print("Insertion des messages...")
    for msg in store.messages:
        supabase.table("messages").upsert(msg.model_dump(by_alias=True)).execute()

    # 13. Payment Gateways
    print("Insertion des méthodes de paiement...")
    for method, connected in store.paymentGateways.items():
        supabase.table("paymentGateways").upsert({"method": method, "connected": connected}).execute()

    print("✅ Seed terminé avec succès ! Toutes les données sont dans Supabase.")

if __name__ == "__main__":
    seed_database()
