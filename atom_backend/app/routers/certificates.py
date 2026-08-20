from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from app.models.certificate import Certificate
from app.schemas.certificate import (
    CertificateCreate, CertificateUpdate, CertificateResponse,
)
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/certificates", tags=["certificates"])


def cert_to_response(c: Certificate) -> CertificateResponse:
    return CertificateResponse(id=str(c.id), certificateNo=c.certificateNo, modelNo=c.modelNo,
                               serialNo=c.serialNo, customerName=c.customerName,
                               calibrationDate=c.calibrationDate, dueDate=c.dueDate, status=c.status)


@router.get("/verify", response_model=CertificateResponse)
async def verify_certificate(certificateNo: str, serialNo: str):
    cert = await Certificate.find_one(
        Certificate.certificateNo == certificateNo.strip().upper(),
        Certificate.serialNo == serialNo.strip().upper(),
    )
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found. Please check the certificate number and serial number.",
        )
    return cert_to_response(cert)


@router.get("", response_model=List[CertificateResponse])
async def list_certificates(_user: User = Depends(get_current_user)):
    certs = await Certificate.find_all().to_list()
    return [cert_to_response(c) for c in certs]


@router.post("", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
async def create_certificate(
    data: CertificateCreate,
    _user: User = Depends(get_current_user),
):
    existing = await Certificate.find_one(Certificate.certificateNo == data.certificateNo)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Certificate already exists")
    cert = Certificate(**data.model_dump())
    await cert.insert()
    return cert_to_response(cert)


@router.put("/{cert_no}", response_model=CertificateResponse)
async def update_certificate(
    cert_no: str,
    data: CertificateUpdate,
    _user: User = Depends(get_current_user),
):
    cert = await Certificate.find_one(Certificate.certificateNo == cert_no)
    if not cert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(cert, key, value)
    await cert.save()
    return cert_to_response(cert)


@router.delete("/{cert_no}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_certificate(
    cert_no: str,
    _user: User = Depends(get_current_user),
):
    cert = await Certificate.find_one(Certificate.certificateNo == cert_no)
    if not cert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certificate not found")
    await cert.delete()
