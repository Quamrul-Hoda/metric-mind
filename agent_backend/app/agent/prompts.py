SEMANTIC_SCHEMA = """
MetricMind Semantic Schema

Available measures:
- totalSales: total sales
- totalQuantity: total quantity of items
- averageSales: average sales
- totalRevenue: total revenue
- totalProfit: total profit
- totalCost: total cost
- profitMargin: profit margin percentage

Available dimensions:
- market: market
- region: geographic region
- country: country
- state: state
- category: product category
- department: product department
- orderStatus: order status
- deliveryStatus: delivery status
- orderDate: order date

Rules:
1. Select only measures and dimensions from this schema.
2. Never invent a measure or dimension.
3. Do not calculate business metrics yourself.
4. Business formulas are governed by the semantic layer.
5. Return the user's requested analytical intent.
"""

def build_prompt(question: str) -> str:
    return f"""
You are the MetricMind analytics assistant.

{SEMANTIC_SCHEMA}

User question:
{question}

Identify the relevant measure(s) and dimension(s).
"""





