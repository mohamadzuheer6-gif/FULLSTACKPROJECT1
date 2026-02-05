from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    education = Column(String, nullable=False)

    skills = relationship(
        "Skill",
        back_populates="profile",
        cascade="all, delete"
    )
    projects = relationship(
        "Project",
        back_populates="profile",
        cascade="all, delete"
    )


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    # 🔥 stores proficiency etc.
    proficiency = Column(String, nullable=False) 
    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    profile = relationship("Profile", back_populates="skills")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)

    # 🔥 supports { link: "https://..." }
    links = Column(JSON, nullable=True)

    profile_id = Column(Integer, ForeignKey("profiles.id"), nullable=False)
    profile = relationship("Profile", back_populates="projects")
