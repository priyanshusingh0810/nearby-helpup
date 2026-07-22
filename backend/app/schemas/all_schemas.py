from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# --- User & Token Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    username: str
    name: str
    bio: Optional[str] = ""
    profile_photo: Optional[str] = ""
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None
    location_name: Optional[str] = "Nearby"
    college: Optional[str] = ""
    interests: Optional[str] = ""
    skills: Optional[str] = ""
    languages: Optional[str] = ""
    badges: Optional[str] = ""

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    profile_photo: Optional[str] = None
    location_lat: Optional[float] = None
    location_lon: Optional[float] = None
    location_name: Optional[str] = None
    college: Optional[str] = None
    interests: Optional[str] = None
    skills: Optional[str] = None
    languages: Optional[str] = None
    badges: Optional[str] = None

class UserResponse(UserBase):
    id: int
    phone_verified: bool
    identity_verified: bool
    trust_score: float
    total_ratings: int
    average_rating: float
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[int] = None


# --- Listing & Barter Schemas ---
class ListingCreate(BaseModel):
    type: str  # "borrow", "lend", "barter", "donate", "service"
    title: str
    description: Optional[str] = ""
    category: str
    images: Optional[str] = ""
    location_lat: float
    location_lon: float
    location_name: Optional[str] = "Nearby"
    
    # Emergency Request
    is_emergency: Optional[bool] = False
    expires_at: Optional[datetime] = None
    
    # Borrow
    borrow_needed_until: Optional[datetime] = None
    
    # Lend
    lend_max_duration: Optional[int] = None
    lend_deposit: Optional[float] = None
    lend_condition: Optional[str] = None
    
    # Barter
    barter_seeking: Optional[str] = None
    
    # Service
    service_skills: Optional[str] = None
    
    # Reward
    reward: Optional[str] = ""

class ListingResponse(ListingCreate):
    id: int
    owner_id: int
    status: str
    created_at: datetime
    owner: UserResponse

    class Config:
        from_attributes = True

class BarterOfferCreate(BaseModel):
    offered_item_title: str
    offered_item_description: Optional[str] = ""
    offered_item_condition: Optional[str] = "Good"
    offered_item_image: Optional[str] = ""

class BarterOfferResponse(BarterOfferCreate):
    id: int
    listing_id: int
    sender_id: int
    status: str
    created_at: datetime
    sender: UserResponse

    class Config:
        from_attributes = True


# --- Message & Chat Schemas ---
class MessageCreate(BaseModel):
    content: Optional[str] = ""
    image_url: Optional[str] = ""
    voice_url: Optional[str] = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class MessageResponse(BaseModel):
    id: int
    chat_id: int
    sender_id: int
    content: str
    image_url: str
    voice_url: str
    latitude: Optional[float]
    longitude: Optional[float]
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ChatCreate(BaseModel):
    recipient_id: int
    listing_id: Optional[int] = None

class ChatResponse(BaseModel):
    id: int
    user1_id: int
    user2_id: int
    listing_id: Optional[int] = None
    created_at: datetime
    user1: UserResponse
    user2: UserResponse
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True


# --- Review Schemas ---
class ReviewCreate(BaseModel):
    rating: float
    content: Optional[str] = ""
    would_borrow_lend_again: Optional[bool] = True

class ReviewResponse(ReviewCreate):
    id: int
    listing_id: int
    author_id: int
    target_id: int
    created_at: datetime
    author: UserResponse

    class Config:
        from_attributes = True


# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    content: str
    link_to: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# --- AI Service Schemas ---
class AICategoryClassification(BaseModel):
    category: str
    confidence: float

class AIDescriptionGeneration(BaseModel):
    description: str

class AIBarterFairness(BaseModel):
    fairness_score: int  # 1 to 100
    suggestion: str

class AISimilarAlternatives(BaseModel):
    search_query: str
    alternatives: List[str]


# --- Community Schemas ---
class CommunityCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    category: str
    cover_image: Optional[str] = ""
    rules: Optional[str] = "Be respectful and helpful to your neighbors."

class CommunityResponse(BaseModel):
    id: int
    name: str
    description: str
    category: str
    cover_image: str
    created_by: int
    is_verified: bool
    rules: str
    created_at: datetime

    class Config:
        from_attributes = True

class CommunityMemberResponse(BaseModel):
    id: int
    community_id: int
    user_id: int
    role: str
    joined_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True

class ChannelCreate(BaseModel):
    name: str
    type: Optional[str] = "text"

class ChannelResponse(BaseModel):
    id: int
    community_id: int
    name: str
    type: str
    created_at: datetime

    class Config:
        from_attributes = True

class CommunityMessageCreate(BaseModel):
    content: Optional[str] = ""
    image_url: Optional[str] = ""
    video_url: Optional[str] = ""

class CommunityMessageResponse(BaseModel):
    id: int
    channel_id: int
    sender_id: int
    content: str
    image_url: str
    video_url: str
    created_at: datetime
    sender: UserResponse

    class Config:
        from_attributes = True

class CommunityPollCreate(BaseModel):
    question: str
    options: List[str]

class CommunityPollResponse(BaseModel):
    id: int
    community_id: int
    creator_id: int
    question: str
    options: List[str]
    votes: dict  # dict of user_id -> option_index, e.g., {"1": 0}
    is_active: bool
    created_at: datetime
    creator: UserResponse

    class Config:
        from_attributes = True

# --- Event Schemas ---
class EventCreate(BaseModel):
    community_id: Optional[int] = None
    title: str
    description: Optional[str] = ""
    cover_image: Optional[str] = ""
    location_name: Optional[str] = "Nearby"
    location_lat: float
    location_lon: float
    event_time: datetime
    rsvp_limit: Optional[int] = None

class EventResponse(BaseModel):
    id: int
    community_id: Optional[int]
    creator_id: int
    title: str
    description: str
    cover_image: str
    location_name: str
    location_lat: float
    location_lon: float
    event_time: datetime
    rsvp_limit: Optional[int]
    created_at: datetime
    creator: UserResponse
    rsvp_count: Optional[int] = 0
    user_rsvp_status: Optional[str] = None # None, "going", "maybe", "not_going"

    class Config:
        from_attributes = True

class EventRSVPCreate(BaseModel):
    status: str # "going", "maybe", "not_going"

class EventRSVPResponse(BaseModel):
    id: int
    event_id: int
    user_id: int
    status: str
    created_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True

# --- AI Chat Schemas ---
class AIChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class AIChatResponse(BaseModel):
    reply: str
    recommended_listings: Optional[List[ListingResponse]] = []
    recommended_communities: Optional[List[CommunityResponse]] = []
    recommended_events: Optional[List[EventResponse]] = []

