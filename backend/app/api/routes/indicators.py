from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional, List
import datetime
import uuid

from app.db.database import get_db
from app.models.indicators import SocioEconomicObservation, EnvironmentalPressureObservation

router = APIRouter()

class SocioEconomicObservationCreate(BaseModel):
    project_id: Optional[uuid.UUID] = None
    coastal_area_name: str
    community_name: Optional[str] = None
    indicator_code: str
    indicator_name: str
    period_start: str
    period_end: str
    value_numeric: Optional[float] = None
    value_text: Optional[str] = None
    unit: Optional[str] = None
    source: Optional[str] = None
    verified_by: Optional[str] = None
    metadata: Optional[dict] = {}

class EnvironmentalPressureCreate(BaseModel):
    project_id: Optional[uuid.UUID] = None
    coastal_area_name: str
    pressure_type: str
    severity: Optional[str] = None
    observation_date: Optional[str] = None
    area_ha: Optional[float] = None
    source: Optional[str] = None
    verified_by: Optional[str] = None
    notes: Optional[str] = None
    metadata: Optional[dict] = {}

@router.get("/socioeconomic")
async def list_socioeconomic(
    project_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(SocioEconomicObservation)
    if project_id and project_id != "all":
        query = query.where(SocioEconomicObservation.project_id == uuid.UUID(project_id))
    
    result = await db.execute(query.order_by(SocioEconomicObservation.observation_period_end.desc()))
    obs = result.scalars().all()
    return obs

@router.post("/socioeconomic")
async def create_socioeconomic(payload: SocioEconomicObservationCreate, db: AsyncSession = Depends(get_db)):
    try:
        start_date = datetime.date.fromisoformat(payload.period_start)
        end_date = datetime.date.fromisoformat(payload.period_end)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    
    new_obs = SocioEconomicObservation(
        project_id=payload.project_id,
        coastal_area_name=payload.coastal_area_name,
        community_name=payload.community_name,
        indicator_code=payload.indicator_code,
        indicator_name=payload.indicator_name,
        observation_period_start=start_date,
        observation_period_end=end_date,
        value_numeric=payload.value_numeric,
        value_text=payload.value_text,
        unit=payload.unit,
        source_reference=payload.source,
        verified_by=payload.verified_by,
        metadata=payload.metadata
    )
    db.add(new_obs)
    await db.commit()
    await db.refresh(new_obs)
    return new_obs

@router.get("/pressure")
async def list_pressure(
    project_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(EnvironmentalPressureObservation)
    if project_id and project_id != "all":
        query = query.where(EnvironmentalPressureObservation.project_id == uuid.UUID(project_id))
    
    result = await db.execute(query.order_by(EnvironmentalPressureObservation.observation_date.desc()))
    obs = result.scalars().all()
    
    # Process geometry to geojson if needed, for now just returning plain objects
    return obs

@router.post("/pressure")
async def create_pressure(payload: EnvironmentalPressureCreate, db: AsyncSession = Depends(get_db)):
    obs_date = datetime.date.today()
    if payload.observation_date:
        try:
            obs_date = datetime.date.fromisoformat(payload.observation_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
        
    new_obs = EnvironmentalPressureObservation(
        project_id=payload.project_id,
        coastal_area_name=payload.coastal_area_name,
        pressure_type=payload.pressure_type,
        severity=payload.severity,
        observation_date=obs_date,
        estimated_impacted_area_ha=payload.area_ha,
        source_reference=payload.source,
        verified_by=payload.verified_by,
        notes=payload.notes,
        metadata=payload.metadata
    )
    db.add(new_obs)
    await db.commit()
    await db.refresh(new_obs)
    return new_obs
