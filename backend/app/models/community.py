from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Community(Base):
    __tablename__ = "communities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, default="")
    category = Column(String, index=True, nullable=False)
    cover_image = Column(String, default="")
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_verified = Column(Boolean, default=False)
    rules = Column(Text, default="Be respectful and helpful to your neighbors.")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    members = relationship("CommunityMember", back_populates="community", cascade="all, delete-orphan")
    channels = relationship("CommunityChatChannel", back_populates="community", cascade="all, delete-orphan")
    polls = relationship("CommunityPoll", back_populates="community", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="community", cascade="all, delete-orphan")

class CommunityMember(Base):
    __tablename__ = "community_members"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String, default="member")  # "admin", "moderator", "member"
    joined_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    community = relationship("Community", back_populates="members")
    user = relationship("User")

class CommunityChatChannel(Base):
    __tablename__ = "community_channels"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=False)
    name = Column(String, nullable=False)  # e.g., "general", "announcements", "events"
    type = Column(String, default="text")  # "text", "announcement"
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    community = relationship("Community", back_populates="channels")
    messages = relationship("CommunityChatMessage", back_populates="channel", cascade="all, delete-orphan")

class CommunityChatMessage(Base):
    __tablename__ = "community_messages"

    id = Column(Integer, primary_key=True, index=True)
    channel_id = Column(Integer, ForeignKey("community_channels.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, default="")
    image_url = Column(String, default="")
    video_url = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    channel = relationship("CommunityChatChannel", back_populates="messages")
    sender = relationship("User")

class CommunityPoll(Base):
    __tablename__ = "community_polls"

    id = Column(Integer, primary_key=True, index=True)
    community_id = Column(Integer, ForeignKey("communities.id"), nullable=False)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question = Column(String, nullable=False)
    options = Column(Text, nullable=False)  # JSON-encoded array of options, e.g., ["Saturday", "Sunday"]
    votes = Column(Text, default="{}")  # JSON-encoded dict of user_id -> option_index, e.g., {"1": 0}
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    community = relationship("Community", back_populates="polls")
    creator = relationship("User")
