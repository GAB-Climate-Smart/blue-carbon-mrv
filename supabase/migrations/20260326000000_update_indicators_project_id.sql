-- Migration: 20260326000000_update_indicators_project_id.sql
-- Description: Adds project_id to socio_economic and environmental pressure tables.

-- Add project_id to socio_economic_observations
ALTER TABLE public.socio_economic_observations 
ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Add project_id to environmental_pressure_observations
ALTER TABLE public.environmental_pressure_observations 
ADD COLUMN project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_socio_economic_project_id ON public.socio_economic_observations(project_id);
CREATE INDEX IF NOT EXISTS idx_environmental_pressure_project_id ON public.environmental_pressure_observations(project_id);

-- Update RLS policies to include project_id checks if needed (keeping it simple for now as per previous policies)
-- The existing policies allow authenticated users to view/insert, which is sufficient for now.
