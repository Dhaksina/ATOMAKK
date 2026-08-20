from pydantic import BaseModel
from datetime import datetime
from typing import Literal


class QuoteCreate(BaseModel):
    productName: str
    customerName: str
    company: str
    email: str
    phone: str
    quantity: int = 1
    message: str = ""


class QuoteUpdate(BaseModel):
    status: Literal["Pending", "Approved", "Contacted"]


class QuoteResponse(BaseModel):
    id: str
    quoteId: str
    productName: str
    customerName: str
    company: str
    email: str
    phone: str
    quantity: int
    message: str
    status: str
    createdAt: datetime
