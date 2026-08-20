from beanie import Document
from pydantic import Field


class Testimonial(Document):
    slug: str = Field(..., unique=True)
    name: str
    role: str
    company: str
    rating: int = Field(..., ge=1, le=5)
    text: str
    logoText: str = ""

    class Settings:
        name = "testimonials"
