from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
import math

from app.core.database import get_db
from app.models.listing import Listing, BarterOffer
from app.models.user import User
from app.models.notification import Notification
from app.schemas.all_schemas import ListingCreate, ListingResponse, BarterOfferCreate, BarterOfferResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/listings", tags=["listings"])

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    # Earth radius in kilometers
    R = 6371.0
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat / 2) ** 2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

@router.post("/", response_model=ListingResponse)
def create_listing(
    listing_in: ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Set default image if none provided
    images = listing_in.images
    if not images:
        images = f"https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop" # Default generic fallback
        
    # Auto expiration for emergency items (e.g. 6 hours if not specified)
    expires_at = listing_in.expires_at
    if listing_in.is_emergency and not expires_at:
        expires_at = datetime.utcnow() + timedelta(hours=6)

    db_listing = Listing(
        owner_id=current_user.id,
        type=listing_in.type,
        title=listing_in.title,
        description=listing_in.description,
        category=listing_in.category,
        images=images,
        location_lat=listing_in.location_lat,
        location_lon=listing_in.location_lon,
        location_name=listing_in.location_name or current_user.location_name,
        is_emergency=listing_in.is_emergency,
        expires_at=expires_at,
        borrow_needed_until=listing_in.borrow_needed_until,
        lend_max_duration=listing_in.lend_max_duration,
        lend_deposit=listing_in.lend_deposit,
        lend_condition=listing_in.lend_condition,
        barter_seeking=listing_in.barter_seeking,
        service_skills=listing_in.service_skills,
        reward=listing_in.reward
    )
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)

    # Trigger notifications for emergency items nearby
    if db_listing.is_emergency:
        try:
            other_users = db.query(User).filter(User.id != current_user.id).all()
            for u in other_users:
                if u.location_lat is not None and u.location_lon is not None:
                    dist = haversine_distance(db_listing.location_lat, db_listing.location_lon, u.location_lat, u.location_lon)
                    if dist <= 10.0:  # Broadcast to anyone within 10 km radius
                        notif = Notification(
                            user_id=u.id,
                            type="emergency",
                            title="🚨 Nearby Emergency Alert",
                            content=f"{current_user.name} urgently needs a '{db_listing.title}' nearby!",
                            link_to=f"/listing/{db_listing.id}"
                        )
                        db.add(notif)
            db.commit()
        except Exception as e:
            print(f"Error generating emergency notifications: {e}")

    return db_listing

@router.get("/", response_model=List[ListingResponse])
def get_listings(
    type: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None,
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    radius: Optional[float] = 10.0, # Default 10km search radius
    is_emergency: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Listing).filter(Listing.status == "active")
    
    if type:
        query = query.filter(Listing.type == type)
    if category:
        query = query.filter(Listing.category == category)
    if is_emergency is not None:
        query = query.filter(Listing.is_emergency == is_emergency)
        # Filters out expired emergency listings
        if is_emergency:
            query = query.filter((Listing.expires_at == None) | (Listing.expires_at > datetime.utcnow()))
            
    if search:
        query = query.filter(
            Listing.title.ilike(f"%{search}%") | 
            Listing.description.ilike(f"%{search}%")
        )
        
    # Perform Geo Filtering at DB level if PostgreSQL + PostGIS, otherwise fall back to memory
    if lat is not None and lon is not None:
        if "postgresql" in str(db.bind.url):
            query = query.filter(
                text("ST_DWithin(ST_MakePoint(location_lon, location_lat)::geography, ST_MakePoint(:lon, :lat)::geography, :radius * 1000)")
            ).params(lon=lon, lat=lat, radius=radius)
            return query.all()

    listings = query.all()
    
    # Fallback memory filtering for SQLite/other databases
    if lat is not None and lon is not None:
        filtered_listings = []
        for item in listings:
            dist = haversine_distance(lat, lon, item.location_lat, item.location_lon)
            if dist <= radius:
                filtered_listings.append(item)
        return filtered_listings
        
    return listings

@router.get("/{id}", response_model=ListingResponse)
def get_listing_by_id(id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@router.put("/{id}", response_model=ListingResponse)
def update_listing_status(
    id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this listing")
        
    listing.status = status
    db.commit()
    db.refresh(listing)
    return listing

@router.delete("/{id}")
def delete_listing(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not own this listing")
        
    db.delete(listing)
    db.commit()
    return {"message": "Listing deleted successfully"}

# --- Barter Offers ---
@router.post("/{id}/barter-offers", response_model=BarterOfferResponse)
def create_barter_offer(
    id: int,
    offer_in: BarterOfferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.type != "barter":
        raise HTTPException(status_code=400, detail="Offers can only be created for barter listings")
        
    db_offer = BarterOffer(
        listing_id=listing.id,
        sender_id=current_user.id,
        offered_item_title=offer_in.offered_item_title,
        offered_item_description=offer_in.offered_item_description,
        offered_item_condition=offer_in.offered_item_condition,
        offered_item_image=offer_in.offered_item_image or "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=500&auto=format&fit=crop"
    )
    db.add(db_offer)
    db.commit()
    db.refresh(db_offer)

    # Notify listing owner of the trade offer
    try:
        notif = Notification(
            user_id=listing.owner_id,
            type="request",
            title="🤝 New Barter Swap Offer",
            content=f"{current_user.name} offered to trade '{db_offer.offered_item_title}' for your '{listing.title}'.",
            link_to=f"/listing/{listing.id}"
        )
        db.add(notif)
        db.commit()
    except Exception as e:
        print(f"Error creating barter offer notification: {e}")

    return db_offer

@router.get("/{id}/barter-offers", response_model=List[BarterOfferResponse])
def get_barter_offers(id: int, db: Session = Depends(get_db)):
    offers = db.query(BarterOffer).filter(BarterOffer.listing_id == id).all()
    return offers

@router.put("/barter-offers/{offer_id}/status", response_model=BarterOfferResponse)
def update_barter_offer_status(
    offer_id: int,
    status: str, # "accepted", "rejected", "completed"
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    offer = db.query(BarterOffer).filter(BarterOffer.id == offer_id).first()
    if not offer:
        raise HTTPException(status_code=404, detail="Offer not found")
        
    listing = db.query(Listing).filter(Listing.id == offer.listing_id).first()
    
    # Only listing owner can accept/reject; sender can potentially mark as complete or cancel
    if status in ["accepted", "rejected"]:
        if listing.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Only listing owner can accept or reject trade offers")
    elif status == "completed":
        if current_user.id not in [listing.owner_id, offer.sender_id]:
            raise HTTPException(status_code=403, detail="Only trading parties can finalize this exchange")
            
    offer.status = status
    if status == "accepted":
        # Mark listing as completed or update statuses
        pass
    db.commit()
    db.refresh(offer)

    # Notify barter offer sender of acceptance or rejection
    try:
        status_text = "accepted" if status == "accepted" else "rejected"
        notif = Notification(
            user_id=offer.sender_id,
            type="match",
            title="🤝 Barter Offer Update",
            content=f"Your trade offer for '{listing.title}' has been {status_text} by {current_user.name}.",
            link_to=f"/listing/{listing.id}"
        )
        db.add(notif)
        db.commit()
    except Exception as e:
        print(f"Error creating barter status update notification: {e}")

    return offer
