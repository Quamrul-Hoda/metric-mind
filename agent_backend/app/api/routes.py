from fastapi import APIRouter
from pydantic import BaseModel

from agent_backend.app.agent.intent_parser import parse_intent
from agent_backend.app.cube.service import answer_question
from agent_backend.app.agent.tools.root_cause_tool import root_cause_analysis

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

@router.post("/root-cause")
def root_cause(request: QuestionRequest):
    return root_cause_analysis()
