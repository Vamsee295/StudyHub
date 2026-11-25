"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Activity } from 'lucide-react';
import { ToolWorkspaceHeader } from '@/components/tools/shared/ToolWorkspaceHeader';
import { DsaAlgorithmSidebar } from '@/components/tools/dsa/DsaAlgorithmSidebar';
import { DsaCanvas } from '@/components/tools/dsa/DsaCanvas';
import { DsaControls } from '@/components/tools/dsa/DsaControls';
import { DsaInfoPanel } from '@/components/tools/dsa/DsaInfoPanel';
import { DSA_ALGORITHMS, DsaAlgorithm, generateRandomArray } from '@/lib/services/tools/dsaAlgorithms';

export default function DsaVisualizerPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<DsaAlgorithm>(DSA_ALGORITHMS[0]);
  const [array, setArray] = useState<number[]>(() => generateRandomArray(10, 10, 100));
  // the algorithm's full trace for this input; playback walks through it
  const steps = useMemo(() => selectedAlgorithm.run([...array]), [selectedAlgorithm, array]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Playback: advance one step per tick; pause on the last step
  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev + 1 >= steps.length - 1) setIsPlaying(false);
        return Math.min(prev + 1, steps.length - 1);
      });
    }, 1000 / speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  // new input or algorithm: back to the first step, paused
  const restart = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };
  const generateNewData = () => {
    setArray(generateRandomArray(10, 10, 100));
    restart();
  };

  const currentStep = steps.length > 0 ? steps[currentStepIndex] : null;

  return (
    <div className="min-h-screen bg-paper-2/50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto h-full flex flex-col">
        <ToolWorkspaceHeader
          title="DSA Visualizer"
          description="Interactive visualization of common data structures and algorithms to help you understand how they work under the hood."
          badge="Step-through"
          icon={<Activity className="w-5 h-5" />}
        />

        {/* Main Workspace Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] mb-8">
          
          {/* Left Sidebar - Algorithms */}
          <div className="lg:col-span-3 flex flex-col h-[500px] lg:h-auto">
            <DsaAlgorithmSidebar 
              selectedAlgorithm={selectedAlgorithm}
              onSelectAlgorithm={(alg) => {
                setSelectedAlgorithm(alg);
                restart();
              }}
            />
          </div>

          {/* Center Content - Visualization & Controls */}
          <div className="lg:col-span-6 flex flex-col gap-6 h-[800px] lg:h-auto">
            <DsaCanvas currentStep={currentStep} />
            <DsaControls 
              isPlaying={isPlaying}
              onPlayPause={() => {
                if (!isPlaying && currentStepIndex >= steps.length - 1) setCurrentStepIndex(0); // replay from the start
                setIsPlaying(!isPlaying);
              }}
              onStepForward={() => setCurrentStepIndex(p => Math.min(p + 1, steps.length - 1))}
              onStepBackward={() => setCurrentStepIndex(p => Math.max(p - 1, 0))}
              onReset={() => {
                setCurrentStepIndex(0);
                setIsPlaying(false);
              }}
              onGenerateNew={generateNewData}
              speed={speed}
              onSpeedChange={setSpeed}
              canStepBackward={currentStepIndex > 0}
              canStepForward={currentStepIndex < steps.length - 1}
            />
          </div>

          {/* Right Sidebar - Info Panel */}
          <div className="lg:col-span-3 flex flex-col h-[500px] lg:h-auto">
            <DsaInfoPanel 
              algorithm={selectedAlgorithm}
              currentLineIndex={currentStep?.lineIndex}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
