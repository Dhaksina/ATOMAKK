from fastapi import APIRouter, HTTPException, status, Depends, Query
from typing import Optional, List
from bson import ObjectId

from app.models.product import Product, Category
from app.schemas.product import (
    ProductCreate, ProductUpdate, ProductResponse,
    CategoryCreate, CategoryUpdate, CategoryResponse,
)
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/products", tags=["products"])


def product_to_response(p: Product) -> ProductResponse:
    return ProductResponse(id=str(p.id), slug=p.slug, name=p.name, category=p.category,
                           shortDescription=p.shortDescription, longDescription=p.longDescription,
                           features=p.features, specs=p.specs, image=p.image, photo=p.photo,
                           datasheetUrl=p.datasheetUrl, videoUrl=p.videoUrl, warranty=p.warranty,
                           inStock=p.inStock, accuracy=p.accuracy)


def category_to_response(c: Category) -> CategoryResponse:
    return CategoryResponse(id=str(c.id), slug=c.slug, name=c.name,
                            description=c.description, iconName=c.iconName)


@router.get("", response_model=List[ProductResponse])
async def list_products(category: Optional[str] = Query(None)):
    query = {}
    if category:
        query["category"] = category
    products = await Product.find(query).to_list()
    return [product_to_response(p) for p in products]


@router.get("/{product_slug}", response_model=ProductResponse)
async def get_product(product_slug: str):
    product = await Product.find_one(Product.slug == product_slug)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product_to_response(product)


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    data: ProductCreate,
    _user: User = Depends(get_current_user),
):
    existing = await Product.find_one(Product.slug == data.slug)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Product with this slug already exists")
    product = Product(**data.model_dump())
    await product.insert()
    return product_to_response(product)


@router.put("/{product_slug}", response_model=ProductResponse)
async def update_product(
    product_slug: str,
    data: ProductUpdate,
    _user: User = Depends(get_current_user),
):
    product = await Product.find_one(Product.slug == product_slug)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    await product.save()
    return product_to_response(product)


@router.delete("/{product_slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_slug: str,
    _user: User = Depends(get_current_user),
):
    product = await Product.find_one(Product.slug == product_slug)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    await product.delete()
