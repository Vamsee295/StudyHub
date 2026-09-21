import asyncio
import os
import sys

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import AsyncSessionLocal
from app.models.practice import PracticeSet, PracticeQuestion

async def seed_practice():
    async with AsyncSessionLocal() as session:
        # Check if already seeded
        # we can just clear and recreate or create if not exists
        # For simplicity, let's just clear and insert
        
        # We need to execute deletes if we want to wipe it
        # But let's just add new ones if empty
        import uuid
        
        # 1. DSA Set
        dsa_set_id = "sprint-dsa-1"
        dsa_set = PracticeSet(
            id=dsa_set_id,
            title="DSA Sprint: Arrays & Pointers",
            domain="dsa",
            difficulty="Intermediate",
            estimated_minutes=30
        )
        
        # 2. SQL Set
        sql_set_id = "sprint-sql-1"
        sql_set = PracticeSet(
            id=sql_set_id,
            title="SQL Challenge: Joins & CTEs",
            domain="sql",
            difficulty="Advanced",
            estimated_minutes=25
        )
        
        session.add(dsa_set)
        session.add(sql_set)
        
        # DSA Questions
        session.add(PracticeQuestion(
            id=str(uuid.uuid4()),
            set_id=dsa_set_id,
            title="Two Sum",
            problem_statement="Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            difficulty="Easy",
            options=[],
            correct_option="",
            explanation="Use a HashMap to store the numbers and their indices."
        ))
        
        session.add(PracticeQuestion(
            id=str(uuid.uuid4()),
            set_id=dsa_set_id,
            title="Container With Most Water",
            problem_statement="You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.",
            difficulty="Medium",
            options=[],
            correct_option="",
            explanation="Use two pointers from both ends, moving the pointer pointing to the shorter line."
        ))
        
        # SQL Questions
        session.add(PracticeQuestion(
            id=str(uuid.uuid4()),
            set_id=sql_set_id,
            title="Find Nth Highest Salary",
            problem_statement="Write a SQL query to find the nth highest salary from the Employee table. If there is no nth highest salary, then the query should return null.",
            difficulty="Medium",
            options=[],
            correct_option="",
            explanation="Use DENSE_RANK() or an OFFSET clause."
        ))
        
        await session.commit()
        print("Successfully seeded practice sets and questions!")

if __name__ == "__main__":
    asyncio.run(seed_practice())
