import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DsaControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onGenerateNew: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  canStepForward: boolean;
  canStepBackward: boolean;
}

export function DsaControls({
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  onGenerateNew,
  speed,
  onSpeedChange,
  canStepForward,
  canStepBackward
}: DsaControlsProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      
      {/* Playback Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onStepBackward}
          disabled={!canStepBackward || isPlaying}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button
          onClick={onPlayPause}
          disabled={!canStepForward && !isPlaying}
          className={cn(
            "p-3 rounded-full flex items-center justify-center transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
            isPlaying 
              ? "bg-amber-100 text-amber-700 hover:bg-amber-200" 
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
          )}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>
        
        <button
          onClick={onStepForward}
          disabled={!canStepForward || isPlaying}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SkipForward className="w-5 h-5" />
        </button>
        
        <div className="w-px h-8 bg-gray-200 mx-2"></div>
        
        <button
          onClick={onReset}
          className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
          title="Reset Animation"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Settings */}
      <div className="flex items-center gap-4 text-sm w-full sm:w-auto">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 flex-1 sm:flex-none">
          <Settings2 className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 font-medium">Speed:</span>
          <select 
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="bg-transparent border-none text-gray-900 font-semibold focus:outline-none cursor-pointer"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2.0x</option>
          </select>
        </div>

        <button
          onClick={onGenerateNew}
          className="px-4 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap"
        >
          New Data
        </button>
      </div>
    </div>
  );
}
