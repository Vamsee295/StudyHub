import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { buttonClass } from '@/components/ui/Button';

interface WizardNavProps {
  currentStep: number;
  handleNext: () => void;
  handleBack: () => void;
  isValid: boolean;
}

export default function WizardNav({ currentStep, handleNext, handleBack, isValid }: WizardNavProps) {
  return (
    <div className="mt-2 flex items-center justify-between gap-3 border-t-[1.5px] border-hair pt-6">
      <button onClick={handleBack} disabled={currentStep === 1} className={buttonClass('ghost', 'sm')} type="button">
        <ArrowLeft className="size-4" />
        Back
      </button>
      <button onClick={handleNext} disabled={!isValid} className={buttonClass(currentStep === 4 ? 'accent' : 'primary')} type="button">
        {currentStep === 4 ? 'Finish' : 'Next'}
        {currentStep === 4 ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
      </button>
    </div>
  );
}
