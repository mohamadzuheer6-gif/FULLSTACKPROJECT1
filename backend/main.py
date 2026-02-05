from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal, engine
from models import Base, Profile, Skill, Project
from schemas import *

app = FastAPI()

# ✅ CORS MUST BE IMMEDIATELY AFTER app creation
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://vercel.com",
        "https://fullstackproject1-mmf5.vercel.app",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}

# ---------------- PROFILE ----------------

@app.post("/profile", response_model=ProfileOut)
def create_profile(profile: ProfileCreate, db: Session = Depends(get_db)):
    if db.query(Profile).first():
        raise HTTPException(400, "Profile already exists")

    p = Profile(**profile.dict())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@app.get("/profile", response_model=ProfileOut)
def get_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(404, "Create profile first")
    return profile


# 🔥 PATCH added (matches frontend)
@app.patch("/profile", response_model=ProfileOut)
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db), _: str = Depends(verify_admin)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(404)

    for k, v in data.dict(exclude_unset=True).items():
        setattr(profile, k, v)

    db.commit()
    db.refresh(profile)
    return profile


# ---------------- SKILLS ----------------

@app.post("/skills", response_model=SkillOut)
def create_skill(
    skill: SkillCreate,
    db: Session = Depends(get_db),
    user: str = Depends(verify_admin)   # if you have admin auth
):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(400, "Create profile first")

    db_skill = Skill(
        name=skill.name,
        proficiency=skill.proficiency,
        profile_id=profile.id   # or however you link profile
    )

    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill


@app.get("/skills", response_model=List[SkillOut])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()


@app.put("/skills/{skill_id}", response_model=SkillOut)
def update_skill(
    skill_id: int,
    data: SkillUpdate,
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(Skill.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    for key, value in data.dict(exclude_unset=True).items():
        setattr(skill, key, value)

    db.commit()
    db.refresh(skill)
    return skill

@app.delete("/skills/{skill_id}")
def delete_skill(skill_id: int, db: Session = Depends(get_db), _: str = Depends(verify_admin)):
    skill = db.query(Skill).get(skill_id)
    if not skill:
        raise HTTPException(404)

    db.delete(skill)
    db.commit()
    return {"ok": True}


# ---------------- PROJECTS ----------------

@app.post("/projects", response_model=ProjectOut)
def add_project(project: ProjectCreate, db: Session = Depends(get_db), _: str = Depends(verify_admin)):
    profile = db.query(Profile).first()
    if not profile:
        raise HTTPException(400, "Create profile first")

    p = Project(
        title=project.title,
        description=project.description,
        links=project.links,      # 🔥 explicit
        profile_id=profile.id
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


@app.get("/projects", response_model=List[ProjectOut])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()


@app.put("/projects/{project_id}", response_model=ProjectOut)
def update_project(project_id: int, data: ProjectUpdate, db: Session = Depends(get_db)):
    project = db.query(Project).get(project_id)
    if not project:
        raise HTTPException(404)

    for k, v in data.dict(exclude_unset=True).items():
        setattr(project, k, v)

    db.commit()
    db.refresh(project)
    return project


@app.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db),_: str = Depends(verify_admin)):
    project = db.query(Project).get(project_id)
    if not project:
        raise HTTPException(404)

    db.delete(project)
    db.commit()
    return {"ok": True}
