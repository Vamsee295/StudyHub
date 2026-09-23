import React from 'react';
import { DsaStep } from '@/lib/services/tools/dsaAlgorithms';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DsaCanvasProps {
  currentStep: DsaStep | null;
}

export function DsaCanvas({ currentStep }: DsaCanvasProps) {
  if (!currentStep) {
    return (
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center p-8">
        <p className="text-gray-500">Select an algorithm and click Play to start visualization.</p>
      </div>
    );
  }

  const { elements, activePointers } = currentStep;
  const maxVal = Math.max(...elements.map(e => e.value), 1);

  const getStateColor = (state: string) => {
    switch (state) {
      case 'comparing': return 'bg-amber-400 border-amber-500 text-amber-900';
      case 'swapping': return 'bg-red-400 border-red-500 text-white';
      case 'sorted': return 'bg-green-400 border-green-500 text-white';
      case 'found': return 'bg-indigo-500 border-indigo-600 text-white';
      default: return 'bg-blue-100 border-blue-200 text-blue-900';
    }
  };

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-center">
        <p className="font-mono text-sm text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm inline-block">
          {currentStep.description || "Initializing..."}
        </p>
      </div>
      
      <div className="flex-1 p-8 flex items-end justify-center gap-2 min-h-[300px] pb-16 relative">
        {elements.map((element, index) => {
          const heightPercent = Math.max((element.value / maxVal) * 100, 10);
          
          // Find pointers for this index
          const pointersForIndex = activePointers.filter(p => p.index === index);

          return (
            <div key={element.id} className="relative flex flex-col items-center justify-end h-full w-full max-w-[60px]">
              <motion.div 
                layout
                initial={false}
                animate={{ height: `${heightPercent}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(
                  "w-full rounded-t-md border-t-2 border-l-2 border-r-2 flex flex-col justify-end items-center pb-2 shadow-sm",
                  getStateColor(element.state)
                )}
              >
                <span className="font-bold text-xs sm:text-sm">{element.value}</span>
              </motion.div>
              
              {/* Index label */}
              <div className="absolute -bottom-6 text-xs text-gray-400 font-mono">
                {index}
              </div>

              {/* Active Pointers */}
              {pointersForIndex.length > 0 && (
                <div className="absolute -bottom-14 flex flex-col items-center gap-1">
                  {pointersForIndex.map((p, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-1 h-3 bg-indigo-500 rounded-full mb-0.5"></div>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded">{p.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
