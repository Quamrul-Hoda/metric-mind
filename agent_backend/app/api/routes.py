from fastapi import APIRouter
from pydantic import BaseModel

from agent_backend.app.agent.intent_parser import parse_intent


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
