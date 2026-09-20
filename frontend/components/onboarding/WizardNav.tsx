import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface WizardNavProps {
  currentStep: number;
  handleNext: () => void;
  handleBack: () => void;
  isValid: boolean;
}

export default function WizardNav({ currentStep, handleNext, handleBack, isValid }: WizardNavProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-2">
      <button 
        onClick={handleBack}
        disabled={currentStep === 1}
        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider rounded-lg border transition-all ${
          currentStep === 1 
            ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50' 
            : 'border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 active:bg-slate-200/60'
        }`}
        type="button"
      >
        <ArrowLeft className="w-4 h-4" />
        Return
      </button>

      <button 
        onClick={handleNext}
        disabled={!isValid}
        className={`flex items-center gap-2 px-6 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider rounded-lg transition-all ${
          !isValid
            ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow active:bg-blue-800'
        }`}
        type="button"
      >
        {currentStep === 4 ? 'Complete Initialization' : 'Proceed to Next'}
        {currentStep === 4 ? (
          <Check className="w-4 h-4 stroke-[2.5]" />
        ) : (
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        )}
      </button>
    </div>
  );
}
