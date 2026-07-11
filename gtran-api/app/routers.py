from __future__ import annotations

from collections.abc import Callable
from typing import TypeVar

from fastapi import APIRouter, Depends, HTTPException, Query

from app.auth import create_access_token, get_current_user, hash_password, verify_password
from app.domain.ai_assist import answer_ai_query
from app.domain.analytics import compute_analytics, compute_dashboard_stats
from app.domain.mission_workflow import (
    create_mission_in_store,
    delete_mission_in_store,
    transition_mission_in_store,
    uid,
)
from app.domain.alerts_engine import compute_alerts
from app.domain.tracking import derive_tracking, process_invoice_reminders
from app.schemas import (
    AiQueryRequest,
    AiQueryResponse,
    AppStore,
    AuthResponse,
    LoginRequest,
    MissionCreateInput,
    MissionTransitionRequest,
    RegisterRequest,
    UserOut,
)
from app.services import create_item, delete_item, filter_agence, list_collection, search_global, update_item
from app.store import get_store, update_store

router = APIRouter(prefix="/api/v1")
T = TypeVar("T")


def _mutate(updater: Callable[[AppStore], AppStore]) -> AppStore:
    try:
        return update_store(updater)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


def _mutate_item(updater: Callable[[AppStore], tuple[AppStore, T]]) -> T:
    try:
        _, item = update_store(updater)
        return item
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


# --- Auth ---

@router.get("/health")
def health():
    return {"status": "ok", "service": "gtran-api"}


@router.get("/auth/me", response_model=UserOut)
def get_me(user: UserOut = Depends(get_current_user)):
    return user


@router.post("/auth/login", response_model=AuthResponse)
def login(body: LoginRequest):
    store = get_store()
    account = next((a for a in store.accounts if a.email == body.email), None)
    if not account or not verify_password(body.password, account.password):
        raise HTTPException(401, "Email ou mot de passe incorrect")
    user = UserOut(id=account.id, nom=account.nom, email=account.email, role=account.role, entrepriseId=account.entrepriseId)
    return AuthResponse(access_token=create_access_token(user), user=user)


@router.post("/auth/register", response_model=AuthResponse)
def register(body: RegisterRequest):
    def updater(store):
        if any(a.email == body.email for a in store.accounts):
            raise HTTPException(400, "Cet email est déjà utilisé")
        account = {
            "id": uid("u"),
            "nom": body.nom,
            "email": body.email,
            "password": hash_password(body.password),
            "role": "Administrateur",
            "entrepriseId": "ent-1",
        }
        from app.schemas import AuthAccount

        acc = AuthAccount.model_validate(account)
        return store.model_copy(update={"accounts": [*store.accounts, acc]})

    try:
        store = update_store(updater)
    except HTTPException:
        raise
    acc = store.accounts[-1]
    user = UserOut(id=acc.id, nom=acc.nom, email=acc.email, role=acc.role, entrepriseId=acc.entrepriseId)
    return AuthResponse(access_token=create_access_token(user), user=user)


@router.patch("/auth/me", response_model=UserOut)
def update_me(body: dict, user: UserOut = Depends(get_current_user)):
    holder: dict = {}

    def updater(store):
        accounts = []
        for a in store.accounts:
            if a.id == user.id:
                patch = {k: v for k, v in body.items() if k in ("nom", "email") and v is not None}
                na = a.model_copy(update=patch)
                accounts.append(na)
                holder["user"] = UserOut(id=na.id, nom=na.nom, email=na.email, role=na.role, entrepriseId=na.entrepriseId)
            else:
                accounts.append(a)
        return store.model_copy(update={"accounts": accounts})

    update_store(updater)
    return holder.get("user", user)


# --- Agences ---

@router.get("/agences")
def get_agences(user: UserOut = Depends(get_current_user)):
    return get_store().agences


# --- Vehicles ---

@router.get("/vehicles")
def get_vehicles(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_store(), "vehicles", agence_id)


@router.post("/vehicles")
def post_vehicle(data: dict, user: UserOut = Depends(get_current_user)):
    return _mutate(lambda s: create_item(s, "vehicles", data)).vehicles[-1]


@router.patch("/vehicles/{item_id}")
def patch_vehicle(item_id: str, data: dict, user: UserOut = Depends(get_current_user)):
    return _mutate_item(lambda s: update_item(s, "vehicles", item_id, data))


@router.delete("/vehicles/{item_id}", status_code=204)
def del_vehicle(item_id: str, user: UserOut = Depends(get_current_user)):
    _mutate(lambda s: delete_item(s, "vehicles", item_id))


