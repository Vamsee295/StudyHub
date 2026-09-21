from fastapi import APIRouter, Depends
from typing import Any
from app.core.security import get_current_user
from app.core.database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.profile import Profile, ProfileCareerPath, ProfileSkillBaseline
from app.models.company import UserCompanyTarget, Company
from app.models.daily_plans import DailyPlan, DailyPlanItem
from app.models.learning import UserLearningProgress, LearningTopic, LearningModule, LearningSubject

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("")
@router.get("/")
async def get_dashboard(user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        # 1. Fetch user Profile
        result = await session.execute(select(Profile).where(Profile.id == user.id))
        profile = result.scalars().first()
        
        # Determine User's Name from DB or Supabase Metadata
        user_meta = getattr(user, "user_metadata", {}) or {}
        full_name = (profile.full_name if profile and profile.full_name else None) or user_meta.get("full_name") or (user.email.split("@")[0] if user.email else "Learner")
        first_name = full_name.split()[0] if full_name else "Learner"

        # Auto-create or ensure Profile exists in DB
        if not profile:
            profile = Profile(
                id=user.id,
                full_name=full_name,
                target_role=user_meta.get("target_role", "Software Development Engineer"),
                profile_completed=False
            )
            session.add(profile)
            await session.commit()
            await session.refresh(profile)
        
        # 2. Fetch primary career path
        result = await session.execute(
            select(ProfileCareerPath).where(ProfileCareerPath.profile_id == user.id, ProfileCareerPath.is_primary == True)
        )
        primary_track = result.scalars().first()
        if not primary_track:
            result = await session.execute(
                select(ProfileCareerPath).where(ProfileCareerPath.profile_id == user.id)
            )
            primary_track = result.scalars().first()
            
        current_track = profile.target_role or (primary_track.career_path_id if primary_track else "Software Development Engineer")
        
        # 3. Fetch Skill Baseline
        result = await session.execute(select(ProfileSkillBaseline).where(ProfileSkillBaseline.profile_id == user.id))
        baseline = result.scalars().first()
        
        def map_skill(level: str | None) -> int:
            return {"Beginner": 25, "Intermediate": 55, "Advanced": 85}.get(level or "", 0)
            
        java_prog = map_skill(baseline.programming) if baseline else 0
        dsa_prog = map_skill(baseline.dsa) if baseline else 0
        sql_prog = map_skill(baseline.sql) if baseline else 0
        core_prog = map_skill(baseline.core_cs) if baseline else 0
        aptitude_prog = map_skill(baseline.aptitude) if baseline else 0
        
        has_baseline = baseline is not None
        readiness = (java_prog + dsa_prog + sql_prog + core_prog + aptitude_prog) // 5 if has_baseline else 0
        
        # 4. Fetch Continue Learning Progress
        recent_prog = await session.execute(
            select(UserLearningProgress, LearningTopic, LearningModule, LearningSubject)
            .join(LearningTopic, UserLearningProgress.topic_id == LearningTopic.id)
            .join(LearningModule, LearningTopic.module_id == LearningModule.id)
            .join(LearningSubject, LearningModule.subject_id == LearningSubject.id)
            .where(UserLearningProgress.user_id == user.id)
            .order_by(UserLearningProgress.last_accessed_at.desc())
        )
        first_recent = recent_prog.first()
        
        if first_recent:
            prog_rec, topic, module, subject = first_recent
            continue_learning = {
                "module": module.title,
                "topic": topic.title,
                "subject_slug": subject.slug,
                "topic_slug": topic.slug,
                "progress": prog_rec.progress,
                "has_started": True
            }
        else:
            continue_learning = {
                "module": "Start First Module",
                "topic": f"Begin your {current_track} learning path",
                "progress": 0,
                "has_started": False
            }
            
        # 5. Fetch Today's Plan
        plan_res = await session.execute(
            select(DailyPlan).where(DailyPlan.user_id == user.id).order_by(DailyPlan.created_at.desc())
        )
        daily_plan = plan_res.scalars().first()
        
        tasks_list = []
        completion_rate = 0
        if daily_plan:
            items_res = await session.execute(
                select(DailyPlanItem).where(DailyPlanItem.plan_id == daily_plan.id)
            )
            items = items_res.scalars().all()
            for idx, item in enumerate(items):
                is_done = item.status == "completed"
                tasks_list.append({
                    "id": item.id or idx + 1,
                    "text": item.task,
                    "completed": is_done
                })
            completed_count = sum(1 for t in tasks_list if t["completed"])
            completion_rate = int((completed_count / len(tasks_list)) * 100) if tasks_list else 0

        # 6. Fetch Target Company
        target_res = await session.execute(
            select(UserCompanyTarget, Company)
            .join(Company, UserCompanyTarget.company_id == Company.id)
            .where(UserCompanyTarget.user_id == user.id)
            .limit(1)
        )
        target_entry = target_res.first()
        
        if target_entry:
            _, company = target_entry
            upcoming_target = {
                "title": f"{company.name} Target Preparation",
                "subtitle": f"Targeting {profile.target_role or company.segment} openings."
            }
        else:
            upcoming_target = {
                "title": "Set Target Companies",
                "subtitle": "Track dream companies to personalize assessments."
            }

        return {
            "user": {
                "id": user.id,
                "full_name": full_name,
                "first_name": first_name,
                "email": user.email
            },
            "metrics": {
                "readiness": readiness,
                "streak": 1 if has_baseline else 0
            },
            "current_track": current_track,
            "continue_learning": continue_learning,
            "learning_progress": [
                {"name": "Programming", "progress": java_prog, "icon": "TerminalSquare"},
                {"name": "DSA", "progress": dsa_prog, "icon": "Code2"},
                {"name": "SQL", "progress": sql_prog, "icon": "Database"},
                {"name": "Core CS", "progress": core_prog, "icon": "Server"},
                {"name": "Aptitude", "progress": aptitude_prog, "icon": "Network"}
            ],
            "today_plan": {
                "tasks": tasks_list,
                "completion": completion_rate,
                "has_plan": len(tasks_list) > 0
            },
            "upcoming_target": upcoming_target
        }
