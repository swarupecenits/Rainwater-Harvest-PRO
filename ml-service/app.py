import asyncio
import os
from contextlib import suppress
from datetime import datetime, timezone
from typing import Optional

import httpx
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import k_means_v3

app = FastAPI()

SELF_PING_URL = (os.environ.get("SELF_PING_URL") or os.environ.get("RENDER_EXTERNAL_URL") or "").rstrip("/")


def _resolve_keep_alive_seconds() -> int:
    raw_value = os.environ.get("KEEP_ALIVE_INTERVAL_SECONDS", "840")
    try:
        parsed = int(raw_value)
    except (TypeError, ValueError):
        parsed = 840
    return max(parsed, 60)


KEEP_ALIVE_SECONDS = _resolve_keep_alive_seconds()
_keep_alive_task: Optional[asyncio.Task] = None

class AssessmentInput(BaseModel):
    roof_area: float
    roof_type: str
    soil_type: str
    annual_rainfall: float

def _run_prediction(data: AssessmentInput):
    result = k_means_v3.predict_harvest(
        roof_area=data.roof_area,
        roof_type=data.roof_type,
        soil_type=data.soil_type,
        rainfall=data.annual_rainfall
    )
    return {
        "potential_harvest": result["potential_harvest"],
        "tank_volume": result["tank_volume"],
        "efficiency": result["efficiency"],
        "inertia": result["inertia"]
    }


@app.post("/predict")
def predict(data: AssessmentInput):
    return _run_prediction(data)


@app.post("/calculate")
def calculate(data: AssessmentInput):
    return _run_prediction(data)


@app.get("/health")
def health():
    return {"ok": True}


async def _keep_awake_loop():
    if not SELF_PING_URL:
        return

    async with httpx.AsyncClient(timeout=10.0) as client:
        while True:
            try:
                response = await client.get(f"{SELF_PING_URL}/health")
                timestamp = datetime.now(timezone.utc).isoformat()
                print(f"[KeepAlive] Ping succeeded: {response.status_code} at {timestamp}")
            except Exception as exc:  # noqa: BLE001
                print(f"[KeepAlive] Ping failed: {exc}")

            await asyncio.sleep(KEEP_ALIVE_SECONDS)


@app.on_event("startup")
async def _start_keep_awake():
    global _keep_alive_task
    if SELF_PING_URL:
        _keep_alive_task = asyncio.create_task(_keep_awake_loop())
        print(f"[KeepAlive] Started for {SELF_PING_URL} (every {KEEP_ALIVE_SECONDS}s)")
    else:
        print("[KeepAlive] Disabled (missing SELF_PING_URL/RENDER_EXTERNAL_URL)")


@app.on_event("shutdown")
async def _stop_keep_awake():
    global _keep_alive_task
    if _keep_alive_task:
        _keep_alive_task.cancel()
        with suppress(asyncio.CancelledError):
            await _keep_alive_task
        _keep_alive_task = None

if __name__ == "__main__":
    # Get the port from the environment variable, with a default for local testing
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
