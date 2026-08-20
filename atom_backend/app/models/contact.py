from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Literal


class ContactInquiry(Document):
    contactId: str = Field(..., unique=True)
    name: str
    email: str
    subject: str
    message: str
    status: Literal["Unread", "Read", "Resolved"] = "Unread"
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "contact_inquiries"
