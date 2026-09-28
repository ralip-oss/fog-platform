import React, { useState } from 'react';
import { ExternalLink, Copy, Check, FileDown, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import { AUDIT_METADATA, TARGET_URL } from '../data/steamAuditData';

interface HeaderProps {
  onExportMarkdown: () => void;
  copied: boolean;
  darkMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onExportMarkdown, copied, darkMode = true }) => {
  return (
    <header className={`border-b sticky top-0 z-40 shadow-md transition-colors ${
      darkMode ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-black border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Senior CRO Strategist Audit
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                Live URL Analyzed
              </span>
            </div>
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 ${
              darkMode ? 'text-white' : 'text-black'
            }`}>
              Fog Storefront: CRO Architecture & Copywriting Deconstruction
            </h1>
            <p className={`text-xs sm:text-sm mt-0.5 flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Target Link:{' '}
              <a
                href={TARGET_URL}
                target="_blank"
                rel="noreferrer"
                className={`underline inline-flex items-center gap-1 font-mono ${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-black'}`}
              >
                {TARGET_URL}
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:inline text-slate-400">{AUDIT_METADATA.globalMonthlyVisits}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="export-markdown-btn"
              onClick={onExportMarkdown}
              className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              title="Copy the complete Senior CRO Markdown blueprint report to your clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-100" />
                  <span>Copied Blueprint!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Full Markdown Blueprint</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Audit Metrics Bar */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t text-xs ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <div className={`w-6 h-6 rounded flex items-center justify-center ${darkMode ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-black'}`}>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>13 Sections</span>
              <span className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} ml-1`}>Mnemonic Stack</span>
            </div>
          </div>

          <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <div className={`w-6 h-6 rounded flex items-center justify-center ${darkMode ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-amber-600'}`}>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>5 Formulas</span>
              <span className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} ml-1`}>Copywriting Models</span>
            </div>
          </div>

          <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <div className={`w-6 h-6 rounded flex items-center justify-center ${darkMode ? 'bg-slate-800 text-rose-400' : 'bg-slate-100 text-rose-600'}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>5 Objections</span>
              <span className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} ml-1`}>Friction Neutralized</span>
            </div>
          </div>

          <div className={`flex items-center gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            <div className={`w-6 h-6 rounded flex items-center justify-center ${darkMode ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-emerald-600'}`}>
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className={`font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>8 Micro-Triggers</span>
              <span className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} ml-1`}>Psychological Levers</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
