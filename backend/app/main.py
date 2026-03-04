from fastapi import FastAPI
from app.api.routes import polygons, uploads

app = FastAPI(title="Blue Carbon MRV API", description="API for Blue Carbon MRV System")

app.include_router(polygons.router, prefix="/api/v1/polygons", tags=["Polygons"])
app.include_router(uploads.router, prefix="/api/v1/uploads", tags=["Uploads"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Blue Carbon MRV API is running"}
