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
projects_data = [
    {
        "title": "Traffic Signal Forecasting System",
        "description": " Built a machine learning model to predict traffic congestion using historical signal data Performed data preprocessing and model training in PythonHelps in understanding traffic flow patterns for smarter signal management",
        "link": "https://github.com/mohamadzuheer6-gif/TRAFFIC-SIGNAL-FORECAST"
    },
    {
        "title": "Medical Chatbot using LLMs",
        "description": "Developed an AI-based medical chatbot using LLMs for answering health-related queries Implemented backend using Flask and LangChain with vector database integration Deployed the application on AWS for real-world usage",
        "link": "https://github.com/mohamadzuheer6-gif/MEDICAL-CHATBOT"
    }
]

for proj_data in projects_data:
    project = Project(
        title=proj_data["title"],
        description=proj_data["description"],
        links={"link": proj_data["link"]},
        profile_id=profile.id
    )
    db.add(project)

db.commit()

db.close()
print("✅ Database seeded successfully")
