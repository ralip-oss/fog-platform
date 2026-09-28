import React, { useState } from 'react';
import { HEADLINE_FORMULAS } from '../data/steamAuditData';
import { Sparkles, ArrowRight, BookOpen, Clock, LayoutGrid, CheckCheck, RefreshCw } from 'lucide-react';

export const CopywritingFormulasView: React.FC = () => {
  // Interactive formula customization playground
  const [customProduct, setCustomProduct] = useState('My Analytics Tool');
  const [customAudience, setCustomAudience] = useState('Growth Marketers');

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          2. Copywriting Patterns & Persuasion Formulas
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Deconstruction of Valve’s high-velocity conversion copy framework: headline mechanics, core UVP anchors, narrative angles, and syntactic pacing metrics.
        </p>
      </div>

      {/* Primary Hook & Angle Deconstruction */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-6 shadow-sm border border-slate-700">
        <div className="flex items-center gap-2 text-slate-200 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          Primary Hook, Core UVP & Narrative Angle
        </div>
        
        <div className="space-y-4">
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Official Core Value Proposition (UVP):</span>
            <blockquote className="text-lg sm:text-xl font-medium text-emerald-300 border-l-2 border-emerald-400 pl-3 py-1 my-2 italic">
              "Fog is the ultimate destination for playing, discussing, and creating games."
            </blockquote>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
            <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700">
              <span className="text-slate-200 font-bold block mb-1">Pillar 1: The Core Promise</span>
              <p className="text-slate-300">
                <strong>Ubiquitous Frictionless Play:</strong> Any PC game, any time, automatically updated and cloud-synced across desktop and portable hardware.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700">
              <span className="text-amber-300 font-bold block mb-1">Pillar 2: The Social Moat</span>
              <p className="text-slate-300">
                <strong>Discussing & Validating:</strong> Decentralized user reviews, community forums, workshop mods, and friends activity lock users into the network.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-lg p-3.5 border border-slate-700">
              <span className="text-rose-300 font-bold block mb-1">Pillar 3: The Creator Ecosystem</span>
              <p className="text-slate-300">
                <strong>Creating & Modding:</strong> Fog Workshop and Early Access turn consumers into stakeholders and co-creators, multiplying platform lifetime value.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Headline Mechanics Matrix */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Headline Mechanics & Formula Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              How Fog structures high-intent display text across different page tiers.
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded">
            5 Extracted Blueprints
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {HEADLINE_FORMULAS.map((formula, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-indigo-900 bg-indigo-100/70 px-2.5 py-0.5 rounded-full inline-block w-fit">
                  {formula.element}
                </span>
                <span className="text-xs text-slate-500 italic">
                  Formula #{idx + 1}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-semibold text-slate-500 block mb-1">Fog Live Copy Example:</span>
                  <div className="bg-slate-900 text-emerald-300 font-mono p-2.5 rounded-lg border border-slate-800">
                    "{formula.steamExample}"
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block mb-1">Extracted Mathematical Formula:</span>
                  <div className="bg-amber-50 text-amber-950 font-mono p-2.5 rounded-lg border border-amber-200">
                    {formula.abstractFormula}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 text-xs text-slate-700">
                <div>
                  <span className="font-semibold text-slate-900 block mb-0.5">Persuasion Psychology:</span>
                  <p>{formula.persuasionPsychology}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block mb-0.5">SaaS / E-commerce Adaptation:</span>
                  <p className="text-indigo-800 font-medium">"{formula.ecommerceSaaSAdaptation}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Copy Pacing & Formatting Metrics */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-700" />
          Pacing, Syntactic Density & Formatting Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-3xl font-extrabold text-slate-900 block">85% : 15%</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1 block">Visual to Copy Ratio</span>
            <p className="text-xs text-slate-600 mt-2 text-left">
              Fog minimizes body paragraphs. Gameplay video, screenshots, and visual discount tags do 85% of the persuasion; text acts purely as metadata.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-3xl font-extrabold text-slate-900 block">3 - 7 Words</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1 block">Sentence Pacing</span>
            <p className="text-xs text-slate-600 mt-2 text-left">
              Headers and subheads strictly adhere to micro-chunks ("All your Fog games, on the go.", "Featured & Recommended", "Under $10").
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-3xl font-extrabold text-slate-900 block">100% Empiric</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1 block">Social Proof Density</span>
            <p className="text-xs text-slate-600 mt-2 text-left">
              Zero vague testimonials. Every review is quantified: exact percentage score, total review tally, and verified purchase badge.
            </p>
          </div>
        </div>

        {/* Formatting Rules Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700 mt-2 border border-slate-200 rounded-lg">
            <thead className="bg-slate-100 text-slate-900 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-2.5">Structural Element</th>
                <th className="p-2.5">Fog Execution</th>
                <th className="p-2.5">Why It Converts (CRO Rationale)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="p-2.5 font-semibold">Bullet Lists vs Tags</td>
                <td className="p-2.5 font-mono">Pill Badges (e.g. 'Action', 'Co-op', 'Roguelike')</td>
                <td className="p-2.5">Tags require zero vertical scroll and allow instantaneous multi-attribute scanning.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Price Placement</td>
                <td className="p-2.5 font-mono">Stacked Right-Aligned adjacent to CTA</td>
                <td className="p-2.5">User processes value (imagery/tags) first, before encountering the price barrier.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Discount Typography</td>
                <td className="p-2.5 font-mono">Emerald -75% pill + strike-through old price</td>
                <td className="p-2.5">Triggers Kahneman & Tversky's Prospect Theory (savings perceived as instant gain).</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Primary CTA Verb</td>
                <td className="p-2.5 font-mono">Install Fog / Add to Cart / Play Game</td>
                <td className="p-2.5">Direct action verbs describing immediate physical outcome rather than abstract commitment.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
