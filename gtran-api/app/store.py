from __future__ import annotations

from typing import TypeVar
from app.config import settings
from supabase import create_client, Client

T = TypeVar("T")

_supabase_client: Client | None = None

def get_supabase() -> Client:
    global _supabase_client
    if _supabase_client is None:
        if not settings.supabase_url or not settings.supabase_key:
            raise RuntimeError("Variables SUPABASE_URL et SUPABASE_KEY manquantes pour le mode Production SQL")
        _supabase_client = create_client(settings.supabase_url, settings.supabase_key)
    return _supabase_client


def save_store(store: AppStore) -> None:
    with _lock:
        _save_unlocked(store)


def update_store(updater: Callable[[AppStore], AppStore]) -> AppStore:
    with _lock:
        store = _load()
        next_store = updater(store)
        _save_unlocked(next_store)
        return next_store


def reset_store() -> AppStore:
    with _lock:
        store = create_seed_store()
        _save_unlocked(store)
        return store
