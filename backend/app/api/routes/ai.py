import uuid
from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.core.security import get_current_user
from app.core.database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.profile import Profile, ProfileCareerPath, ProfileSkillBaseline
from app.models.company import UserCompanyTarget
from app.models.roadmap import Roadmap, RoadmapStage, UserRoadmapProgress
from app.services.groq_service import generate_personalized_roadmap

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/generate-plan")
async def generate_plan(user: Any = Depends(get_current_user)):
    user_id = getattr(user, "id", None) or (user.get("id") if isinstance(user, dict) else None) or (user.get("sub") if isinstance(user, dict) else None)
    async with AsyncSessionLocal() as session:
        # Fetch profile
        prof_res = await session.execute(select(Profile).where(Profile.id == user_id))
        profile = prof_res.scalars().first()
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
            
        # Fetch baseline
        base_res = await session.execute(select(ProfileSkillBaseline).where(ProfileSkillBaseline.profile_id == user_id))
        baseline = base_res.scalars().first()
        
        # Fetch tracks
        track_res = await session.execute(select(ProfileCareerPath).where(ProfileCareerPath.profile_id == user_id))
        tracks = track_res.scalars().all()
        
        # Fetch targets
        target_res = await session.execute(select(UserCompanyTarget).where(UserCompanyTarget.user_id == user_id))
        targets = target_res.scalars().all()

        profile_data = {
            "college": profile.college,
            "baseline": {
                "programming": baseline.programming if baseline else "Beginner",
                "dsa": baseline.dsa if baseline else "Beginner"
            },
            "tracks": [t.career_path_id for t in tracks],
            "targets": [t.company_id for t in targets]
        }
        
        try:
            plan_json = await generate_personalized_roadmap(profile_data)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
            
        # Create Roadmap
        roadmap_id = f"rm_{uuid.uuid4().hex[:8]}"
        new_roadmap = Roadmap(
            id=roadmap_id,
            career_path_id=tracks[0].career_path_id if tracks else "sde",
            title=plan_json.get("title", "Customized Roadmap"),
            description=plan_json.get("description", ""),
            total_stages=len(plan_json.get("stages", []))
        )
        session.add(new_roadmap)
        
        # Add Stages
        stage_id = None
        for i, stage_data in enumerate(plan_json.get("stages", [])):
            stage_id = f"rms_{uuid.uuid4().hex[:8]}"
            stage = RoadmapStage(
                id=stage_id,
                roadmap_id=roadmap_id,
                phase=stage_data.get("phase", f"Phase {i+1}"),
                title=stage_data.get("title", ""),
                description=stage_data.get("description", ""),
                sort_order=i
            )
            session.add(stage)
            
        # Attach progress
        progress = UserRoadmapProgress(
            user_id=user_id,
            roadmap_id=roadmap_id,
            current_stage_id=stage_id, # Can point to the first stage if we kept track of it
            completed_stages=0
        )
        session.add(progress)
        
        await session.commit()
        return {"status": "success", "roadmap_id": roadmap_id, "plan": plan_json}
