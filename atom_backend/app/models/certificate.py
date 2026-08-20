from beanie import Document
from pydantic import Field
from datetime import date
from typing import Literal


class Certificate(Document):
    certificateNo: str = Field(..., unique=True)
    modelNo: str
    serialNo: str
    customerName: str
    calibrationDate: date
    dueDate: date
    status: Literal["Valid", "Expired"] = "Valid"

    class Settings:
        name = "certificates"
