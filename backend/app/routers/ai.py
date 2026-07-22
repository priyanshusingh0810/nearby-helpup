from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.routers.auth import get_current_user
from app.models.listing import Listing
from app.models.community import Community
from app.models.event import Event
from app.models.user import User
from app.schemas.all_schemas import (
    AICategoryClassification, AIDescriptionGeneration, AIBarterFairness, AISimilarAlternatives,
    AIChatRequest, AIChatResponse, ListingResponse, CommunityResponse, EventResponse
)
from app.core.config import settings
from typing import List, Optional
import google.generativeai as genai
import json
import math


router = APIRouter(prefix="/ai", tags=["ai"])

CATEGORIES = [
    "Electronics", "Fashion", "Books", "Gaming", "Sports", "Furniture", 
    "Home", "Kitchen", "Baby", "Medical", "Education", "Vehicles", 
    "Pets", "Music", "Art", "Services", "Others"
]

# Initialize Gemini if API key is provided
has_gemini = False
if settings.GEMINI_API_KEY:
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        has_gemini = True
        print("Gemini API configured successfully in Nearby HelpUp AI router.")
    except Exception as e:
        print(f"Error configuring Gemini API: {e}")

# --- Local Heuristic Fallbacks (used if API key is missing or fails) ---

def classify_item_fallback(title: str):
    title_lower = title.lower()
    mapping = {
        "Electronics": ["phone", "charger", "laptop", "camera", "headphone", "dslr", "screen", "keyboard", "mouse", "wire", "adapter", "tv", "speaker"],
        "Fashion": ["blazer", "suit", "shoes", "umbrella", "dress", "jacket", "shirt", "trousers", "watch", "ring", "tie"],
        "Books": ["book", "novel", "textbook", "notes", "comic", "biography", "magazine"],
        "Gaming": ["ps5", "xbox", "switch", "console", "game", "controller", "nintendo", "playstation"],
        "Sports": ["bat", "ball", "racket", "helmet", "tent", "sleeping bag", "cycle", "football", "gym"],
        "Furniture": ["chair", "table", "desk", "bed", "sofa", "stool", "cabinet"],
        "Medical": ["wheelchair", "oxygen", "cylinder", "medicine", "pill", "bp", "thermometer", "first aid", "bandage"],
        "Education": ["calculator", "compass", "ruler", "pen", "notebook", "backpack"],
        "Music": ["guitar", "keyboard", "ukulele", "flute", "violin", "mic", "microphone"],
        "Services": ["teach", "tutoring", "code", "design", "photo", "repair", "fixing", "install", "clean"]
    }
    for category, keywords in mapping.items():
        if any(keyword in title_lower for keyword in keywords):
            return {"category": category, "confidence": 0.92}
    return {"category": "Others", "confidence": 0.50}

def generate_description_fallback(title: str, condition: str = "Good", type: str = "borrow"):
    templates = {
        "borrow": f"Hi! I urgently need a {title} in {condition} condition. I will take good care of it and return it on time. Thanks in advance for the help!",
        "lend": f"Available for borrowing: A {title} in {condition} condition. Please keep it clean and return it by the agreed date. Let me know if you have questions.",
        "barter": f"Looking to exchange my {title} ({condition} condition). Open to trading for items on my seek list or equivalent exchange offers.",
        "donate": f"Giving away this {title} for free! It is in {condition} condition and looking for a good home. Pickup location details will be shared in chat.",
        "service": f"Offering {title} services. I have solid experience and can help you out. Let's chat to align on requirements and schedule."
    }
    desc = templates.get(type.lower(), f"Offering/Requesting: {title}. Condition: {condition}.")
    return {"description": desc}

def check_barter_fairness_fallback(item1_title: str, item1_cond: str, item2_title: str, item2_cond: str):
    conditions = {"New": 100, "Like New": 90, "Good": 75, "Fair": 55, "Poor": 30}
    val1 = conditions.get(item1_cond, 75)
    val2 = conditions.get(item2_cond, 75)
    diff = abs(val1 - val2)
    fairness = 100 - diff
    if fairness >= 85:
        suggestion = f"Great deal! Trading a '{item1_title}' for a '{item2_title}' seems highly balanced and fair."
    elif fairness >= 65:
        suggestion = "Reasonable trade. Consider adding a small favor, a book, or sweet treat to sweeten the exchange if needed."
    else:
        suggestion = f"Slight condition mismatch between these items. Verify details with the owner to ensure both parties are satisfied."
    return {"fairness_score": fairness, "suggestion": suggestion}

