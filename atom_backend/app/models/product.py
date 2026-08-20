from beanie import Document
from pydantic import Field
from typing import Dict, List, Optional


class Category(Document):
    slug: str = Field(..., unique=True)
    name: str
    description: str
    iconName: str

    class Settings:
        name = "categories"


class Product(Document):
    slug: str = Field(..., unique=True)
    name: str
    category: str
    shortDescription: str
    longDescription: str
    features: List[str] = []
    specs: Dict[str, str] = {}
    image: str = ""
    photo: Optional[str] = None
    datasheetUrl: str = ""
    videoUrl: Optional[str] = None
    warranty: str = ""
    inStock: bool = True
    accuracy: str = ""

    class Settings:
        name = "products"
