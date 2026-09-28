import React, { useState } from 'react';
import { getFaqItems, getFaqCategories } from '../../data/faqData';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FAQSectionProps {
  darkMode: boolean;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ darkMode }) => {
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const categories = getFaqCategories(language);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  // When language switches, ensure selected category resets to all
  const allCategoryLabel = categories[0];
  const activeCategory = categories.includes(selectedCategory as any) ? selectedCategory : allCategoryLabel;

  const faqItems = getFaqItems(language);

  const filteredFaqs = faqItems.filter((item) => {
    const matchesCategory = activeCategory === allCategoryLabel || item.category === activeCategory;
    const matchesSearch =
      !searchTerm.trim() ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className={`py-16 md:py-24 border-t transition-colors ${
      darkMode ? 'bg-slate-950 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'
    }`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{language === 'pt' ? 'Respostas Transparentes & Sem Complicações' : 'Transparent & Frictionless Answers'}</span>
          </div>
          <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-black'}`}>
            {t.faq_title}
          </h2>
          <p className={`text-sm sm:text-base max-w-2xl mx-auto ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {t.faq_subtitle}
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.faq_search_placeholder}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all ${
                darkMode
                  ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-slate-50 border-slate-300 text-black placeholder-slate-400'
              }`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? darkMode
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-black text-white font-bold shadow-md'
                    : darkMode
                    ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    : 'bg-slate-100 text-slate-700 hover:text-black border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-center text-[11px] text-slate-400">
            <span>{filteredFaqs.length} {t.faq_questions_found}</span>
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? darkMode
                        ? 'bg-slate-900/90 border-slate-600 shadow-lg ring-1 ring-white/10'
                        : 'bg-white border-slate-400 shadow-md ring-1 ring-slate-400/20'
                      : darkMode
                      ? 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                      : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <h3 className={`text-sm sm:text-base font-bold ${
                        isExpanded ? (darkMode ? 'text-white' : 'text-black') : (darkMode ? 'text-white' : 'text-black')
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                    <div className="shrink-0 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1">
                      <p className={darkMode ? 'text-slate-300' : 'text-black'}>
                        {faq.answer}
                      </p>
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/40">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                          {faq.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 space-y-3">
              <p className="text-sm text-slate-400">{t.faq_no_results}</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(allCategoryLabel);
                }}
                className="text-xs text-slate-300 hover:text-white underline font-bold cursor-pointer"
              >
                {t.faq_clear_filter}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
