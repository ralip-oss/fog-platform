import React, { useState } from 'react';
import { getShowcaseGames } from '../../data/landingPageData';
import { Star, MonitorCheck, Flame } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface InteractiveShowcaseProps {
  darkMode: boolean;
  onInstallClick: () => void;
}

export const InteractiveShowcase: React.FC<InteractiveShowcaseProps> = ({
  darkMode,
  onInstallClick,
}) => {
  const { language, t } = useLanguage();
  const showcaseGames = getShowcaseGames(language);
  const [filter, setFilter] = useState<'all' | 'verified' | 'discounts'>('all');

  const filteredGames = showcaseGames.filter((g) => {
    if (filter === 'verified') return g.deckVerified;
    if (filter === 'discounts') return parseInt(g.discount.replace('-', '').replace('%', '')) >= 20;
    return true;
  });

  return (
    <section id="showcase" className={`py-16 md:py-24 transition-colors ${
      darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'pt' ? 'Catálogo em Destaque da Loja Fog' : 'Live Fog Store Catalog Spotlight'}</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
              {t.showcase_title}
            </h2>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.showcase_subtitle}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? darkMode
                    ? 'bg-slate-800 text-white border border-slate-600 shadow-xs'
                    : 'bg-slate-200 text-black border border-slate-400 shadow-xs'
                  : darkMode
                  ? 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                  : 'bg-slate-100 text-slate-600 hover:text-black border border-slate-200'
              }`}
            >
              {t.showcase_all}
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'verified'
                  ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.showcase_deck_verified}
            </button>
            <button
              onClick={() => setFilter('discounts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'discounts'
                  ? 'bg-slate-800 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.showcase_specials}
            </button>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className={`rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 ${
                darkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md hover:shadow-xl'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                <img
                  src={game.imageThumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-sm">
                    {game.tag}
                  </span>
                  {game.deckVerified && (
                    <span className="bg-slate-900/90 text-emerald-400 font-semibold text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 shadow-sm">
                      <MonitorCheck className="w-3 h-3" />
                      Deck
                    </span>
                  )}
                </div>
              </div>

              {/* Game Content */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className={`font-bold text-sm leading-snug line-clamp-1 ${
                    darkMode ? 'text-white' : 'text-black'
                  }`}>
                    {game.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {game.genre}
                  </p>
                </div>

                {/* Rating Info */}
                <div className="flex items-center gap-1.5 text-xs">
                  <Star className="w-3.5 h-3.5 fill-slate-200 text-slate-200 shrink-0" />
                  <span className={`font-semibold text-[11px] ${darkMode ? 'text-slate-200' : 'text-black'}`}>
                    {game.reviewSentiment}
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    ({game.reviewPercentage}%)
                  </span>
                </div>

                {/* Pricing Capsule & Action */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 text-slate-950 font-black text-xs px-1.5 py-0.5 rounded font-mono">
                      {game.discount}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[10px] line-through text-slate-500 font-mono leading-none">
                        {game.originalPrice}
                      </span>
                      <span className="text-sm font-black text-emerald-400 font-mono leading-tight">
                        {game.salePrice}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onInstallClick}
                    className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                      darkMode
                        ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                        : 'bg-slate-100 hover:bg-slate-200 text-black border-slate-300'
                    }`}
                    title={t.showcase_buy_now}
                  >
                    <span className="text-xs font-bold px-1">{t.showcase_buy_now}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
