import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load env vars
const supabaseUrl = 'https://eavqytqxeaswfbytguxs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhdnF5dHF4ZWFzd2ZieXRndXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzI5NzE1NCwiZXhwIjoyMDg4ODczMTU0fQ.f8SzbOExNQX8DUgO15JGJWI1JOgpYD5KQ3P0Q-yoH-k';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedKeta() {
    console.log('Seeding Keta Lagoon Complex Pilot...');
    const sourceDir = '/Users/danielnsowah/Desktop/Blue-Carbon-Project-Final-Report/source_reports';
    const ketaBoundaryFile = path.join(sourceDir, 'keta_lagoon_boundary.geojson');
    const saloPspFile = path.join(sourceDir, 'salo_permanent_sampla_plot_1_ndmi_03mar2026_boundary.geojson');
    
    // 0. Cleanup existing pilot projects to keep it clean
    await supabase.from('projects').delete().eq('name', 'Keta Lagoon Complex Pilot');

    // 1. Create Project
    const { data: project, error: pErr } = await supabase.from('projects').insert({
        name: 'Keta Lagoon Complex Pilot',
        region: 'Volta',
        district: 'Keta',
        project_types: ['restoration', 'conservation'],
        description: 'Official WACA MRV Pilot Site based on the comprehensive 2025 eco-social baseline.'
    }).select().single();

    if (pErr) {
        console.error('Error creating project:', pErr);
        return;
    }
    console.log(`Project created with ID: ${project.id}`);

    // If PostGIS insertion fails via REST, we will catch it.
    try {
        console.log('Reading Keta boundary...');
        if (fs.existsSync(ketaBoundaryFile)) {
            const raw = fs.readFileSync(ketaBoundaryFile, 'utf8');
            const parsed = JSON.parse(raw);
            for (const feature of parsed.features || []) {
                // Convert Polygon to MultiPolygon
                let geom = feature.geometry;
                if (geom.type === 'Polygon') {
                    geom = { type: 'MultiPolygon', coordinates: [geom.coordinates] };
                }
                const { error: geomErr } = await supabase.from('project_areas').insert({
                    project_id: project.id,
                    area_name: 'Keta Lagoon Boundary',
                    area_type: 'conservation', // Must be one of: restoration, conservation, protection, buffer, reference
                    geom: geom,
                });
                if (geomErr) console.error('Geom Insert Error:', geomErr.message);
                else console.log('Successfully inserted Keta Boundary Geom via REST.');
            }
        }
    } catch (e) {
        console.error('Failed to parse or insert boundary via REST', e);
    }
    
    try {
        console.log('Reading Salo PSP...');
        if (fs.existsSync(saloPspFile)) {
            const raw = fs.readFileSync(saloPspFile, 'utf8');
            const parsed = JSON.parse(raw);
            for (const feature of parsed.features || []) {
                // To get a point from a polygon, just grab the first coordinate of the outer ring
                let ptCoord = feature.geometry.coordinates[0][0];
                let ptGeom = { type: 'Point', coordinates: ptCoord };
                
                const { data: pspTarget, error: pspTargetErr } = await supabase.from('sample_plots').insert({
                    project_id: project.id,
                    plot_name: 'Salo Permanent Sample Plot 1',
                    stratum: 'Basin', // Must be one of: Fringing, Basin, Riverine, Overwash, Scrub, Hammock
                    location: ptGeom
                }).select().single();
                
                if (pspTargetErr) console.error('PSP Point Err:', pspTargetErr.message);
                else {
                    console.log(`Created PSP Point: ${pspTarget.id}`);
                    
                    // Also create the Sample Plot Boundary (which expects MultiPolygon)
                    let boundGeom = feature.geometry;
                    if (boundGeom.type === 'Polygon') {
                        boundGeom = { type: 'MultiPolygon', coordinates: [boundGeom.coordinates] };
                    }
                    const { error: boundErr } = await supabase.from('sample_plot_boundaries').insert({
                        project_id: project.id,
                        sample_plot_id: pspTarget.id,
                        boundary_name: 'Salo PSP 1 Footprint',
                        geom: boundGeom
                    });
                    if (boundErr) console.error('PSP Boundary Err:', boundErr.message);
                    else console.log('Successfully inserted PSP Boundary Geom.');
                }
            }
        }
    } catch (e) {
        console.error('Failed to insert PSP.', e);
    }

    try {
        console.log('Reading Dzita restoration areas...');
        const dzitaRestFile = path.join(sourceDir, 'dzita_restoration_areas_ndmi_03mar2026_boundary.geojson');
        if (fs.existsSync(dzitaRestFile)) {
            const raw = fs.readFileSync(dzitaRestFile, 'utf8');
            const parsed = JSON.parse(raw);
            for (let i = 0; i < (parsed.features || []).length; i++) {
                const feature = parsed.features[i];
                let geom = feature.geometry;
                if (geom.type === 'Polygon') {
                    geom = { type: 'MultiPolygon', coordinates: [geom.coordinates] };
                }
                const { error: geomErr } = await supabase.from('project_areas').insert({
                    project_id: project.id,
                    area_name: `Dzita Restoration Area ${i + 1}`,
                    area_type: 'restoration', // Lowercase restoration is allowed
                    geom: geom,
                });
                if (geomErr) console.error(`Dzita ${i+1} Insert Error:`, geomErr.message);
                else console.log(`Successfully inserted Dzita Restoration Area ${i+1}.`);
            }
        }
    } catch (e) {
        console.error('Failed to parse or insert Dzita areas.', e);
    }
}

seedKeta().catch(console.error);
