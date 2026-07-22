from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
import json

from app.core.database import get_db
from app.models.community import Community, CommunityMember, CommunityChatChannel, CommunityChatMessage, CommunityPoll
from app.models.user import User
from app.models.notification import Notification
from app.schemas.all_schemas import (
    CommunityCreate, CommunityResponse, CommunityMemberResponse,
    ChannelCreate, ChannelResponse, CommunityMessageCreate, CommunityMessageResponse,
    CommunityPollCreate, CommunityPollResponse
)
from app.routers.auth import get_current_user

router = APIRouter(prefix="/communities", tags=["communities"])

@router.post("/", response_model=CommunityResponse)
def create_community(
    community_in: CommunityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if community name is unique
    existing = db.query(Community).filter(Community.name == community_in.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Community name already taken")

    cover_image = community_in.cover_image
    if not cover_image:
        cover_image = "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&auto=format&fit=crop"

    db_community = Community(
        name=community_in.name,
        description=community_in.description,
        category=community_in.category,
        cover_image=cover_image,
        created_by=current_user.id,
        rules=community_in.rules,
        is_verified=False
    )
    db.add(db_community)
    db.commit()
    db.refresh(db_community)

    # Automatically add creator as admin member
    admin_member = CommunityMember(
        community_id=db_community.id,
        user_id=current_user.id,
        role="admin"
    )
    db.add(admin_member)

    # Create default channels
    general_channel = CommunityChatChannel(
        community_id=db_community.id,
        name="general",
        type="text"
    )
    announcements_channel = CommunityChatChannel(
        community_id=db_community.id,
        name="announcements",
        type="announcement"
    )
    db.add(general_channel)
    db.add(announcements_channel)

    db.commit()
    db.refresh(db_community)
    return db_community

@router.get("/", response_model=List[CommunityResponse])
def get_communities(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Community)
    if category:
        query = query.filter(Community.category == category)
    if search:
        query = query.filter(
            Community.name.ilike(f"%{search}%") |
            Community.description.ilike(f"%{search}%")
        )
    return query.all()

@router.get("/{id}", response_model=CommunityResponse)
def get_community(id: int, db: Session = Depends(get_db)):
    community = db.query(Community).filter(Community.id == id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")
    return community

@router.post("/{id}/join", response_model=CommunityMemberResponse)
def join_community(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    community = db.query(Community).filter(Community.id == id).first()
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")

    # Check if already a member
    member = db.query(CommunityMember).filter(
        CommunityMember.community_id == id,
        CommunityMember.user_id == current_user.id
    ).first()
    if member:
        raise HTTPException(status_code=400, detail="Already a member of this community")

    db_member = CommunityMember(
        community_id=id,
        user_id=current_user.id,
        role="member"
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@router.post("/{id}/leave")
def leave_community(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = db.query(CommunityMember).filter(
        CommunityMember.community_id == id,
        CommunityMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Membership not found")

    if member.role == "admin":
        raise HTTPException(status_code=400, detail="Admin cannot leave without promoting another member first")

    db.delete(member)
    db.commit()
    return {"message": "Successfully left the community"}

@router.get("/{id}/members", response_model=List[CommunityMemberResponse])
def get_community_members(id: int, db: Session = Depends(get_db)):
    return db.query(CommunityMember).filter(CommunityMember.community_id == id).all()

# --- Channels ---
@router.get("/{id}/channels", response_model=List[ChannelResponse])
def get_channels(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify membership
    member = db.query(CommunityMember).filter(
        CommunityMember.community_id == id,
        CommunityMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Must be a community member to view channels")

    return db.query(CommunityChatChannel).filter(CommunityChatChannel.community_id == id).all()

@router.post("/{id}/channels", response_model=ChannelResponse)
def create_channel(
    id: int,
    channel_in: ChannelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify admin or mod
    member = db.query(CommunityMember).filter(
        CommunityMember.community_id == id,
        CommunityMember.user_id == current_user.id
    ).first()
    if not member or member.role not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Only admins or moderators can create channels")

    db_channel = CommunityChatChannel(
        community_id=id,
        name=channel_in.name.lower().replace(" ", "-"),
        type=channel_in.type
    )
    db.add(db_channel)
    db.commit()
    db.refresh(db_channel)
    return db_channel

# --- Channel Messages ---
@router.get("/channels/{channel_id}/messages", response_model=List[CommunityMessageResponse])
def get_channel_messages(
    channel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    channel = db.query(CommunityChatChannel).filter(CommunityChatChannel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")

    # Verify membership in parent community
    member = db.query(CommunityMember).filter(
        CommunityMember.community_id == channel.community_id,
        CommunityMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Must join the community to read chat history")

    return db.query(CommunityChatMessage).filter(
        CommunityChatMessage.channel_id == channel_id
    ).order_by(CommunityChatMessage.created_at.asc()).all()

@router.post("/channels/{channel_id}/messages", response_model=CommunityMessageResponse)
def send_channel_message(
    channel_id: int,
    msg_in: CommunityMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    channel = db.query(CommunityChatChannel).filter(CommunityChatChannel.id == channel_id).first()
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")

    # Verify membership
    member = db.query(CommunityMember).filter(
        CommunityMember.community_id == channel.community_id,
        CommunityMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Must join the community to send messages")

    # Announcements restriction
    if channel.type == "announcement" and member.role not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Only admins/mods can post in announcement channels")

    db_msg = CommunityChatMessage(
        channel_id=channel_id,
        sender_id=current_user.id,
        content=msg_in.content,
        image_url=msg_in.image_url or "",
        video_url=msg_in.video_url or ""
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

# --- Polls ---
@router.get("/{id}/polls", response_model=List[CommunityPollResponse])
def get_community_polls(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify membership
    member = db.query(CommunityMember).filter(
        CommunityMember.community_id == id,
        CommunityMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Must join community to view polls")

    polls = db.query(CommunityPoll).filter(CommunityPoll.community_id == id).all()
    
    # Parse options and votes JSON for standard schemas output
    parsed_polls = []
    for poll in polls:
        options_list = json.loads(poll.options)
        votes_dict = json.loads(poll.votes)
        
        parsed_polls.append({
            "id": poll.id,
            "community_id": poll.community_id,
            "creator_id": poll.creator_id,
            "question": poll.question,
            "options": options_list,
            "votes": votes_dict,
            "is_active": poll.is_active,
            "created_at": poll.created_at,
            "creator": poll.creator
        })
    return parsed_polls

@router.post("/{id}/polls", response_model=CommunityPollResponse)
def create_poll(
    id: int,
    poll_in: CommunityPollCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = db.query(CommunityMember).filter(
        CommunityMember.community_id == id,
        CommunityMember.user_id == current_user.id
    ).first()
    if not member or member.role not in ["admin", "moderator"]:
        raise HTTPException(status_code=403, detail="Only admins or moderators can launch polls")

    if not poll_in.options or len(poll_in.options) < 2:
        raise HTTPException(status_code=400, detail="Poll must contain at least 2 options")

    db_poll = CommunityPoll(
        community_id=id,
        creator_id=current_user.id,
        question=poll_in.question,
        options=json.dumps(poll_in.options),
        votes=json.dumps({})
    )
    db.add(db_poll)
    db.commit()
    db.refresh(db_poll)

    return {
        "id": db_poll.id,
        "community_id": db_poll.community_id,
        "creator_id": db_poll.creator_id,
        "question": db_poll.question,
        "options": poll_in.options,
        "votes": {},
        "is_active": db_poll.is_active,
        "created_at": db_poll.created_at,
        "creator": current_user
    }

@router.put("/polls/{poll_id}/vote", response_model=CommunityPollResponse)
def vote_poll(
    poll_id: int,
    option_index: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    poll = db.query(CommunityPoll).filter(CommunityPoll.id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="Poll not found")
    if not poll.is_active:
        raise HTTPException(status_code=400, detail="This poll is closed")

    options_list = json.loads(poll.options)
    if option_index < 0 or option_index >= len(options_list):
        raise HTTPException(status_code=400, detail="Invalid option index selection")

    # Verify membership
    member = db.query(CommunityMember).filter(
        CommunityMember.community_id == poll.community_id,
        CommunityMember.user_id == current_user.id
    ).first()
    if not member:
        raise HTTPException(status_code=403, detail="Must be a member to submit votes")

    votes_dict = json.loads(poll.votes)
    # Store/update user's vote
    votes_dict[str(current_user.id)] = option_index
    poll.votes = json.dumps(votes_dict)
    
    db.commit()
    db.refresh(poll)

    return {
        "id": poll.id,
        "community_id": poll.community_id,
        "creator_id": poll.creator_id,
        "question": poll.question,
        "options": options_list,
        "votes": votes_dict,
        "is_active": poll.is_active,
        "created_at": poll.created_at,
        "creator": poll.creator
    }
