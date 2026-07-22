from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

# Import related models so they register in SQLAlchemy Base metadata
from app.models.listing import Listing
from app.models.review import Review
from app.models.notification import Notification

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    bio = Column(String, default="")
    profile_photo = Column(String, default="")
    
    # Location coordinates
    location_lat = Column(Float, nullable=True)
    location_lon = Column(Float, nullable=True)
    location_name = Column(String, default="Nearby")
    
    college = Column(String, default="")
    phone_verified = Column(Boolean, default=False)
    identity_verified = Column(Boolean, default=False)
    
    # Trust System metrics
    trust_score = Column(Float, default=75.0)
    total_ratings = Column(Integer, default=0)
    average_rating = Column(Float, default=5.0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Custom tags & badges
    interests = Column(String, default="") # Semi-colon separated interests
    skills = Column(String, default="") # Semi-colon separated skills
    languages = Column(String, default="") # Semi-colon separated languages
    badges = Column(String, default="") # Semi-colon separated badges

    
    # Relationships
    listings = relationship("Listing", back_populates="owner", cascade="all, delete-orphan")
    reviews_received = relationship("Review", foreign_keys="Review.target_id", back_populates="target")
    reviews_written = relationship("Review", foreign_keys="Review.author_id", back_populates="author")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
