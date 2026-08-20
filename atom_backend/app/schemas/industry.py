from pydantic import BaseModel
from typing import Optional


class IndustryCreate(BaseModel):
    slug: str
    name: str
    description: str
    iconName: str


class IndustryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    iconName: Optional[str] = None


class IndustryResponse(BaseModel):
    id: str
    slug: str
    name: str
    description: str
    iconName: str