# --- Drivers ---

@router.get("/drivers")
def get_drivers(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_store(), "drivers", agence_id)


@router.post("/drivers")
def post_driver(data: dict, user: UserOut = Depends(get_current_user)):
    return _mutate(lambda s: create_item(s, "drivers", data)).drivers[-1]


@router.patch("/drivers/{item_id}")
def patch_driver(item_id: str, data: dict, user: UserOut = Depends(get_current_user)):
    return _mutate_item(lambda s: update_item(s, "drivers", item_id, data))


@router.delete("/drivers/{item_id}", status_code=204)
def del_driver(item_id: str, user: UserOut = Depends(get_current_user)):
    _mutate(lambda s: delete_item(s, "drivers", item_id))


# --- Missions ---

@router.get("/missions")
def get_missions(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_store(), "missions", agence_id)


@router.post("/missions")
def post_mission(data: MissionCreateInput, user: UserOut = Depends(get_current_user)):
    try:
        store = update_store(lambda s: create_mission_in_store(s, data))
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    return store.missions[-1]


@router.post("/missions/{mission_id}/transition")
def mission_transition(mission_id: str, body: MissionTransitionRequest, user: UserOut = Depends(get_current_user)):
    holder: dict = {}

    def updater(s):
        ns, result = transition_mission_in_store(s, mission_id, body.statut)
        holder["result"] = result
        return ns

    try:
        update_store(updater)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    return holder["result"]


@router.patch("/missions/{mission_id}")
def patch_mission(mission_id: str, data: dict, user: UserOut = Depends(get_current_user)):
    if data.get("statut"):
        raise HTTPException(400, "Utilisez POST /missions/{id}/transition pour changer le statut")
    return _mutate_item(lambda s: update_item(s, "missions", mission_id, data))


@router.delete("/missions/{mission_id}", status_code=204)
def del_mission(mission_id: str, user: UserOut = Depends(get_current_user)):
    try:
        update_store(lambda s: delete_mission_in_store(s, mission_id))
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc


# --- Documents ---

@router.get("/documents")
def get_documents(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_store(), "documents", agence_id)


@router.post("/documents")
def post_document(data: dict, user: UserOut = Depends(get_current_user)):
    return _mutate(lambda s: create_item(s, "documents", data)).documents[-1]


@router.delete("/documents/{item_id}", status_code=204)
def del_document(item_id: str, user: UserOut = Depends(get_current_user)):
    _mutate(lambda s: delete_item(s, "documents", item_id))


# --- Invoices ---

