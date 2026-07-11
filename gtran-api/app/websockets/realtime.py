from __future__ import annotations

import asyncio
import contextlib

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.encoders import jsonable_encoder

from app.domain.tracking import derive_tracking
from app.store import get_store

router = APIRouter()


@router.websocket("/ws/tracking")
async def ws_tracking(websocket: WebSocket, agenceId: str | None = None):
    await websocket.accept()
    try:
        while True:
            store = get_store()
            payload = jsonable_encoder(derive_tracking(store, agenceId))
            await websocket.send_json(payload)
            await asyncio.sleep(5)
    except WebSocketDisconnect:
        pass
    except Exception:
        with contextlib.suppress(Exception):
            await websocket.close()
