from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from datetime import datetime

from app.models.quote import QuoteRequest
from app.schemas.quote import QuoteCreate, QuoteUpdate, QuoteResponse
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/quotes", tags=["quotes"])


def quote_to_response(q: QuoteRequest) -> QuoteResponse:
    return QuoteResponse(id=str(q.id), quoteId=q.quoteId, productName=q.productName,
                         customerName=q.customerName, company=q.company, email=q.email,
                         phone=q.phone, quantity=q.quantity, message=q.message,
                         status=q.status, createdAt=q.createdAt)


@router.get("", response_model=List[QuoteResponse])
async def list_quotes(_user: User = Depends(get_current_user)):
    quotes = await QuoteRequest.find_all().sort("-createdAt").to_list()
    return [quote_to_response(q) for q in quotes]


@router.post("", response_model=QuoteResponse, status_code=status.HTTP_201_CREATED)
async def create_quote(data: QuoteCreate):
    quote_id = f"q-{int(datetime.utcnow().timestamp() * 1000)}"
    quote = QuoteRequest(
        quoteId=quote_id,
        **data.model_dump(),
        status="Pending",
        createdAt=datetime.utcnow(),
    )
    await quote.insert()
    return quote_to_response(quote)


@router.put("/{quote_mongo_id}", response_model=QuoteResponse)
async def update_quote(
    quote_mongo_id: str,
    data: QuoteUpdate,
    _user: User = Depends(get_current_user),
):
    quote = await QuoteRequest.get(quote_mongo_id)
    if not quote:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quote request not found")
    quote.status = data.status
    await quote.save()
    return quote_to_response(quote)


@router.delete("/{quote_mongo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_quote(
    quote_mongo_id: str,
    _user: User = Depends(get_current_user),
):
    quote = await QuoteRequest.get(quote_mongo_id)
    if not quote:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quote request not found")
    await quote.delete()
