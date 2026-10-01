import React from 'react';
import { Download, Moon, Sun, ShieldCheck, Menu, X, Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type LandingSection = 'main' | 'solutions' | 'guarantee' | 'faq' | 'proposta' | 'agendamento';

interface LandingNavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenAudit: () => void;
  onInstallClick: () => void;
  currentSection?: LandingSection;
  onSelectSection?: (section: LandingSection) => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  darkMode,
  setDarkMode,
  onOpenAudit,
  onInstallClick,
  currentSection = 'main',
  onSelectSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks: { id: LandingSection; label: string }[] = [
    { id: 'main', label: t.nav_main },
    { id: 'solutions', label: t.nav_solutions },
    { id: 'guarantee', label: t.nav_guarantee },
    { id: 'faq', label: t.nav_faq },
    { id: 'proposta', label: t.nav_proposal },
    { id: 'agendamento', label: t.nav_booking },
  ];

  const handleLinkClick = (sectionId: LandingSection) => {
    if (onSelectSection) {
      onSelectSection(sectionId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md transition-colors border-b ${
      darkMode
        ? 'bg-slate-950/90 border-slate-800/80 text-white'
        : 'bg-white/95 border-slate-200 text-black'
    }`}>
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleLinkClick('main')}
            className="flex items-center gap-2.5 font-bold tracking-tight text-lg group text-left cursor-pointer"
          >
            <div className={`w-9 h-9 rounded-xl shadow-md group-hover:scale-105 transition-all flex items-center justify-center border ${
              darkMode
                ? 'bg-gradient-to-br from-white via-slate-100 to-slate-300 text-slate-900 border-white/40'
                : 'bg-slate-900 text-white border-slate-800'
            }`}>
              <svg viewBox="0 0 24 24" className={`w-5 h-5 fill-none transition-colors ${darkMode ? 'stroke-slate-900' : 'stroke-white'}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Chimney Logo">
                <path d="M5 21h14" />
                <path d="M6.5 21V11h11v10" />
                <path d="M5 11h14" />
                <path d="M9.5 8c0-1.2 1-1.8 1-3" />
                <path d="M13.5 7c0-1 1-1.5 1-2.5" />
                <line x1="10" y1="15" x2="14" y2="15" strokeWidth="1.5" />
                <line x1="8" y1="18" x2="16" y2="18" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`font-extrabold tracking-wider leading-none text-base ${darkMode ? 'text-white' : 'text-black'}`}>FOG</span>
              <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-widest leading-none mt-0.5">The Ultimate Portal</span>
            </div>
          </button>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = currentSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? darkMode
                      ? 'bg-white/15 text-white font-bold border border-white/20 shadow-xs'
                      : 'bg-slate-200 text-black font-bold border border-slate-300 shadow-xs'
                    : darkMode
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher: PT (PT-PT) vs EN */}
          <div className={`flex items-center rounded-lg p-0.5 border text-xs font-semibold ${
            darkMode ? 'bg-slate-900 border-slate-700/70' : 'bg-slate-200 border-slate-300'
          }`}>
            <button
              onClick={() => setLanguage('pt')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                language === 'pt'
                  ? darkMode
                    ? 'bg-white text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800 text-white font-bold shadow-xs'
                  : darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-black'
              }`}
              title="Português (PT-PT)"
            >
              <span>🇵🇹</span>
              <span className="hidden sm:inline">PT</span>
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                language === 'en'
                  ? darkMode
                    ? 'bg-white text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-800 text-white font-bold shadow-xs'
                  : darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-black'
              }`}
              title="English (EN)"
            >
              <span>🇬🇧</span>
              <span className="hidden sm:inline">EN</span>
            </button>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
              darkMode
                ? 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            aria-label="Toggle theme"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Admin link */}
          <a
            href="/admin"
            className={`p-2 rounded-lg text-xs transition-colors cursor-pointer border flex items-center gap-1.5 ${
              darkMode
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-black hover:bg-slate-200'
            }`}
            title="Área de Administração"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="hidden xl:inline text-xs font-bold">Admin</span>
          </a>

          {/* Primary High-Converting CTA Button */}
          <button
            id="navbar-install-button"
            onClick={onInstallClick}
            className="px-3 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md hover:shadow-emerald-500/20 flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap font-bold">{language === 'pt' ? 'Instalar o Fog Agora' : 'Install Fog Now'}</span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors cursor-pointer ${
              darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Open mobile navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 pt-3 pb-5 space-y-3 ${
          darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-slate-50/95 border-slate-200'
        }`}>
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = currentSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? darkMode ? 'bg-white/15 text-white font-bold' : 'bg-slate-200 text-black font-bold'
                      : darkMode
                      ? 'text-slate-200 hover:bg-slate-800'
                      : 'text-slate-700 hover:text-black hover:bg-slate-200'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className={`pt-2 border-t flex items-center justify-between ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <span className={`text-xs font-medium flex items-center gap-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <Languages className="w-3.5 h-3.5 text-sky-400" />
              Idioma / Language:
            </span>
            <div className={`flex items-center gap-1 p-0.5 rounded-lg border ${
              darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300'
            }`}>
              <button
                onClick={() => setLanguage('pt')}
                className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                  language === 'pt'
                    ? darkMode
                      ? 'bg-white text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-800 text-white font-bold shadow-xs'
                    : darkMode ? 'text-slate-400' : 'text-slate-700'
                }`}
              >
                🇵🇹 PT
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs rounded-md font-bold transition-all ${
                  language === 'en'
                    ? darkMode
                      ? 'bg-white text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-800 text-white font-bold shadow-xs'
                    : darkMode ? 'text-slate-400' : 'text-slate-700'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