def suggest_alternatives_fallback(query: str):
    q_lower = query.lower()
    alternatives = []
    mapping = {
        "dslr": ["Mirrorless Camera", "Action Camera", "Phone Gimbal", "Tripod Stand", "Camera Lens"],
        "camera": ["Mirrorless Camera", "Action Camera", "Phone Gimbal", "Tripod Stand", "Camera Lens"],
        "blazer": ["Formal Suit", "Dress Shoes", "Leather Belt", "Formal Trousers", "Tie"],
        "calculator": ["Scientific Calculator", "Graphing Calculator", "Notebook", "Geometry Box"],
        "wheelchair": ["Walker", "Crutches", "Orthopedic Pillow", "First Aid Kit"],
        "charger": ["Power Bank", "Multi-port Adapter", "USB-C Cable", "Wireless Charger"],
        "laptop": ["Monitor Screen", "Wireless Mouse", "Keyboard", "Laptop Stand", "Power Bank"],
        "guitar": ["Ukulele", "Acoustic Guitar", "Capo & Picks", "Guitar Strap", "Violin"]
    }
    for key, alts in mapping.items():
        if key in q_lower:
            alternatives = alts
            break
    if not alternatives:
        alternatives = ["General Electronics", "Multi-utility Charger", "Reference Book", "Sports Gear"]
    return {"search_query": query, "alternatives": alternatives}


# --- API Routes ---

@router.get("/classify", response_model=AICategoryClassification)
def classify_item(title: str):
    if has_gemini:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = (
                f"Classify the following item title into exactly one of these categories: {', '.join(CATEGORIES)}. "
                f"Item Title: '{title}'. "
                f"Respond ONLY with a raw JSON object containing the fields: "
                f"'category' (string) and 'confidence' (float between 0.0 and 1.0). "
                f"Do not include any markdown formatting or extra text."
            )
            response = model.generate_content(prompt)
            text = response.text.strip()
            
            # Strip markdown code blocks if generated
            if text.startswith("```"):
                lines = text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].strip() == "```":
                    lines = lines[:-1]
                text = "\n".join(lines).strip()
                
            data = json.loads(text)
            cat = data.get("category", "Others")
            if cat not in CATEGORIES:
                # Find best matching category by containment or fallback
                for fallback_cat in CATEGORIES:
                    if fallback_cat.lower() in cat.lower():
                        cat = fallback_cat
                        break
                else:
                    cat = "Others"
            return {"category": cat, "confidence": float(data.get("confidence", 0.9))}
        except Exception as e:
            print(f"Gemini classify failed ({e}). Falling back to heuristic.")
            
    return classify_item_fallback(title)

@router.get("/generate-description", response_model=AIDescriptionGeneration)
def generate_description(title: str, condition: str = "Good", type: str = "borrow"):
    if has_gemini:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = (
                f"You are a helpful community sharing assistant for a hyperlocal peer-to-peer sharing network called Nearby HelpUp. "
                f"Write a friendly, polite, and brief (2-3 sentences) description for a listing with the following details:\n"
                f"- Listing Type: {type} (can be: borrow, lend, barter, donate, or service)\n"
                f"- Item Title: {title}\n"
                f"- Item Condition: {condition}\n"
                f"Write from the perspective of the user posting the listing. Avoid generic filler. Be helpful and direct. "
                f"Respond ONLY with the generated description text itself. Do not put quotes or extra introductory text around the response."
            )
            response = model.generate_content(prompt)
            return {"description": response.text.strip()}
        except Exception as e:
            print(f"Gemini generate-description failed ({e}). Falling back to heuristic.")
            
    return generate_description_fallback(title, condition, type)

