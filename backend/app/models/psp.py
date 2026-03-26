import uuid
from sqlalchemy import Column, String, Numeric, Date, Boolean, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from .base import Base


class PlotMeasurement(Base):
    __tablename__ = "plot_measurements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    plot_id = Column(UUID(as_uuid=True), ForeignKey("sample_plots.id", ondelete="CASCADE"), nullable=False)
    measurement_date = Column(Date, nullable=False, server_default=text("CURRENT_DATE"))
    recorded_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"), nullable=True)
    canopy_cover_percent = Column(Numeric, nullable=True)
    avg_tree_height_m = Column(Numeric, nullable=True)
    above_ground_biomass_tc_ha = Column(Numeric, nullable=True)
    notes = Column(String, nullable=True)
    is_qa_survey = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=text("timezone('utc'::text, now())"), nullable=False)

    plot = relationship("SamplePlot", back_populates="measurements")


class SamplePlotBoundary(Base):
    __tablename__ = "sample_plot_boundaries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    sample_plot_id = Column(UUID(as_uuid=True), ForeignKey("sample_plots.id", ondelete="CASCADE"), nullable=False)
    boundary_name = Column(String, nullable=True)
    geom = Column(Geometry('MULTIPOLYGON', srid=4326), nullable=False)
    area_ha = Column(Numeric(10, 2), nullable=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=True)
    valid_from = Column(Date, nullable=False, server_default=text("CURRENT_DATE"))
    valid_to = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=text("timezone('utc'::text, now())"), nullable=False)

    plot = relationship("SamplePlot", back_populates="boundaries")
    project = relationship("Project", back_populates="sample_plot_boundaries")
