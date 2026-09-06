from agent_backend.app.models.schemas import MetricIntent


ALLOWED_MEASURES = {
    "totalSales",
    "totalQuantity",
    "averageSales",
    "totalRevenue",
    "totalProfit",
    "totalCost",
    "profitMargin",
}

ALLOWED_DIMENSIONS = {
    "market",
    "region",
    "country",
    "state",
    "category",
    "department",
    "orderStatus",
    "deliveryStatus",
    "orderDate",
}


def build_cube_query(intent: MetricIntent) -> dict:
    invalid_measures = set(intent.measures) - ALLOWED_MEASURES
    invalid_dimensions = set(intent.dimensions) - ALLOWED_DIMENSIONS

    if invalid_measures:
        raise ValueError(f"Invalid measures: {sorted(invalid_measures)}")

    if invalid_dimensions:
        raise ValueError(f"Invalid dimensions: {sorted(invalid_dimensions)}")

    if not intent.measures:
        raise ValueError("At least one measure is required")

    query = {
        "measures": [
            f"Sales.{measure}"
            for measure in intent.measures
        ],
        "dimensions": [
            f"Sales.{dimension}"
            for dimension in intent.dimensions
        ],
    }

    if intent.filters:
        query["filters"] = intent.filters

    return query
