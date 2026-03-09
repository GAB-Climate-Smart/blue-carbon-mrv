-- Migration: 20260309000000_add_insert_project_area_rpc.sql
-- Description: Adds a PostgreSQL RPC function so the frontend can upload GeoJSON spatial
--   layers directly to project_areas via Supabase (no separate FastAPI server required).

CREATE OR REPLACE FUNCTION public.insert_project_area_geojson(
    p_features  jsonb,
    p_area_type text,
    p_project_id uuid,
    p_filename  text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    feature         jsonb;
    feature_name    text;
    area_ha         numeric;
    geometry_json   text;
    inserted_count  integer := 0;
    skipped_count   integer := 0;
    geom_type       text;
BEGIN
    FOR feature IN SELECT * FROM jsonb_array_elements(p_features)
    LOOP
        -- Skip features without geometry
        IF feature -> 'geometry' IS NULL OR feature -> 'geometry' = 'null'::jsonb THEN
            skipped_count := skipped_count + 1;
            CONTINUE;
        END IF;

        geom_type := feature -> 'geometry' ->> 'type';

        -- Only accept Polygon and MultiPolygon geometries
        IF geom_type NOT IN ('Polygon', 'MultiPolygon') THEN
            skipped_count := skipped_count + 1;
            CONTINUE;
        END IF;

        -- Derive a human-readable name from the feature properties
        feature_name := COALESCE(
            NULLIF(TRIM(feature -> 'properties' ->> 'name'), ''),
            NULLIF(TRIM(feature -> 'properties' ->> 'area_name'), ''),
            NULLIF(TRIM(feature -> 'properties' ->> 'plot_name'), ''),
            initcap(p_area_type) || ' Area'
        );

        -- Try to parse area_ha if provided
        BEGIN
            area_ha := (feature -> 'properties' ->> 'area_ha')::numeric;
        EXCEPTION WHEN OTHERS THEN
            area_ha := NULL;
        END;

        geometry_json := (feature -> 'geometry')::text;

        INSERT INTO public.project_areas (
            area_name,
            area_type,
            source_file_name,
            area_ha,
            properties,
            project_id,
            geom
        ) VALUES (
            feature_name,
            p_area_type,
            p_filename,
            area_ha,
            COALESCE(feature -> 'properties', '{}'::jsonb),
            p_project_id,
            -- ST_Multi promotes Polygon → MultiPolygon; MultiPolygon passes through unchanged
            ST_Multi(ST_SetSRID(ST_GeomFromGeoJSON(geometry_json), 4326))::geometry(MultiPolygon, 4326)
        );

        inserted_count := inserted_count + 1;
    END LOOP;

    RETURN json_build_object(
        'inserted_count', inserted_count,
        'skipped_count',  skipped_count,
        'feature_count',  jsonb_array_length(p_features)
    );
END;
$$;

-- Allow authenticated callers only
GRANT EXECUTE ON FUNCTION public.insert_project_area_geojson TO authenticated;
