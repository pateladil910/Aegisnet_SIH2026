from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class CorrelationRequest(BaseModel):
    nodeId: str
    hazard: str
    riskScore: float
    location: List[float] # [lon, lat]
    timestamp: Optional[str] = None

class CorrelationResponse(BaseModel):
    areaProbabilityIndex: int
    confirmingNodes: List[str]
    confidence: float
    spatialCluster: str

class ValidationRequest(BaseModel):
    nodeId: str
    hazard: str
    reading: Dict[str, Any]

class ValidationResponse(BaseModel):
    isLikelyFalsePositive: bool
    reason: str
    confidence: float

class ForecastPoint(BaseModel):
    timestamp: str
    predictedValue: int
    confidenceLow: int
    confidenceHigh: int

class ForecastResponse(BaseModel):
    nodeId: str
    hazard: str
    forecastWindowHours: int
    series: List[ForecastPoint]
