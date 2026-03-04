from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import json

from app.db.database import get_db
from app.models.polygon import MangrovePlot
from app.schemas.polygon import MangrovePlotCreate, MangrovePlotResponse

router = APIRouter()

@router.get("/mangrove_plots")
async def get_mangrove_plots(db: AsyncSession = Depends(get_db)):
    # Use ST_AsGeoJSON to get valid geojson from PostGIS
    stmt = select(
        MangrovePlot.id,
        MangrovePlot.stratum_name,
        MangrovePlot.area_ha,
        MangrovePlot.planting_date,
        func.ST_AsGeoJSON(MangrovePlot.geom).label("geojson")
    )
    result = await db.execute(stmt)
    plots = result.all()

    # Format as a GeoJSON FeatureCollection
    features = []
    for plot in plots:
        features.append({
            "type": "Feature",
            "id": str(plot.id),
            "geometry": json.loads(plot.geojson),
            "properties": {
                "stratum_name": plot.stratum_name,
                "area_ha": float(plot.area_ha),
                "planting_date": plot.planting_date.isoformat() if plot.planting_date else None
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.post("/mangrove_plots")
async def create_mangrove_plot(plot: MangrovePlotCreate, db: AsyncSession = Depends(get_db)):
    # Convert GeoJSON dict back to PostGIS geometry via ST_GeomFromGeoJSON
    geom_json = plot.geom.model_dump_json()
    
    new_plot = MangrovePlot(
        stratum_name=plot.stratum_name,
        area_ha=plot.area_ha,
        planting_date=plot.planting_date,
        geom=func.ST_SetSRID(func.ST_GeomFromGeoJSON(geom_json), 4326)
    )
    
    db.add(new_plot)
    await db.commit()
    await db.refresh(new_plot)
    
    return {"message": "Plot created safely", "id": str(new_plot.id)}
