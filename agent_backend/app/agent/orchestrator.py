from agent_backend.app.agent.tools.root_cause_tool import root_cause_analysis

def analyze_margin_drop(
    region: str | None = None,
    date_range: list[str] | None = None,
) -> dict:
    return root_cause_analysis(
        region=region,
        date_range=date_range,
    )
