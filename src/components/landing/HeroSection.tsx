import React, { useState } from 'react';
import { Download, ArrowRight, ShieldCheck, CheckCircle2, Star, MonitorCheck, Gamepad2 } from 'lucide-react';
import { getHeroData, getShowcaseGames } from '../../data/landingPageData';
import { useLanguage } from '../../context/LanguageContext';

interface HeroSectionProps {
  darkMode: boolean;
  onInstallClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  darkMode,
  onInstallClick,
  onExploreClick
}) => {
  const { language, t } = useLanguage();
  const heroData = getHeroData(language);
  const showcaseGames = getShowcaseGames(language);

  const [activeGameIndex, setActiveGameIndex] = useState(0);
  const activeGame = showcaseGames[activeGameIndex] || showcaseGames[0];

  return (
    <section id="problem" className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-white/10 via-slate-400/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Core Pain Point / Problem Statement Alert Banner */}
        <div className="max-w-3xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            darkMode
              ? 'bg-rose-950/40 text-rose-300 border-rose-800/60 shadow-inner'
              : 'bg-rose-50 text-rose-800 border-rose-200 shadow-xs'
          }`}>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <span className="font-bold">{t.hero_problem_tag}</span>
            <span>{heroData.problemStatement}</span>
          </div>
        </div>

        {/* Hero Copy: Strictly respecting Word Limits */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          {/* Main Headline: Exactly 9 words */}
          <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] ${
            darkMode ? 'text-white' : 'text-black'
          }`}>
            {heroData.headline}
          </h1>

          {/* Subheadline: Resonates emotionally with clear value */}
          <p className={`text-base sm:text-xl font-normal leading-relaxed max-w-3xl mx-auto ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {heroData.subheadline}
          </p>

          {/* Primary & Secondary Call To Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Primary CTA */}
            <button
              onClick={onInstallClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Download className="w-5 h-5" />
              <span>{heroData.primaryCtaText}</span>
            </button>

            {/* Secondary CTA */}
            <button
              onClick={onExploreClick}
              className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                darkMode
                  ? 'bg-slate-800/80 hover:bg-slate-800 text-white border-slate-700 hover:border-slate-600'
                  : 'bg-white hover:bg-slate-50 text-black border-slate-300 hover:border-slate-400'
              }`}
            >
              <span>{heroData.secondaryCtaText}</span>
              <ArrowRight className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          {/* Friction-Free Reassurance Tags */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {t.cta_badge_free}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-300" />
              {t.cta_badge_refund}
            </span>
            <span className="flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              {t.cta_badge_crossplay}
            </span>
          </div>
        </div>

        {/* Live Platform Metric Bar */}
        <div className={`max-w-4xl mx-auto rounded-2xl p-4 sm:p-5 border transition-all ${
          darkMode
            ? 'bg-slate-900/90 border-slate-800 shadow-xl'
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x-0 sm:divide-x divide-slate-800/50">
            {heroData.stats.map((stat, i) => (
              <div key={i} className="px-2">
                <span className={`text-xl sm:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text block font-mono ${
                  darkMode
                    ? 'bg-gradient-to-r from-white via-slate-200 to-slate-400'
                    : 'bg-gradient-to-r from-slate-700 via-slate-800 to-black'
                }`}>
                  {stat.value}
                </span>
                <span className="text-xs text-slate-400 font-medium block mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Live Hero Showcase Capsule */}
        <div className="max-w-5xl mx-auto pt-4">
          <div className={`rounded-2xl border overflow-hidden shadow-2xl transition-all ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
          }`}>
            {/* Window bar */}
            <div className={`px-4 py-2.5 border-b flex items-center justify-between text-xs font-mono ${
              darkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className={`ml-2 font-semibold uppercase ${darkMode ? 'text-slate-300' : 'text-black'}`}>
                  {language === 'pt' ? 'Destaque ao Vivo • Loja Oficial' : 'Featured Spotlight • Live Store'}
                </span>
              </div>
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                {language === 'pt' ? 'Ofertas Especiais Ativas' : 'Special Offers Active'}
              </span>
            </div>

            {/* Game Showcase Capsule Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Media Preview Box */}
              <div className="lg:col-span-8 relative group overflow-hidden bg-slate-950 aspect-video flex items-center justify-center">
                <img
                  src={activeGame.imageThumbnail}
                  alt={activeGame.title}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded shadow">
                    {activeGame.tag}
                  </span>
                  {activeGame.deckVerified && (
                    <span className="bg-slate-900/90 text-emerald-400 font-semibold text-xs px-2.5 py-1 rounded border border-emerald-500/40 flex items-center gap-1">
                      <MonitorCheck className="w-3.5 h-3.5" />
                      {t.hero_verified}
                    </span>
                  )}
                </div>

                {/* Bottom Game Title on Image */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-black text-white drop-shadow">
                      {activeGame.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium drop-shadow">
                      {activeGame.genre}
                    </p>
                  </div>
                </div>
              </div>

              {/* Game Info & Price Action Sidebar */}
              <div className={`lg:col-span-4 p-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l ${
                darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {language === 'pt' ? 'Opinião da Comunidade' : 'Community Sentiment'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold flex items-center gap-1 ${darkMode ? 'text-slate-200' : 'text-black'}`}>
                        <Star className="w-3.5 h-3.5 fill-slate-200 text-slate-200" />
                        {activeGame.reviewSentiment}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({activeGame.reviewPercentage}% de {activeGame.totalReviews} {t.showcase_reviews})
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {language === 'pt' ? 'Preço & Desconto' : 'Price & Discount'}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-500 text-slate-950 font-black text-sm px-2 py-0.5 rounded font-mono">
                        {activeGame.discount}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs line-through text-slate-500 font-mono">
                          {activeGame.originalPrice}
                        </span>
                        <span className="text-xl font-black text-emerald-400 font-mono">
                          {activeGame.salePrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onInstallClick}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md border ${
                        darkMode
                          ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      <span>{t.showcase_buy_now}</span>
                    </button>
                  </div>
                </div>

                {/* Thumbnails switcher */}
                <div className="pt-4 border-t border-slate-800/60 mt-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    {language === 'pt' ? 'Outros Títulos em Destaque' : 'Other Featured Games'}
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {showcaseGames.map((game, idx) => (
                      <button
                        key={game.id}
                        onClick={() => setActiveGameIndex(idx)}
                        className={`aspect-video rounded-md overflow-hidden border-2 transition-all cursor-pointer relative ${
                          activeGameIndex === idx
                            ? 'border-white scale-105 shadow-md'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        title={game.title}
                      >
                        <img
                          src={game.imageThumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
