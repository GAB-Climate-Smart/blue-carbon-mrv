from fastapi import FastAPI

app = FastAPI(title="Blue Carbon MRV API", description="API for Blue Carbon MRV System")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Blue Carbon MRV API is running"}
