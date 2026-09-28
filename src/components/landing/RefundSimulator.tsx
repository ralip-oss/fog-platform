import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, Calendar, AlertCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface RefundSimulatorProps {
  darkMode: boolean;
  onInstallClick: () => void;
}

export const RefundSimulator: React.FC<RefundSimulatorProps> = ({
  darkMode,
  onInstallClick,
}) => {
  const { language, t } = useLanguage();
  const [daysElapsed, setDaysElapsed] = useState<number>(5);
  const [hoursPlayed, setHoursPlayed] = useState<number>(1.1);

  const isEligible = daysElapsed <= 14 && hoursPlayed <= 2.0;

  return (
    <section id="guarantee" className={`py-16 md:py-24 border-y transition-colors ${
      darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'pt' ? 'Política de Reembolso Sem Risco' : 'Ironclad Risk Reversal Policy'}</span>
            </div>
            <h2 className={`text-2xl sm:text-4xl font-black tracking-tight ${
              darkMode ? 'text-white' : 'text-black'
            }`}>
              {t.simulator_title}
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {t.simulator_subtitle}
            </p>
          </div>

          {/* Interactive Calculator Box */}
          <div className={`rounded-2xl p-6 sm:p-8 border shadow-xl transition-all ${
            darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-300'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Sliders */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-4 h-4 text-slate-300" />
                      {t.simulator_days_since}:
                    </span>
                    <span className={`font-mono text-sm font-extrabold ${darkMode ? 'text-slate-200' : 'text-black'}`}>
                      {daysElapsed} {daysElapsed === 1 ? (language === 'pt' ? 'Dia' : 'Day') : (language === 'pt' ? 'Dias' : 'Days')} ({language === 'pt' ? 'Máx: 14' : 'Max: 14'})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="21"
                    value={daysElapsed}
                    onChange={(e) => setDaysElapsed(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-300"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>1 {language === 'pt' ? 'Dia' : 'Day'}</span>
                    <span className="text-emerald-400 font-bold">14 {language === 'pt' ? 'Dias (Limite)' : 'Days (Limit)'}</span>
                    <span>21 {language === 'pt' ? 'Dias' : 'Days'}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-2">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      {t.simulator_hours_played}:
                    </span>
                    <span className="font-mono text-sm font-extrabold text-emerald-400">
                      {hoursPlayed.toFixed(1)} {language === 'pt' ? 'Horas' : 'Hours'} ({language === 'pt' ? 'Máx: 2.0h' : 'Max: 2.0h'})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={hoursPlayed}
                    onChange={(e) => setHoursPlayed(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>0.0h</span>
                    <span className="text-emerald-400 font-bold">2.0h ({language === 'pt' ? 'Limite Automático' : 'Auto Limit'})</span>
                    <span>5.0h</span>
                  </div>
                </div>

                {/* Rules Checklist */}
                <div className="pt-2 space-y-1.5 text-xs text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${daysElapsed <= 14 ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={daysElapsed <= 14 ? (darkMode ? 'text-slate-200' : 'text-black') : 'line-through text-slate-500'}>
                      {t.simulator_rule_2}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${hoursPlayed <= 2.0 ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={hoursPlayed <= 2.0 ? (darkMode ? 'text-slate-200' : 'text-black') : 'line-through text-slate-500'}>
                      {t.simulator_rule_1}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Outcome Card */}
              <div className={`p-6 rounded-2xl border text-center space-y-4 flex flex-col justify-center items-center transition-all ${
                isEligible
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  isEligible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {isEligible ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                </div>

                <div>
                  <span className="text-xs uppercase font-mono font-bold tracking-widest block text-slate-400 mb-1">
                    {language === 'pt' ? 'Resultado do Diagnóstico' : 'Diagnostic Outcome'}
                  </span>
                  <h3 className="text-lg font-black leading-tight">
                    {isEligible ? t.simulator_status_approved : t.simulator_status_manual}
                  </h3>
                  <p className="text-xs mt-2 text-slate-300 leading-relaxed max-w-xs">
                    {isEligible ? t.simulator_eligible_msg : t.simulator_ineligible_msg}
                  </p>
                </div>

                <button
                  onClick={onInstallClick}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{t.nav_install}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
