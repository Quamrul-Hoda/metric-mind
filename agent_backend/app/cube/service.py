from agent_backend.app.agent.intent_parser import parse_intent
from agent_backend.app.cube.query_builder import build_cube_query
from agent_backend.app.cube.client import query_cube


def answer_question(question: str) -> dict:
    intent = parse_intent(question)
    cube_query = build_cube_query(intent)
    result = query_cube(cube_query)

    response = {
        "intent": intent.model_dump(),
        "query": cube_query,
        "data": result,
    }

    if any(
        measure.lower() in {"profitmargin", "margin"}
        for measure in intent.measures
    ):
        from agent_backend.app.agent.tools.root_cause_tool import root_cause_analysis

        response["root_cause"] = root_cause_analysis()

    return response
