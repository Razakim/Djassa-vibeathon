from __future__ import annotations

from typing import TypeVar

from fastapi import APIRouter, Depends, HTTPException, Query

from app.auth import create_access_token, get_current_user, hash_password, verify_password
from app.domain.mission_workflow import uid
from app.schemas import (
    AiQueryRequest,
    AiQueryResponse,
    AuthResponse,
    LoginRequest,
    MissionCreateInput,
    MissionTransitionRequest,
    RegisterRequest,
    UserOut,
)
from app.services import create_item, delete_item, filter_agence, list_collection, search_global, update_item
from app.store import get_supabase

router = APIRouter(prefix="/api/v1")
T = TypeVar("T")


# --- Auth ---

@router.get("/health")
def health():
    return {"status": "ok", "service": "gtran-api", "mode": "supabase"}


@router.get("/auth/me", response_model=UserOut)
def get_me(user: UserOut = Depends(get_current_user)):
    return user


@router.post("/auth/login", response_model=AuthResponse)
def login(body: LoginRequest):
    sb = get_supabase()
    res = sb.table("accounts").select("*").eq("email", body.email).execute()
    if not res.data or not verify_password(body.password, res.data[0]["password"]):
        raise HTTPException(401, "Email ou mot de passe incorrect")
    acc = res.data[0]
    user = UserOut(id=acc["id"], nom=acc["nom"], email=acc["email"], role=acc["role"], entrepriseId=acc["entrepriseId"])
    return AuthResponse(access_token=create_access_token(user), user=user)


@router.post("/auth/register", response_model=AuthResponse)
def register(body: RegisterRequest):
    sb = get_supabase()
    res = sb.table("accounts").select("id").eq("email", body.email).execute()
    if res.data:
        raise HTTPException(400, "Cet email est déjà utilisé")
    
    account = {
        "id": uid("u"),
        "nom": body.nom,
        "email": body.email,
        "password": hash_password(body.password),
        "role": "Administrateur",
        "entrepriseId": "ent-1",
    }
    
    inserted = sb.table("accounts").insert(account).execute()
    acc = inserted.data[0]
    user = UserOut(id=acc["id"], nom=acc["nom"], email=acc["email"], role=acc["role"], entrepriseId=acc["entrepriseId"])
    return AuthResponse(access_token=create_access_token(user), user=user)


@router.patch("/auth/me", response_model=UserOut)
def update_me(body: dict, user: UserOut = Depends(get_current_user)):
    sb = get_supabase()
    patch = {k: v for k, v in body.items() if k in ("nom", "email") and v is not None}
    if not patch:
        return user
    res = sb.table("accounts").update(patch).eq("id", user.id).execute()
    if not res.data:
        raise HTTPException(404, "Utilisateur introuvable")
    acc = res.data[0]
    return UserOut(id=acc["id"], nom=acc["nom"], email=acc["email"], role=acc["role"], entrepriseId=acc["entrepriseId"])


# --- Agences ---

@router.get("/agences")
def get_agences(user: UserOut = Depends(get_current_user)):
    res = get_supabase().table("agences").select("*").execute()
    return res.data


# --- Vehicles ---

@router.get("/vehicles")
def get_vehicles(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_supabase(), "vehicles", agence_id)


@router.post("/vehicles")
def post_vehicle(data: dict, user: UserOut = Depends(get_current_user)):
    return create_item(get_supabase(), "vehicles", data)


@router.patch("/vehicles/{item_id}")
def patch_vehicle(item_id: str, data: dict, user: UserOut = Depends(get_current_user)):
    return update_item(get_supabase(), "vehicles", item_id, data)


@router.delete("/vehicles/{item_id}", status_code=204)
def del_vehicle(item_id: str, user: UserOut = Depends(get_current_user)):
    delete_item(get_supabase(), "vehicles", item_id)


# --- Drivers ---

@router.get("/drivers")
def get_drivers(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_supabase(), "drivers", agence_id)


@router.post("/drivers")
def post_driver(data: dict, user: UserOut = Depends(get_current_user)):
    return create_item(get_supabase(), "drivers", data)


@router.patch("/drivers/{item_id}")
def patch_driver(item_id: str, data: dict, user: UserOut = Depends(get_current_user)):
    return update_item(get_supabase(), "drivers", item_id, data)


@router.delete("/drivers/{item_id}", status_code=204)
def del_driver(item_id: str, user: UserOut = Depends(get_current_user)):
    delete_item(get_supabase(), "drivers", item_id)


# --- Missions ---

@router.get("/missions")
def get_missions(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_supabase(), "missions", agence_id)


@router.post("/missions")
def post_mission(data: dict, user: UserOut = Depends(get_current_user)):
    # Simple insertion pour l'instant (la logique complexe devra être refactorisée plus tard)
    return create_item(get_supabase(), "missions", data)


@router.post("/missions/{mission_id}/transition")
def mission_transition(mission_id: str, body: MissionTransitionRequest, user: UserOut = Depends(get_current_user)):
    # Simple update pour le statut
    return update_item(get_supabase(), "missions", mission_id, {"statut": body.statut})


@router.patch("/missions/{mission_id}")
def patch_mission(mission_id: str, data: dict, user: UserOut = Depends(get_current_user)):
    if data.get("statut"):
        raise HTTPException(400, "Utilisez POST /missions/{id}/transition pour changer le statut")
    return update_item(get_supabase(), "missions", mission_id, data)


