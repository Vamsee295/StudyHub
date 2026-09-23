"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import { ToolWorkspaceHeader } from '@/components/tools/shared/ToolWorkspaceHeader';
import { DsaAlgorithmSidebar } from '@/components/tools/dsa/DsaAlgorithmSidebar';
import { DsaCanvas } from '@/components/tools/dsa/DsaCanvas';
import { DsaControls } from '@/components/tools/dsa/DsaControls';
import { DsaInfoPanel } from '@/components/tools/dsa/DsaInfoPanel';
import { DSA_ALGORITHMS, DsaAlgorithm, generateRandomArray, DsaStep } from '@/lib/services/tools/dsaAlgorithms';

export default function DsaVisualizerPage() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<DsaAlgorithm>(DSA_ALGORITHMS[0]);
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<DsaStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize
  useEffect(() => {
    generateNewData();
  }, []);

  // When algorithm or data changes, recalculate steps
  useEffect(() => {
    if (array.length > 0) {
      const newSteps = selectedAlgorithm.run([...array]);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    }
  }, [selectedAlgorithm, array]);

  // Playback logic
  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1000 / speed);
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const generateNewData = () => {
    setArray(generateRandomArray(10, 10, 100));
  };

  const currentStep = steps.length > 0 ? steps[currentStepIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto h-full flex flex-col">
        <ToolWorkspaceHeader
          title="DSA Visualizer"
          description="Interactive visualization of common data structures and algorithms to help you understand how they work under the hood."
          badge="Algorithm Engine"
          icon={<Activity className="w-5 h-5" />}
        />

        {/* Main Workspace Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] mb-8">
          
          {/* Left Sidebar - Algorithms */}
          <div className="lg:col-span-3 flex flex-col h-[500px] lg:h-auto">
            <DsaAlgorithmSidebar 
              selectedAlgorithm={selectedAlgorithm}
              onSelectAlgorithm={(alg) => setSelectedAlgorithm(alg)}
            />
          </div>

          {/* Center Content - Visualization & Controls */}
          <div className="lg:col-span-6 flex flex-col gap-6 h-[800px] lg:h-auto">
            <DsaCanvas currentStep={currentStep} />
            <DsaControls 
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
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
