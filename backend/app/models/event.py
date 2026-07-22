from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=True) # Optional link to a community
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    title = Column(String, nullable=False, index=True)
    description = Column(String, default="")
    cover_image = Column(String, default="")
    
    # Event Location & Coordinates
    location_name = Column(String, default="Nearby")
    location_lat = Column(Float, nullable=False)
    location_lon = Column(Float, nullable=False)
    
    event_time = Column(DateTime, nullable=False)
    rsvp_limit = Column(Integer, nullable=True) # Optional RSVP limit
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    community = relationship("Community", back_populates="events")
    creator = relationship("User", foreign_keys=[creator_id])
    rsvps = relationship("EventRSVP", back_populates="event", cascade="all, delete-orphan")

class EventRSVP(Base):
    __tablename__ = "event_rsvps"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String, default="going") # "going", "maybe", "not_going"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    event = relationship("Event", back_populates="rsvps")
    user = relationship("User")