@router.delete("/missions/{mission_id}", status_code=204)
def del_mission(mission_id: str, user: UserOut = Depends(get_current_user)):
    delete_item(get_supabase(), "missions", mission_id)


# --- Documents ---

@router.get("/documents")
def get_documents(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_supabase(), "documents", agence_id)


@router.post("/documents")
def post_document(data: dict, user: UserOut = Depends(get_current_user)):
    return create_item(get_supabase(), "documents", data)


@router.delete("/documents/{item_id}", status_code=204)
def del_document(item_id: str, user: UserOut = Depends(get_current_user)):
    delete_item(get_supabase(), "documents", item_id)


# --- Invoices ---

@router.get("/invoices")
def get_invoices(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_supabase(), "invoices", agence_id)


@router.post("/invoices")
def post_invoice(data: dict, user: UserOut = Depends(get_current_user)):
    return create_item(get_supabase(), "invoices", data)


@router.patch("/invoices/{item_id}")
def patch_invoice(item_id: str, data: dict, user: UserOut = Depends(get_current_user)):
    return update_item(get_supabase(), "invoices", item_id, data)


@router.post("/invoices/{invoice_id}/remind")
def remind_invoice(
    invoice_id: str,
    agence_id: str = Query(..., alias="agenceId"),
    user: UserOut = Depends(get_current_user),
):
    from datetime import datetime
    today = datetime.utcnow().strftime("%Y-%m-%d")
    update_item(get_supabase(), "invoices", invoice_id, {"lastReminderAt": today})
    
    msg = {
        "from": "Système",
        "subject": f"Relance paiement — {invoice_id}",
        "body": f"Relance envoyée.",
        "time": "À l'instant",
        "unread": True,
        "agenceId": agence_id,
    }
    return create_item(get_supabase(), "messages", msg)


# --- Payments ---

@router.get("/payments")
def get_payments(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_supabase(), "payments", agence_id)


@router.post("/payments")
def post_payment(data: dict, user: UserOut = Depends(get_current_user)):
    return create_item(get_supabase(), "payments", data)


@router.post("/payments/{payment_id}/release-escrow")
def release_escrow(payment_id: str, user: UserOut = Depends(get_current_user)):
    return update_item(get_supabase(), "payments", payment_id, {"statut": "paye"})


# --- Maintenance ---

@router.get("/maintenance")
def get_maintenance(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_supabase(), "maintenanceItems", agence_id)


@router.post("/maintenance")
def post_maintenance(data: dict, user: UserOut = Depends(get_current_user)):
    return create_item(get_supabase(), "maintenanceItems", data)


@router.patch("/maintenance/{item_id}")
def patch_maintenance(item_id: str, data: dict, user: UserOut = Depends(get_current_user)):
    return update_item(get_supabase(), "maintenanceItems", item_id, data)


@router.delete("/maintenance/{item_id}", status_code=204)
def del_maintenance(item_id: str, user: UserOut = Depends(get_current_user)):
    delete_item(get_supabase(), "maintenanceItems", item_id)


# --- Fuel ---

@router.get("/fuel-records")
def get_fuel(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_supabase(), "fuelRecords", agence_id)


@router.post("/fuel-records")
def post_fuel(data: dict, user: UserOut = Depends(get_current_user)):
    return create_item(get_supabase(), "fuelRecords", data)


# --- Employees ---

@router.get("/employees")
def get_employees(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_supabase(), "employees", agence_id)


@router.post("/employees")
def post_employee(data: dict, user: UserOut = Depends(get_current_user)):
    return create_item(get_supabase(), "employees", data)


@router.patch("/employees/{item_id}")
def patch_employee(item_id: str, data: dict, user: UserOut = Depends(get_current_user)):
    return update_item(get_supabase(), "employees", item_id, data)


# --- Messages ---

@router.get("/messages")
def get_messages(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_supabase(), "messages", agence_id)


@router.post("/messages")
def post_message(data: dict, user: UserOut = Depends(get_current_user)):
    return create_item(get_supabase(), "messages", data)


@router.patch("/messages/{item_id}/read")
def read_message(item_id: str, user: UserOut = Depends(get_current_user)):
    return update_item(get_supabase(), "messages", item_id, {"unread": False})


# --- Derived (Simplified for SQL mode) ---

@router.get("/alerts")
def get_alerts(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return []

@router.get("/tracking")
def get_tracking(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return []

@router.get("/search")
def global_search(
    q: str = Query(..., min_length=2),
    agence_id: str | None = Query(None, alias="agenceId"),
    user: UserOut = Depends(get_current_user),
):
    return search_global(get_supabase(), q, agence_id)


@router.get("/analytics")
def get_analytics(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return {}

@router.get("/dashboard/stats")
def get_dashboard_stats(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return {}

@router.get("/payment-gateways")
def get_gateways(user: UserOut = Depends(get_current_user)):
    res = get_supabase().table("paymentGateways").select("*").execute()
    return {g["method"]: g["connected"] for g in res.data}


@router.post("/payment-gateways/{method}/test")
def test_gateway(method: str, user: UserOut = Depends(get_current_user)):
    get_supabase().table("paymentGateways").upsert({"method": method, "connected": True}).execute()
    return {"method": method, "connected": True}

