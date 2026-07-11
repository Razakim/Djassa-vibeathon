from __future__ import annotations
from supabase import Client

def filter_agence(query, agence_id: str | None):
    if agence_id:
        return query.eq("agenceId", agence_id)
    return query

def list_collection(supabase: Client, table: str, agence_id: str | None = None):
    query = supabase.table(table).select("*")
    query = filter_agence(query, agence_id)
    response = query.execute()
    return response.data

def create_item(supabase: Client, table: str, data: dict):
    from app.domain.mission_workflow import uid
    entry = {**data, "id": data.get("id") or uid(table[:3])}
    response = supabase.table(table).insert(entry).execute()
    if not response.data:
        raise ValueError("Erreur lors de la création")
    return response.data[0]

def update_item(supabase: Client, table: str, item_id: str, patch: dict):
    response = supabase.table(table).update(patch).eq("id", item_id).execute()
    if not response.data:
        raise ValueError("Élément introuvable")
    return response.data[0]

def delete_item(supabase: Client, table: str, item_id: str):
    supabase.table(table).delete().eq("id", item_id).execute()

def search_global(supabase: Client, query: str, agence_id: str | None = None):
    q = f"%{query}%"
    m_query = supabase.table("missions").select("*").or_(f"id.ilike.{q},client.ilike.{q}")
    v_query = supabase.table("vehicles").select("*").or_(f"immatriculation.ilike.{q},chauffeur.ilike.{q}")
    d_query = supabase.table("drivers").select("*").or_(f"nom.ilike.{q}")
    
    missions = filter_agence(m_query, agence_id).execute().data
    vehicles = filter_agence(v_query, agence_id).execute().data
    drivers = filter_agence(d_query, agence_id).execute().data
    
    return {"missions": missions, "vehicles": vehicles, "drivers": drivers}
