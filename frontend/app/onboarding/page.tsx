'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  CircleDot, 
  Circle, 
  Lock, 
  User,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { UserProfile, UserIdentity, SkillBaseline, UserTargets } from '@/types';
import { onboardingService } from '@/lib/services/onboardingService';
import { useProfile } from '@/components/providers/ProfileProvider';
import { useAuth } from '@/components/providers/AuthProvider';

import Step1Identity from '@/components/onboarding/Step1Identity';
import Step2Career from '@/components/onboarding/Step2Career';
import Step3Baseline from '@/components/onboarding/Step3Baseline';
import Step4Targets from '@/components/onboarding/Step4Targets';
import StepCompletionOverlay from '@/components/onboarding/StepCompletionOverlay';
import WizardNav from '@/components/onboarding/WizardNav';
import { StudyHubLogo } from '@/components/ui/StudyHubLogo';
import { buttonClass } from '@/components/ui/Button';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    identity: {
      fullName: '',
      college: '',
      degree: 'B.Tech — Computer Science & Engineering',
      graduationYear: '2026',
      driveCycle: 'Campus & Off-Campus 2026–27'
    },
    careerTracks: [],
    skillBaseline: {
      programming: 'Intermediate',
      dsa: 'Intermediate',
      sql: 'Beginner',
      coreCS: 'Beginner',
      aptitude: 'Intermediate'
    },
    targets: {
      objectives: [],
      companies: []
    }
  });
  
  const [isClient, setIsClient] = useState(false);

  const { draftProfile: canonicalProfile, isLoading: profileLoading, refreshProfile } = useProfile();

  useEffect(() => {
    setIsClient(true);
    // Load draft if exists in local storage
    const draft = onboardingService.getDraft();
    if (draft) {
      setProfile((prev) => ({ ...prev, ...draft }));
    }
  }, []);

  // Removed: Strict route guard - now handled by OnboardingGuard component

  if (!isClient || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      onboardingService.saveDraft(profile);
    } else if (currentStep === 4) {
      setCurrentStep(5); // Show completion overlay
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      onboardingService.saveDraft(profile);
    }
  };

  const handleJump = (step: number) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
      onboardingService.saveDraft(profile);
    }
  };

  const handleSkipForNow = async () => {
    try {
      await onboardingService.completeOnboarding(profile as UserProfile, user?.id);
      await refreshProfile();
      window.location.href = '/dashboard';
    } catch (e) {
      console.error("Skip for now error:", e);
      window.location.href = '/dashboard';
    }
  };

  const handleSaveAndExit = async () => {
    onboardingService.saveDraft(profile);
    try {
      await onboardingService.completeOnboarding(profile as UserProfile, user?.id);
      await refreshProfile();
      window.location.href = '/dashboard';
    } catch (e) {
      console.error("Save and exit error:", e);
      window.location.href = '/dashboard';
    }
  };

  const handleComplete = async () => {
    try {
      await onboardingService.completeOnboarding(profile as UserProfile, user?.id);
      await refreshProfile();
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }

    try {
      const { aiApi } = await import('@/lib/api/ai');
      await aiApi.generatePlan();
    } catch (error) {
      console.error("Failed to generate AI plan:", error);
    }

    window.location.href = '/dashboard';
  };

  // State update helpers
  const updateIdentity = (updates: Partial<UserIdentity>) => {
    setProfile((prev) => ({ ...prev, identity: { ...prev.identity!, ...updates } }));
  };

  const updateCareerTracks = (tracks: string[]) => {
    setProfile((prev) => ({ ...prev, careerTracks: tracks }));
  };

  const updateSkillBaseline = (updates: Partial<SkillBaseline>) => {
    setProfile((prev) => ({ ...prev, skillBaseline: { ...prev.skillBaseline!, ...updates } }));
  };

  const updateTargets = (updates: Partial<UserTargets>) => {
    setProfile((prev) => ({ ...prev, targets: { ...prev.targets!, ...updates } }));
  };

  // Check validity for current step to enable/disable Next button
  const isStepValid = () => {
    if (currentStep === 1) {
      return !!profile.identity?.fullName && !!profile.identity?.college;
    }
    if (currentStep === 2) {
      return !!profile.careerTracks && profile.careerTracks.length > 0;
    }
    if (currentStep === 3) {
      return true; // default values are set
    }
    if (currentStep === 4) {
      return !!profile.targets?.objectives && profile.targets.objectives.length > 0;
    }
    return true;
  };

  const stepLabels = ['About you', 'Career', 'Skills', 'Goals'];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b-[2.4px] border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
          <StudyHubLogo href="/onboarding" size="md" />
          <div className="flex items-center gap-2">
            <button onClick={handleSaveAndExit} className={buttonClass('ghost', 'sm')} title="Save what you've entered and go to the dashboard">
              Save &amp; exit
            </button>
            <button onClick={handleSkipForNow} className={buttonClass('secondary', 'sm')} title="Skip setup and go straight to the dashboard">
              Skip for now <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex w-full flex-1 flex-col items-center px-4 py-8 sm:px-6 md:py-12">
        <div className="flex w-full max-w-3xl flex-col gap-6">
          <div>
            <p className="eyebrow mb-2">{currentStep <= 4 ? `Step ${currentStep} of 4` : 'All set'}</p>
            <h1 className="display text-[44px] md:text-[60px]">
              Set up your <span className="hl">plan</span>
            </h1>
            <p className="note mt-2 -rotate-1">takes about two minutes</p>
          </div>

          <nav aria-label="Setup steps" className="grid grid-cols-4 gap-2">
            {stepLabels.map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isCompleted = currentStep > stepNum;
              return (
                <button
                  key={label}
                  onClick={() => handleJump(stepNum)}
                  type="button"
                  aria-current={isActive ? 'step' : undefined}
                  className="no-press group flex flex-col gap-2 text-left"
                >
                  <span className={`h-1.5 w-full rounded-full ${isCompleted ? 'bg-note' : isActive ? 'bg-accent' : 'bg-ink/10'}`} />
                  <span className={`flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider ${isActive ? 'text-ink' : 'text-mute group-hover:text-ink'}`}>
                    {isCompleted && <CheckCircle2 className="size-3.5 text-note" aria-label="Done" />}
                    <span className="hidden sm:inline">0{stepNum} ·</span> {label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="brut flex w-full flex-col gap-6 rounded-2xl bg-card p-6 sm:p-8">
            {currentStep === 1 && <Step1Identity data={profile.identity!} update={updateIdentity} />}
            {currentStep === 2 && <Step2Career data={profile.careerTracks!} update={updateCareerTracks} />}
            {currentStep === 3 && <Step3Baseline data={profile.skillBaseline!} update={updateSkillBaseline} />}
            {currentStep === 4 && <Step4Targets data={profile.targets!} update={updateTargets} />}
            {currentStep === 5 && (
              <StepCompletionOverlay profile={profile as UserProfile} onComplete={handleComplete} onEdit={() => handleJump(1)} />
            )}
            {currentStep <= 4 && (
              <WizardNav currentStep={currentStep} handleNext={handleNext} handleBack={handleBack} isValid={isStepValid()} />
            )}
          </div>

          <p className="text-center font-mono text-[12px] text-mute">You can change any of this later in your profile.</p>
        </div>
      </main>
    </div>
  );
}
