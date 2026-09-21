from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.core.security import get_current_user
from app.core.database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.profile import Profile, ProfileCareerPath, ProfileSkillBaseline, CareerPath
from app.models.company import UserCompanyTarget, Company
from app.schemas.profile import OnboardingCompleteRequest, ProfileUpdateRequest
from datetime import datetime

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.get("/status")
@router.get("/status/")
async def get_profile_status(user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Profile).where(Profile.id == user.id))
        profile = result.scalars().first()
        if not profile:
            return {"profile_completed": False}
        return {"profile_completed": profile.profile_completed}

@router.post("/onboarding/complete")
async def complete_onboarding(data: OnboardingCompleteRequest, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        # Create or update Profile
        result = await session.execute(select(Profile).where(Profile.id == user.id))
        profile = result.scalars().first()
        
        if not profile:
            profile = Profile(id=user.id)
            session.add(profile)
            
        profile.full_name = data.identity.fullName
        profile.university = data.identity.university or data.identity.college or ""
        profile.degree = data.identity.degree
        profile.branch = data.identity.branch or ""
        profile.graduation_year = data.identity.graduationYear
        profile.drive_cycle = data.identity.driveCycle
        profile.target_role = data.identity.targetRole
        profile.profile_completed = True
        
        # Skill baseline
        result = await session.execute(select(ProfileSkillBaseline).where(ProfileSkillBaseline.profile_id == user.id))
        baseline = result.scalars().first()
        if not baseline:
            baseline = ProfileSkillBaseline(profile_id=user.id)
            session.add(baseline)
        
        baseline.programming = data.baseline.programming
        baseline.dsa = data.baseline.dsa
        baseline.sql = data.baseline.sql
        baseline.core_cs = data.baseline.coreCS or data.baseline.coreCs or "Beginner"
        baseline.aptitude = data.baseline.aptitude
        
        # Delete existing tracks and recreate
        await session.execute(ProfileCareerPath.__table__.delete().where(ProfileCareerPath.profile_id == user.id))
        for path_id in data.tracks.selectedPathIds:
            if not path_id:
                continue
            # Ensure CareerPath exists in database
            cp = await session.get(CareerPath, path_id)
            if not cp:
                cp = CareerPath(id=path_id, name=path_id)
                session.add(cp)
                await session.flush()
                
            session.add(ProfileCareerPath(
                profile_id=user.id,
                career_path_id=path_id,
                is_primary=(path_id == data.tracks.primaryPathId)
            ))
            
        # Targets
        await session.execute(UserCompanyTarget.__table__.delete().where(UserCompanyTarget.user_id == user.id))
        for comp_id in data.targets.companyIds:
            if not comp_id:
                continue
            # Ensure Company exists in database
            comp = await session.get(Company, comp_id)
            if not comp:
                comp = Company(
                    id=comp_id, 
                    name=comp_id, 
                    monogram=comp_id[:2].upper() if len(comp_id) >= 2 else "CO", 
                    segment="Product", 
                    tier="Tier-1"
                )
                session.add(comp)
                await session.flush()
                
            session.add(UserCompanyTarget(
                user_id=user.id,
                company_id=comp_id,
                status="Tracking"
            ))
            
        try:
            await session.commit()
            return {"status": "success", "profile": {"full_name": profile.full_name, "target_role": profile.target_role}}
        except Exception as e:
            await session.rollback()
            raise HTTPException(status_code=500, detail=str(e))

@router.get("")
@router.get("/")
async def get_profile(user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Profile).where(Profile.id == user.id))
        profile = result.scalars().first()
        
        user_meta = getattr(user, "user_metadata", {}) or {}
        default_name = user_meta.get("full_name") or (user.email.split("@")[0] if user.email else "Learner")
        
        if not profile:
            return {
                "id": user.id,
                "email": user.email,
                "full_name": default_name,
                "first_name": default_name.split()[0] if default_name else "Learner",
                "profile_completed": False
            }
        
        # Get career paths
        tracks_res = await session.execute(select(ProfileCareerPath).where(ProfileCareerPath.profile_id == user.id))
        tracks = tracks_res.scalars().all()
        
        # Get baseline
        base_res = await session.execute(select(ProfileSkillBaseline).where(ProfileSkillBaseline.profile_id == user.id))
        baseline = base_res.scalars().first()
        
        print("\n=======================================")
        print("[PROFILE HYDRATION]")
        print(f"auth.user.id = {user.id}")
        print(f"auth.user.email = {user.email}")
        print(f"auth.user.user_metadata.full_name = {user_meta.get('full_name')}")
        print(f"GET /api/profile status = 200")
        print(f"GET /api/profile response (db.full_name) = {profile.full_name if profile else None}")
        print(f"database profile id = {profile.id if profile else None}")
        print(f"database profile full_name = {profile.full_name if profile else None}")
        print("=======================================\n")

        
        return {
            "id": profile.id,
            "email": user.email,
            "full_name": profile.full_name or default_name,
            "first_name": (profile.full_name or default_name).split()[0],
            "university": profile.university,
            "degree": profile.degree,
            "branch": profile.branch,
            "graduation_year": profile.graduation_year,
            "drive_cycle": profile.drive_cycle,
            "target_role": profile.target_role,
            "profile_completed": profile.profile_completed,
            "completion_percentage": profile.completion_percentage,
            "career_tracks": [t.career_path_id for t in tracks],
            "skill_baseline": {
                "programming": baseline.programming if baseline else "Beginner",
                "dsa": baseline.dsa if baseline else "Beginner",
                "sql": baseline.sql if baseline else "Beginner",
                "coreCS": baseline.core_cs if baseline else "Beginner",
                "aptitude": baseline.aptitude if baseline else "Beginner"
            } if baseline else None
        }

