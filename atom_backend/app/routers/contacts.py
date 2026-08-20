from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from datetime import datetime

from app.models.contact import ContactInquiry
from app.schemas.contact import ContactCreate, ContactUpdate, ContactResponse
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/contacts", tags=["contacts"])


def contact_to_response(c: ContactInquiry) -> ContactResponse:
    return ContactResponse(id=str(c.id), contactId=c.contactId, name=c.name, email=c.email,
                           subject=c.subject, message=c.message, status=c.status, createdAt=c.createdAt)


@router.get("", response_model=List[ContactResponse])
async def list_contacts(_user: User = Depends(get_current_user)):
    contacts = await ContactInquiry.find_all().sort("-createdAt").to_list()
    return [contact_to_response(c) for c in contacts]


@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(data: ContactCreate):
    contact_id = f"c-{int(datetime.utcnow().timestamp() * 1000)}"
    contact = ContactInquiry(
        contactId=contact_id,
        **data.model_dump(),
        status="Unread",
        createdAt=datetime.utcnow(),
    )
    await contact.insert()
    return contact_to_response(contact)


@router.put("/{contact_mongo_id}", response_model=ContactResponse)
async def update_contact(
    contact_mongo_id: str,
    data: ContactUpdate,
    _user: User = Depends(get_current_user),
):
    contact = await ContactInquiry.get(contact_mongo_id)
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact inquiry not found")
    contact.status = data.status
    await contact.save()
    return contact_to_response(contact)


@router.delete("/{contact_mongo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_contact(
    contact_mongo_id: str,
    _user: User = Depends(get_current_user),
):
    contact = await ContactInquiry.get(contact_mongo_id)
    if not contact:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact inquiry not found")
    await contact.delete()
