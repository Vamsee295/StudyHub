import asyncio
import os
import sys

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import AsyncSessionLocal
from app.models.resource import ResourceCategory, Resource
from app.models.profile import Profile
from sqlalchemy.future import select

async def seed_resources():
    async with AsyncSessionLocal() as session:
        # Check if already seeded
        result = await session.execute(select(ResourceCategory))
        categories = result.scalars().all()
        if categories:
            print("Resources already seeded!")
            return

        print("Seeding resource categories...")
        cat_dsa = ResourceCategory(id="cat_dsa", name="Algorithms", description="Data Structures and Algorithms")
        cat_sys = ResourceCategory(id="cat_sys", name="System Design", description="System Design patterns and cases")
        cat_db = ResourceCategory(id="cat_db", name="Databases", description="Database concepts and SQL")
        cat_lang = ResourceCategory(id="cat_lang", name="Languages", description="Programming Languages (Java, C++, Python)")
        
        session.add_all([cat_dsa, cat_sys, cat_db, cat_lang])
        
        print("Seeding resources...")
        res_dsa_1 = Resource(
            id="res_dsa_1",
            title="Comprehensive DSA Handbook",
            description="A complete guide to arrays, strings, trees, and graphs.",
            category_id="cat_dsa",
            subject="dsa",
            file_path="mock/dsa_handbook.pdf",
            file_type="pdf",
            page_count=120,
            author="Pathward Team",
            is_featured=True
        )

        res_dsa_2 = Resource(
            id="res_dsa_2",
            title="Dynamic Programming Patterns",
            description="Master DP with common patterns and approaches.",
            category_id="cat_dsa",
            subject="dsa",
            file_path="mock/dp_patterns.pdf",
            file_type="pdf",
            page_count=45,
            author="Algorithm Master",
            is_featured=False
        )

        res_sys_1 = Resource(
            id="res_sys_1",
            title="System Design Interview Prep",
            description="A high-level overview of distributed systems.",
            category_id="cat_sys",
            subject="system-design",
            file_path="mock/sys_design.pdf",
            file_type="pdf",
            page_count=80,
            author="System Architect",
            is_featured=True
        )

        res_db_1 = Resource(
            id="res_db_1",
            title="Advanced SQL Queries",
            description="Window functions, CTEs, and query optimization.",
            category_id="cat_db",
            subject="sql",
            file_path="mock/advanced_sql.pdf",
            file_type="pdf",
            page_count=35,
            author="Database Guru",
            is_featured=False
        )

        session.add_all([res_dsa_1, res_dsa_2, res_sys_1, res_db_1])
        await session.commit()
        print("Successfully seeded resources!")

if __name__ == "__main__":
    asyncio.run(seed_resources())
