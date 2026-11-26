import json
from typing import Dict, Any
from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.groq_api_key) if settings.groq_api_key else None

async def generate_personalized_roadmap(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    if not client:
        raise ValueError("Groq API Key not configured")
        
    prompt = f"""
    You are an expert career and technical coach for software engineering candidates.
    The user is preparing for software engineering roles.
    Here is their profile information:
    - Education: {profile_data.get('college')}
    - Current Target Roles: {profile_data.get('tracks')}
    - Technical Baseline: {profile_data.get('baseline')}
    - Target Companies: {profile_data.get('targets')}

    Based on this, generate a structured, personalized learning roadmap with 3-4 distinct phases (e.g., Foundations, Advanced, Interview Prep).
    Respond strictly in JSON format matching this schema:
    {{
        "title": "String (e.g., SDE Placement Roadmap)",
        "description": "String (Short description)",
        "stages": [
            {{
                "phase": "String (e.g., Phase 1, Phase 2)",
                "title": "String",
                "description": "String"
            }}
        ]
    }}
    Do not include any other text besides the JSON.
    """

    response = client.chat.completions.create(
        model=settings.groq_model or "llama3-70b-8192",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    
    result = response.choices[0].message.content
    if not result:
        raise ValueError("Empty response from Groq")
        
    try:
        return json.loads(result)
    except json.JSONDecodeError:
        raise ValueError("Failed to parse LLM response as JSON")

async def explain_code_error(code: str, error_message: str, language: str) -> str:
    """Explains a compile or runtime error as a hint. Uses the shared provider (Groq, falling back to Ollama)."""
    from app.ai.provider.factory import get_ai_provider

    system = (
        "You are a patient programming tutor. A student's code failed. Explain what the error means and point at the "
        "line or idea that causes it, in 1 to 3 short paragraphs of markdown. Give a hint toward the fix. "
        "Never write the corrected code or the solution to the problem; the student must write it themselves. "
        "A one-line syntax reminder unrelated to the problem's logic is fine."
    )
    user = f"Language: {language}\n\nError:\n```\n{error_message[:4000]}\n```\n\nCode:\n```\n{code[:8000]}\n```"
    text, _ = await get_ai_provider().generate(
        [{"role": "system", "content": system}, {"role": "user", "content": user}], max_tokens=700, temperature=0.3
    )
    return text.strip() or "Sorry, I could not generate an explanation at this time."
