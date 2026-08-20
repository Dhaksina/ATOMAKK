from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from app.models.industry import Industry
from app.schemas.industry import IndustryCreate, IndustryUpdate, IndustryResponse
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/industries", tags=["industries"])


def industry_to_response(i: Industry) -> IndustryResponse:
    return IndustryResponse(id=str(i.id), slug=i.slug, name=i.name,
                            description=i.description, iconName=i.iconName)


@router.get("", response_model=List[IndustryResponse])
async def list_industries():
    industries = await Industry.find_all().to_list()
    return [industry_to_response(i) for i in industries]


@router.get("/{industry_slug}", response_model=IndustryResponse)
async def get_industry(industry_slug: str):
    industry = await Industry.find_one(Industry.slug == industry_slug)
    if not industry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Industry not found")
    return industry_to_response(industry)


@router.post("", response_model=IndustryResponse, status_code=status.HTTP_201_CREATED)
async def create_industry(
    data: IndustryCreate,
    _user: User = Depends(get_current_user),
):
    existing = await Industry.find_one(Industry.slug == data.slug)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Industry already exists")
    industry = Industry(**data.model_dump())
    await industry.insert()
    return industry_to_response(industry)


@router.put("/{industry_slug}", response_model=IndustryResponse)
async def update_industry(
    industry_slug: str,
    data: IndustryUpdate,
    _user: User = Depends(get_current_user),
):
    industry = await Industry.find_one(Industry.slug == industry_slug)
    if not industry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Industry not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(industry, key, value)
    await industry.save()
    return industry_to_response(industry)


@router.delete("/{industry_slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_industry(
    industry_slug: str,
    _user: User = Depends(get_current_user),
):
    industry = await Industry.find_one(Industry.slug == industry_slug)
    if not industry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Industry not found")
    await industry.delete()
