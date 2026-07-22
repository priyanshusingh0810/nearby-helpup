from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.listing import Listing, BarterOffer
from app.models.review import Review
from app.models.chat import Chat, Message
from app.models.community import Community, CommunityMember, CommunityChatChannel, CommunityChatMessage, CommunityPoll
from app.models.event import Event, EventRSVP
from app.core.security import get_password_hash
import json

from app.routers import auth, listings, chat, profile, ai, admin, notifications, upload, communities, events

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Hyperlocal Community Sharing Platform",
    version="1.0.0"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(listings.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)
app.include_router(communities.router, prefix=settings.API_V1_STR)
app.include_router(events.router, prefix=settings.API_V1_STR)

def seed_db(db: Session):
    # Check if database is empty
    if db.query(User).count() > 0:
        return
        
    print("Seeding database with sample community data...")
    
    # 1. Users
    pwd_hash = get_password_hash("password123")
    
    admin_user = User(
        email="admin@helpup.com",
        username="admin",
        hashed_password=pwd_hash,
        name="System Administrator",
        bio="HelpUp Platform Moderation Team",
        profile_photo="https://api.dicebear.com/7.x/adventurer/svg?seed=admin",
        location_lat=28.6139,
        location_lon=77.2090,
        location_name="Connaught Place, New Delhi",
        identity_verified=True,
        phone_verified=True,
        trust_score=99.0
    )
    
    user1 = User(
        email="priyanshu@helpup.com",
        username="priyanshu",
        hashed_password=pwd_hash,
        name="Priyanshu Sharma",
        bio="Student at DTU. Love photography and hiking. Happy to share calculators, jackets or help out with coding!",
        profile_photo="https://api.dicebear.com/7.x/adventurer/svg?seed=priyanshu",
        location_lat=28.7501, # DTU lat
        location_lon=77.1177, # DTU lon
        location_name="DTU Campus, Rohini",
        college="Delhi Technological University",
        identity_verified=True,
        phone_verified=True,
        trust_score=92.5,
        total_ratings=4,
        average_rating=4.8,
        interests="Photography;Hiking;Chess;Volunteering;Running;Gaming;AI",
        skills="React;TypeScript;CSS;Tailwind;Tutoring",
        languages="English;Hindi",
        badges="Top Helper;Student;Verified Member"
    )
    
    user2 = User(
        email="alice@helpup.com",
        username="alice",
        hashed_password=pwd_hash,
        name="Alice Jenkins",
        bio="Tech enthusiast and active volunteer. Borrowing, bartering, and giving away items to reduce electronic waste.",
        profile_photo="https://api.dicebear.com/7.x/adventurer/svg?seed=alice",
        location_lat=28.7450,
        location_lon=77.1230,
        location_name="Rohini Sector 16",
        college="DTU",
        identity_verified=True,
        phone_verified=False,
        trust_score=81.0,
        total_ratings=2,
        average_rating=4.5,
        interests="Books;Cycling;Yoga;Gaming;NGO;Social Work",
        skills="Writing;Organization;Cooking",
        languages="English",
        badges="Verified Member;Professional"
    )
    
    user3 = User(
        email="rohan@helpup.com",
        username="rohan",
        hashed_password=pwd_hash,
        name="Rohan Verma",
        bio="Avid reader. Let's exchange books or share study notes.",
        profile_photo="https://api.dicebear.com/7.x/adventurer/svg?seed=rohan",
        location_lat=28.7520,
        location_lon=77.1140,
        location_name="Rohini Sector 17",
        college="DTU",
        identity_verified=False,
        phone_verified=True,
        trust_score=68.0,
        total_ratings=1,
        average_rating=4.0,
        interests="Books;Cricket;Football;Startup;Yoga;Chess",
        skills="Study Notes;Coaching;Tutoring",
        languages="English;Hindi;Punjabi",
        badges="Verified Member;Student"
    )
    
    db.add_all([admin_user, user1, user2, user3])
    db.commit()
    db.refresh(user1)
    db.refresh(user2)
    db.refresh(user3)
    
    # 2. Listings
    l1 = Listing(
        owner_id=user2.id,
        type="borrow",
        title="Scientific Calculator",
        description="Need a Casio scientific calculator for tomorrow's engineering exam (10 AM to 1 PM). Will return immediately after the exam.",
        category="Education",
        images="https://images.unsplash.com/photo-1616400619175-5ebd30090ac5?w=500&auto=format&fit=crop",
        location_lat=28.7450,
        location_lon=77.1230,
        location_name="Rohini Sector 16",
        is_emergency=True,
        expires_at=datetime.utcnow() + timedelta(hours=14),
        borrow_needed_until=datetime.utcnow() + timedelta(days=1),
        reward="Can treat you to a hot coffee!"
    )
    
    l2 = Listing(
        owner_id=user1.id,
        type="lend",
        title="Black Slim Blazer (Size M)",
        description="Formal slim fit black blazer, perfect for college presentations, interviews or guest lectures. Only lend to people with trust score > 70.",
        category="Fashion",
        images="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop",
        location_lat=28.7501,
        location_lon=77.1177,
        location_name="DTU Campus",
        lend_max_duration=3,
        lend_deposit=500.0,
        lend_condition="Like New",
        reward=""
    )
    
    l3 = Listing(
        owner_id=user3.id,
        type="barter",
        title="Principles of Physics Textbook",
        description="Resnick Halliday Walker Walker (10th Edition). Looking to trade this for a computer networks or operating system textbook.",
        category="Books",
        images="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop",
        location_lat=28.7520,
        location_lon=77.1140,
        location_name="Rohini Sector 17",
        barter_seeking="Computer Networks / OS textbook or a good programming reference book",
        reward=""
    )
    
    l4 = Listing(
        owner_id=user2.id,
        type="donate",
        title="Pack of 3 Novels",
        description="Giving away 'To Kill a Mockingbird', 'The Alchemist', and '1984'. All in readable condition. Just come and pick them up!",
        category="Books",
        images="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop",
        location_lat=28.7450,
        location_lon=77.1230,
        location_name="Rohini Sector 16",
        reward=""
    )
    
    l5 = Listing(
        owner_id=user1.id,
        type="service",
        title="React & Tailwind Tutoring",
        description="Can help you set up Vite projects, understand hooks, state management, or responsive styling with Tailwind. 1-2 hours slots.",
        category="Services",
        images="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop",
        location_lat=28.7501,
        location_lon=77.1177,
        location_name="DTU Campus",
        service_skills="React, TypeScript, CSS, Tailwind",
        reward=""
    )
    
    l6 = Listing(
        owner_id=user2.id,
        type="borrow",
        title="Canon DSLR Camera Gimbal",
        description="Looking for a camera stabilizer/gimbal for a weekend short film shoot. Happy to exchange books or pay a small rental fee.",
        category="Electronics",
        images="https://images.unsplash.com/photo-1584438784894-089d6a128f3e?w=500&auto=format&fit=crop",
        location_lat=28.7450,
        location_lon=77.1230,
        location_name="Rohini Sector 16",
        borrow_needed_until=datetime.utcnow() + timedelta(days=2),
        reward="Willing to barter or pay deposit"
    )
    
    db.add_all([l1, l2, l3, l4, l5, l6])
    db.commit()
    db.refresh(l3)
    
    # 3. Barter Offer Mock
    bo = BarterOffer(
        listing_id=l3.id,
        sender_id=user1.id,
        offered_item_title="Operating Systems Concept (Silberschatz)",
        offered_item_description="Galvin Gagne (9th Edition), perfect for university prep. Condition is neat.",
        offered_item_condition="Good",
        offered_item_image="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop",
        status="pending"
    )
    db.add(bo)
    db.commit()
    
    # 4. Review Mocks
    r1 = Review(listing_id=l2.id, author_id=user2.id, target_id=user1.id, rating=5.0, content="Borrowing blazer was smooth. Priyanshu was polite and accommodating.", would_borrow_lend_again=True)
    r2 = Review(listing_id=l3.id, author_id=user3.id, target_id=user1.id, rating=4.5, content="Traded books. Quick response and transaction was super simple.", would_borrow_lend_again=True)
    db.add_all([r1, r2])
    db.commit()
    
    # 5. Chats and Message Mocks
    chat1 = Chat(user1_id=user1.id, user2_id=user2.id, listing_id=l1.id)
    db.add(chat1)
    db.commit()
    db.refresh(chat1)
    
    m1 = Message(chat_id=chat1.id, sender_id=user1.id, content="Hey Alice, I noticed your emergency request for a scientific calculator. I have one!", is_read=True)
    m2 = Message(chat_id=chat1.id, sender_id=user2.id, content="Oh hi! That would be amazing. When could I borrow it?", is_read=True)
    m3 = Message(chat_id=chat1.id, sender_id=user1.id, content="I'm in DTU hostel block 3, you can grab it tonight, or I can bring it to the library tomorrow morning.", is_read=False)
    db.add_all([m1, m2, m3])
    db.commit()
    
    # 6. Communities & Members Seeding
    c1 = Community(
        name="DTU Running Club",
        description="A group of DTU student runners, organizing weekend runs and training together.",
        category="Running Club",
        cover_image="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format&fit=crop",
        created_by=user1.id,
        rules="Be respectful; Show up on time; Stay hydrated!",
        is_verified=True
    )
    c2 = Community(
        name="Rohini Chess Alliance",
        description="Weekly offline chess meetups and tournaments in Rohini sector 16/17.",
        category="Chess",
        cover_image="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=500&auto=format&fit=crop",
        created_by=user2.id,
        rules="Fair play; Beginners are welcome!",
        is_verified=True
    )
    c3 = Community(
        name="Robotics and AI Lab",
        description="Discussing AI advancements, deep learning, coding bots and building hardware together.",
        category="AI",
        cover_image="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&auto=format&fit=crop",
        created_by=user1.id,
        rules="No spamming links; Share learning resources.",
        is_verified=False
    )
    db.add_all([c1, c2, c3])
    db.commit()
    db.refresh(c1)
    db.refresh(c2)
    db.refresh(c3)

    # Community Members
    m_c1_1 = CommunityMember(community_id=c1.id, user_id=user1.id, role="admin")
    m_c1_2 = CommunityMember(community_id=c1.id, user_id=user2.id, role="member")
    m_c1_3 = CommunityMember(community_id=c1.id, user_id=user3.id, role="member")
    
    m_c2_1 = CommunityMember(community_id=c2.id, user_id=user2.id, role="admin")
    m_c2_2 = CommunityMember(community_id=c2.id, user_id=user1.id, role="member")
    
    m_c3_1 = CommunityMember(community_id=c3.id, user_id=user1.id, role="admin")
    m_c3_2 = CommunityMember(community_id=c3.id, user_id=user3.id, role="member")
    db.add_all([m_c1_1, m_c1_2, m_c1_3, m_c2_1, m_c2_2, m_c3_1, m_c3_2])

    # Channels
    ch1 = CommunityChatChannel(community_id=c1.id, name="general", type="text")
    ch2 = CommunityChatChannel(community_id=c1.id, name="announcements", type="announcement")
    ch3 = CommunityChatChannel(community_id=c2.id, name="general", type="text")
    ch4 = CommunityChatChannel(community_id=c2.id, name="tournaments", type="text")
    ch5 = CommunityChatChannel(community_id=c3.id, name="general", type="text")
    db.add_all([ch1, ch2, ch3, ch4, ch5])
    db.commit()
    db.refresh(ch1)
    db.refresh(ch2)
    db.refresh(ch3)

    # Community Polls
    poll1 = CommunityPoll(
        community_id=c1.id,
        creator_id=user1.id,
        question="Which morning run schedule works best for the weekend session?",
        options=json.dumps(["Saturday 6:00 AM", "Sunday 7:00 AM", "Sunday 6:30 AM"]),
        votes=json.dumps({str(user1.id): 1, str(user2.id): 1, str(user3.id): 2})
    )
    db.add(poll1)

    # 7. Events
    e1 = Event(
        community_id=c1.id,
        creator_id=user1.id,
        title="Weekend Morning Jog",
        description="A steady 5km run starting from the DTU Main Gate up to Rohini Sector 16 Park. Walkers are also welcome!",
        cover_image="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format&fit=crop",
        location_name="DTU Main Gate, Rohini",
        location_lat=28.7501,
        location_lon=77.1177,
        event_time=datetime.utcnow() + timedelta(days=2, hours=12),
        rsvp_limit=15
    )
    e2 = Event(
        community_id=c2.id,
        creator_id=user2.id,
        title="Friendly Chess Blitz Tournament",
        description="Quick chess tournament with prizes (coffee + donuts!). Bring your own chessboard if available.",
        cover_image="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=500&auto=format&fit=crop",
        location_name="Rohini Sector 16 CCD",
        location_lat=28.7450,
        location_lon=77.1230,
        event_time=datetime.utcnow() + timedelta(days=5, hours=15),
        rsvp_limit=8
    )
    db.add_all([e1, e2])
    db.commit()
    db.refresh(e1)
    db.refresh(e2)

    # Event RSVPs
    rsv1 = EventRSVP(event_id=e1.id, user_id=user1.id, status="going")
    rsv2 = EventRSVP(event_id=e1.id, user_id=user2.id, status="going")
    rsv3 = EventRSVP(event_id=e2.id, user_id=user2.id, status="going")
    rsv4 = EventRSVP(event_id=e2.id, user_id=user1.id, status="maybe")
    db.add_all([rsv1, rsv2, rsv3, rsv4])
    db.commit()

    print("Database seeding completed.")

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "status": "online",
        "project": "Nearby HelpUp API",
        "documentation": f"{settings.API_V1_STR}/docs"
    }
