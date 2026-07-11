from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, EmailStr, Field

LatLng = tuple[float, float]

MissionStatus = Literal["planifiee", "en_cours", "en_retard", "livree", "annulee"]
VehicleStatus = Literal["disponible", "en_mission", "maintenance", "immobilise"]
PaymentStatus = Literal["paye", "partiel", "en_attente", "en_retard"]
AlertSeverity = Literal["info", "warning", "danger"]


class Vehicle(BaseModel):
    id: str
    immatriculation: str
    type: str
    statut: VehicleStatus
    driverId: str | None = None
    chauffeur: str | None = None
    km: float
    conso: float
    disponibilite: int
    agenceId: str
    position: LatLng | None = None
    immobiliseDepuis: str | None = None


class Driver(BaseModel):
    id: str
    nom: str
    permis: str
    categorie: str
    ponctualite: int
    km: float
    accidents: int
    statut: str
    agenceId: str


class Mission(BaseModel):
    id: str
    client: str
    depart: str
    destination: str
    marchandise: str
    poids: str
    driverId: str
    vehicleId: str
    chauffeur: str
    vehicule: str
    statut: MissionStatus
    prix: float
    cout: float
    agenceId: str
    route: list[LatLng]
    progress: float
    createdAt: str | None = None


class Document(BaseModel):
    id: str
    type: str
    entite: str
    expiration: str
    statut: str
    agenceId: str
    missionId: str | None = None
    vehicleId: str | None = None
    driverId: str | None = None


class Invoice(BaseModel):
    id: str
    client: str
    montant: float
    echeance: str
    statut: PaymentStatus
    agenceId: str
    missionId: str | None = None
    lastReminderAt: str | None = None


class Payment(BaseModel):
    id: str
    reference: str
    client: str
    montant: float
    methode: str
    statut: PaymentStatus
    date: str
    agenceId: str
    invoiceId: str | None = None


class MaintenanceItem(BaseModel):
    id: str
    vehicleId: str
    vehicule: str
    type: str
    echeance: str
    kmRestant: int
    priorite: str
    agenceId: str


class FuelRecord(BaseModel):
    id: str
    vehicleId: str
    vehicule: str
    station: str
    litres: float
    montant: float
    conso: float
    anomalie: bool
    date: str
    agenceId: str


class Employee(BaseModel):
    id: str
    nom: str
    poste: str
    contrat: str
    conges: int
    statut: str
    agenceId: str


class Message(BaseModel):
    id: str
    from_: str = Field(alias="from")
    subject: str
    body: str
    time: str
    unread: bool
    agenceId: str

    model_config = {"populate_by_name": True}


class Alert(BaseModel):
    id: str
    type: str
    message: str
    severity: AlertSeverity
    agenceId: str
    entityId: str | None = None
    href: str | None = None


class TrackingVehicle(BaseModel):
    id: str
    immatriculation: str
    chauffeur: str
    vitesse: int
    position: str
    statut: str
    arret: str
    coords: LatLng
    heading: float | None = None
    vehicleType: str | None = None
    missionStatut: str | None = None
    missionId: str | None = None
    vehicleId: str | None = None
    driverId: str | None = None


class AgenceDetail(BaseModel):
    id: str
    nom: str
    employes: int
    vehicules: int
    ville: str


class AuthAccount(BaseModel):
    id: str
    nom: str
    email: str
    password: str
    role: str
    entrepriseId: str


class AppStore(BaseModel):
    vehicles: list[Vehicle] = []
    drivers: list[Driver] = []
    missions: list[Mission] = []
    documents: list[Document] = []
    invoices: list[Invoice] = []
    payments: list[Payment] = []
    maintenanceItems: list[MaintenanceItem] = []
    fuelRecords: list[FuelRecord] = []
    employees: list[Employee] = []
    messages: list[Message] = []
    alerts: list[Alert] = []
    agences: list[AgenceDetail] = []
    accounts: list[AuthAccount] = []
    paymentGateways: dict[str, bool] = {}


# --- API DTOs ---

class UserOut(BaseModel):
    id: str
    nom: str
    email: str
    role: str
    entrepriseId: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    nom: str
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class MissionCreateInput(BaseModel):
    client: str
    depart: str
    destination: str
    marchandise: str
    poids: str
    driverId: str | None = None
    vehicleId: str | None = None
    prix: float
    cout: float
    agenceId: str
    statut: MissionStatus | None = None


class MissionTransitionRequest(BaseModel):
    statut: MissionStatus


class MissionTransitionResult(BaseModel):
    mission: Mission
    invoice: Invoice | None = None
    message: Message | None = None


class SearchResult(BaseModel):
    missions: list[Mission]
    vehicles: list[Vehicle]
    drivers: list[Driver]


class AiQueryRequest(BaseModel):
    query: str
    agence_id: str | None = None


class AiQueryResponse(BaseModel):
    answer: str
