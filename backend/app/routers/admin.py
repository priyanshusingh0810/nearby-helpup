from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User
from app.models.listing import Listing
from app.models.review import Review
from app.schemas.all_schemas import UserResponse, ListingResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/admin", tags=["admin"])

# Quick helper to verify admin permissions (in a real app, User has an is_admin flag.
# We will simulate this by checking if username is 'admin' or if it is the first user)
def check_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.username.lower() != "admin" and current_user.id != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required to access this portal"
        )
    return current_user

@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db), current_user: User = Depends(check_admin_user)):
    total_users = db.query(User).count()
    total_listings = db.query(Listing).count()
    active_listings = db.query(Listing).filter(Listing.status == "active").count()
    completed_listings = db.query(Listing).filter(Listing.status == "completed").count()
    emergency_listings = db.query(Listing).filter(Listing.is_emergency == True, Listing.status == "active").count()
    
    # Calculate avg trust score across all users
    users = db.query(User).all()
    avg_trust = sum(u.trust_score for u in users) / len(users) if users else 75.0
    
    return {
        "total_users": total_users,
        "total_listings": total_listings,
        "active_listings": active_listings,
        "completed_listings": completed_listings,
        "emergency_listings": emergency_listings,
        "avg_trust_score": round(avg_trust, 1)
    }

@router.get("/users", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db), current_user: User = Depends(check_admin_user)):
    users = db.query(User).all()
    return users

@router.post("/verify-identity/{user_id}", response_model=UserResponse)
def approve_identity_verification(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(check_admin_user)
):
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
        
    target.identity_verified = True
    # Boost trust score on successful verification
    target.trust_score = min(target.trust_score + 20.0, 100.0)
    db.commit()
    db.refresh(target)
    return target

@router.delete("/listings/{listing_id}")
def moderate_delete_listing(
    listing_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(check_admin_user)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    db.delete(listing)
    db.commit()
    return {"message": f"Listing {listing_id} deleted by administrator"}
