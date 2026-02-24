-- Insert Dummy Data for Mangrove Plots (Polygons around Keta Lagoon area)
INSERT INTO public.mangrove_plots (stratum_name, area_ha, planting_date, geom)
VALUES (
        'Keta Restoration Zone A',
        15.5,
        '2025-06-12',
        ST_GeomFromText(
            'POLYGON((0.957 5.865, 0.960 5.865, 0.960 5.860, 0.957 5.860, 0.957 5.865))',
            4326
        )
    ),
    (
        'Songor Protection Area',
        250.0,
        NULL,
        ST_GeomFromText(
            'POLYGON((0.550 5.800, 0.580 5.800, 0.580 5.750, 0.550 5.750, 0.550 5.800))',
            4326
        )
    ),
    (
        'Muni-Pomadze Reserve',
        85.2,
        '2023-11-20',
        ST_GeomFromText(
            'POLYGON((-0.670 5.380, -0.650 5.380, -0.650 5.350, -0.670 5.350, -0.670 5.380))',
            4326
        )
    );
-- Insert Dummy Deforestation Alerts
INSERT INTO public.sar_change_alerts (
        alert_type,
        severity,
        confidence_score,
        status,
        detected_area_ha,
        event_date,
        geom
    )
VALUES (
        'Deforestation',
        'High',
        95.5,
        'Pending Verification',
        1.2,
        '2026-02-21',
        ST_GeomFromText(
            'POLYGON((0.958 5.863, 0.959 5.863, 0.959 5.862, 0.958 5.862, 0.958 5.863))',
            4326
        )
    ),
    (
        'Vegetation Stress',
        'Medium',
        78.2,
        'Under Review',
        4.5,
        '2026-02-15',
        ST_GeomFromText(
            'POLYGON((0.560 5.780, 0.565 5.780, 0.565 5.775, 0.560 5.775, 0.560 5.780))',
            4326
        )
    ),
    (
        'Encroachment',
        'Critical',
        99.1,
        'Verified - Illegal Logging',
        0.8,
        '2026-01-10',
        ST_GeomFromText(
            'POLYGON((-0.660 5.370, -0.662 5.370, -0.662 5.368, -0.660 5.368, -0.660 5.370))',
            4326
        )
    ),
    (
        'New Planting',
        'Low',
        88.0,
        'Logged',
        2.0,
        '2026-02-01',
        ST_GeomFromText(
            'POLYGON((0.959 5.861, 0.960 5.861, 0.960 5.860, 0.959 5.860, 0.959 5.861))',
            4326
        )
    );