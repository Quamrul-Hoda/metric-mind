import json
import os
import time

import requests


CUBE_URL = os.getenv("CUBE_URL", "http://localhost:4000")
CUBE_TOKEN = os.getenv("CUBE_TOKEN")


def query_cube(query: dict) -> dict:
    max_attempts = 10
    wait_seconds = 2

    for attempt in range(max_attempts):
        response = requests.get(
            f"{CUBE_URL}/cubejs-api/v1/load",
            params={"query": json.dumps(query)},
            headers={
                "Authorization": f"Bearer {CUBE_TOKEN}",
            },
            timeout=30,
        )

        response.raise_for_status()
        data = response.json()

        # Cube may return this while the query is still processing.
        if data.get("error") == "Continue wait":
            if attempt < max_attempts - 1:
                time.sleep(wait_seconds)
                continue

            raise RuntimeError(
                "Cube query is still processing after multiple retries."
            )

        return data

    raise RuntimeError("Cube query failed.")
