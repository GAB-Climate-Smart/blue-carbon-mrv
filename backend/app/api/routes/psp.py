from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from pydantic import BaseModel, Field
from typing import Optional, List, Any
import datetime
import uuid

from app.db.database import get_db
from app.models.polygon import SamplePlot
from app.models.psp import PlotMeasurement, SamplePlotBoundary

router = APIRouter()

# --- Pydantic Schemas ---

class PlotBase(BaseModel):
    plot_name: str
    stratum: str
    status: str = "Active"
    project_id: Optional[uuid.UUID] = None

class MeasurementCreate(BaseModel):
    measurement_date: Optional[str] = None
    canopy_cover_percent: Optional[float] = None
    avg_tree_height_m: Optional[float] = None
    above_ground_biomass_tc_ha: Optional[float] = None
    notes: Optional[str] = None
    is_qa_survey: bool = False
    recorded_by: Optional[uuid.UUID] = None

# --- Routes ---

@router.get("/")
async def list_plots(project_id: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """List all Permanent Sample Plots."""
    query = select(SamplePlot)
    if project_id and project_id != "all":
        query = query.where(SamplePlot.project_id == uuid.UUID(project_id))
    
    result = await db.execute(query.order_by(SamplePlot.plot_name))
    plots = result.scalars().all()
    
    # We can't easily Serialize Geometry objects without GeoAlchemy2 helpers or manual conversion
    # For now, return basic info. In a real app, we'd use ST_AsGeoJSON in the query.
    return [
        {
            "id": str(p.id),
            "plot_name": p.plot_name,
            "stratum": p.stratum,
            "status": p.status,
            "project_id": str(p.project_id) if p.project_id else None,
            "created_at": p.created_at.isoformat()
        }
        for p in plots
    ]

@router.get("/{plot_id}/measurements")
async def list_measurements(plot_id: str, db: AsyncSession = Depends(get_db)):
    """Get measurement history for a specific plot."""
    query = select(PlotMeasurement).where(PlotMeasurement.plot_id == uuid.UUID(plot_id))
    result = await db.execute(query.order_by(PlotMeasurement.measurement_date.desc()))
    measurements = result.scalars().all()
    return measurements

@router.post("/{plot_id}/measurements")
async def log_measurement(plot_id: str, payload: MeasurementCreate, db: AsyncSession = Depends(get_db)):
    """Log a new biometric measurement for a plot."""
    meas_date = datetime.date.today()
    if payload.measurement_date:
        meas_date = datetime.date.fromisoformat(payload.measurement_date)
    
    new_meas = PlotMeasurement(
        plot_id=uuid.UUID(plot_id),
        measurement_date=meas_date,
        canopy_cover_percent=payload.canopy_cover_percent,
        avg_tree_height_m=payload.avg_tree_height_m,
        above_ground_biomass_tc_ha=payload.above_ground_biomass_tc_ha,
        notes=payload.notes,
        is_qa_survey=payload.is_qa_survey,
        recorded_by=payload.recorded_by
    )
    
    db.add(new_meas)
    await db.commit()
    await db.refresh(new_meas)
    return new_meas

@router.get("/{plot_id}/due-date")
async def get_plot_due_date(plot_id: str, db: AsyncSession = Depends(get_db)):
    """Get the calculated next measurement due date via DB RPC."""
    # Using raw SQL to call the helper function
    result = await db.execute(
        text("SELECT public.calculate_next_measurement_due(:pid)"),
        {"pid": uuid.UUID(plot_id)}
    )
    due_date = result.scalar()
    return {"due_date": due_date.isoformat() if due_date else None}
