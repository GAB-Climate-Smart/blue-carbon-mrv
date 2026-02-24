-- Enable PostGIS extension for spatial data
CREATE EXTENSION IF NOT EXISTS postgis;
-- 1. Mangrove Plots
CREATE TABLE public.mangrove_plots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stratum_name VARCHAR(255) NOT NULL,
    area_ha NUMERIC(10, 2) NOT NULL,
    planting_date DATE,
    geom geometry(Polygon, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Index for spatial queries on plots
CREATE INDEX idx_mangrove_plots_geom ON public.mangrove_plots USING GIST (geom);
-- 2. Leakage Buffer Zones
CREATE TABLE public.leakage_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_name VARCHAR(255) NOT NULL,
    area_ha NUMERIC(10, 2) NOT NULL,
    geom geometry(Polygon, 4326) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Index for spatial queries on leakage zones
CREATE INDEX idx_leakage_zones_geom ON public.leakage_zones USING GIST (geom);
-- 3. SAR / NDVI Change Alerts (Deforestation / Stress)
CREATE TABLE public.sar_change_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(50) NOT NULL CHECK (
        alert_type IN (
            'Deforestation',
            'Vegetation Stress',
            'Encroachment',
            'New Planting'
        )
    ),
    severity VARCHAR(20) NOT NULL CHECK (
        severity IN ('Low', 'Medium', 'High', 'Critical')
    ),
    confidence_score NUMERIC(5, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'Pending Verification',
    detected_area_ha NUMERIC(10, 2),
    event_date DATE NOT NULL,
    geom geometry(Polygon, 4326) NOT NULL,
    assigned_crema_id UUID,
    -- For future User linking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Index for spatial queries on alerts
CREATE INDEX idx_sar_change_alerts_geom ON public.sar_change_alerts USING GIST (geom);
CREATE INDEX idx_sar_change_alerts_status ON public.sar_change_alerts(status);
-- Setup Row Level Security (RLS) policies (Placeholder for now, assumes Admin access)
ALTER TABLE public.mangrove_plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leakage_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sar_change_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to all users" ON public.mangrove_plots FOR
SELECT USING (true);
CREATE POLICY "Allow read access to all users" ON public.leakage_zones FOR
SELECT USING (true);
CREATE POLICY "Allow read access to all users" ON public.sar_change_alerts FOR
SELECT USING (true);