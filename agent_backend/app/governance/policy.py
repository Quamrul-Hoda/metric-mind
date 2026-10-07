import json
import logging
import os
from typing import Any

from dotenv import load_dotenv

load_dotenv()

# Query execution limits
QUERY_TIMEOUT_SECONDS = int(
    os.getenv("METRICMIND_QUERY_TIMEOUT_SECONDS", "30")
)

MAX_QUERY_RETRIES = int(
    os.getenv("METRICMIND_MAX_QUERY_RETRIES", "5")
)

QUERY_RETRY_WAIT_SECONDS = float(
    os.getenv("METRICMIND_QUERY_RETRY_WAIT_SECONDS", "2")
)

MAX_RESULT_ROWS = int(
    os.getenv("METRICMIND_MAX_RESULT_ROWS", "1000")
)


logger = logging.getLogger("metricmind.governance")


def audit_query(
    *,
    query: dict[str, Any],
    status: str,
    duration_seconds: float,
    row_count: int | None = None,
    error: str | None = None,
) -> None:
    """
    Record a lightweight audit event for a semantic query execution.
    """

    event = {
        "event": "semantic_query",
        "status": status,
        "duration_seconds": round(duration_seconds, 3),
        "row_count": row_count,
        "query": query,
    }

    if error:
        event["error"] = error

    logger.info(
        "AUDIT %s",
        json.dumps(event, default=str),
    )


def enforce_result_limit(data: dict[str, Any]) -> dict[str, Any]:
    """
    Limit returned Cube rows to the configured maximum.
    """

    rows = data.get("data")

    if not isinstance(rows, list):
        return data

    if len(rows) <= MAX_RESULT_ROWS:
        return data

    limited = dict(data)
    limited["data"] = rows[:MAX_RESULT_ROWS]
    limited["metricmind_result_limit"] = {
        "applied": True,
        "limit": MAX_RESULT_ROWS,
        "original_rows": len(rows),
    }

    return limited