@router.get("/target-companies")
async def get_target_companies(user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(UserCompanyTarget).where(UserCompanyTarget.user_id == user.id))
        targets = result.scalars().all()
        return {"companies": [t.company_id for t in targets]}

@router.put("")
@router.put("/")
@router.patch("")
@router.patch("/")
async def update_profile(data: ProfileUpdateRequest, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Profile).where(Profile.id == user.id))
        profile = result.scalars().first()
        
        if not profile:
            profile = Profile(id=user.id, full_name="Learner")
            session.add(profile)
            
        new_name = data.full_name if data.full_name is not None else data.fullName
        if new_name is not None and new_name.strip():
            profile.full_name = new_name.strip()
            
        univ = data.university if data.university is not None else data.college
        if univ is not None:
            profile.university = univ.strip()
            
        if data.degree is not None:
            profile.degree = data.degree.strip()
            
        if data.branch is not None:
            profile.branch = data.branch.strip()
            
        grad_yr = data.graduation_year if data.graduation_year is not None else data.graduationYear
        if grad_yr is not None:
            profile.graduation_year = str(grad_yr).strip()
            
        curr_sem = data.current_semester if data.current_semester is not None else data.currentSemester
        if curr_sem is not None:
            profile.current_semester = str(curr_sem).strip()
            
        drv = data.drive_cycle if data.drive_cycle is not None else data.driveCycle
        if drv is not None:
            profile.drive_cycle = str(drv).strip()
            
        tgt_role = data.target_role if data.target_role is not None else data.targetRole
        if tgt_role is not None:
            profile.target_role = str(tgt_role).strip()
            
        pref_job = data.preferred_job_type if data.preferred_job_type is not None else data.preferredJobType
        if pref_job is not None:
            profile.preferred_job_type = str(pref_job).strip()
            
        loc = data.location_preference if data.location_preference is not None else data.locationPreference
        if loc is not None:
            profile.location_preference = str(loc).strip()
            
        av = data.avatar_url if data.avatar_url is not None else data.avatarUrl
        if av is not None:
            profile.avatar_url = str(av).strip()
            
        comp_pct = data.completion_percentage if data.completion_percentage is not None else data.completionPercentage
        if comp_pct is not None:
            profile.completion_percentage = comp_pct
            
        profile.updated_at = datetime.utcnow()
        
        # Handle career tracks update if provided
        tracks = data.career_tracks if data.career_tracks is not None else data.careerTracks
        if tracks is not None and len(tracks) > 0:
            await session.execute(ProfileCareerPath.__table__.delete().where(ProfileCareerPath.profile_id == user.id))
            for idx, path_id in enumerate(tracks):
                if not path_id:
                    continue
                cp = await session.get(CareerPath, path_id)
                if not cp:
                    cp = CareerPath(id=path_id, name=path_id)
                    session.add(cp)
                    await session.flush()
                session.add(ProfileCareerPath(
                    profile_id=user.id,
                    career_path_id=path_id,
                    is_primary=(idx == 0)
                ))
                
        try:
            await session.commit()
            await session.refresh(profile)
            return {
                "status": "success",
                "profile": {
                    "id": profile.id,
                    "full_name": profile.full_name,
                    "first_name": profile.full_name.split()[0] if profile.full_name else "Learner",
                    "target_role": profile.target_role,
                    "university": profile.university,
                    "degree": profile.degree,
                    "branch": profile.branch,
                    "graduation_year": profile.graduation_year,
                    "current_semester": profile.current_semester,
                    "drive_cycle": profile.drive_cycle,
                    "preferred_job_type": profile.preferred_job_type,
                    "location_preference": profile.location_preference,
                    "completion_percentage": profile.completion_percentage
                }
            }
        except Exception as e:
            await session.rollback()
            raise HTTPException(status_code=500, detail=str(e))

