'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  CircleDot, 
  Circle, 
  Lock, 
  User
} from 'lucide-react';
import { UserProfile, UserIdentity, SkillBaseline, UserTargets } from '@/types';
import { onboardingService } from '@/lib/services/onboardingService';

import Step1Identity from '@/components/onboarding/Step1Identity';
import Step2Career from '@/components/onboarding/Step2Career';
import Step3Baseline from '@/components/onboarding/Step3Baseline';
import Step4Targets from '@/components/onboarding/Step4Targets';
import StepCompletionOverlay from '@/components/onboarding/StepCompletionOverlay';
import WizardNav from '@/components/onboarding/WizardNav';

export default function OnboardingPage() {
  const router = useRouter();
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

  useEffect(() => {
    setIsClient(true);
    // Load draft if exists
    const draft = onboardingService.getDraft();
    if (draft) {
      setProfile((prev) => ({ ...prev, ...draft }));
    }
  }, []);

  if (!isClient) return null; // Avoid hydration mismatch

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

  const handleSaveAndExit = () => {
    onboardingService.saveDraft(profile);
    router.push('/login');
  };

  const handleComplete = () => {
    // Actually generate roadmap and finish
    onboardingService.completeOnboarding(profile as UserProfile);
    router.push('/dashboard');
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

  const stepLabels = [
    { num: '01', title: 'IDENTITY' },
    { num: '02', title: 'CAREER' },
    { num: '03', title: 'SKILLS' },
    { num: '04', title: 'GOALS' },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf8] grid-texture text-slate-900 flex flex-col justify-between">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17.5L13 8L19 17.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="font-bold text-[16px] tracking-tight text-slate-900">PATHWARD</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200 tracking-wider">
              ENGINE
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>Profile Setup // First-Time Initialization</span>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleSaveAndExit} 
                className="text-xs font-mono font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Save &amp; Exit
              </button>
              
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col items-center px-4 sm:px-6 py-8 md:py-10">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          
          {/* Progress Ribbon */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span className="font-semibold uppercase tracking-wider">PATHWARD PROFILE SETUP // STEP-BY-STEP</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800 font-bold">
                  {currentStep <= 4 ? `STEP 0${currentStep} OF 04 • ${Math.round((currentStep / 4) * 100)}%` : 'CALIBRATION 100%'}
                </span>
                <span className="hidden md:inline text-slate-300">|</span>
                <span className="hidden md:inline text-slate-500">CYCLE 2026</span>
              </div>
            </div>
            
            {/* Steps Navigator */}
            <nav className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
              {stepLabels.map((step, idx) => {
                const stepNum = idx + 1;
                const isActive = currentStep === stepNum;
                const isCompleted = currentStep > stepNum;
                
                return (
                  <button 
                    key={stepNum}
                    onClick={() => handleJump(stepNum)}
                    type="button"
                    className={`flex flex-col gap-2 p-3 rounded-xl text-left border transition-all ${
                      isActive 
                        ? 'bg-blue-50/70 border-blue-400 shadow-xs' 
                        : isCompleted
                        ? 'bg-white border-slate-200 hover:border-slate-300'
                        : 'bg-slate-50/80 border-slate-200/80 hover:bg-white text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold tracking-wider ${
                        isActive ? 'text-blue-700' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {step.num}. {step.title}
                      </span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : isActive ? (
                        <CircleDot className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                    </div>
                    
                    {/* Tiny Progress Bar per step */}
                    <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? 'w-full bg-emerald-500' : isActive ? 'w-full bg-blue-600' : 'w-0'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Form Container Card */}
          <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
            {currentStep === 1 && (
              <Step1Identity data={profile.identity!} update={updateIdentity} />
            )}
            {currentStep === 2 && (
              <Step2Career data={profile.careerTracks!} update={updateCareerTracks} />
            )}
            {currentStep === 3 && (
              <Step3Baseline data={profile.skillBaseline!} update={updateSkillBaseline} />
            )}
            {currentStep === 4 && (
              <Step4Targets data={profile.targets!} update={updateTargets} />
            )}
            {currentStep === 5 && (
              <StepCompletionOverlay profile={profile as UserProfile} onComplete={handleComplete} onEdit={() => handleJump(1)} />
            )}
            
            {/* Bottom Navigation */}
            {currentStep <= 4 && (
              <WizardNav 
                currentStep={currentStep} 
                handleNext={handleNext} 
                handleBack={handleBack} 
                isValid={isStepValid()} 
              />
            )}
          </div>
          
          {/* Metadata Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-400 gap-2 px-1">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Profile synchronization active • Data encrypted</span>
            </div>
            <div>PATHWARD ONBOARDING // 2026-27 PLACEMENTS</div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div>PATHWARD Placement Engine • System Calibration Cycle v2.4 (Verified)</div>
          <div className="flex items-center gap-6">
            <a className="hover:text-slate-900 transition-colors" href="#">Privacy &amp; Data Ethics</a>
            <a className="hover:text-slate-900 transition-colors" href="#">Diagnostic Telemetry</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
