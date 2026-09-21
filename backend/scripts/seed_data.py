import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import asyncio
from app.core.database import AsyncSessionLocal
from app.models.company import Company
from app.models.resource import ResourceCategory, Resource
from app.models.learning import LearningModule

async def seed_database():
    json_path = os.path.join(os.path.dirname(__file__), "seed_data.json")
    
    if not os.path.exists(json_path):
        print(f"Error: {json_path} does not exist.")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    async with AsyncSessionLocal() as session:
        # 1. Seed Companies
        print("Seeding Companies...")
        for comp in data.get("companies", []):
            session.add(Company(
                id=comp["id"],
                name=comp["name"],
                monogram=comp["monogram"],
                segment=comp["segment"],
                tier=comp.get("difficulty", "N/A"),
                location=comp.get("location", ""),
                salary_range=comp.get("salaryRange", ""),
                process_summary=comp.get("processSummary", "")
            ))
            
        # 2. Seed Resource Categories
        print("Seeding Resource Categories...")
        for cat in data.get("resourceCategories", []):
            session.add(ResourceCategory(
                id=cat["id"],
                name=cat["title"],
                description=cat.get("description", "")
            ))
            
        # 3. Seed Resources
        print("Seeding Resources...")
        for res in data.get("resources", []):
            session.add(Resource(
                id=res["id"],
                title=res["title"],
                description=res.get("description", ""),
                category_id=None, # Needs mapping if available
                subject=res.get("track", ""),
                file_path=res.get("slug", ""),
                author=res.get("author", ""),
                is_featured=res.get("isVerified", False)
            ))

        try:
            await session.commit()
            print("Database seeded successfully!")
        except Exception as e:
            await session.rollback()
            print(f"Failed to seed database: {e}")

if __name__ == "__main__":
    asyncio.run(seed_database())
