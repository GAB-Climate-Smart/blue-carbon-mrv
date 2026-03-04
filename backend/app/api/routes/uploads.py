from fastapi import APIRouter, File, UploadFile, HTTPException
import json

router = APIRouter()

@router.post("/spatial")
async def upload_spatial_file(file: UploadFile = File(...)):
    """
    MVP Endpoint to handle spatial file uploads.
    Currently only supports .geojson files.
    """
    if not file.filename.endswith(".geojson") and not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Only .geojson files are supported for MVP")
    
    content = await file.read()
    try:
        data = json.loads(content)
        if data.get("type") != "FeatureCollection":
            raise ValueError("File is not a valid GeoJSON FeatureCollection")
        
        features = data.get("features", [])
        
        # MVP: Return the features to the frontend for preview/confirmation
        # In a full implementation, we might save this to a staging table or directly to the plots table
        
        return {
            "message": "File processed successfully",
            "feature_count": len(features),
            "features": features
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON file format")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
