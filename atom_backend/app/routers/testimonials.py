from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate, TestimonialResponse
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/testimonials", tags=["testimonials"])


def testimonial_to_response(t: Testimonial) -> TestimonialResponse:
    return TestimonialResponse(id=str(t.id), slug=t.slug, name=t.name, role=t.role,
                               company=t.company, rating=t.rating, text=t.text, logoText=t.logoText)


@router.get("", response_model=List[TestimonialResponse])
async def list_testimonials():
    testimonials = await Testimonial.find_all().to_list()
    return [testimonial_to_response(t) for t in testimonials]


@router.get("/{testimonial_slug}", response_model=TestimonialResponse)
async def get_testimonial(testimonial_slug: str):
    testimonial = await Testimonial.find_one(Testimonial.slug == testimonial_slug)
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    return testimonial_to_response(testimonial)


@router.post("", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
async def create_testimonial(
    data: TestimonialCreate,
    _user: User = Depends(get_current_user),
):
    existing = await Testimonial.find_one(Testimonial.slug == data.slug)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Testimonial already exists")
    testimonial = Testimonial(**data.model_dump())
    await testimonial.insert()
    return testimonial_to_response(testimonial)


@router.put("/{testimonial_slug}", response_model=TestimonialResponse)
async def update_testimonial(
    testimonial_slug: str,
    data: TestimonialUpdate,
    _user: User = Depends(get_current_user),
):
    testimonial = await Testimonial.find_one(Testimonial.slug == testimonial_slug)
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(testimonial, key, value)
    await testimonial.save()
    return testimonial_to_response(testimonial)


@router.delete("/{testimonial_slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testimonial(
    testimonial_slug: str,
    _user: User = Depends(get_current_user),
):
    testimonial = await Testimonial.find_one(Testimonial.slug == testimonial_slug)
    if not testimonial:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found")
    await testimonial.delete()
