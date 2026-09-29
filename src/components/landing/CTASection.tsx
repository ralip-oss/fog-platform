import React from 'react';
import { Download, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Gamepad2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface CTASectionProps {
  darkMode: boolean;
  onInstallClick: () => void;
  onExploreClick: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  darkMode,
  onInstallClick,
  onExploreClick,
}) => {
  const { language, t } = useLanguage();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-950 to-slate-900/60 pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-3xl p-8 sm:p-12 md:p-16 border text-center relative overflow-hidden shadow-2xl ${
          darkMode
            ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-slate-800'
            : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border-slate-300'
        }`}>
          {/* Subtle grid background pattern */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            {/* Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'pt' ? 'Junta-te a mais de 35 Milhões de Jogadores' : 'Join Over 35 Million Active Players Right Now'}</span>
            </div>

            {/* Headline */}
            <h2 className={`text-3xl sm:text-5xl font-black tracking-tight leading-tight ${
              darkMode ? 'text-white' : 'text-black'
            }`}>
              {t.cta_title}
            </h2>

            {/* Subhead */}
            <p className={`text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto ${
              darkMode ? 'text-slate-300' : 'text-slate-800'
            }`}>
              {t.cta_subtitle}
            </p>

            {/* CTAs: Primary and Secondary */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Primary Action Button */}
              <button
                id="cta-install-fog-primary"
                onClick={onInstallClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xl hover:shadow-emerald-500/25 flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Download className="w-5 h-5" />
                <span>{t.cta_primary}</span>
              </button>

              {/* Secondary Action Button */}
              <button
                id="cta-explore-catalog-secondary"
                onClick={onExploreClick}
                className={`w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                  darkMode
                    ? 'bg-slate-800/80 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-600'
                    : 'bg-white hover:bg-slate-50 text-black border-slate-300 hover:border-slate-400'
                }`}
              >
                <span>{t.hero_secondary_cta}</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </button>
            </div>

            {/* Guarantees list */}
            <div className={`pt-4 flex flex-wrap items-center justify-center gap-6 text-xs ${
              darkMode ? 'text-slate-400' : 'text-slate-700 font-medium'
            }`}>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {t.cta_badge_free}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className={`w-4 h-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} />
                {t.cta_badge_refund}
              </span>
              <span className="flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-sky-400" />
                {t.cta_badge_crossplay}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
