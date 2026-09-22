'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile } from '@/types';
import { useAuth } from './AuthProvider';
import { profileApi } from '@/lib/api/profile';
import { onboardingService, BLANK_USER_PROFILE } from '@/lib/services/onboardingService';
import { supabase } from '@/lib/supabase/client';

type ProfileState = {
  savedProfile: UserProfile;
  draftProfile: UserProfile;
  isLoading: boolean;
  error: string | null;
  updateDraft: (updates: Partial<UserProfile>) => void;
  saveProfile: (profileToSave?: UserProfile) => Promise<void>;
  cancelEdits: () => void;
  refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileState | null>(null);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [savedProfile, setSavedProfile] = useState<UserProfile>(BLANK_USER_PROFILE);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(BLANK_USER_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    if (authLoading) return;
    
    if (!user) {
      setSavedProfile(BLANK_USER_PROFILE);
      setDraftProfile(BLANK_USER_PROFILE);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // 1. First hydrate from local cache if present to prevent redirect flicker
    let cachedProfile: UserProfile | null = null;
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(`pathward-user-profile:${user.id}`) || localStorage.getItem('pathward-user-profile');
        if (raw) {
          cachedProfile = JSON.parse(raw);
          if (cachedProfile) {
            setSavedProfile(cachedProfile);
            setDraftProfile(cachedProfile);
          }
        }
      } catch (e) {
        console.warn("[PROFILE CACHE READ ERROR]", e);
      }
    }

    try {
      console.log("[AUTH] user id:", user.id);
      
      // Fetch authoritative profile from backend API
      const dbRes = await profileApi.getProfile();
      console.log("\n=======================================");
      console.log("[PROFILE HYDRATION]");
      console.log("GET /api/profile response =", dbRes);
      console.log("ProfileProvider fullName =", dbRes.full_name);
      console.log("=======================================\n");

      let targetsRes = { companies: [] };
      try {
        targetsRes = await profileApi.getTargetCompanies();
      } catch (e) {}

      const isCompleted = dbRes.profile_completed || 
        (typeof document !== 'undefined' && document.cookie.includes('onboarding-complete=true')) ||
        (cachedProfile?.profileCompleted ?? false);

      const finalProfile: UserProfile = {
        ...BLANK_USER_PROFILE,
        identity: {
          ...BLANK_USER_PROFILE.identity,
          fullName: dbRes.full_name || cachedProfile?.identity?.fullName || '',
          email: dbRes.email || user.email || '',
          college: dbRes.university || cachedProfile?.identity?.college || '',
          degree: dbRes.degree || cachedProfile?.identity?.degree || '',
          branch: dbRes.branch || cachedProfile?.identity?.branch || '',
          graduationYear: dbRes.graduation_year || cachedProfile?.identity?.graduationYear || '',
          targetRole: dbRes.target_role || cachedProfile?.identity?.targetRole || '',
          currentSemester: dbRes.current_semester || cachedProfile?.identity?.currentSemester || '',
          driveCycle: dbRes.drive_cycle || cachedProfile?.identity?.driveCycle || '',
          preferredJobType: dbRes.preferred_job_type || cachedProfile?.identity?.preferredJobType || '',
          locationPreference: dbRes.location_preference || cachedProfile?.identity?.locationPreference || '',
        },
        careerTracks: (dbRes.career_tracks && dbRes.career_tracks.length > 0) ? dbRes.career_tracks : (cachedProfile?.careerTracks || []),
        skillBaseline: {
          ...BLANK_USER_PROFILE.skillBaseline,
          ...(dbRes.skill_baseline || cachedProfile?.skillBaseline || {})
        },
        targets: {
          ...BLANK_USER_PROFILE.targets,
          companies: (targetsRes.companies && targetsRes.companies.length > 0) ? targetsRes.companies : (cachedProfile?.targets?.companies || [])
        },
        completionPercentage: dbRes.completion_percentage || cachedProfile?.completionPercentage || (isCompleted ? 100 : 0),
        profileCompleted: isCompleted,
      };

      setSavedProfile(finalProfile);
      setDraftProfile(finalProfile);

      // Persist to local cache
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`pathward-user-profile:${user.id}`, JSON.stringify(finalProfile));
          localStorage.setItem('pathward-user-profile', JSON.stringify(finalProfile));
          if (finalProfile.profileCompleted) {
            document.cookie = "onboarding-complete=true; path=/; max-age=31536000";
          }
        } catch (e) {}
      }

      console.log("[PROFILE REFRESH] success");
    } catch (err) {
      console.warn("[PROFILE LOAD ERROR]", err);
      // If DB/backend fails, preserve existing cached profile or cookie state if available
      const isCookieComplete = typeof document !== 'undefined' && document.cookie.includes('onboarding-complete=true');
      const hasCompletedCache = cachedProfile?.profileCompleted || isCookieComplete;

      const fallbackProfile: UserProfile = cachedProfile || {
        ...BLANK_USER_PROFILE,
        identity: {
          ...BLANK_USER_PROFILE.identity,
          fullName: user.email ? user.email.split('@')[0] : "Learner",
          email: user.email || ''
        },
        profileCompleted: Boolean(hasCompletedCache),
      };

      setSavedProfile(fallbackProfile);
      setDraftProfile(fallbackProfile);
      setError("Unable to sync profile with server");
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateDraft = useCallback((updates: Partial<UserProfile>) => {
    setDraftProfile(prev => ({
      ...prev,
      ...updates,
      identity: {
        ...prev.identity,
        ...(updates.identity || {})
      },
      targets: {
        ...prev.targets,
        ...(updates.targets || {})
      },
      skillBaseline: {
        ...prev.skillBaseline,
        ...(updates.skillBaseline || {})
      }
    }));
  }, []);

  const saveProfile = useCallback(async (profileToSave?: UserProfile) => {
    if (!user) throw new Error("Must be logged in to save profile");
    setError(null);
    
    const targetProfile = profileToSave || draftProfile;

    try {
      console.log("[PROFILE UPDATE]", targetProfile.identity?.fullName);

      // 1. Update auth metadata first
      if (targetProfile.identity?.fullName) {
        const { error } = await supabase.auth.updateUser({
          data: { full_name: targetProfile.identity.fullName }
        });
        if (error) console.warn("Supabase auth metadata update failed (likely RLS/config), but DB will still be updated:", error);
      }

      // 2. Persist to Postgres profiles table
      const res = await profileApi.updateProfile({
        full_name: targetProfile.identity?.fullName,
        fullName: targetProfile.identity?.fullName,
        university: targetProfile.identity?.college,
        college: targetProfile.identity?.college,
        degree: targetProfile.identity?.degree,
        branch: targetProfile.identity?.branch,
        graduation_year: targetProfile.identity?.graduationYear,
        graduationYear: targetProfile.identity?.graduationYear,
        current_semester: targetProfile.identity?.currentSemester,
        currentSemester: targetProfile.identity?.currentSemester,
        drive_cycle: targetProfile.identity?.driveCycle,
        driveCycle: targetProfile.identity?.driveCycle,
        target_role: targetProfile.identity?.targetRole,
        targetRole: targetProfile.identity?.targetRole,
        preferred_job_type: targetProfile.identity?.preferredJobType,
        preferredJobType: targetProfile.identity?.preferredJobType,
        location_preference: targetProfile.identity?.locationPreference,
        locationPreference: targetProfile.identity?.locationPreference,
        career_tracks: targetProfile.careerTracks,
        careerTracks: targetProfile.careerTracks,
        completion_percentage: targetProfile.completionPercentage || 100,
        completionPercentage: targetProfile.completionPercentage || 100
      });

      console.log("[PROFILE UPDATE SUCCESS]", res);

      // Refresh canonical state by performing a fresh SELECT from Supabase
      await loadProfile();

    } catch (err: any) {
      console.error("[PROFILE SAVE ERROR]", err);
      setError(err.message || "Failed to save profile");
      throw err;
    }
  }, [user, draftProfile, loadProfile]);

  const cancelEdits = useCallback(() => {
    setDraftProfile(savedProfile);
    setError(null);
  }, [savedProfile]);

  return (
    <ProfileContext.Provider value={{
      savedProfile,
      draftProfile,
      isLoading,
      error,
      updateDraft,
      saveProfile,
      cancelEdits,
      refreshProfile: loadProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
