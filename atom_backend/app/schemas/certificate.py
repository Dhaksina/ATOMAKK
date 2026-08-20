from pydantic import BaseModel
from datetime import date
from typing import Literal, Optional


class CertificateCreate(BaseModel):
    certificateNo: str
    modelNo: str
    serialNo: str
    customerName: str
    calibrationDate: date
    dueDate: date
    status: Literal["Valid", "Expired"] = "Valid"


class CertificateUpdate(BaseModel):
    modelNo: Optional[str] = None
    serialNo: Optional[str] = None
    customerName: Optional[str] = None
    calibrationDate: Optional[date] = None
    dueDate: Optional[date] = None
    status: Optional[Literal["Valid", "Expired"]] = None


class CertificateResponse(BaseModel):
    id: str
    certificateNo: str
    modelNo: str
    serialNo: str
    customerName: str
    calibrationDate: date
    dueDate: date
    status: str


class CertificateVerifyRequest(BaseModel):
    certificateNo: str
    serialNo: str
