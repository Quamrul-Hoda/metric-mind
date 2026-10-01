from fastapi import APIRouter
from pydantic import BaseModel

from agent_backend.app.agent.intent_parser import parse_intent
from agent_backend.app.cube.service import answer_question
from agent_backend.app.agent.tools.root_cause_tool import root_cause_analysis

from agent_backend.app.governance.policy import (
    MAX_QUERY_RETRIES,
    MAX_RESULT_ROWS,
    QUERY_RETRY_WAIT_SECONDS,
    QUERY_TIMEOUT_SECONDS,
)

router = APIRouter()


class QuestionRequest(BaseModel):
    question: str


@router.post("/intent")
def get_intent(request: QuestionRequest):
    intent = parse_intent(request.question)

    return {
        "measures": intent.measures,
        "dimensions": intent.dimensions,
        "filters": intent.filters,
    }

@router.post("/query")
def query(request: QuestionRequest):
    return answer_question(request.question)

@router.get("/governance")
def governance():
    return {
        "query_timeout_seconds": QUERY_TIMEOUT_SECONDS,
        "max_query_retries": MAX_QUERY_RETRIES,
        "retry_wait_seconds": QUERY_RETRY_WAIT_SECONDS,
        "max_result_rows": MAX_RESULT_ROWS,
        "audit_logging": True,
        "semantic_layer": "Cube.dev",
        "sql_exposed": False,
    }

@router.post("/root-cause")
def root_cause(request: QuestionRequest):
    return root_cause_analysis()
