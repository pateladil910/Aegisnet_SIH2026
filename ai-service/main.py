from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from schemas import (
    CorrelationRequest, CorrelationResponse,
    ValidationRequest, ValidationResponse,
    ForecastResponse
)
from models.correlation import compute_spatial_correlation
from models.forecast import generate_forecast_series
from models.filters import validate_environmental_fusion

app = FastAPI(
    title="AegisNet Cloud Correlation & Forecasting AI Service",
    description="Microservice for spatial correlation, multi-sensor fusion, and disaster forecasting",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "aegisnet-ai-service",
        "engine": "FastAPI + Spatial Correlation & TimeSeries Inference"
    }

@app.post("/correlate", response_model=CorrelationResponse)
def correlate_alert(req: CorrelationRequest):
    try:
        api_score, confirming, conf, cluster = compute_spatial_correlation(
            source_node_id=req.nodeId,
            hazard=req.hazard,
            source_risk_score=req.riskScore,
            source_coords=req.location
        )
        return CorrelationResponse(
            areaProbabilityIndex=api_score,
            confirmingNodes=confirming,
            confidence=conf,
            spatialCluster=cluster
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate-alert", response_model=ValidationResponse)
def validate_alert(req: ValidationRequest):
    try:
        is_false_pos, reason, conf = validate_environmental_fusion(
            node_id=req.nodeId,
            hazard=req.hazard,
            reading=req.reading
        )
        return ValidationResponse(
            isLikelyFalsePositive=is_false_pos,
            reason=reason,
            confidence=conf
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/forecast/{nodeId}", response_model=ForecastResponse)
def get_forecast(nodeId: str, hazard: str = Query("flood")):
    try:
        series = generate_forecast_series(node_id=nodeId, hazard=hazard, window_hours=6)
        return ForecastResponse(
            nodeId=nodeId,
            hazard=hazard,
            forecastWindowHours=6,
            series=series
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
