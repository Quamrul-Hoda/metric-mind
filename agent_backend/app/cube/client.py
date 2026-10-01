import json
import os
import time

import requests

from agent_backend.app.governance.policy import (
    MAX_QUERY_RETRIES,
    QUERY_RETRY_WAIT_SECONDS,
    QUERY_TIMEOUT_SECONDS,
    audit_query,
    enforce_result_limit,
)


CUBE_URL = os.getenv(
    "CUBE_URL",
    "http://localhost:4000",
)

CUBE_TOKEN = os.getenv("CUBE_TOKEN")


def query_cube(query: dict) -> dict:
    start_time = time.monotonic()

    for attempt in range(MAX_QUERY_RETRIES):
        try:
            response = requests.get(
                f"{CUBE_URL}/cubejs-api/v1/load",
                params={
                    "query": json.dumps(query),
                },
                headers={
                    "Authorization": f"Bearer {CUBE_TOKEN}",
                },
                timeout=QUERY_TIMEOUT_SECONDS,
            )

            response.raise_for_status()

            data = response.json()

            # Cube may return this while the query is still processing.
            if data.get("error") == "Continue wait":
                if attempt < MAX_QUERY_RETRIES - 1:
                    time.sleep(QUERY_RETRY_WAIT_SECONDS)
                    continue

                duration = time.monotonic() - start_time

                audit_query(
                    query=query,
                    status="timeout",
                    duration_seconds=duration,
                    error="Cube query remained in Continue wait state.",
                )

                raise RuntimeError(
                    "Cube query is still processing after "
                    "multiple retries."
                )

            data = enforce_result_limit(data)

            rows = data.get("data", [])
            row_count = len(rows) if isinstance(rows, list) else None

            duration = time.monotonic() - start_time

            audit_query(
                query=query,
                status="success",
                duration_seconds=duration,
                row_count=row_count,
            )

            return data

        except requests.RequestException as exc:
            duration = time.monotonic() - start_time

            audit_query(
                query=query,
                status="error",
                duration_seconds=duration,
                error=str(exc),
            )

            raise

    raise RuntimeError("Cube query failed.")
