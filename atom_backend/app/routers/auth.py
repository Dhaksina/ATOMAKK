from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime

from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin, Token, UserResponse
from app.dependencies import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    existing = await User.find_one(User.username == user_data.username)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already registered",
        )
    user = User(
        username=user_data.username,
        hashed_password=hash_password(user_data.password),
        role="admin",
        created_at=datetime.utcnow(),
    )
    await user.insert()
    return UserResponse(
        id=str(user.id),
        username=user.username,
        role=user.role,
        created_at=user.created_at,
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await User.find_one(User.username == credentials.username)
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    access_token = create_access_token(data={"sub": user.username})
    return Token(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user.id),
        username=current_user.username,
        role=current_user.role,
        created_at=current_user.created_at,
    )
