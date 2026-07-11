from __future__ import annotations

from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings
from app.schemas import UserOut

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    if hashed == plain:
        return True
    try:
        return pwd_context.verify(plain, hashed)
    except Exception:
        return False


def create_access_token(user: UserOut) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {
        "sub": user.id,
        "email": user.email,
        "nom": user.nom,
        "role": user.role,
        "entrepriseId": user.entrepriseId,
        "exp": expire,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)


def user_from_token(token: str) -> UserOut:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
        return UserOut(
            id=payload["sub"],
            email=payload["email"],
            nom=payload["nom"],
            role=payload["role"],
            entrepriseId=payload.get("entrepriseId", "ent-1"),
        )
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token invalide") from e


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> UserOut:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentification requise")
    return user_from_token(credentials.credentials)


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> UserOut | None:
    if credentials is None:
        return None
    try:
        return user_from_token(credentials.credentials)
    except HTTPException:
        return None