@router.get("/barter-fairness", response_model=AIBarterFairness)
def check_barter_fairness(item1_title: str, item1_cond: str, item2_title: str, item2_cond: str):
    if has_gemini:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = (
                f"You are a trade valuation assistant. A user wants to exchange their item for another item.\n"
                f"Item 1 (Offered by listing owner): '{item1_title}' in '{item1_cond}' condition.\n"
                f"Item 2 (Offered by sender): '{item2_title}' in '{item2_cond}' condition.\n"
                f"Assess the fairness and balance of this trade. Consider item value and conditions.\n"
                f"Respond ONLY with a raw JSON object containing:\n"
                f"- 'fairness_score': an integer from 1 to 100 representing how balanced/fair the trade is (100 is perfectly fair/equal value, lower is unfair).\n"
                f"- 'suggestion': a 1-2 sentence friendly advice/suggestion on how they might balance the trade (e.g. suggesting adding small favors, sweet treats, or verifying details if conditions are mismatched).\n"
                f"Do not include any markdown format or extra characters."
            )
            response = model.generate_content(prompt)
            text = response.text.strip()
            
            # Strip markdown code blocks if generated
            if text.startswith("```"):
                lines = text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].strip() == "```":
                    lines = lines[:-1]
                text = "\n".join(lines).strip()
                
            data = json.loads(text)
            return {
                "fairness_score": int(data.get("fairness_score", 75)),
                "suggestion": data.get("suggestion", "Trade seems reasonable. Please review condition details in person.")
            }
        except Exception as e:
            print(f"Gemini barter-fairness failed ({e}). Falling back to heuristic.")
            
    return check_barter_fairness_fallback(item1_title, item1_cond, item2_title, item2_cond)

@router.get("/alternatives", response_model=AISimilarAlternatives)
def suggest_alternatives(query: str):
    if has_gemini:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = (
                f"Suggest 4 to 5 alternative or similar item names a user might search for in a community sharing app "
                f"when they search for: '{query}'. "
                f"For example, if they search for 'dslr', suggestions could be Mirrorless Camera, Tripod Stand, Action Camera, Camera Lens. "
                f"Respond ONLY with a raw JSON object containing a field 'alternatives' which is a list of strings. "
                f"Do not include any markdown syntax or extra text."
            )
            response = model.generate_content(prompt)
            text = response.text.strip()
            
            # Strip markdown code blocks if generated
            if text.startswith("```"):
                lines = text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].strip() == "```":
                    lines = lines[:-1]
                text = "\n".join(lines).strip()
                
            data = json.loads(text)
            return {
                "search_query": query,
                "alternatives": list(data.get("alternatives", []))
            }
        except Exception as e:
            print(f"Gemini suggest-alternatives failed ({e}). Falling back to heuristic.")
            
    return suggest_alternatives_fallback(query)


