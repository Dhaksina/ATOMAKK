from pydantic import BaseModel, Field
from typing import Optional


class TestimonialCreate(BaseModel):
    slug: str
    name: str
    role: str
    company: str
    rating: int = Field(..., ge=1, le=5)
    text: str
    logoText: str = ""


class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    company: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    text: Optional[str] = None
    logoText: Optional[str] = None


class TestimonialResponse(BaseModel):
    id: str
    slug: str
    name: str
    role: str
    company: str
    rating: int
    text: str
    logoText: str
