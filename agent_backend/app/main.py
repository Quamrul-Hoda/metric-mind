from fastapi import FastAPI

from agent_backend.app.api.routes import router


app = FastAPI(
    title="MetricMind Agent Backend",
    version="1.0.0"
)


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(router)
