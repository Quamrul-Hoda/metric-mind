from agent_backend.app.cube.client import query_cube


def root_cause_analysis(
    region: str | None = None,
    date_range: list[str] | None = None,
) -> dict:
    filters = []

    if region:
        filters.append({
            "member": "Sales.region",
            "operator": "equals",
            "values": [region],
        })

    if date_range:
        filters.append({
            "member": "Sales.orderDate",
            "operator": "inDateRange",
            "values": date_range,
        })

    query = {
        "measures": [
            "Sales.totalSales",
            "Sales.totalProfit",
            "Sales.totalCost",
        ],
        "dimensions": ["Sales.region"],
        "filters": filters,
    }

    result = query_cube(query)

    response = {
        "analysis": "margin_root_cause",
        "query": query,
        "data": result,
    }

    response["explanation"] = explain_root_cause(response)

    return response

def explain_root_cause(data: dict) -> str:
    rows = data.get("data", {}).get("data", [])

    if not rows:
        return "No data available for root-cause analysis."

    row = rows[0]

    sales = float(row.get("Sales.totalSales", 0) or 0)
    profit = float(row.get("Sales.totalProfit", 0) or 0)
    cost = float(row.get("Sales.totalCost", 0) or 0)

    margin = (profit / sales * 100) if sales else 0

    return (
        f"Sales were {sales:.2f}, while total cost was {cost:.2f} "
        f"and total profit was {profit:.2f}. "
        f"The resulting profit margin was {margin:.2f}%. "
        f"The analysis indicates that cost relative to sales is the primary "
        f"factor affecting margin."
    )
