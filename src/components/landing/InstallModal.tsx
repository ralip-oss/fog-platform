import React from 'react';
import { X, Download, Monitor, Laptop, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  darkMode,
}) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative transition-all ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-black'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors ${
            darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-black hover:bg-slate-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Download className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-tight">
              {t.install_modal_title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t.install_modal_subtitle}
            </p>
          </div>

          {/* OS Download Options */}
          <div className="space-y-2.5 pt-2">
            <a
              href="https://store.steampowered.com/about/"
              target="_blank"
              rel="noreferrer"
              className="w-full p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 text-left flex items-center justify-between transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="font-bold text-sm text-emerald-200 block">{t.install_modal_windows}</span>
                  <span className="text-[11px] text-slate-400">Windows 10 / 11 (64-bit)</span>
                </div>
              </div>
              <Download className="w-4 h-4 text-emerald-400 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <a
              href="https://store.steampowered.com/about/"
              target="_blank"
              rel="noreferrer"
              className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-left flex items-center justify-between transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-slate-300" />
                <div>
                  <span className="font-bold text-sm text-slate-200 block">{t.install_modal_mac}</span>
                  <span className="text-[11px] text-slate-400">macOS 10.15+ (Intel & Apple Silicon)</span>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <a
              href="https://store.steampowered.com/about/"
              target="_blank"
              rel="noreferrer"
              className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 text-left flex items-center justify-between transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-purple-400" />
                <div>
                  <span className="font-bold text-sm text-slate-200 block">{t.install_modal_linux}</span>
                  <span className="text-[11px] text-slate-400">Ubuntu, Debian, FogOS (.deb / tar)</span>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
            </a>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.install_modal_installer_info}
            </span>
            <button
              onClick={onClose}
              className={`${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'} underline cursor-pointer`}
            >
              {language === 'pt' ? 'Fechar' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
