from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    type = Column(String, nullable=False) # "request", "message", "emergency", "match", "return_reminder"
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    link_to = Column(String, default="") # frontend route (e.g. "/chat/3" or "/listing/12")
    
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="notifications")
