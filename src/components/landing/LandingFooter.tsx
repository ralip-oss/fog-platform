import React from 'react';
import { TARGET_URL } from '../../data/steamAuditData';
import { ExternalLink, ShieldCheck, Download, Heart } from 'lucide-react';
import type { LandingSection } from './LandingNavbar';
import { useLanguage } from '../../context/LanguageContext';

interface LandingFooterProps {
  darkMode: boolean;
  onInstallClick: () => void;
  onOpenAudit: () => void;
  onSelectSection?: (section: LandingSection) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  darkMode,
  onInstallClick,
  onOpenAudit,
  onSelectSection,
}) => {
  const { language, t } = useLanguage();

  return (
    <footer className={`border-t py-12 text-xs transition-colors ${
      darkMode ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow border transition-colors ${
              darkMode
                ? 'bg-gradient-to-br from-white via-slate-100 to-slate-300 text-slate-900 border-white/40'
                : 'bg-slate-900 text-white border-slate-800'
            }`}>
              <svg viewBox="0 0 24 24" className={`w-4 h-4 fill-none transition-colors ${darkMode ? 'stroke-slate-900' : 'stroke-white'}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Chimney Logo">
                <path d="M5 21h14" />
                <path d="M6.5 21V11h11v10" />
                <path d="M5 11h14" />
                <path d="M9.5 8c0-1.2 1-1.8 1-3" />
                <path d="M13.5 7c0-1 1-1.5 1-2.5" />
                <line x1="10" y1="15" x2="14" y2="15" strokeWidth="1.5" />
                <line x1="8" y1="18" x2="16" y2="18" strokeWidth="1.5" />
              </svg>
            </div>
            <div>
              <span className={`font-bold text-sm block ${darkMode ? 'text-white' : 'text-black'}`}>
                FOG STORE & GAMING PLATFORM
              </span>
              <span className="text-[11px] text-slate-500">
                Valve Corporation • All trademarks are property of their respective owners.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onInstallClick}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.cta_primary}</span>
            </button>

            <button
              onClick={onOpenAudit}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer border ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700'
                  : 'bg-slate-200 hover:bg-slate-300 text-black border-slate-300'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
              <span>{language === 'pt' ? 'Ver Relatório Auditoria CRO' : 'View Senior CRO Audit Report'}</span>
            </button>
          </div>
        </div>

        {/* Quick App Section Links */}
        <div className={`flex flex-wrap items-center gap-4 text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <span className={`font-semibold ${darkMode ? 'text-slate-400' : 'text-black'}`}>{language === 'pt' ? 'Secções:' : 'Sections:'}</span>
          <button onClick={() => onSelectSection?.('main')} className={`${darkMode ? 'hover:text-white' : 'hover:text-black'} transition-colors cursor-pointer`}>{t.nav_main}</button>
          <span>•</span>
          <button onClick={() => onSelectSection?.('solutions')} className={`${darkMode ? 'hover:text-white' : 'hover:text-black'} transition-colors cursor-pointer`}>{t.nav_solutions}</button>
          <span>•</span>
          <button onClick={() => onSelectSection?.('guarantee')} className={`${darkMode ? 'hover:text-white' : 'hover:text-black'} transition-colors cursor-pointer`}>{t.nav_guarantee}</button>
          <span>•</span>
          <button onClick={() => onSelectSection?.('faq')} className={`${darkMode ? 'hover:text-white' : 'hover:text-black'} transition-colors cursor-pointer`}>{t.nav_faq}</button>
          <span>•</span>
          <button onClick={() => onSelectSection?.('agendamento')} className="hover:text-emerald-400 transition-colors font-semibold text-emerald-400 cursor-pointer">{t.nav_booking} (Cal.com)</button>
        </div>

        {/* Legal & CRO Compliance */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            {language === 'pt'
              ? 'Página otimizada com foco em experiência sem atrito, transparência total e conformidade com a política oficial de reembolso da Valve.'
              : 'Optimized landing experience focusing on zero friction, complete transparency, and official Valve refund compliance.'}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://store.steampowered.com/subscriber_agreement/"
              target="_blank"
              rel="noreferrer"
              className={`${darkMode ? 'hover:text-white' : 'hover:text-black'} flex items-center gap-1`}
            >
              <span>{language === 'pt' ? 'Acordo de Subscrição' : 'Subscriber Agreement'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://store.steampowered.com/privacy_agreement/"
              target="_blank"
              rel="noreferrer"
              className={`${darkMode ? 'hover:text-white' : 'hover:text-black'} flex items-center gap-1`}
            >
              <span>{language === 'pt' ? 'Política de Privacidade' : 'Privacy Policy'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={TARGET_URL}
              target="_blank"
              rel="noreferrer"
              className={`${darkMode ? 'hover:text-white' : 'hover:text-black text-black'} flex items-center gap-1 font-semibold`}
            >
              <span>store.fogpowered.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
