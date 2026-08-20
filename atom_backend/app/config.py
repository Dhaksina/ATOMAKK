from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "atom_backend"
    JWT_SECRET_KEY: str = "change-this-to-a-random-secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
