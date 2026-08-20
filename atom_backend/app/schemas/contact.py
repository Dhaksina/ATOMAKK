from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class ContactCreate(BaseModel):
    name: str
    email: str
    subject: str
    message: str


class ContactUpdate(BaseModel):
    status: Literal["Unread", "Read", "Resolved"]


class ContactResponse(BaseModel):
    id: str
    contactId: str
    name: str
    email: str
    subject: str
    message: str
    status: str
    createdAt: datetime
