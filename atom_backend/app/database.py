from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings

client: Optional[AsyncIOMotorClient] = None
db = None


async def init_database():
    global client, db
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    from app.models.user import User
    from app.models.product import Product, Category
    from app.models.industry import Industry
    from app.models.testimonial import Testimonial
    from app.models.quote import QuoteRequest
    from app.models.contact import ContactInquiry
    from app.models.certificate import Certificate

    await init_beanie(
        database=db,
        document_models=[
            User,
            Product,
            Category,
            Industry,
            Testimonial,
            QuoteRequest,
            ContactInquiry,
            Certificate,
        ],
    )


async def close_database():
    global client
    if client:
        client.close()
