import React, { useState } from 'react';
import { SECTIONS_DATA } from '../data/steamAuditData';
import { Layout, Eye, ArrowDown, Check, ArrowRight, Layers, Sparkles } from 'lucide-react';

export const BlueprintReplicatorView: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState(SECTIONS_DATA[2]); // default to hero

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          5. Replicable Landing Page Blueprint & Visual Wireframe
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Interactive anatomical schematic of Fog’s high-converting layout. Click any layout tier below to inspect its cognitive eye-flow and adaptation rules.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Page Wireframe Stack */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Page Visual Hierarchy Stack</span>
            <span>Eye-Flow Order (1 → 13)</span>
          </div>

          <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 space-y-2 shadow-inner">
            {SECTIONS_DATA.map((section) => {
              const isSelected = selectedBlock.id === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setSelectedBlock(section)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-center justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/70 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded bg-slate-900 text-slate-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 border border-slate-700">
                      {section.order}
                    </span>
                    <span className="font-semibold truncate">{section.name}</span>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                      section.category === 'hero'
                        ? 'bg-amber-900/60 text-amber-300'
                        : section.category === 'urgency'
                        ? 'bg-rose-900/60 text-rose-300'
                        : section.category === 'social_proof'
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {section.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Block Inspector & Adaptation Guide */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Block #{selectedBlock.order} — {selectedBlock.category.toUpperCase()}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {selectedBlock.name}
                </h3>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">Selected in Wireframe</span>
            </div>

            {/* Cognitive Purpose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Functional Directive:</span>
                <p className="text-slate-700">{selectedBlock.functionalGoal}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Primary Emotional Trigger:</span>
                <p className="text-slate-700">{selectedBlock.primaryEmotionalDriver}</p>
              </div>
            </div>

            {/* Transcribed Copy Preview */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Exact Transcribed Content on Fog:
              </span>
              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-xs space-y-1 border border-slate-800">
                {selectedBlock.rawCopyTranscribed.map((line, lIdx) => (
                  <div key={lIdx} className="text-emerald-300">
                    › {line}
                  </div>
                ))}
              </div>
            </div>

            {/* CRO Replication Blueprint */}
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 space-y-2 text-xs">
              <span className="font-bold text-emerald-950 uppercase tracking-wider block flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                How to Replicate This in Any Offer (SaaS / E-commerce / Courses)
              </span>
              <p className="text-emerald-900">
                <strong>Architectural Law:</strong> {selectedBlock.replicationBlueprint.rule}
              </p>
              <p className="text-emerald-900">
                <strong>Implementation:</strong> {selectedBlock.replicationBlueprint.howToApply}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="text-emerald-800 font-semibold">Success Metric:</span>
                <span className="bg-white px-2 py-0.5 rounded text-emerald-800 border border-emerald-300 font-mono font-bold">
                  {selectedBlock.replicationBlueprint.keyMetricToWatch}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
