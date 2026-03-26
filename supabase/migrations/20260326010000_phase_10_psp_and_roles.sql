-- Migration: 20260326010000_phase_10_psp_and_roles.sql
-- Description: Expands institutional role taxonomy and completes project-centric wiring for PSPs.

-- 1. Expand Role Taxonomy
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_role_check CHECK (
    role IN (
        'admin',
        'crema_agent',
        'gis_unit',
        'soil_lab',
        'mlnr_admin',
        'mest_reviewer',
        'fc_analyst',
        'wd_validator',
        'mmda_reviewer',
        'crema_submitter',
        'auditor_readonly'
    )
);

-- 2. Complete PSP Wiring & Validation Columns
-- Add validation columns to plot_measurements
ALTER TABLE public.plot_measurements
ADD COLUMN IF NOT EXISTS validation_status TEXT DEFAULT 'Pending' CHECK (validation_status IN ('Pending', 'Approved', 'Rejected')),
ADD COLUMN IF NOT EXISTS validated_by UUID REFERENCES public.profiles(id);

-- Add project_id to sample_plot_boundaries (missed in previous wiring)
ALTER TABLE public.sample_plot_boundaries
ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_sample_plot_boundaries_project_id ON public.sample_plot_boundaries(project_id);

-- Update geojson view for sample_plot_boundaries to include project_id
DROP VIEW IF EXISTS public.geojson_sample_plot_boundaries;
CREATE OR REPLACE VIEW public.geojson_sample_plot_boundaries WITH (security_invoker = on) AS
SELECT
    id,
    sample_plot_id,
    boundary_name,
    area_ha,
    valid_from,
    valid_to,
    project_id,
    created_at,
    ST_AsGeoJSON(geom)::jsonb AS geojson
FROM public.sample_plot_boundaries;

-- 3. Institutional RLS Refinement
-- We want to ensure that roles like fc_analyst or wd_validator can see and manage data.
-- For the MVP, we already have many "Allow authenticated users to view" policies.
-- We will add specific "Validator" update policies for plot measurements.

-- Allow institutional validators to update measurements (mark as QA/QC verified)
CREATE POLICY "Validators can update plot measurements" ON public.plot_measurements FOR
UPDATE USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'fc_analyst', 'wd_validator', 'mest_reviewer')
    )
);

-- 4. Due Date Helper Function
-- Function to calculate the next measurement date (Default: 2 years after last measurement)
CREATE OR REPLACE FUNCTION public.calculate_next_measurement_due(plot_id UUID)
RETURNS DATE AS $$
DECLARE
    last_date DATE;
BEGIN
    SELECT MAX(measurement_date) INTO last_date
    FROM public.plot_measurements
    WHERE public.plot_measurements.plot_id = $1;

    IF last_date IS NULL THEN
        -- If no measurements, due now (or plot creation date)
        RETURN CURRENT_DATE;
    ELSE
        RETURN last_date + INTERVAL '2 years';
    END IF;
END;
$$ LANGUAGE plpgsql STABLE;
