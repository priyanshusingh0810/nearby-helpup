from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    rating = Column(Float, nullable=False) # 1.0 to 5.0
    content = Column(String, default="")
    would_borrow_lend_again = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    listing = relationship("Listing", back_populates="reviews")
    author = relationship("User", foreign_keys=[author_id], back_populates="reviews_written")
    target = relationship("User", foreign_keys=[target_id], back_populates="reviews_received")
