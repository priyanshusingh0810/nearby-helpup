from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status
from sqlalchemy.orm import Session
from typing import List, Dict, Optional
import json

from app.core.database import get_db, SessionLocal
from app.models.chat import Chat, Message
from app.models.user import User
from app.models.listing import Listing
from app.models.notification import Notification
from app.schemas.all_schemas import ChatResponse, MessageResponse, MessageCreate, ChatCreate
from app.routers.auth import get_current_user
from app.core.security import settings
from jose import jwt, JWTError

router = APIRouter(prefix="/chats", tags=["chats"])

# WebSocket Manager to handle room active connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, chat_id: int, websocket: WebSocket):
        await websocket.accept()
        if chat_id not in self.active_connections:
            self.active_connections[chat_id] = []
        self.active_connections[chat_id].append(websocket)

    def disconnect(self, chat_id: int, websocket: WebSocket):
        if chat_id in self.active_connections:
            self.active_connections[chat_id].remove(websocket)
            if not self.active_connections[chat_id]:
                del self.active_connections[chat_id]

    async def broadcast(self, chat_id: int, message_data: dict):
        if chat_id in self.active_connections:
            for connection in self.active_connections[chat_id]:
                await connection.send_json(message_data)

manager = ConnectionManager()

@router.get("/", response_model=List[ChatResponse])
def get_user_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chats = db.query(Chat).filter(
        (Chat.user1_id == current_user.id) | (Chat.user2_id == current_user.id)
    ).all()
    return chats

@router.post("/", response_model=ChatResponse)
def get_or_create_chat(
    chat_in: ChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if chat_in.recipient_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot start a chat with yourself")
        
    # Check if a chat session already exists between these users for this listing
    chat = db.query(Chat).filter(
        ((Chat.user1_id == current_user.id) & (Chat.user2_id == chat_in.recipient_id)) |
        ((Chat.user1_id == chat_in.recipient_id) & (Chat.user2_id == current_user.id))
    ).filter(Chat.listing_id == chat_in.listing_id).first()
    
    if chat:
        return chat
        
    # Create new chat
    chat = Chat(
        user1_id=current_user.id,
        user2_id=chat_in.recipient_id,
        listing_id=chat_in.listing_id
    )
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat

@router.get("/{chat_id}", response_model=ChatResponse)
def get_chat_details(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    if chat.user1_id != current_user.id and chat.user2_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this chat")
    return chat

@router.post("/{chat_id}/messages", response_model=MessageResponse)
def send_http_message(
    chat_id: int,
    msg_in: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
        
    db_msg = Message(
        chat_id=chat_id,
        sender_id=current_user.id,
        content=msg_in.content,
        image_url=msg_in.image_url,
        voice_url=msg_in.voice_url,
        latitude=msg_in.latitude,
        longitude=msg_in.longitude
    )
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)

    # Notify recipient of the new chat message
    try:
        recipient_id = chat.user2_id if chat.user1_id == current_user.id else chat.user1_id
        notif = Notification(
            user_id=recipient_id,
            type="message",
            title="🤝 New Chat Message",
            content=f"{current_user.name}: {db_msg.content[:40]}..." if db_msg.content else f"{current_user.name} sent an attachment.",
            link_to="/chat"
        )
        db.add(notif)
        db.commit()
    except Exception as e:
        print(f"Error creating chat message notification: {e}")

    return db_msg

# WebSocket endpoint for real-time exchange
@router.websocket("/ws/{chat_id}")
async def websocket_chat_endpoint(websocket: WebSocket, chat_id: int, token: Optional[str] = None):
    # Verify token
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
        
    db = SessionLocal()
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = int(payload.get("sub"))
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
    except (JWTError, ValueError):
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
        
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat or (chat.user1_id != user_id and chat.user2_id != user_id):
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
        
    await manager.connect(chat_id, websocket)
    try:
        while True:
            # Expecting messages to be in JSON format: {"content": "...", "latitude": null, etc.}
            data = await websocket.receive_text()
            parsed_data = json.loads(data)
            
            # Save message to database
            db_msg = Message(
                chat_id=chat_id,
                sender_id=user_id,
                content=parsed_data.get("content", ""),
                image_url=parsed_data.get("image_url", ""),
                voice_url=parsed_data.get("voice_url", ""),
                latitude=parsed_data.get("latitude"),
                longitude=parsed_data.get("longitude")
            )
            db.add(db_msg)
            db.commit()
            db.refresh(db_msg)
            
            # Notify recipient if they are not active in the chat room session
            try:
                recipient_id = chat.user2_id if chat.user1_id == user_id else chat.user1_id
                active_sockets = manager.active_connections.get(chat_id, [])
                if len(active_sockets) < 2:
                    notif = Notification(
                        user_id=recipient_id,
                        type="message",
                        title="🤝 New Chat Message",
                        content=f"{user.name}: {db_msg.content[:40]}..." if db_msg.content else f"{user.name} sent an attachment.",
                        link_to="/chat"
                    )
                    db.add(notif)
                    db.commit()
            except Exception as e:
                print(f"Error creating websocket chat notification: {e}")
            
            # Broadcast message payload
            broadcast_payload = {
                "id": db_msg.id,
                "chat_id": db_msg.chat_id,
                "sender_id": db_msg.sender_id,
                "content": db_msg.content,
                "image_url": db_msg.image_url,
                "voice_url": db_msg.voice_url,
                "latitude": db_msg.latitude,
                "longitude": db_msg.longitude,
                "is_read": db_msg.is_read,
                "created_at": db_msg.created_at.isoformat()
            }
            await manager.broadcast(chat_id, broadcast_payload)
    except WebSocketDisconnect:
        manager.disconnect(chat_id, websocket)
    finally:
        db.close()
