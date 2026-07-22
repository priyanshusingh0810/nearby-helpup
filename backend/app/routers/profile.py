from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.user import User
from app.models.listing import Listing
from app.models.review import Review
from app.models.notification import Notification
from app.schemas.all_schemas import UserResponse, UserUpdate, ListingResponse, ReviewResponse, ReviewCreate
from app.routers.auth import get_current_user

router = APIRouter(prefix="/profiles", tags=["profiles"])

def recalculate_trust_score(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return
        
    score = 50.0  # Base score
    if user.identity_verified:
        score += 20.0
    if user.phone_verified:
        score += 10.0
        
    # Get all reviews
    reviews = db.query(Review).filter(Review.target_id == user_id).all()
    if reviews:
        avg_rating = sum(r.rating for r in reviews) / len(reviews)
        user.average_rating = round(avg_rating, 2)
        user.total_ratings = len(reviews)
        
        # Rating modifier: maps 3.0 to 0, 5.0 to +15, 1.0 to -15
        rating_mod = (avg_rating - 3.0) * 7.5
        score += rating_mod
    else:
        user.average_rating = 5.0
        user.total_ratings = 0
        
    # Add transaction count modifier
    completed_listings = db.query(Listing).filter(
        Listing.owner_id == user_id,
        Listing.status == "completed"
    ).count()
    
    # +0.5 per transaction, max +5.0
    score += min(completed_listings * 0.5, 5.0)
    
    # Clamp score between 0.0 and 100.0
    user.trust_score = max(0.0, min(100.0, score))
    db.commit()

@router.get("/{user_id}", response_model=UserResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/me", response_model=UserResponse)
def update_profile(
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    for field, val in user_in.dict(exclude_unset=True).items():
        setattr(current_user, field, val)
        
    db.commit()
    db.refresh(current_user)
    recalculate_trust_score(current_user.id, db)
    return current_user

@router.get("/{user_id}/listings", response_model=List[ListingResponse])
def get_user_listings(user_id: int, db: Session = Depends(get_db)):
    listings = db.query(Listing).filter(Listing.owner_id == user_id).all()
    return listings

@router.get("/{user_id}/reviews", response_model=List[ReviewResponse])
def get_user_reviews(user_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.target_id == user_id).all()
    return reviews

@router.post("/{user_id}/reviews", response_model=ReviewResponse)
def create_review(
    user_id: int, # target_id
    listing_id: int,
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot rate yourself")
        
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
        
    # Verify target exists
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target user not found")
        
    # Create the review
    db_review = Review(
        listing_id=listing_id,
        author_id=current_user.id,
        target_id=user_id,
        rating=review_in.rating,
        content=review_in.content,
        would_borrow_lend_again=review_in.would_borrow_lend_again
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Recalculate target's trust score
    recalculate_trust_score(user_id, db)

    # Notify target user of the new review rating
    try:
        notif = Notification(
            user_id=user_id,
            type="match",
            title="⭐️ New Review Received",
            content=f"{current_user.name} rated you {review_in.rating} stars!" if not review_in.content else f"{current_user.name} rated you {review_in.rating} stars.",
            link_to=f"/profile/{user_id}"
        )
        db.add(notif)
        db.commit()
    except Exception as e:
        print(f"Error creating review notification: {e}")
    
    return db_review
