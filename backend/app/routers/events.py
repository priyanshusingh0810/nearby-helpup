from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Optional
import math

from app.core.database import get_db
from app.models.event import Event, EventRSVP
from app.models.user import User
from app.models.notification import Notification
from app.schemas.all_schemas import EventCreate, EventResponse, EventRSVPCreate, EventRSVPResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/events", tags=["events"])

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

@router.post("/", response_model=EventResponse)
def create_event(
    event_in: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cover_image = event_in.cover_image
    if not cover_image:
        cover_image = "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&auto=format&fit=crop"

    db_event = Event(
        community_id=event_in.community_id,
        creator_id=current_user.id,
        title=event_in.title,
        description=event_in.description,
        cover_image=cover_image,
        location_name=event_in.location_name,
        location_lat=event_in.location_lat,
        location_lon=event_in.location_lon,
        event_time=event_in.event_time,
        rsvp_limit=event_in.rsvp_limit
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    # Automatically RSVP Going for the creator
    rsvp = EventRSVP(
        event_id=db_event.id,
        user_id=current_user.id,
        status="going"
    )
    db.add(rsvp)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/", response_model=List[EventResponse])
def get_events(
    community_id: Optional[int] = None,
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    radius: Optional[float] = 10.0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Event)
    if community_id is not None:
        query = query.filter(Event.community_id == community_id)
        
    # Perform Geo Filtering at DB level if PostgreSQL + PostGIS, otherwise fall back to memory
    is_postgres = False
    if lat is not None and lon is not None:
        if "postgresql" in str(db.bind.url):
            is_postgres = True
            query = query.filter(
                text("ST_DWithin(ST_MakePoint(location_lon, location_lat)::geography, ST_MakePoint(:lon, :lat)::geography, :radius * 1000)")
            ).params(lon=lon, lat=lat, radius=radius)
            
    events = query.all()
    filtered_events = []

    for event in events:
        # Distance calculation
        distance = 0.0
        if lat is not None and lon is not None:
            distance = haversine_distance(lat, lon, event.location_lat, event.location_lon)
            if distance > radius:
                continue

        # Fetch RSVP count & current user's RSVP status
        rsvp_count = db.query(EventRSVP).filter(
            EventRSVP.event_id == event.id,
            EventRSVP.status == "going"
        ).count()

        user_rsvp = db.query(EventRSVP).filter(
            EventRSVP.event_id == event.id,
            EventRSVP.user_id == current_user.id
        ).first()
        user_status = user_rsvp.status if user_rsvp else None

        # Build response item dictionary
        evt_dict = {
            "id": event.id,
            "community_id": event.community_id,
            "creator_id": event.creator_id,
            "title": event.title,
            "description": event.description,
            "cover_image": event.cover_image,
            "location_name": event.location_name,
            "location_lat": event.location_lat,
            "location_lon": event.location_lon,
            "event_time": event.event_time,
            "rsvp_limit": event.rsvp_limit,
            "created_at": event.created_at,
            "creator": event.creator,
            "rsvp_count": rsvp_count,
            "user_rsvp_status": user_status
        }
        filtered_events.append(evt_dict)

    # Sort events by time
    filtered_events.sort(key=lambda x: x["event_time"])
    return filtered_events

@router.post("/{id}/rsvp", response_model=EventRSVPResponse)
def rsvp_event(
    id: int,
    rsvp_in: EventRSVPCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(Event).filter(Event.id == id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check RSVP limit
    if rsvp_in.status == "going" and event.rsvp_limit is not None:
        current_going = db.query(EventRSVP).filter(
            EventRSVP.event_id == id,
            EventRSVP.status == "going"
        ).count()
        
        # Check if already RSVP'd as going to avoid double-counting
        existing_rsvp = db.query(EventRSVP).filter(
            EventRSVP.event_id == id,
            EventRSVP.user_id == current_user.id
        ).first()
        
        if (not existing_rsvp or existing_rsvp.status != "going") and current_going >= event.rsvp_limit:
            raise HTTPException(status_code=400, detail="Event RSVP limit reached")

    db_rsvp = db.query(EventRSVP).filter(
        EventRSVP.event_id == id,
        EventRSVP.user_id == current_user.id
    ).first()

    if db_rsvp:
        db_rsvp.status = rsvp_in.status
    else:
        db_rsvp = EventRSVP(
            event_id=id,
            user_id=current_user.id,
            status=rsvp_in.status
        )
        db.add(db_rsvp)

    db.commit()
    db.refresh(db_rsvp)

    # Notify creator if someone RSVPs going
    if rsvp_in.status == "going" and event.creator_id != current_user.id:
        try:
            notif = Notification(
                user_id=event.creator_id,
                type="event",
                title="📅 New Event RSVP",
                content=f"{current_user.name} is attending your event '{event.title}'!",
                link_to=f"/events"
            )
            db.add(notif)
            db.commit()
        except Exception as e:
            print(f"Error generating event RSVP notification: {e}")

    return db_rsvp

@router.get("/weather")
def get_weather_forecast(lat: float, lon: float):
    # Simulated weather forecast abstraction for outdoor activities
    # (Easily replaced with OpenWeatherMap API later)
    import random
    conditions = [
        {"temp": "28°C", "desc": "Clear Skies & Sunny - Perfect for outdoor events!", "icon": "sunny"},
        {"temp": "24°C", "desc": "Partly Cloudy - Nice, mild weather.", "icon": "cloudy"},
        {"temp": "22°C", "desc": "Light Rain showers expected - Carry umbrellas!", "icon": "rainy"},
        {"temp": "30°C", "desc": "Warm & Humid - Keep hydration ready.", "icon": "humid"}
    ]
    # Deterministic choice based on coordinates so it doesn't change every refresh
    idx = int((abs(lat) + abs(lon)) * 10) % len(conditions)
    return {
        "lat": lat,
        "lon": lon,
        "forecast": conditions[idx]
    }
