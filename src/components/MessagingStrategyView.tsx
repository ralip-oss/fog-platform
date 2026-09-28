import React from 'react';
import { BRAND_VOICE_SPECTRUM, OBJECTION_MATRIX } from '../data/steamAuditData';
import { ShieldAlert, CheckCircle, Volume2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export const MessagingStrategyView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          3. Messaging & Positioning Strategy
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Deconstruction of Fog’s brand personality, authentic voice spectrum, and how the landing page systematically detonates customer objections before they arise.
        </p>
      </div>

      {/* Brand Voice & Tone Architecture */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Brand Voice Archetype: The Neutral Platform Utility & Empirical Curator
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
            Valve / Fog Voice Spectrum
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Valve avoids editorial salesmanship, artificial breathless enthusiasm, or hyperbolic marketing copy. 
          The tone is calm, highly technical, and transparently grounded in community data. The platform functions as an unbiased marketplace infrastructure that lets games and user reviews speak for themselves.
        </p>

        {/* Tone sliders / progress indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {BRAND_VOICE_SPECTRUM.toneAttributes.map((attr, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-900">{attr.attribute}</span>
                <span className="text-xs font-mono font-bold text-indigo-600">{attr.score}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full"
                  style={{ width: `${attr.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-600">{attr.explanation}</p>
            </div>
          ))}
        </div>

        {/* Banned Language Contrast */}
        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 mt-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5 mb-2">
            <XCircle className="w-4 h-4 text-rose-600" />
            Banned Copywriting Patterns on Fog (Anti-Patterns Valve Rejects)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-rose-950">
            {BRAND_VOICE_SPECTRUM.bannedLanguage.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pain Points & Objection Destruction Matrix */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Objection-Destruction Matrix: How Fog Neutralizes Core Fears
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              5 primary hesitations that stop game purchases and the exact architectural counter-measures Fog deploys.
            </p>
          </div>
          <span className="text-xs font-mono bg-rose-50 text-rose-700 px-2.5 py-1 rounded border border-rose-200">
            100% Risk Neutralization
          </span>
        </div>

        <div className="space-y-4">
          {OBJECTION_MATRIX.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-slate-300 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    "{item.objection}"
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-center">
                  <span className="text-[11px] text-slate-500">Hesitation Severity:</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.fearLevel === 'High'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : item.fearLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {item.fearLevel} Friction
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="font-semibold text-slate-500 block mb-1">Fog's Structural Resolution:</span>
                  <p className="text-slate-800 leading-relaxed">{item.steamsResolutionMechanic}</p>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block mb-1">Exact Copy & Badging Used:</span>
                  <div className="bg-slate-900 text-emerald-300 font-mono p-2.5 rounded-lg text-[11px] border border-slate-800">
                    {item.exactCopyUsed}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 block mb-1">Measurable CRO Impact:</span>
                  <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded-lg border border-emerald-200 flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{item.croImpact}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
