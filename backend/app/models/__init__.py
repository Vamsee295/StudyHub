from app.core.database import Base
from app.models.profile import Profile, CareerPath, ProfileCareerPath, ProfileSkillBaseline
from app.models.learning import LearningSubject, LearningModule, LearningTopic, UserLearningProgress
from app.models.roadmap import Roadmap, RoadmapStage, UserRoadmapProgress, UserDsaProblemProgress
from app.models.company import Company, CompanyRole, UserCompanyTarget
from app.models.resource import ResourceCategory, Resource, UserResourceProgress
from app.models.practice import PracticeSet, PracticeQuestion, UserPracticeAttempt
from app.models.practice import PracticeSet, PracticeQuestion, UserPracticeAttempt
from app.models.settings import UserSettings, ActivityEvent
from app.models.templates import TemplateCategory, Template, TemplateUsage
from app.models.tools import Tool, ToolUsage
from app.models.daily_plans import DailyPlan, DailyPlanItem

# This file imports all the models so that Alembic can auto-discover them via Base.metadata

