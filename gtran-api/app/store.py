from __future__ import annotations

import json
import threading
from pathlib import Path
from typing import Callable, TypeVar

from app.config import settings
from app.data.seed import create_seed_store
from app.schemas import AppStore

T = TypeVar("T")

_lock = threading.Lock()


def _store_path() -> Path:
    p = Path(settings.store_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    return p


def _load() -> AppStore:
    path = _store_path()
    if not path.exists():
        store = create_seed_store()
        _save_unlocked(store)
        return store
    data = json.loads(path.read_text(encoding="utf-8"))
    return AppStore.model_validate(data)


def _save_unlocked(store: AppStore) -> None:
    path = _store_path()
    path.write_text(
        json.dumps(store.model_dump(mode="json", by_alias=True), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def get_store() -> AppStore:
    with _lock:
        return _load()


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
