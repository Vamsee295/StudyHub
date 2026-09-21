import { UserProfile, RoadmapGenerationResult } from '@/types';
import { profileApi } from '@/lib/api/profile';
import { supabase } from '@/lib/supabase/client';

const DRAFT_KEY = 'pathward-onboarding-draft';
const PROFILE_KEY = 'pathward-user-profile';

export const BLANK_USER_PROFILE: UserProfile = {
  identity: {
    fullName: "",
    email: "",
    college: "",
    degree: "B.Tech — Computer Science & Engineering",
    branch: "Computer Science & Engineering",
    graduationYear: "2026",
    currentSemester: "Final Year",
    driveCycle: "Campus & Off-Campus 2026–27",
    targetRole: "Software Development Engineer (SDE-1)",
    preferredJobType: "Full-Time Campus & Off-Campus",
    locationPreference: "Bangalore / Hyderabad / Pune / Remote",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
  },
  careerTracks: ["Software Engineer"],
  skillBaseline: {
    programming: "Beginner",
    dsa: "Beginner",
    sql: "Beginner",
    coreCS: "Beginner",
    aptitude: "Beginner"
  },
  targets: {
    objectives: ["Campus Placements"],
    companies: []
  },
  profileCompleted: false,
  completionPercentage: 0,
  updatedAt: new Date().toISOString()
};

export const DEFAULT_USER_PROFILE = BLANK_USER_PROFILE;

export const onboardingService = {
  // LocalStorage methods for draft
  saveDraft(data: Partial<UserProfile>) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    }
  },

  getDraft(): Partial<UserProfile> | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(DRAFT_KEY);
      if (data) {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error('Failed to parse onboarding draft:', e);
          return null;
        }
      }
    }
    return null;
  },

  clearDraft() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DRAFT_KEY);
    }
  },

  // Save the final completed profile
  async completeOnboarding(profile: UserProfile, userId?: string): Promise<RoadmapGenerationResult> {
    const finalProfile: UserProfile = {
      ...profile,
      profileCompleted: true,
      onboardingCompletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionPercentage: 100
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(finalProfile));
      if (userId) {
        localStorage.setItem(`${PROFILE_KEY}:${userId}`, JSON.stringify(finalProfile));
      }
      // Set a cookie so middleware knows onboarding is complete
      document.cookie = "onboarding-complete=true; path=/; max-age=31536000"; // 1 year
      this.clearDraft();
    }
    
    try {
      await profileApi.completeOnboarding({
        identity: {
          fullName: profile.identity?.fullName || "",
          university: profile.identity?.college || "",
          college: profile.identity?.college || "",
          degree: profile.identity?.degree || "B.Tech",
          branch: profile.identity?.branch || "CSE",
          graduationYear: profile.identity?.graduationYear || "2026",
          driveCycle: profile.identity?.driveCycle || "Campus 2026",
          targetRole: profile.identity?.targetRole || profile.careerTracks?.[0] || "Software Engineer"
        },
        tracks: {
          selectedPathIds: profile.careerTracks || [],
          primaryPathId: profile.careerTracks?.[0] || null
        },
        baseline: {
          programming: profile.skillBaseline?.programming || "Intermediate",
          dsa: profile.skillBaseline?.dsa || "Intermediate",
          sql: profile.skillBaseline?.sql || "Beginner",
          coreCS: profile.skillBaseline?.coreCS || "Beginner",
          aptitude: profile.skillBaseline?.aptitude || "Intermediate"
        },
        targets: {
          placementObjective: profile.targets?.objectives?.[0] || "Campus Placements",
          companyIds: profile.targets?.companies || []
        }
      });
    } catch (e) {
      console.error("Failed to sync profile to backend", e);
    }

    return this.generateInitialRoadmap(finalProfile);
  },




  // Deterministic Roadmap Generation
  generateInitialRoadmap(profile: UserProfile): RoadmapGenerationResult {
    const primaryTrack = profile.careerTracks && profile.careerTracks.length > 0 ? profile.careerTracks[0] : "Software Engineer";
    
    // Core stages always included
    const stages: RoadmapGenerationResult['stages'] = [
      {
        id: "programming-foundations",
        title: "Programming & OOP Foundations",
        description: "Core syntax, classes, memory lifecycle.",
        status: profile.skillBaseline?.programming === "Advanced" ? "completed" : "active" as const
      },
      {
        id: "dsa-patterns",
        title: "DSA & Algorithmic Patterns",
        description: "Trees, Graphs, DP, Sliding Window.",
        status: profile.skillBaseline?.dsa === "Advanced" ? "completed" : "queued" as const
      },
      {
        id: "sql-databases",
        title: "SQL & Relational Databases",
        description: "Complex joins, subqueries, normalization.",
        status: profile.skillBaseline?.sql === "Advanced" ? "completed" : "queued" as const
      },
      {
        id: "core-cs",
        title: "Core Computer Science",
        description: "Operating Systems, DBMS internals, Computer Networks.",
        status: profile.skillBaseline?.coreCS === "Advanced" ? "completed" : "queued" as const
      },
      {
        id: "aptitude",
        title: "Quantitative & Logical Aptitude",
        description: "Speed math, analytical reasoning.",
        status: profile.skillBaseline?.aptitude === "Advanced" ? "completed" : "queued" as const
      }
    ];

    // Add company preparation stage if any companies selected
    if (profile.targets?.companies && profile.targets.companies.length > 0) {
      stages.push({
        id: "company-prep",
        title: "Target Company Preparation",
        description: `Preparation strategies for ${profile.targets.companies.join(', ')}`,
        status: "queued" as const
      });
    }

    const queuedModules = stages.filter(s => s.status !== "completed").length;
    
    // Simple heuristic for target rubric
    const targetRubric = profile.targets?.objectives?.includes("Campus Placements") 
      ? `Campus ${profile.identity?.graduationYear || '2026'}` 
      : "Off-Campus Readiness";

    const companyCount = profile.targets?.companies?.length || 0;

    return {
      stages,
      primaryTrack,
      modulesQueued: queuedModules,
      targetRubric: `${targetRubric} (${companyCount} company patterns synced)`
    };
  }
};
