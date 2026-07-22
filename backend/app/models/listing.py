from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Core Fields
    type = Column(String, nullable=False) # "borrow", "lend", "barter", "donate", "service"
    title = Column(String, nullable=False, index=True)
    description = Column(String, default="")
    category = Column(String, nullable=False, index=True)
    images = Column(String, default="") # Semi-colon separated image paths/URLs
    
    location_lat = Column(Float, nullable=False)
    location_lon = Column(Float, nullable=False)
    location_name = Column(String, default="Nearby")
    
    status = Column(String, default="active") # "active", "completed", "cancelled"
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Emergency Request fields
    is_emergency = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=True) # Countdown limit for emergency
    
    # Type-Specific Fields
    # Borrow
    borrow_needed_until = Column(DateTime, nullable=True)
    
    # Lend
    lend_max_duration = Column(Integer, nullable=True) # in days
    lend_deposit = Column(Float, nullable=True)
    lend_condition = Column(String, nullable=True) # "New", "Like New", "Good", "Fair"
    
    # Barter
    barter_seeking = Column(String, nullable=True) # Description of what they seek in return
    
    # Service
    service_skills = Column(String, nullable=True)
    
    # General (Optional Reward)
    reward = Column(String, default="")
    
    # Relationships
    owner = relationship("User", back_populates="listings")
    barter_offers = relationship("BarterOffer", back_populates="listing", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="listing", cascade="all, delete-orphan")

class BarterOffer(Base):
    __tablename__ = "barter_offers"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    offered_item_title = Column(String, nullable=False)
    offered_item_description = Column(String, default="")
    offered_item_condition = Column(String, default="Good")
    offered_item_image = Column(String, default="")
    
    status = Column(String, default="pending") # "pending", "accepted", "rejected", "completed"
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    listing = relationship("Listing", back_populates="barter_offers")
    sender = relationship("User", foreign_keys=[sender_id])
