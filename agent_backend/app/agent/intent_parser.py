from agent_backend.app.agent.llm_config import llm
from agent_backend.app.agent.prompts import build_prompt
from agent_backend.app.models.schemas import MetricIntent


structured_llm = llm.with_structured_output(MetricIntent)


def parse_intent(question: str) -> MetricIntent:
    prompt = build_prompt(question)
    return structured_llm.invoke(prompt)
