from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
import random
import urllib.request
import urllib.parse
import json
import threading

from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
from app.schemas.all_schemas import UserCreate, UserResponse, Token, TokenData

router = APIRouter(prefix="/auth", tags=["auth"])

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=int(user_id))
    except (JWTError, ValueError):
        raise credentials_exception
        
    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/signup", response_model=Token)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    user_by_email = db.query(User).filter(User.email == user_in.email).first()
    if user_by_email:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists in the system.",
        )
    user_by_username = db.query(User).filter(User.username == user_in.username).first()
    if user_by_username:
        raise HTTPException(
            status_code=400,
            detail="A user with this username already exists in the system.",
        )
        
    # Create new user
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        username=user_in.username,
        name=user_in.name,
        hashed_password=hashed_password,
        bio=user_in.bio,
        profile_photo=user_in.profile_photo or f"https://api.dicebear.com/7.x/adventurer/svg?seed={user_in.username}",
        location_lat=user_in.location_lat,
        location_lon=user_in.location_lon,
        location_name=user_in.location_name,
        college=user_in.college,
        trust_score=75.0, # Standard default starting score
        total_ratings=0,
        average_rating=5.0
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token = create_access_token(subject=db_user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # Allow logging in with either username or email
    user = db.query(User).filter(
        (User.email == form_data.username) | (User.username == form_data.username)
    ).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email/username or password"
        )
        
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/google-login", response_model=Token)
def google_login(profile: dict, db: Session = Depends(get_db)):
    # Support Google ID Token credential (from Google Identity Services)
    if "credential" in profile and profile["credential"]:
        try:
            import base64
            credential = profile["credential"]
            payload_segment = credential.split('.')[1]
            padded = payload_segment + '=' * (-len(payload_segment) % 4)
            decoded_bytes = base64.urlsafe_b64decode(padded)
            token_claims = json.loads(decoded_bytes)
            
            email = token_claims.get("email")
            name = token_claims.get("name", "Google User")
            google_id = token_claims.get("sub")
            picture = token_claims.get("picture")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid Google ID token: {str(e)}")
    else:
        email = profile.get("email")
        name = profile.get("name", "Google User")
        google_id = profile.get("id") or profile.get("sub")
        picture = profile.get("picture")
    
    if not email:
        raise HTTPException(status_code=400, detail="Email is required from Google profile")
        
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Auto generate username from email prefix
        base_username = email.split("@")[0].replace(".", "_")
        username = base_username
        counter = 1
        while db.query(User).filter(User.username == username).first():
            username = f"{base_username}_{counter}"
            counter += 1
            
        hashed_password = get_password_hash(f"google-oauth-pwd-{google_id}-{email}")
        user = User(
            email=email,
            username=username,
            name=name,
            hashed_password=hashed_password,
            profile_photo=picture or f"https://api.dicebear.com/7.x/adventurer/svg?seed={username}",
            identity_verified=True, # Auto-verify email via Google
            phone_verified=False,
            trust_score=80.0 # extra bump for verified email provider
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif picture and (not user.profile_photo or "dicebear" in user.profile_photo):
        # Update profile photo if user has default
        user.profile_photo = picture
        db.commit()
        
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/check-email")
def check_email(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    return {"exists": user is not None}

# In-memory storage for OTP codes: {phone_number: {"code": otp_code, "expires_at": expiry_datetime}}
otp_store = {}

def send_real_sms(phone: str, code: str):
    # Normalize phone number to include country code (default to +91 India if 10 digits)
    clean_phone = "".join(c for c in phone if c.isdigit())
    if len(clean_phone) == 10:
        clean_phone = "+91" + clean_phone
    elif not clean_phone.startswith("+"):
        clean_phone = "+" + clean_phone
        
    # Check if Twilio settings are configured
    if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN and settings.TWILIO_PHONE_NUMBER:
        try:
            from twilio.rest import Client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            message = client.messages.create(
                body=f"Nearby HelpUp: Your dynamic OTP verification code is {code}. Valid for 5 minutes.",
                from_=settings.TWILIO_PHONE_NUMBER,
                to=clean_phone
            )
            print(f"\n[Twilio SMS Gateway Success] Message SID: {message.sid}, Recipient: {clean_phone}\n")
            return {"success": True, "provider": "twilio", "sid": message.sid}
        except Exception as e:
            print(f"\n[Twilio SMS Gateway Exception] {e}. Falling back to Textbelt...\n")
        
    # Textbelt fallback (default)
    data = urllib.parse.urlencode({
        'phone': clean_phone,
        'message': f"Nearby HelpUp: Your verification code is {code}. Valid for 5 mins.",
        'key': 'textbelt'
    }).encode('utf-8')
    
    req = urllib.request.Request(
        "https://textbelt.com/text", 
        data=data,
        headers={'Content-Type': 'application/x-www-form-urlencoded'}
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            print(f"\n[Textbelt SMS Gateway Response] Phone: {clean_phone}, Result: {res_data}\n")
            return res_data
    except Exception as e:
        print(f"\n[Textbelt SMS Gateway Exception] {e}\n")
        return {"success": False, "error": str(e)}

@router.post("/request-otp")
def request_otp(payload: dict):
    phone = payload.get("phone")
    if not phone or len(phone) < 10:
        raise HTTPException(status_code=400, detail="A valid 10-digit phone number is required")
    
    # Generate a random 4-digit verification code
    code = str(random.randint(1000, 9999))
    expiry = datetime.utcnow() + timedelta(minutes=5)
    otp_store[phone] = {"code": code, "expires_at": expiry}
    
    print(f"\n[SMS GATEWAY] OTP Code generated for {phone}: {code}\n")
    
    # Fire off SMS sending in a background thread
    threading.Thread(target=send_real_sms, args=(phone, code), daemon=True).start()
    
    return {"message": "OTP verification code sent", "otp": code}

@router.post("/phone-login", response_model=Token)
def phone_login(payload: dict, db: Session = Depends(get_db)):
    phone = payload.get("phone")
    otp = payload.get("otp")
    if not phone or not otp:
        raise HTTPException(status_code=400, detail="Phone number and OTP code are required")
        
    stored = otp_store.get(phone)
    if not stored:
        raise HTTPException(status_code=400, detail="No verification code was requested for this phone number")
        
    if datetime.utcnow() > stored["expires_at"]:
        del otp_store[phone]
        raise HTTPException(status_code=400, detail="Verification code has expired")
        
    if stored["code"] != otp:
        raise HTTPException(status_code=400, detail="Incorrect verification code")
        
    # Clear code on success
    del otp_store[phone]
    
    # Resolve any phone login to the primary demo user "priyanshu"
    user = db.query(User).filter(User.username == "priyanshu").first()
    if not user:
        raise HTTPException(status_code=404, detail="Demo user not found")
        
    access_token = create_access_token(subject=user.id)
    return {"access_token": access_token, "token_type": "bearer"}
