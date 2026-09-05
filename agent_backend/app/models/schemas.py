from pydantic import BaseModel, Field


class MetricFilter(BaseModel):
    member: str
    operator: str
    values: list[str]


class MetricIntent(BaseModel):
    measures: list[str] = Field(default_factory=list)
    dimensions: list[str] = Field(default_factory=list)
    filters: list[MetricFilter] = Field(default_factory=list)
