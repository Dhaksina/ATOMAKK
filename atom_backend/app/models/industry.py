from beanie import Document
from pydantic import Field


class Industry(Document):
    slug: str = Field(..., unique=True)
    name: str
    description: str
    iconName: str

    class Settings:
        name = "industries"
