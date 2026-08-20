from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from app.models.product import Category
from app.schemas.product import CategoryCreate, CategoryUpdate, CategoryResponse
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/categories", tags=["categories"])


def category_to_response(c: Category) -> CategoryResponse:
    return CategoryResponse(id=str(c.id), slug=c.slug, name=c.name,
                            description=c.description, iconName=c.iconName)


@router.get("", response_model=List[CategoryResponse])
async def list_categories():
    categories = await Category.find_all().to_list()
    return [category_to_response(c) for c in categories]


@router.get("/{category_slug}", response_model=CategoryResponse)
async def get_category(category_slug: str):
    category = await Category.find_one(Category.slug == category_slug)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category_to_response(category)


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    data: CategoryCreate,
    _user: User = Depends(get_current_user),
):
    existing = await Category.find_one(Category.slug == data.slug)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category already exists")
    category = Category(**data.model_dump())
    await category.insert()
    return category_to_response(category)


@router.put("/{category_slug}", response_model=CategoryResponse)
async def update_category(
    category_slug: str,
    data: CategoryUpdate,
    _user: User = Depends(get_current_user),
):
    category = await Category.find_one(Category.slug == category_slug)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)
    await category.save()
    return category_to_response(category)


@router.delete("/{category_slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_slug: str,
    _user: User = Depends(get_current_user),
):
    category = await Category.find_one(Category.slug == category_slug)
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    await category.delete()
