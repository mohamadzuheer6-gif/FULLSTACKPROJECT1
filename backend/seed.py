from database import SessionLocal
from models import Profile, Skill, Project

db = SessionLocal()

# ================= PROFILE =================
profile = db.query(Profile).first()

if not profile:
    profile = Profile(
        name="Mohammad Zuheer",
        email="mohamadzuheer8@gmail.com",
        education="B.Tech in Material Science and Engineering"
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

# ================= SKILLS =================
def get_or_create_skill(name, proficiency):
    skill = db.query(Skill).filter(
        Skill.name == name,
        Skill.profile_id == profile.id
    ).first()

    if not skill:
        skill = Skill(
            name=name,
            proficiency=proficiency,
            profile_id=profile.id
        )
        db.add(skill)
        db.commit()
        db.refresh(skill)

    return skill


python = get_or_create_skill("Python", "Advanced")
fastapi = get_or_create_skill("FastAPI", "Medium")
sql = get_or_create_skill("SQL", "Medium")
docker = get_or_create_skill("Docker", "Beginner")
llm = get_or_create_skill("LLM", "Beginner")


# ================= PROJECTS =================
title = "Sample Project"
description = "This is a sample project description"
link = "https://example.com"

project = Project(
    title=title,
    description=description,
    links={"link": link},
    profile_id=profile.id
)
db.add(project)
db.commit()

db.close()
print("✅ Database seeded successfully")
