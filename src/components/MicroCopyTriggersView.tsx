import React, { useState } from 'react';
import { MICRO_TRIGGERS } from '../data/steamAuditData';
import { ShieldCheck, Zap, Bookmark, MousePointerClick, RefreshCw, CheckCircle2, TrendingUp } from 'lucide-react';

export const MicroCopyTriggersView: React.FC = () => {
  const [filterCat, setFilterCat] = useState<string>('All');

  const categories = ['All', 'Trust & Proof', 'Scarcity & Urgency', 'Micro-Commitment', 'Action Prompt', 'Risk Neutralizer'];

  const filtered = filterCat === 'All'
    ? MICRO_TRIGGERS
    : MICRO_TRIGGERS.filter(t => t.category === filterCat);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          4. Micro-Copy & High-Velocity Conversion Triggers
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Detailed catalog of the subtle micro-copy, psychological hooks, trust badges, and CTA triggers that drive billions of dollars in game sales.
        </p>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
          {categories.map((c, i) => (
            <button
              key={i}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterCat === c
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Trigger Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    item.category === 'Trust & Proof'
                      ? 'bg-slate-100 text-slate-800 border border-slate-300'
                      : item.category === 'Scarcity & Urgency'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : item.category === 'Micro-Commitment'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : item.category === 'Action Prompt'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Location: {item.placement}</span>
              </div>

              {/* Exact Trigger Copy */}
              <div className="bg-slate-900 text-emerald-300 p-3 rounded-lg font-mono text-xs font-semibold border border-slate-800 tracking-tight">
                "{item.triggerText}"
              </div>

              {/* Psychological mechanism */}
              <div className="mt-3 text-xs text-slate-700">
                <span className="font-semibold text-slate-900 block mb-0.5">Psychological Mechanism:</span>
                <p className="leading-relaxed">{item.psychologicalMechanism}</p>
              </div>
            </div>

            {/* Expected Conversion Impact */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Observed Conversion Lift:</span>
              <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {item.expectedConversionLift}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Button Taxonomy & Color Psychology Deep-Dive */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MousePointerClick className="w-4 h-4 text-emerald-600" />
          CTA Button Anatomy & Chromatic Hierarchy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
            <div className="bg-[#5c7e10] hover:bg-[#6c9313] text-white font-semibold text-xs px-3.5 py-2 rounded shadow-inner text-center w-full mb-3 cursor-pointer">
              Install Fog
            </div>
            <span className="text-xs font-bold text-emerald-400 block mb-1">Primary Tier: High-LTV Installation</span>
            <p className="text-xs text-slate-300">
              Valve reserves the vivid lime-green shade exclusively for downloading the Fog Client. This isolates the platform’s ultimate lifetime value driver from game purchase buttons.
            </p>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
            <div className="bg-gradient-to-r from-slate-200 via-white to-slate-300 text-slate-900 font-semibold text-xs px-3.5 py-2 rounded shadow text-center w-full mb-3 cursor-pointer">
              Add to Cart / Buy Now
            </div>
            <span className="text-xs font-bold text-slate-200 block mb-1">Secondary Tier: Transactional Commits</span>
            <p className="text-xs text-slate-300">
              Cart buttons adopt cool neutral white and grey tones that harmonize with the store’s ambient theme without overpowering gameplay art.
            </p>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
            <div className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs px-3.5 py-2 rounded border border-slate-700 text-center w-full mb-3 cursor-pointer">
              + Add to your Wishlist
            </div>
            <span className="text-xs font-bold text-purple-400 block mb-1">Tertiary Tier: Zero-Friction Hook</span>
            <p className="text-xs text-slate-300">
              Low-contrast neutral gray invites micro-commitments without transaction anxiety, activating the highest ROI re-engagement channel in gaming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