# --- Dynamic Helper calculations ---
def local_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# --- New AI Router Endpoints ---
@router.post("/chat", response_model=AIChatResponse)
def ai_chatbot(
    chat_in: AIChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_msg = chat_in.message.lower()
    
    # Query databases for context
    listings = db.query(Listing).filter(Listing.status == "active").all()
    communities = db.query(Community).all()
    events = db.query(Event).all()
    
    # Heuristic matches
    matched_listings = []
    matched_communities = []
    matched_events = []
    
    # Scan listing matches
    for item in listings:
        if item.title.lower() in user_msg or user_msg in item.title.lower() or item.category.lower() in user_msg:
            matched_listings.append(item)
            
    # Scan community matches
    for comm in communities:
        if comm.name.lower() in user_msg or user_msg in comm.name.lower() or comm.category.lower() in user_msg:
            matched_communities.append(comm)
            
    # Scan event matches
    for evt in events:
        if evt.title.lower() in user_msg or user_msg in evt.title.lower():
            matched_events.append(evt)
            
    # Fallback to general matches if search returns nothing
    if not matched_listings and not matched_communities and not matched_events:
        matched_listings = listings[:2]
        matched_communities = communities[:2]
        matched_events = events[:2]

    reply_content = "Hi! I am Nearby HelpUp Assistant. "
    if has_gemini:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            # Build context strings
            items_str = ", ".join([f"'{l.title}' ({l.type} in {l.location_name})" for l in matched_listings])
            comm_str = ", ".join([f"'{c.name}' ({c.category})" for c in matched_communities])
            evt_str = ", ".join([f"'{e.title}' at ({e.location_name})" for e in matched_events])
            
            prompt = (
                f"You are the Nearby HelpUp AI local helper. Help the user with their request.\n"
                f"User request: '{chat_in.message}'\n"
                f"Nearby available items: {items_str or 'None'}\n"
                f"Suggested communities: {comm_str or 'None'}\n"
                f"Upcoming events: {evt_str or 'None'}\n"
                f"Draft a brief, friendly, helpful response summarizing how they can find these resources. "
                f"Keep your response strictly under 3 sentences."
            )
            response = model.generate_content(prompt)
            reply_content = response.text.strip()
            
            # Map database entities to schemas response cleanly
            return {
                "reply": reply_content,
                "recommended_listings": matched_listings,
                "recommended_communities": matched_communities,
                "recommended_events": matched_events
            }
        except Exception as e:
            print(f"Gemini chat assistant failed ({e}). Falling back to heuristic reply.")

    # Heuristic reply text
    recs = []
    if matched_listings:
        recs.append(f"item '{matched_listings[0].title}'")
    if matched_communities:
        recs.append(f"community '{matched_communities[0].name}'")
    if matched_events:
        recs.append(f"event '{matched_events[0].title}'")
        
    if recs:
        reply_content += f"I found some interesting options nearby for you, including the " + " and the ".join(recs) + ". Check them out in the panels below!"
    else:
        reply_content += "I couldn't find matches for that query in our database. Try asking for items like 'blazer', 'calculator', or look for 'Chess' communities!"
        
    return {
        "reply": reply_content,
        "recommended_listings": matched_listings,
        "recommended_communities": matched_communities,
        "recommended_events": matched_events
    }

@router.get("/recommendations")
def get_ai_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Base user interest lists
    user_interests = [i.strip().lower() for i in current_user.interests.split(";") if i.strip()]
    
    # Query options
    listings = db.query(Listing).filter(Listing.status == "active", Listing.owner_id != current_user.id).all()
    communities = db.query(Community).all()
    events = db.query(Event).all()
    
    recommended_listings = []
    recommended_communities = []
    recommended_events = []
    
    # Match listings based on interests or proximity
    for item in listings:
        score = 0
        if item.category.lower() in user_interests or any(interest in item.title.lower() for interest in user_interests):
            score += 5
        if current_user.location_lat is not None and current_user.location_lon is not None:
            dist = local_haversine(current_user.location_lat, current_user.location_lon, item.location_lat, item.location_lon)
            if dist <= 5.0:
                score += 3
            elif dist <= 15.0:
                score += 1
        item.recommendation_score = score
        recommended_listings.append(item)
        
    # Match communities
    for comm in communities:
        score = 0
        if comm.category.lower() in user_interests or any(interest in comm.name.lower() for interest in user_interests):
            score += 5
        comm.recommendation_score = score
        recommended_communities.append(comm)
        
    # Match events
    for evt in events:
        score = 0
        if current_user.location_lat is not None and current_user.location_lon is not None:
            dist = local_haversine(current_user.location_lat, current_user.location_lon, evt.location_lat, evt.location_lon)
            if dist <= 10.0:
                score += 5
        evt.recommendation_score = score
        recommended_events.append(evt)
        
    # Sort by score desc
    recommended_listings.sort(key=lambda x: x.recommendation_score, reverse=True)
    recommended_communities.sort(key=lambda x: x.recommendation_score, reverse=True)
    recommended_events.sort(key=lambda x: x.recommendation_score, reverse=True)
    
    return {
        "recommended_listings": recommended_listings[:4],
        "recommended_communities": recommended_communities[:4],
        "recommended_events": recommended_events[:4]
    }

@router.get("/parse-search")
def parse_natural_language_search(query: str):
    q_lower = query.lower()
    
    # Default outputs
    parsed_type = "all"
    parsed_category = None
    parsed_search = query
    
    if "club" in q_lower or "group" in q_lower or "community" in q_lower or "society" in q_lower:
        parsed_type = "community"
    elif "run" in q_lower or "event" in q_lower or "meetup" in q_lower or "trek" in q_lower or "hackathon" in q_lower:
        parsed_type = "event"
    elif "borrow" in q_lower or "need" in q_lower or "exam" in q_lower or "calculat" in q_lower:
        parsed_type = "borrow"
    elif "lend" in q_lower or "share" in q_lower or "available" in q_lower or "give" in q_lower:
        parsed_type = "lend"
    elif "barter" in q_lower or "swap" in q_lower or "exchange" in q_lower or "trade" in q_lower:
        parsed_type = "barter"
    elif "service" in q_lower or "teach" in q_lower or "tutor" in q_lower or "help" in q_lower:
        parsed_type = "service"

    # Match Category keywords
    categories_keywords = {
        "Electronics": ["phone", "laptop", "charger", "camera", "dslr", "adapter", "wire"],
        "Fashion": ["jacket", "blazer", "suit", "clothes", "shoes", "umbrella"],
        "Books": ["book", "novel", "textbook", "read"],
        "Gaming": ["console", "ps5", "xbox", "game"],
        "Sports": ["bat", "ball", "cricket", "football", "racket", "trek", "run"],
        "Medical": ["wheelchair", "medicine", "pill", "oxygen"]
    }
    for cat, keywords in categories_keywords.items():
        if any(kw in q_lower for kw in keywords):
            parsed_category = cat
            break

    # Using Gemini if available for higher accuracy parsing
    if has_gemini:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = (
                f"You are a search query parser for a hyperlocal app 'Nearby HelpUp'.\n"
                f"Parse this query: '{query}'\n"
                f"Respond ONLY with a raw JSON object containing these keys:\n"
                f"- 'type': a string, exactly one of: 'all', 'borrow', 'lend', 'barter', 'donate', 'service', 'community', 'event'\n"
                f"- 'category': a string (exactly one of: 'Electronics', 'Fashion', 'Books', 'Gaming', 'Sports', 'Furniture', 'Medical', 'Education', 'Services', or null)\n"
                f"- 'search': clean search keywords string (or same query if already clean).\n"
                f"Do not include any extra text or markdown formatting."
            )
            response = model.generate_content(prompt)
            text = response.text.strip()
            
            # Strip markdown code blocks if generated
            if text.startswith("```"):
                lines = text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].strip() == "```":
                    lines = lines[:-1]
                text = "\n".join(lines).strip()
                
            data = json.loads(text)
            return {
                "type": data.get("type", parsed_type),
                "category": data.get("category", parsed_category),
                "search": data.get("search", parsed_search)
            }
        except Exception as e:
            print(f"Gemini parse-search failed ({e}). Falling back to heuristic.")
            
    return {
        "type": parsed_type,
        "category": parsed_category,
        "search": parsed_search
    }

