import logging
from typing import AsyncGenerator
from app.ai.provider.factory import get_ai_provider
from app.models.practice import PracticeQuestion
from app.models.profile import ProfileSkillBaseline

logger = logging.getLogger(__name__)

class TutorService:
    def __init__(self):
        self.provider = get_ai_provider()

    async def get_tutor_stream(
        self,
        question: PracticeQuestion,
        query: str,
        user_skills: ProfileSkillBaseline | None = None,
        chat_history: list[dict[str, str]] | None = None,
    ) -> AsyncGenerator[str, None]:
        """
        Generates a streaming response for the AI tutor.
        Uses the Socratic method to guide the student without giving away the answer.
        """
        
        # Build context
        skill_context = ""
        if user_skills:
            skill_context = f"""
Student Skill Level:
- DSA: {user_skills.dsa}
- Programming: {user_skills.programming}
- SQL: {user_skills.sql}
- Core CS: {user_skills.core_cs}
"""

        system_prompt = f"""You are the StudyHub AI Tutor. Your goal is to help the student solve the current practice question.

CURRENT QUESTION:
Title: {question.title}
Difficulty: {question.difficulty}
Statement: {question.problem_statement}
{skill_context}

RULES FOR TUTORING:
1. Socratic Method: NEVER give the direct answer or the full code solution. Ask guiding questions to help the student realize the answer themselves.
2. Adapt to Skill Level: Tailor your hints based on the student's skill level.
3. Be concise and encouraging.
4. If the student asks something completely unrelated to the question or their studies, politely redirect them back to the question.
"""

        messages = [{"role": "system", "content": system_prompt}]
        
        if chat_history:
            # chat_history should be a list of {"role": "user"|"assistant", "content": "..."}
            messages.extend(chat_history)
            
        messages.append({"role": "user", "content": query})

        # We will stream the response
        try:
            async for chunk in self.provider.stream(messages=messages):
                yield chunk
        except Exception as e:
            logger.error(f"Error in tutor stream: {e}")
            yield f"\n\n[Error communicating with AI service. Please try again later.]"
