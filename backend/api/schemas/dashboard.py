from pydantic import BaseModel


class DashboardSummary(BaseModel):
    totalUsers: int
    activeSessions: int
    conversionRate: float

    class Config:
        json_schema_extra = {
            "example": {
                "totalUsers": 1280,
                "activeSessions": 245,
                "conversionRate": 3.2
            }
        }