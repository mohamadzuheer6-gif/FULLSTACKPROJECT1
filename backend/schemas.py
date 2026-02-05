from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# -------- PROFILE --------
class ProfileCreate(BaseModel):
    name: str
    email: str
    education: str


class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    education: Optional[str] = None


class ProfileOut(ProfileCreate):
    id: int

    class Config:
        from_attributes = True


# -------- SKILLS --------
class SkillCreate(BaseModel):
    name: str
    proficiency: str  # 🔥 proficiency stored here


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    proficiency: Optional[str] = None


class SkillOut(BaseModel):
    id: int
    name: str
    proficiency: str

    class Config:
        from_attributes = True


# -------- PROJECTS --------
class ProjectCreate(BaseModel):
    title: str
    description: str
    links: Optional[Dict[str, Any]] = None   # 🔥 { "link": "url" }


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    links: Optional[Dict[str, Any]] = None


class ProjectOut(ProjectCreate):
    id: int

    class Config:
        from_attributes = True
