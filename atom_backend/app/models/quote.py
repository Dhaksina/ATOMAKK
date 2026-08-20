from beanie import Document
from pydantic import Field
from datetime import datetime
from typing import Literal


class QuoteRequest(Document):
    quoteId: str = Field(..., unique=True)
    productName: str
    customerName: str
    company: str
    email: str
    phone: str
    quantity: int = 1
    message: str = ""
    status: Literal["Pending", "Approved", "Contacted"] = "Pending"
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "quote_requests"
