import json
import os
import requests


CUBE_URL = os.getenv("CUBE_URL", "http://localhost:4000")
CUBE_TOKEN = os.getenv("CUBE_TOKEN")


def query_cube(query: dict) -> dict:
    response = requests.get(
        f"{CUBE_URL}/cubejs-api/v1/load",
        params={"query": json.dumps(query)},
        headers={
            "Authorization": f"Bearer {CUBE_TOKEN}",
        },
        timeout=30,
    )

    response.raise_for_status()
    return response.json()
