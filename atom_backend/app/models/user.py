from beanie import Document
from pydantic import Field
from datetime import datetime


class User(Document):
    username: str = Field(..., unique=True)
    hashed_password: str
    role: str = "admin"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
