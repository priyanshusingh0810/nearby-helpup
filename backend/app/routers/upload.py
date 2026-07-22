from fastapi import APIRouter, UploadFile, File, Request, HTTPException
import shutil
import uuid
import os

router = APIRouter(prefix="/upload", tags=["upload"])

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/file")
def upload_file(request: Request, file: UploadFile = File(...)):
    # Validate that it is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed.")
        
    # Generate a unique secure filename
    file_extension = os.path.splitext(file.filename)[1]
    if not file_extension:
        file_extension = ".png" # default fallback
        
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        base_url = str(request.base_url).rstrip("/")
        file_url = f"{base_url}/static/uploads/{unique_filename}"
        return {"url": file_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save uploaded image: {str(e)}")
