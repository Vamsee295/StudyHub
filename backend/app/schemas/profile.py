from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional

class IdentitySchema(BaseModel):
    model_config = ConfigDict(extra="ignore")
    fullName: str = "User"
    university: Optional[str] = None
    college: Optional[str] = None
    degree: str = "B.Tech"
    branch: Optional[str] = "CSE"
    graduationYear: str = "2026"
    driveCycle: str = "Campus 2026"
    targetRole: str = "Software Engineer"

class TracksSchema(BaseModel):
    model_config = ConfigDict(extra="ignore")
    selectedPathIds: List[str] = Field(default_factory=list)
    primaryPathId: Optional[str] = None

class BaselineSchema(BaseModel):
    model_config = ConfigDict(extra="ignore")
    programming: str = "Intermediate"
    oop: Optional[str] = "Intermediate"
    dsa: str = "Intermediate"
    sql: str = "Beginner"
    coreCs: Optional[str] = None
    coreCS: Optional[str] = None
    aptitude: str = "Intermediate"

class TargetsSchema(BaseModel):
    model_config = ConfigDict(extra="ignore")
    placementObjective: str = "Campus Placements"
    companyIds: List[str] = Field(default_factory=list)

class OnboardingCompleteRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    identity: IdentitySchema
    tracks: TracksSchema
    baseline: BaselineSchema
    targets: TargetsSchema

class ProfileUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    full_name: Optional[str] = None
    fullName: Optional[str] = None
    university: Optional[str] = None
    college: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    graduation_year: Optional[str] = None
    graduationYear: Optional[str] = None
    current_semester: Optional[str] = None
    currentSemester: Optional[str] = None
    drive_cycle: Optional[str] = None
    driveCycle: Optional[str] = None
    target_role: Optional[str] = None
    targetRole: Optional[str] = None
    preferred_job_type: Optional[str] = None
    preferredJobType: Optional[str] = None
    location_preference: Optional[str] = None
    locationPreference: Optional[str] = None
    avatar_url: Optional[str] = None
    avatarUrl: Optional[str] = None
    career_tracks: Optional[List[str]] = None
    careerTracks: Optional[List[str]] = None
    completion_percentage: Optional[int] = None
    completionPercentage: Optional[int] = None

