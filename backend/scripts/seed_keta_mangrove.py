import json
import asyncio
import os
import sys

# Add the parent directory to sys.path so we can import 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import AsyncSessionLocal
from app.models.polygon import MangrovePlot
from sqlalchemy import func

SEED_FILE = "/Users/danielnsowah/Desktop/Prism_Project_Biodiversity_Plan 2/WACA Blue Carbon/output/Verified_Extent_4.6m.geojson"

async def seed_keta_mangroves():
    print(f"Reading {SEED_FILE}...")
    with open(SEED_FILE, 'r') as f:
        geojson = json.load(f)

    if geojson.get("type") != "FeatureCollection":
        print("Expected a FeatureCollection")
        return

    features = geojson.get("features", [])
    print(f"Found {len(features)} features. Inserting into database...")

    async with AsyncSessionLocal() as session:
        for i, feature in enumerate(features):
            # Extract basic properties, defaulting to unknown or 0 if missing
            props = feature.get("properties", {})
            stratum = props.get("stratum", "Unknown Fringing")
            area = props.get("area_ha", 0.0)

            # Insert raw geojson directly to PostGIS ST_GeomFromGeoJSON
            geom_json = json.dumps(feature.get("geometry"))
            
            plot = MangrovePlot(
                stratum_name=stratum,
                area_ha=area,
                geom=func.ST_SetSRID(func.ST_GeomFromGeoJSON(geom_json), 4326)
            )
            session.add(plot)

            if (i + 1) % 100 == 0:
                print(f"Inserted {i + 1} features...")
                await session.commit()
                
        # Commit the remaining records
        await session.commit()
        print("Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed_keta_mangroves())
