import React, { useState } from 'react';
import { SectionItem } from '../types';
import { SECTIONS_DATA } from '../data/steamAuditData';
import { CheckCircle2, ChevronDown, ChevronUp, Compass, Heart, Lightbulb, Shield, Tag, Zap } from 'lucide-react';

export const SectionMappingView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedSection, setExpandedSection] = useState<string | null>(SECTIONS_DATA[0].id);

  const categories = [
    { id: 'all', label: 'All 13 Sections' },
    { id: 'header', label: 'Header & Navigation' },
    { id: 'hero', label: 'Hero & Discovery' },
    { id: 'urgency', label: 'Urgency & Deals' },
    { id: 'algorithmic', label: 'Algorithmic Feeds' },
    { id: 'social_proof', label: 'Social Proof & Curators' },
    { id: 'hardware', label: 'Hardware Anchor' },
    { id: 'risk_reversal', label: 'Risk Reversal & Policies' }
  ];

  const filteredSections = activeCategory === 'all'
    ? SECTIONS_DATA
    : SECTIONS_DATA.filter(s => s.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Intro Context Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              1. Full Content & Section-by-Section Mapping
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Deconstructed in order of visual appearance on <code className="text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono">store.fogpowered.com</code>.
              Each section is analyzed for its raw copy transcription, functional goal, primary emotional driver, and behavioral conversion mechanics.
            </p>
          </div>
          <div className="flex items-center gap-1.5 self-start sm:self-center text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>{filteredSections.length} of {SECTIONS_DATA.length} sections displayed</span>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section List */}
      <div className="space-y-4">
        {filteredSections.map((section) => {
          const isExpanded = expandedSection === section.id;
          return (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
            >
              {/* Header bar of Section Card */}
              <button
                onClick={() => toggleExpand(section.id)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {section.order}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      {section.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                        <Compass className="w-3 h-3" />
                        Goal: {section.functionalGoal.split('.')[0]}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <Heart className="w-3 h-3" />
                        Driver: {section.primaryEmotionalDriver.split('(')[0].trim()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 shrink-0">
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    {isExpanded ? 'Collapse analysis' : 'Expand full analysis'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-600" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 space-y-5">
                  {/* Raw Transcribed Copy */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      Extracted & Transcribed Raw Copy
                    </h4>
                    <div className="bg-slate-900 text-slate-200 rounded-lg p-3.5 text-xs font-mono space-y-1.5 overflow-x-auto border border-slate-800">
                      {section.rawCopyTranscribed.map((line, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-slate-600 select-none">{idx + 1}.</span>
                          <span className="text-emerald-300 font-medium">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dual Grid: Functional Goal & Primary Emotional Driver */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-100/80 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider mb-1.5">
                        <Compass className="w-4 h-4 text-slate-700" />
                        Functional Goal
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {section.functionalGoal}
                      </p>
                    </div>

                    <div className="bg-rose-50/60 rounded-lg p-4 border border-rose-100">
                      <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider mb-1.5">
                        <Heart className="w-4 h-4 text-rose-600" />
                        Primary Emotional Driver
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {section.primaryEmotionalDriver}
                      </p>
                    </div>
                  </div>

                  {/* Persuasion Tactics & Cognitive Biases */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Persuasion & Conversion Tactics
                      </h4>
                      <ul className="space-y-2">
                        {section.persuasionTactics.map((tactic, tIdx) => (
                          <li key={tIdx} className="text-xs text-slate-700 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>{tactic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-indigo-500" />
                        Cognitive Biases Harnesses & Friction Removers
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {section.cognitiveBiases.map((bias, bIdx) => (
                          <span
                            key={bIdx}
                            className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                          >
                            {bias}
                          </span>
                        ))}
                      </div>
                      <ul className="space-y-1.5">
                        {section.conversionFrictionRemovers.map((remover, rIdx) => (
                          <li key={rIdx} className="text-xs text-slate-600 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{remover}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Blueprint Replication Card */}
                  <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-200/80">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider mb-2">
                      <Lightbulb className="w-4 h-4 text-emerald-700" />
                      How to Replicate This Blueprint in Your Product
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-slate-900 block mb-0.5">Architectural Rule:</span>
                        <p className="text-slate-700">{section.replicationBlueprint.rule}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block mb-0.5">Practical Application:</span>
                        <p className="text-slate-700">{section.replicationBlueprint.howToApply}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block mb-0.5">Metric to Track:</span>
                        <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-medium text-[11px]">
                          {section.replicationBlueprint.keyMetricToWatch}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
