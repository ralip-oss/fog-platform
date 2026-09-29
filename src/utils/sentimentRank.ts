/**
 * Sentiment ranking color system for game reviews and community sentiments.
 * Rank 1: Overwhelmingly Positive / Extremamente Positivas -> Sky Blue
 * Rank 2: Very Positive / Muito Positivas -> Emerald Green
 * Rank 3: Mostly Positive / Positivas -> Teal
 * Rank 4: Mixed / Mistas -> Amber / Warm Yellow
 * Rank 5: Negative / Negativas -> Rose / Coral
 */

export const getSentimentStarClass = (sentiment: string, darkMode: boolean = true): string => {
  if (!sentiment) return darkMode ? 'text-sky-400 fill-sky-400' : 'text-sky-600 fill-sky-500';
  const s = sentiment.toLowerCase();

  // Tier 1: Overwhelmingly Positive
  if (s.includes('overwhelmingly') || s.includes('extremamente') || s.includes('95%') || s.includes('98%') || s.includes('97%')) {
    return darkMode ? 'text-sky-400 fill-sky-400' : 'text-sky-600 fill-sky-500';
  }

  // Tier 2: Very Positive
  if (s.includes('very') || s.includes('muito')) {
    return darkMode ? 'text-emerald-400 fill-emerald-400' : 'text-emerald-600 fill-emerald-500';
  }

  // Tier 3: Mostly Positive / Positive
  if (s.includes('mostly') || s.includes('ligeiramente') || s.includes('positiv')) {
    return darkMode ? 'text-teal-400 fill-teal-400' : 'text-teal-600 fill-teal-500';
  }

  // Tier 4: Mixed
  if (s.includes('mix') || s.includes('mista') || s.includes('neutr')) {
    return darkMode ? 'text-amber-400 fill-amber-400' : 'text-amber-600 fill-amber-500';
  }

  // Tier 5: Negative
  if (s.includes('negativ')) {
    return darkMode ? 'text-rose-400 fill-rose-400' : 'text-rose-600 fill-rose-500';
  }

  return darkMode ? 'text-sky-400 fill-sky-400' : 'text-sky-600 fill-sky-500';
};

export const getSentimentTextClass = (sentiment: string, darkMode: boolean = true): string => {
  if (!sentiment) return darkMode ? 'text-slate-200' : 'text-slate-900';
  const s = sentiment.toLowerCase();

  if (s.includes('overwhelmingly') || s.includes('extremamente')) {
    return darkMode ? 'text-sky-300' : 'text-sky-700';
  }
  if (s.includes('very') || s.includes('muito')) {
    return darkMode ? 'text-emerald-300' : 'text-emerald-700';
  }
  if (s.includes('mostly') || s.includes('ligeiramente') || s.includes('positiv')) {
    return darkMode ? 'text-teal-300' : 'text-teal-700';
  }
  if (s.includes('mix') || s.includes('mista') || s.includes('neutr')) {
    return darkMode ? 'text-amber-300' : 'text-amber-700';
  }
  if (s.includes('negativ')) {
    return darkMode ? 'text-rose-300' : 'text-rose-700';
  }

  return darkMode ? 'text-slate-200' : 'text-slate-900';
};
