import React, { useState, useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  ExternalLink,
  User,
  Mail,
  MessageSquare,
  Sliders,
  CalendarCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface MeetingSchedulerProps {
  darkMode: boolean;
}

export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({ darkMode }) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'calcom' | 'directForm'>('calcom');

  // Custom Cal link configuration - maintaining respo_0/30min as requested
  const [calLink, setCalLink] = useState<string>('respo_0/30min');
  const [isEditingCalLink, setIsEditingCalLink] = useState(false);
  const [tempCalLink, setTempCalLink] = useState('respo_0/30min');

  // Fast Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    meetingType: language === 'pt' ? 'Sessão de Suporte & Demonstração (30 min)' : 'Support & Demo Session (30 min)',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    timeSlot: '14:30',
    notes: '',
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [googleCalendarUrl, setGoogleCalendarUrl] = useState('');

  // Initialize Cal API styling
  useEffect(() => {
    (async function initCal() {
      try {
        const cal = await getCalApi();
        cal('ui', {
          theme: darkMode ? 'dark' : 'light',
          styles: { branding: { brandColor: '#1d1e21' } },
          hideEventTypeDetails: false,
          layout: 'month_view',
        });
      } catch (err) {
        console.warn('Cal.com embed init note:', err);
      }
    })();
  }, [darkMode]);

  const handleFastFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    const startDateTime = new Date(`${formData.date}T${formData.timeSlot}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

    const formatGCalDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const title = encodeURIComponent(
      language === 'pt' ? `Reunião Fog: ${formData.meetingType}` : `Fog Meeting: ${formData.meetingType}`
    );
    const details = encodeURIComponent(
      language === 'pt'
        ? `Agendamento via Cal.com / Google Calendar Sync.\nParticipante: ${formData.name} (${formData.email})\nNotas: ${formData.notes || 'Sem observações.'}\nVideoconferência automática Google Meet incluída.`
        : `Meeting scheduled via Cal.com / Google Calendar Sync.\nParticipant: ${formData.name} (${formData.email})\nNotes: ${formData.notes || 'No extra notes.'}\nAutomatic Google Meet included.`
    );
    const location = encodeURIComponent('Google Meet / Cal.com Virtual Room');
    const dates = `${formatGCalDate(startDateTime)}/${formatGCalDate(endDateTime)}`;

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;

    setGoogleCalendarUrl(gcalUrl);
    setBookingConfirmed(true);
  };

  return (
    <section
      id="agendamento"
      className={`py-16 md:py-24 border-t transition-colors ${
        darkMode
          ? 'bg-slate-950 text-white border-slate-800'
          : 'bg-slate-50 text-slate-900 border-slate-200'
      }`}
    >
      <div className="max-w-6xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            darkMode ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
          }`}>
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>{language === 'pt' ? 'Agendamento Direto & Google Calendar' : 'Direct Booking & Google Calendar'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t.booking_title}
          </h2>
          <p
            className={`text-sm sm:text-base max-w-2xl mx-auto ${
              darkMode ? 'text-slate-400' : 'text-slate-700 font-medium'
            }`}
          >
            {t.booking_subtitle}
          </p>
        </div>

        {/* Integration Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold">
                {language === 'pt' ? 'Sincronização Bidirecional' : 'Two-Way Synchronization'}
              </h4>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'pt'
                  ? 'O Cal.com reflete horários livres e cria o evento direto no Google Calendar.'
                  : 'Cal.com displays real-time slots and creates events directly in Google Calendar.'}
              </p>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold">
                {language === 'pt' ? 'Google Meet Automático' : 'Automated Google Meet'}
              </h4>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'pt'
                  ? 'Link de videoconferência gerado no instante da confirmação sem passos manuais.'
                  : 'Instant video conference link generated at booking confirmation with zero friction.'}
              </p>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 shrink-0 mt-0.5">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold">
                {language === 'pt' ? 'Fuso Horário Inteligente' : 'Smart Timezone Detection'}
              </h4>
              <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'pt'
                  ? 'Deteção automática de fuso horário para prevenir desfasamentos de agenda.'
                  : 'Automatic timezone detection prevents calendar scheduling errors across regions.'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Cal.com link config */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4 max-w-4xl 2xl:max-w-5xl mx-auto ${
          darkMode ? 'border-slate-800' : 'border-slate-300'
        }`}>
          <div className={`flex items-center gap-2 p-1 rounded-xl border ${
            darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-200 border-slate-300'
          }`}>
            <button
              onClick={() => setActiveTab('calcom')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'calcom'
                  ? darkMode
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-black text-white font-bold shadow-sm'
                  : darkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-black hover:text-black font-bold'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.booking_tab_calendar}</span>
            </button>
            <button
              onClick={() => setActiveTab('directForm')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'directForm'
                  ? darkMode
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'bg-black text-white font-bold shadow-sm'
                  : darkMode
                  ? 'text-slate-400 hover:text-white'
                  : 'text-black hover:text-black font-bold'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t.booking_tab_form}</span>
            </button>
          </div>

          {/* Quick Cal Link config */}
          {activeTab === 'calcom' && (
            <div className="flex items-center gap-2 text-xs">
              {isEditingCalLink ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-mono text-[11px]">cal.com/</span>
                  <input
                    type="text"
                    value={tempCalLink}
                    onChange={(e) => setTempCalLink(e.target.value)}
                    placeholder="user/slot"
                    className="px-2 py-1 rounded bg-slate-900 border border-slate-600 text-white text-xs w-40"
                  />
                  <button
                    onClick={() => {
                      if (tempCalLink.trim()) setCalLink(tempCalLink.trim());
                      setIsEditingCalLink(false);
                    }}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold text-[11px]"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingCalLink(true)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] underline cursor-pointer"
                  title="Config link"
                >
                  <Sliders className="w-3 h-3" />
                  <span>Link: cal.com/{calLink}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* VIEW 1: Cal.com Embed */}
        {activeTab === 'calcom' && (
          <div
            className={`rounded-2xl border p-4 sm:p-6 transition-all overflow-hidden ${
              darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}
          >
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {language === 'pt'
                    ? 'Cal.com Embed Ativo — Sincronização Google Calendar Pronta'
                    : 'Cal.com Embed Live — Google Calendar Sync Ready'}
                </span>
              </div>
              <a
                href={`https://cal.com/${calLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white flex items-center gap-1 font-medium underline"
              >
                <span>{t.booking_open_cal}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Cal.com Component */}
            <div className="w-full min-h-[520px] rounded-xl overflow-hidden bg-slate-900/20">
              <Cal
                calLink={calLink}
                style={{ width: '100%', height: '100%', minHeight: '520px', overflow: 'scroll' }}
                config={{ layout: 'month_view' }}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: Fast Form with Direct Google Calendar Sync */}
        {activeTab === 'directForm' && (
          <div className="max-w-2xl mx-auto">
            {bookingConfirmed ? (
              <div
                className={`p-8 rounded-2xl border text-center space-y-5 ${
                  darkMode ? 'bg-slate-900 border-emerald-500/40' : 'bg-white border-emerald-300 shadow-lg'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-emerald-400">
                    {language === 'pt' ? 'Reunião Pronta para Agendamento!' : 'Meeting Ready to Schedule!'}
                  </h3>
                  <p className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {language === 'pt'
                      ? `Os detalhes da reunião com ${formData.name} para o dia ${formData.date} às ${formData.timeSlot} foram preparados.`
                      : `Meeting details for ${formData.name} on ${formData.date} at ${formData.timeSlot} are prepared.`}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-xl text-left text-xs space-y-2 border ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-black'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">{t.booking_subject_label}:</span>
                    <span className="font-bold">{formData.meetingType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">{t.booking_email_label}:</span>
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">
                      {language === 'pt' ? 'Plataforma:' : 'Platform:'}
                    </span>
                    <span className="text-slate-200 font-semibold">Google Meet + Cal.com</span>
                  </div>
                </div>

                {/* Primary Google Calendar Sync Button */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg border border-slate-600 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{language === 'pt' ? 'Adicionar ao Google Calendar' : 'Add to Google Calendar'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => setBookingConfirmed(false)}
                    className="px-4 py-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                  >
                    {language === 'pt' ? 'Marcar Outro Horário' : 'Schedule Another Slot'}
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleFastFormSubmit}
                className={`p-6 sm:p-8 rounded-2xl border space-y-4 ${
                  darkMode ? 'bg-slate-900/60 border-slate-800 text-white' : 'bg-white border-slate-200 shadow-md text-black'
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.booking_name_label}</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={language === 'pt' ? 'Ex: João Silva' : 'e.g. John Doe'}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-black'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.booking_email_label}</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-black'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5">{t.booking_subject_label}</label>
                    <select
                      value={formData.meetingType}
                      onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-black'
                      }`}
                    >
                      <option value={language === 'pt' ? 'Demonstração da Plataforma (15 min)' : 'Platform Demo (15 min)'}>
                        {language === 'pt' ? 'Demonstração (15 min)' : 'Demo (15 min)'}
                      </option>
                      <option value={language === 'pt' ? 'Suporte Técnico Fog Deck (30 min)' : 'Fog Deck Tech Support (30 min)'}>
                        {language === 'pt' ? 'Suporte Fog Deck (30 min)' : 'Fog Deck Support (30 min)'}
                      </option>
                      <option value={language === 'pt' ? 'Dúvidas de Reembolso & Faturação' : 'Refund & Billing Inquiries'}>
                        {language === 'pt' ? 'Reembolsos & Contas' : 'Refunds & Accounts'}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'pt' ? 'Data' : 'Date'}</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-black'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'pt' ? 'Horário' : 'Time'}</span>
                    </label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                      className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                        darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-black'
                      }`}
                    >
                      <option value="10:00">10:00 - 10:30</option>
                      <option value="11:30">11:30 - 12:00</option>
                      <option value="14:30">14:30 - 15:00</option>
                      <option value="16:00">16:00 - 16:30</option>
                      <option value="17:30">17:30 - 18:00</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.booking_message_label}</span>
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={language === 'pt' ? 'Indique brevemente o tema principal...' : 'Briefly describe your topic or question...'}
                    className={`w-full px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-slate-400 ${
                      darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-black'
                    }`}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl ${
                      darkMode
                        ? 'bg-gradient-to-r from-white via-slate-200 to-slate-400 hover:from-slate-100 hover:to-slate-300 text-black border border-white/40'
                        : 'bg-gradient-to-r from-slate-700 via-slate-800 to-black hover:from-slate-600 hover:to-slate-900 text-white border border-slate-900'
                    } text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all`}
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>{t.booking_submit}</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-500 mt-2">
                    {language === 'pt'
                      ? 'Receberá um convite imediato com link do Google Meet e lembrete antes da sessão.'
                      : 'You will receive an immediate calendar invitation with Google Meet link.'}
                  </p>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
