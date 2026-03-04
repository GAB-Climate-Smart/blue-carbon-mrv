from pydantic import BaseModel, Field
from typing import Any, Dict, Optional
from datetime import date
from uuid import UUID

class GeoJSONGeometry(BaseModel):
    type: str
    coordinates: Any

class MangrovePlotBase(BaseModel):
    stratum_name: str
    area_ha: float
    planting_date: Optional[date] = None

class MangrovePlotCreate(MangrovePlotBase):
    geom: GeoJSONGeometry

class MangrovePlotResponse(MangrovePlotBase):
    id: UUID
    geom: GeoJSONGeometry

    class Config:
        from_attributes = True

class LeakageZoneBase(BaseModel):
    zone_name: str
    area_ha: float

class LeakageZoneCreate(LeakageZoneBase):
    geom: GeoJSONGeometry

class LeakageZoneResponse(LeakageZoneBase):
    id: UUID
    geom: GeoJSONGeometry

    class Config:
        from_attributes = True
