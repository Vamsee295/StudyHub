import React from 'react';
import { Info, Clock, HardDrive, Code2 } from 'lucide-react';
import { DsaAlgorithm } from '@/lib/services/tools/dsaAlgorithms';
import { cn } from '@/lib/utils';

interface DsaInfoPanelProps {
  algorithm: DsaAlgorithm;
  currentLineIndex?: number;
}

export function DsaInfoPanel({ algorithm, currentLineIndex }: DsaInfoPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <Info className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900">Information</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* Description */}
        <div>
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {algorithm.description}
          </p>
        </div>

        {/* Complexity */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
            <div className="flex items-center gap-1.5 text-orange-700 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Time</span>
            </div>
            <div className="text-lg font-mono font-semibold text-orange-900">
              {algorithm.timeComplexity}
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
            <div className="flex items-center gap-1.5 text-emerald-700 mb-1">
              <HardDrive className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Space</span>
            </div>
            <div className="text-lg font-mono font-semibold text-emerald-900">
              {algorithm.spaceComplexity}
            </div>
          </div>
        </div>

        {/* Pseudo Code */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="w-4 h-4 text-gray-500" />
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pseudo Code</h4>
          </div>
          <div className="bg-[#1E1E1E] rounded-xl p-4 overflow-x-auto shadow-inner">
            <div className="font-mono text-sm leading-6">
              {algorithm.pseudoCode.map((line, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "px-2 py-0.5 rounded transition-colors whitespace-pre",
                    currentLineIndex === index 
                      ? "bg-blue-500/20 text-blue-300 border-l-2 border-blue-400" 
                      : "text-gray-400 border-l-2 border-transparent"
                  )}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
