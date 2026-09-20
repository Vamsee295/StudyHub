import { UserProfile, RoadmapGenerationResult } from '@/types';

const DRAFT_KEY = 'pathward-onboarding-draft';
const PROFILE_KEY = 'pathward-user-profile';

export const DEFAULT_USER_PROFILE: UserProfile = {
  identity: {
    fullName: "Aditya",
    email: "aditya@university.edu",
    college: "Indian Institute of Technology",
    degree: "B.Tech — Computer Science & Engineering",
    branch: "Computer Science & Engineering",
    graduationYear: "2026",
    currentSemester: "7th Semester (Final Year)",
    driveCycle: "Campus & Off-Campus 2026–27",
    targetRole: "Software Development Engineer (SDE-1)",
    preferredJobType: "Full-Time Campus & Off-Campus",
    locationPreference: "Bangalore / Hyderabad / Pune / Remote",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
  },
  careerTracks: ["Software Engineer"],
  skillBaseline: {
    programming: "Intermediate",
    dsa: "Intermediate",
    sql: "Beginner",
    coreCS: "Intermediate",
    aptitude: "Advanced"
  },
  targets: {
    objectives: ["Campus Placements", "Product Roles"],
    companies: ["Google", "Microsoft", "Amazon", "TCS"]
  },
  profileCompleted: true,
  completionPercentage: 88,
  updatedAt: new Date().toISOString()
};

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
  completeOnboarding(profile: UserProfile): RoadmapGenerationResult {
    const finalProfile = {
      ...profile,
      profileCompleted: true,
      onboardingCompletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(finalProfile));
      // Set a cookie so middleware knows onboarding is complete
      document.cookie = "onboarding-complete=true; path=/; max-age=31536000"; // 1 year
      this.clearDraft();
    }

    return this.generateInitialRoadmap(finalProfile);
  },

  getProfile(): UserProfile | null {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error('Failed to parse user profile:', e);
          return null;
        }
      }
    }
    return null;
  },

  getProfileWithDefaults(): UserProfile {
    const existing = this.getProfile();
    if (!existing) return DEFAULT_USER_PROFILE;
    return {
      ...DEFAULT_USER_PROFILE,
      ...existing,
      identity: {
        ...DEFAULT_USER_PROFILE.identity,
        ...existing.identity
      },
      targets: {
        ...DEFAULT_USER_PROFILE.targets,
        ...existing.targets
      },
      skillBaseline: {
        ...DEFAULT_USER_PROFILE.skillBaseline,
        ...existing.skillBaseline
      },
      careerTracks: existing.careerTracks?.length ? existing.careerTracks : DEFAULT_USER_PROFILE.careerTracks,
      completionPercentage: existing.completionPercentage || 88
    };
  },

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getProfileWithDefaults();
    const updated: UserProfile = {
      ...current,
      ...updates,
      identity: {
        ...current.identity,
        ...(updates.identity || {})
      },
      targets: {
        ...current.targets,
        ...(updates.targets || {})
      },
      skillBaseline: {
        ...current.skillBaseline,
        ...(updates.skillBaseline || {})
      },
      careerTracks: updates.careerTracks || current.careerTracks,
      updatedAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('pathward-profile-updated', { detail: updated }));
    }

    return updated;
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
