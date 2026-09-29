import React from 'react';
import { getFeaturesData } from '../../data/landingPageData';
import { Cloud, MonitorPlay, Star, Wrench, ShieldCheck, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FeaturesSectionProps {
  darkMode: boolean;
  onInstallClick: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  darkMode,
}) => {
  const { language, t } = useLanguage();
  const featuresData = getFeaturesData(language);

  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cloud':
        return <Cloud className="w-6 h-6 text-sky-400" />;
      case 'MonitorPlay':
        return <MonitorPlay className="w-6 h-6 text-emerald-400" />;
      case 'Star':
        return <Star className="w-6 h-6 text-amber-400 fill-amber-400/20" />;
      case 'Wrench':
        return <Wrench className="w-6 h-6 text-purple-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-rose-400" />;
      default:
        return <Zap className="w-6 h-6 text-sky-400" />;
    }
  };

  const getMetricTagColor = (iconName: string, isDark: boolean = true) => {
    switch (iconName) {
      case 'Cloud':
        return isDark ? 'bg-sky-950/60 text-sky-400 border-sky-800/70' : 'bg-sky-100 text-sky-900 border-sky-300 font-bold';
      case 'MonitorPlay':
        return isDark ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/70' : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      case 'Star':
        return isDark ? 'bg-amber-950/60 text-amber-400 border-amber-800/70' : 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      case 'Wrench':
        return isDark ? 'bg-purple-950/60 text-purple-400 border-purple-800/70' : 'bg-purple-100 text-purple-900 border-purple-300 font-bold';
      case 'ShieldCheck':
        return isDark ? 'bg-rose-950/60 text-rose-400 border-rose-800/70' : 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
      default:
        return isDark ? 'bg-sky-950/60 text-sky-400 border-sky-800/70' : 'bg-sky-100 text-sky-900 border-sky-300 font-bold';
    }
  };

  return (
    <section id="solutions" className={`py-16 md:py-24 transition-colors ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-black'
    }`}>
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            darkMode ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
          }`}>
            <Zap className="w-3.5 h-3.5" />
            <span>{language === 'pt' ? 'Vantagens do Ecossistema Fog' : 'The Fog Ecosystem Advantage'}</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
            {t.features_title}
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${
            darkMode ? 'text-slate-400' : 'text-slate-700 font-medium'
          }`}>
            {t.features_subtitle}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuresData.map((feature, idx) => (
            <div
              key={feature.id}
              className={`rounded-2xl p-6 border transition-all hover:-translate-y-1 flex flex-col justify-between group ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900 shadow-lg'
                  : 'bg-white border-slate-300 hover:border-slate-400 hover:shadow-xl'
              } ${idx === 0 ? 'lg:col-span-2' : ''}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner group-hover:scale-110 transition-transform ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-200 border-slate-300'
                  }`}>
                    {getFeatureIcon(feature.iconName)}
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getMetricTagColor(feature.iconName, darkMode)}`}>
                    {feature.metricTag}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold uppercase tracking-widest ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {t.features_pillar} 0{idx + 1}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold leading-tight mt-1 ${
                    darkMode ? 'text-white' : 'text-black'
                  }`}>
                    {feature.name}
                  </h3>
                </div>

                {/* Outcome Benefit Highlight (Mandate: Focus on Outcome) */}
                <div className={`p-3 rounded-xl border text-xs font-medium leading-relaxed ${
                  darkMode ? 'bg-slate-950/70 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-300 text-black'
                }`}>
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold block mb-1">
                    {language === 'pt' ? 'Resultado Direto:' : 'Direct Outcome:'}
                  </span>
                  {feature.benefit}
                </div>

                {/* Description */}
                <p className={`text-xs leading-relaxed ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