@router.post("/spam-check")
def spam_and_fraud_detection(description: str):
    # Quick duplicate/spam listing keywords heuristics check
    description_lower = description.lower()
    is_spam = False
    confidence = 0.1
    reason = "Safe content verified."
    
    spam_terms = ["cash now", "earn money from home", "bitcoin profit", "cheap weight loss", "free cash click here", "buy pills cheap"]
    for term in spam_terms:
        if term in description_lower:
            is_spam = True
            confidence = 0.95
            reason = f"Detected blacklisted promotional spam keyword: '{term}'"
            break
            
    if len(description) < 10:
        is_spam = True
        confidence = 0.8
        reason = "Listing details are too short to be descriptive (potential placeholder/spam)."

    # Optional Gemini validation
    if has_gemini and not is_spam:
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = (
                f"Examine this listing description for potential spam, illegal promotional items, or fraud. "
                f"Description: '{description}'\n"
                f"Respond ONLY with a raw JSON object containing:\n"
                f"- 'is_spam': boolean\n"
                f"- 'confidence': float between 0.0 and 1.0\n"
                f"- 'reason': brief explanation string.\n"
                f"Do not include extra markdown text."
            )
            response = model.generate_content(prompt)
            text = response.text.strip()
            
            # Strip markdown code blocks if generated
            if text.startswith("```"):
                lines = text.split("\n")
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].strip() == "```":
                    lines = lines[:-1]
                text = "\n".join(lines).strip()
                
            data = json.loads(text)
            return data
        except Exception as e:
            print(f"Gemini spam-check failed ({e}). Falling back to heuristic.")

    return {
        "is_spam": is_spam,
        "confidence": confidence,
        "reason": reason
    }

