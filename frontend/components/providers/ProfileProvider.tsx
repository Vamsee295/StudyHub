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

    try {
      console.log("[AUTH] user id:", user.id);
      
      // Fetch authoritative profile from Supabase
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

      const finalProfile: UserProfile = {
        ...BLANK_USER_PROFILE,
        identity: {
          ...BLANK_USER_PROFILE.identity,
          fullName: dbRes.full_name || '',
          email: dbRes.email || user.email || '',
          college: dbRes.university || '',
          degree: dbRes.degree || '',
          branch: dbRes.branch || '',
          graduationYear: dbRes.graduation_year || '',
          targetRole: dbRes.target_role || '',
          currentSemester: dbRes.current_semester || '',
          driveCycle: dbRes.drive_cycle || '',
          preferredJobType: dbRes.preferred_job_type || '',
          locationPreference: dbRes.location_preference || '',
        },
        careerTracks: dbRes.career_tracks || [],
        skillBaseline: {
          ...BLANK_USER_PROFILE.skillBaseline,
          ...(dbRes.skill_baseline || {})
        },
        targets: {
          ...BLANK_USER_PROFILE.targets,
          companies: targetsRes.companies || []
        },
        completionPercentage: dbRes.completion_percentage || 0,
        profileCompleted: dbRes.profile_completed || false,
      };

      setSavedProfile(finalProfile);
      setDraftProfile(finalProfile);
      console.log("[PROFILE REFRESH] success");
    } catch (err) {
      console.warn("[PROFILE LOAD ERROR]", err);
      // If DB fails, do not silently fallback to stale auth metadata
      const errorProfile: UserProfile = {
        ...BLANK_USER_PROFILE,
        identity: {
          ...BLANK_USER_PROFILE.identity,
          fullName: "Unable to load profile",
          email: user.email || ''
        }
      };
      setSavedProfile(errorProfile);
      setDraftProfile(errorProfile);
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
