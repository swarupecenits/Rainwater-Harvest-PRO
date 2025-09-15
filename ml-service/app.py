from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import k_means_v3  

app = FastAPI()

class AssessmentInput(BaseModel):
    roof_area: float
    roof_type: str
    soil_type: str
    annual_rainfall: float

@app.post("/predict")
def predict(data: AssessmentInput):
    result = k_means_v3.predict_harvest(
        roof_area=data.roof_area,
        roof_type=data.roof_type,
        soil_type=data.soil_type,
        rainfall=data.annual_rainfall
    )
    return {
        "potential_harvest": result["potential_harvest"],
        "tank_volume": result["tank_volume"],
        "efficiency": result["efficiency"],
        "inertia": result["inertia"]


    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

