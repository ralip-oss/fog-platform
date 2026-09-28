import React, { useState } from 'react';
import { getPersonasData } from '../../data/landingPageData';
import { Cpu, Gamepad2, Sparkles, Frown, CheckCircle2, Quote, Shield } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface TargetAudienceSectionProps {
  darkMode: boolean;
  onInstallClick: () => void;
}

export const TargetAudienceSection: React.FC<TargetAudienceSectionProps> = ({
  darkMode,
}) => {
  const { language, t } = useLanguage();
  const personasData = getPersonasData(language);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>(personasData[0].id);

  const getPersonaIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-slate-200" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6 text-emerald-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-400" />;
      default:
        return <Gamepad2 className="w-6 h-6 text-slate-200" />;
    }
  };

  return (
    <section id="audience" className={`py-16 md:py-24 border-t transition-colors ${
      darkMode ? 'bg-slate-900/50 border-slate-800/80' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
            <Shield className="w-3.5 h-3.5" />
            <span>{language === 'pt' ? 'Para o Teu Estilo de Jogo' : 'Tailored For Your Gaming Lifestyle'}</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${
            darkMode ? 'text-white' : 'text-black'
          }`}>
            {t.audience_title}
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {t.audience_subtitle}
          </p>
        </div>

        {/* 3 Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personasData.map((persona) => {
            const isSelected = selectedPersonaId === persona.id;
            return (
              <div
                key={persona.id}
                onClick={() => setSelectedPersonaId(persona.id)}
                className={`rounded-2xl p-6 transition-all cursor-pointer border flex flex-col justify-between ${
                  isSelected
                    ? darkMode
                      ? 'bg-slate-800/90 border-slate-400 shadow-xl ring-1 ring-white/30 -translate-y-1'
                      : 'bg-white border-slate-700 shadow-xl ring-1 ring-slate-400/30 -translate-y-1'
                    : darkMode
                    ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="space-y-4">
                  {/* Persona Header & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner">
                      {getPersonaIcon(persona.iconName)}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {persona.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className={`text-base font-bold leading-tight ${
                      darkMode ? 'text-white' : 'text-black'
                    }`}>
                      {persona.role}
                    </h3>
                    <p className={`text-xs mt-1 leading-normal ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {persona.tagline}
                    </p>
                  </div>

                  {/* Frustration vs Desired Outcome */}
                  <div className="space-y-3 pt-2">
                    {/* Key Frustration */}
                    <div className={`p-3 rounded-xl border text-xs ${
                      darkMode ? 'bg-rose-950/20 border-rose-900/40 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-400">
                        <Frown className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.audience_key_frustration}</span>
                      </div>
                      <p className="leading-relaxed opacity-90">{persona.keyFrustration}</p>
                    </div>

                    {/* Desired Outcome */}
                    <div className={`p-3 rounded-xl border text-xs ${
                      darkMode ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold mb-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.audience_desired_outcome}</span>
                      </div>
                      <p className="leading-relaxed opacity-90">{persona.desiredOutcome}</p>
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  <div className="pt-2 text-xs italic text-slate-400 flex gap-2">
                    <Quote className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span>"{persona.heroQuote}"</span>
                  </div>
                </div>

                {/* Steam Solution Footer */}
                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${darkMode ? 'text-slate-200' : 'text-black'}`}>
                    {t.audience_steam_solution}
                  </span>
                  <p className={`text-xs font-medium ${darkMode ? 'text-slate-300' : 'text-black'}`}>
                    {persona.steamSolution}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-emerald-400">{persona.statsHighlight}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
