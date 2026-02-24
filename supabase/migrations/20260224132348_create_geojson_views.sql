-- Create a view for sar change alerts that converts PostGIS EWKB geom to GeoJSON
CREATE OR REPLACE VIEW public.geojson_alerts WITH (security_invoker = on) AS
SELECT id,
    alert_type,
    severity,
    confidence_score,
    status,
    detected_area_ha,
    event_date,
    ST_AsGeoJSON(geom)::jsonb AS geojson
FROM public.sar_change_alerts;
-- Create a view for mangrove plots that converts PostGIS EWKB geom to GeoJSON
CREATE OR REPLACE VIEW public.geojson_plots WITH (security_invoker = on) AS
SELECT id,
    stratum_name,
    area_ha,
    planting_date,
    created_at,
    updated_at,
    ST_AsGeoJSON(geom)::jsonb AS geojson
FROM public.mangrove_plots;