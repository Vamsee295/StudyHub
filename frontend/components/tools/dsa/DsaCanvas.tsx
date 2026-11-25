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
      <div className="flex-1 bg-card rounded-2xl border-[1.5px] border-hair flex items-center justify-center p-8">
        <p className="text-mute">Select an algorithm and click Play to start visualization.</p>
      </div>
    );
  }

  const { elements, activePointers } = currentStep;
  const maxVal = Math.max(...elements.map(e => e.value), 1);

  const getStateColor = (state: string) => {
    switch (state) {
      case 'comparing': return 'bg-gold border-gold text-warning';
      case 'swapping': return 'bg-danger border-danger text-paper';
      case 'sorted': return 'bg-note border-note text-paper';
      case 'found': return 'bg-accent border-accent text-paper';
      default: return 'bg-accent-soft border-accent-line text-accent-ink';
    }
  };

  return (
    <div className="flex-1 bg-card rounded-2xl border-[1.5px] border-hair flex flex-col overflow-hidden relative">
      <div className="p-4 border-b border-hair bg-paper-2/50 flex items-center justify-center">
        <p className="font-mono text-sm text-body bg-card px-4 py-2 rounded-lg border-[1.5px] border-hair inline-block">
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
                  "w-full rounded-t-md border-t-2 border-l-2 border-r-2 flex flex-col justify-end items-center pb-2",
                  getStateColor(element.state)
                )}
              >
                <span className="font-bold text-xs sm:text-sm">{element.value}</span>
              </motion.div>
              
              {/* Index label */}
              <div className="absolute -bottom-6 text-xs text-mute font-mono">
                {index}
              </div>

              {/* Active Pointers */}
              {pointersForIndex.length > 0 && (
                <div className="absolute -bottom-14 flex flex-col items-center gap-1">
                  {pointersForIndex.map((p, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-1 h-3 bg-accent rounded-full mb-0.5"></div>
                      <span className="text-[10px] font-bold text-accent-ink bg-accent-soft px-1.5 rounded">{p.label}</span>
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