@router.get("/invoices")
def get_invoices(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    store = update_store(process_invoice_reminders)
    return filter_agence(store.invoices, agence_id)


@router.post("/invoices")
def post_invoice(data: dict, user: UserOut = Depends(get_current_user)):
    return _mutate(lambda s: create_item(s, "invoices", data)).invoices[-1]


@router.patch("/invoices/{item_id}")
def patch_invoice(item_id: str, data: dict, user: UserOut = Depends(get_current_user)):
    return _mutate_item(lambda s: update_item(s, "invoices", item_id, data))


@router.post("/invoices/{invoice_id}/remind")
def remind_invoice(
    invoice_id: str,
    agence_id: str = Query(..., alias="agenceId"),
    user: UserOut = Depends(get_current_user),
):
    store = get_store()
    inv = next((i for i in store.invoices if i.id == invoice_id), None)
    if not inv:
        raise HTTPException(404, "Facture introuvable")
    from datetime import datetime

    today = datetime.utcnow().strftime("%Y-%m-%d")

    def updater(s):
        invoices = [i.model_copy(update={"lastReminderAt": today}) if i.id == invoice_id else i for i in s.invoices]
        from app.schemas import Message

        msg = Message(
            id=uid("msg"),
            **{
                "from": "Système",
                "subject": f"Relance paiement — {inv.id}",
                "body": f"Relance envoyée à {inv.client} pour un montant de {int(inv.montant):,} XOF.".replace(",", " "),
                "time": "À l'instant",
                "unread": True,
                "agenceId": agence_id,
            },
        )
        return s.model_copy(update={"invoices": invoices, "messages": [*s.messages, msg]})

    store = update_store(updater)
    return store.messages[-1]


# --- Payments ---

@router.get("/payments")
def get_payments(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_store(), "payments", agence_id)


@router.post("/payments")
def post_payment(data: dict, user: UserOut = Depends(get_current_user)):
    return _mutate(lambda s: create_item(s, "payments", data)).payments[-1]


@router.post("/payments/{payment_id}/release-escrow")
def release_escrow(payment_id: str, user: UserOut = Depends(get_current_user)):
    return _mutate_item(lambda s: update_item(s, "payments", payment_id, {"statut": "paye"}))


# --- Maintenance ---

@router.get("/maintenance")
def get_maintenance(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_store(), "maintenanceItems", agence_id)


@router.post("/maintenance")
def post_maintenance(data: dict, user: UserOut = Depends(get_current_user)):
    store = get_store()
    if not data.get("vehicleId") and data.get("vehicule"):
        v = next((x for x in store.vehicles if x.immatriculation == data["vehicule"]), None)
        if v:
            data["vehicleId"] = v.id
    return _mutate(lambda s: create_item(s, "maintenanceItems", data)).maintenanceItems[-1]


@router.patch("/maintenance/{item_id}")
def patch_maintenance(item_id: str, data: dict, user: UserOut = Depends(get_current_user)):
    return _mutate_item(lambda s: update_item(s, "maintenanceItems", item_id, data))


@router.delete("/maintenance/{item_id}", status_code=204)
def del_maintenance(item_id: str, user: UserOut = Depends(get_current_user)):
    _mutate(lambda s: delete_item(s, "maintenanceItems", item_id))


# --- Fuel ---

@router.get("/fuel-records")
def get_fuel(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_store(), "fuelRecords", agence_id)


@router.post("/fuel-records")
def post_fuel(data: dict, user: UserOut = Depends(get_current_user)):
    store = get_store()
    if not data.get("vehicleId") and data.get("vehicule"):
        v = next((x for x in store.vehicles if x.immatriculation == data["vehicule"]), None)
        if v:
            data["vehicleId"] = v.id
    return _mutate(lambda s: create_item(s, "fuelRecords", data)).fuelRecords[-1]


# --- Employees ---

@router.get("/employees")
def get_employees(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_store(), "employees", agence_id)


@router.post("/employees")
def post_employee(data: dict, user: UserOut = Depends(get_current_user)):
    return _mutate(lambda s: create_item(s, "employees", data)).employees[-1]


@router.patch("/employees/{item_id}")
def patch_employee(item_id: str, data: dict, user: UserOut = Depends(get_current_user)):
    return _mutate_item(lambda s: update_item(s, "employees", item_id, data))


# --- Messages ---

@router.get("/messages")
def get_messages(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return list_collection(get_store(), "messages", agence_id)


@router.post("/messages")
def post_message(data: dict, user: UserOut = Depends(get_current_user)):
    return _mutate(lambda s: create_item(s, "messages", data)).messages[-1]


@router.patch("/messages/{item_id}/read")
def read_message(item_id: str, user: UserOut = Depends(get_current_user)):
    return _mutate_item(lambda s: update_item(s, "messages", item_id, {"unread": False}))


# --- Derived ---

@router.get("/alerts")
def get_alerts(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    store = update_store(process_invoice_reminders)
    return compute_alerts(store, agence_id)


@router.get("/tracking")
def get_tracking(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return derive_tracking(get_store(), agence_id)


@router.get("/search")
def global_search(
    q: str = Query(..., min_length=2),
    agence_id: str | None = Query(None, alias="agenceId"),
    user: UserOut = Depends(get_current_user),
):
    return search_global(get_store(), q, agence_id)


@router.get("/analytics")
def get_analytics(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    return compute_analytics(get_store(), agence_id)


@router.get("/dashboard/stats")
def get_dashboard_stats(agence_id: str | None = Query(None, alias="agenceId"), user: UserOut = Depends(get_current_user)):
    store = update_store(process_invoice_reminders)
    return compute_dashboard_stats(store, agence_id)


# --- Payment gateways ---

@router.get("/payment-gateways")
def get_gateways(user: UserOut = Depends(get_current_user)):
    return get_store().paymentGateways


@router.post("/payment-gateways/{method}/test")
def test_gateway(method: str, user: UserOut = Depends(get_current_user)):
    def updater(s):
        gw = dict(s.paymentGateways)
        gw[method] = True
        return s.model_copy(update={"paymentGateways": gw})

    update_store(updater)
    return {"method": method, "connected": True}


# --- AI ---

@router.post("/ai-assist/query", response_model=AiQueryResponse)
def ai_query(body: AiQueryRequest, user: UserOut = Depends(get_current_user)):
    answer = answer_ai_query(get_store(), body.query, body.agence_id)
    return AiQueryResponse(answer=answer)


# --- Admin ---

@router.post("/admin/reset")
def admin_reset(user: UserOut = Depends(get_current_user)):
    from app.store import reset_store

    reset_store()
    return {"ok": True}
