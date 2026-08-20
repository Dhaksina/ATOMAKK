from pydantic import BaseModel
from typing import Dict, List, Optional


class ProductCreate(BaseModel):
    slug: str
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


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    shortDescription: Optional[str] = None
    longDescription: Optional[str] = None
    features: Optional[List[str]] = None
    specs: Optional[Dict[str, str]] = None
    image: Optional[str] = None
    photo: Optional[str] = None
    datasheetUrl: Optional[str] = None
    videoUrl: Optional[str] = None
    warranty: Optional[str] = None
    inStock: Optional[bool] = None
    accuracy: Optional[str] = None


class ProductResponse(BaseModel):
    id: str
    slug: str
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


class CategoryCreate(BaseModel):
    slug: str
    name: str
    description: str
    iconName: str


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    iconName: Optional[str] = None


class CategoryResponse(BaseModel):
    id: str
    slug: str
    name: str
    description: str
    iconName: str
