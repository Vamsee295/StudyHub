import sys
import os
import asyncio
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import AsyncSessionLocal
from app.models.learning import LearningSubject, LearningModule, LearningTopic
from sqlalchemy.future import select

async def seed_curriculum():
    data_file = os.path.join(os.path.dirname(__file__), "..", "data", "courses.json")
    with open(data_file, 'r', encoding='utf-8') as f:
        courses = json.load(f)

    async with AsyncSessionLocal() as session:
        print("Starting curriculum seed from courses.json...")
        
        # Check if already seeded to prevent duplication
        res = await session.execute(select(LearningSubject).limit(1))
        if res.scalars().first():
            print("Curriculum already exists. Clearing old data...")
            from sqlalchemy import delete
            from app.models.learning import UserLearningProgress
            # Also clear progress to avoid constraint issues if user played with old data
            await session.execute(delete(UserLearningProgress))
            await session.execute(delete(LearningTopic))
            await session.execute(delete(LearningModule))
            await session.execute(delete(LearningSubject))
            await session.commit()
            print("Old data cleared.")

        # Insert subjects, modules, topics
        for s_idx, s_data in enumerate(courses):
            subject = LearningSubject(
                id=s_data["id"],
                name=s_data["title"],
                slug=s_data["slug"],
                description=s_data.get("description", ""),
                icon=s_data.get("icon", "Book"),
                category=s_data.get("category", "General"),
                display_order=s_idx + 1
            )
            session.add(subject)
            
            for m_idx, m_data in enumerate(s_data.get("modules", [])):
                module = LearningModule(
                    id=m_data["id"],
                    subject_id=subject.id,
                    title=m_data["title"],
                    slug=m_data["slug"],
                    description=m_data.get("description", ""),
                    difficulty=m_data.get("difficulty", "Beginner"),
                    estimated_minutes=m_data.get("estimatedMinutes", 0),
                    display_order=m_idx + 1
                )
                session.add(module)
                
                for t_idx, t_data in enumerate(m_data.get("lessons", [])):
                    topic = LearningTopic(
                        id=t_data["id"],
                        module_id=module.id,
                        title=t_data["title"],
                        slug=t_data["slug"],
                        description=t_data.get("description", ""),
                        content=json.dumps(t_data.get("content", {})),
                        estimated_minutes=t_data.get("estimatedMinutes", 0),
                        display_order=t_idx + 1
                    )
                    session.add(topic)
                    
        try:
            await session.commit()
            print("Curriculum seeded successfully!")
        except Exception as e:
            await session.rollback()
            print(f"Failed to seed curriculum: {e}")

if __name__ == "__main__":
    asyncio.run(seed_curriculum())
