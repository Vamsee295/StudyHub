import React from 'react';
import { Layers, Search, SortAsc, GitMerge } from 'lucide-react';
import { DSA_ALGORITHMS, DsaAlgorithm } from '@/lib/services/tools/dsaAlgorithms';
import { cn } from '@/lib/utils';

interface DsaAlgorithmSidebarProps {
  selectedAlgorithm: DsaAlgorithm;
  onSelectAlgorithm: (alg: DsaAlgorithm) => void;
}

export function DsaAlgorithmSidebar({ selectedAlgorithm, onSelectAlgorithm }: DsaAlgorithmSidebarProps) {
  const categories = Array.from(new Set(DSA_ALGORITHMS.map(a => a.category)));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sorting': return <SortAsc className="w-4 h-4 text-accent" />;
      case 'Searching': return <Search className="w-4 h-4 text-note" />;
      default: return <Layers className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <div className="bg-card rounded-2xl border-[1.5px] border-hair flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-hair flex items-center gap-2">
        <GitMerge className="w-5 h-5 text-accent-ink" />
        <h3 className="font-semibold text-ink">Algorithms</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {categories.map(category => (
          <div key={category}>
            <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
              {getCategoryIcon(category)}
              <h4 className="text-xs font-bold text-mute uppercase tracking-wider">{category}</h4>
            </div>
            <div className="space-y-1">
              {DSA_ALGORITHMS.filter(a => a.category === category).map(alg => (
                <button
                  key={alg.id}
                  onClick={() => onSelectAlgorithm(alg)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors border",
                    selectedAlgorithm.id === alg.id
                      ? "bg-accent-soft border-accent-line text-accent-ink"
                      : "bg-transparent border-transparent text-body hover:bg-card-2 hover:border-hair"
                  )}
                >
                  {alg.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
