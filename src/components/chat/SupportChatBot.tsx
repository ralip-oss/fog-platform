import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  Wrench,
  Calendar,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { searchTroubleshootingGuide, TroubleshootingEntry } from '../../data/internalTroubleshootingGuide';
import { getFaqItems } from '../../data/faqData';
import { useLanguage } from '../../context/LanguageContext';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  troubleshootingData?: TroubleshootingEntry | null;
  faqMatch?: { question: string; answer: string; category: string } | null;
  actionButton?: {
    label: string;
    href: string;
  };
}

interface SupportChatBotProps {
  darkMode: boolean;
  onNavigateToSection?: (sectionId: string) => void;
}

export const SupportChatBot: React.FC<SupportChatBotProps> = ({
  darkMode,
  onNavigateToSection,
}) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: language === 'pt'
        ? 'Olá! Sou o Fogger. Como posso ajudar hoje? Pode colocar uma dúvida direta, relatar um problema técnico ou agendar uma reunião.'
        : 'Hello! I am Fogger. How can I help today? Feel free to ask a direct question, report a technical issue, or schedule a meeting.',
      timestamp: language === 'pt' ? 'Agora' : 'Now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Suggested prompt chips based on language
  const quickChips = language === 'pt'
    ? [
        'Como pedir reembolso?',
        'Erro de sincronização da Cloud',
        'Jogo crasha no arranque',
        'Comando não detetado',
        'Marcar reunião de 30 min (Cal.com)',
      ]
    : [
        'How do I request a refund?',
        'Cloud synchronization error',
        'Game crashes on startup',
        'Controller not detected',
        'Schedule 30-min meeting (Cal.com)',
      ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      let botResponse: Message;

      // 0. Scheduling Intent
      const isSchedulingIntent = [
        'agendar', 'marcar reuniao', 'reuniao', 'cal.com', 'google calendar',
        'falar com alguem', 'falar com especialista', 'marcar hora', 'sessao de suporte', 'suporte humano', 'marcar 30 min',
        'schedule', 'meeting', 'book', 'call', 'appointment'
      ].some((term) => normalizedQuery.includes(term));

      if (isSchedulingIntent) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'pt'
            ? 'Com certeza! Pode marcar uma reunião individual de 30 minutos diretamente através do Cal.com (cal.com/respo_0/30min). O horário fica automaticamente reservado e sincronizado com o seu Google Calendar com link de videoconferência.'
            : 'Certainly! You can schedule a 1-on-1 30-minute session directly through Cal.com (cal.com/respo_0/30min). The slot is automatically reserved and synchronized with your Google Calendar with a video meeting link.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: {
            label: language === 'pt' ? 'Abrir Agendamento (cal.com/respo_0/30min)' : 'Open Booking (cal.com/respo_0/30min)',
            href: '#agendamento',
          },
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
        return;
      }

      // 1. Troubleshooting Guide
      const guideMatch = searchTroubleshootingGuide(query);

      if (guideMatch) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'pt'
            ? `Encontrei uma solução direta no nosso Guia de Diagnóstico Técnico para "${guideMatch.title}":`
            : `Found a direct solution in our Technical Diagnostics Guide for "${guideMatch.title}":`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          troubleshootingData: guideMatch,
          actionButton: guideMatch.actionSuggestion
            ? {
                label: guideMatch.actionSuggestion.label,
                href: `#${guideMatch.actionSuggestion.targetSection || 'agendamento'}`,
              }
            : undefined,
        };
      } else {
        // 2. FAQ Items
        const currentFaqs = getFaqItems(language);
        const faqMatch = currentFaqs.find((faq) => {
          const normQuestion = faq.question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (normQuestion.includes(normalizedQuery) || (normalizedQuery.length > 8 && normQuestion.slice(0, 15).includes(normalizedQuery.slice(0, 15)))) {
            return true;
          }
          return faq.tags?.some((t) => {
            const normTag = t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            return normTag.length >= 4 && normalizedQuery.includes(normTag);
          });
        });

        if (faqMatch) {
          botResponse = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: language === 'pt'
              ? `Aqui está a resposta oficial direta sobre este tema:`
              : `Here is the official direct answer on this topic:`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            faqMatch: {
              question: faqMatch.question,
              answer: faqMatch.answer,
              category: faqMatch.category,
            },
            actionButton: {
              label: language === 'pt' ? 'Ver mais respostas na FAQ' : 'View more answers in FAQ',
              href: '#faq',
            },
          };
        } else {
          // 3. Fallback to Cal.com meeting
          botResponse = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: language === 'pt'
              ? `Não tenho uma resposta exata ou direta para esta pergunta no meu guia rápido de suporte.\n\nPara não lhe dar informações genéricas que não respondam ao que procura, se desejar pode marcar uma reunião rápida de 30 minutos (via Cal.com: cal.com/respo_0/30min) com a nossa equipa para esclarecer a sua dúvida de forma personalizada e direta.`
              : `I don't have an exact direct answer for this specific question in my quick guide.\n\nTo ensure you don't receive generic answers that do not address your needs, you can schedule a quick 30-minute session (via Cal.com: cal.com/respo_0/30min) with our team for personalized assistance.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionButton: {
              label: language === 'pt' ? 'Marcar Reunião de 30 min (Cal.com)' : 'Schedule 30-min Meeting (Cal.com)',
              href: '#agendamento',
            },
          };
        }
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 350);
  };

  const handleActionClick = (href: string) => {
    if (onNavigateToSection && href.startsWith('#')) {
      onNavigateToSection(href.substring(1));
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* FLOATING CHAT BUTTON & POPUP (Acesso permanente e exclusivo no canto inferior direito) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className={`w-14 h-14 rounded-full shadow-xl hover:scale-105 transition-all flex items-center justify-center cursor-pointer relative group ${
              darkMode
                ? 'bg-gradient-to-tr from-white via-slate-100 to-slate-400 text-black border border-white/50'
                : 'bg-gradient-to-tr from-slate-700 via-slate-800 to-black text-white border border-slate-900'
            }`}
            aria-label="Chatbot"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" />
          </button>
        ) : (
          <div
            className={`w-[90vw] sm:w-[420px] h-[580px] max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 ${
              darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
            }`}
          >
            {/* Header */}
            <div className={`px-4 py-3 flex items-center justify-between border-b ${
              darkMode ? 'bg-gradient-to-r from-slate-950 to-slate-900 text-white border-slate-800' : 'bg-gradient-to-r from-slate-100 to-white text-black border-slate-200'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-slate-800 border border-slate-700 text-sky-400' : 'bg-slate-200 border border-slate-300 text-sky-500'
                }`}>
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold leading-tight flex items-center gap-1.5 ${darkMode ? 'text-white' : 'text-black'}`}>
                    <span>{language === 'pt' ? 'Fogger • Suporte Técnico' : 'Fogger • Tech Support'}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  </h4>
                  <span className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {language === 'pt' ? 'FAQ • Diagnóstico • Cal.com' : 'FAQ • Diagnosis • Cal.com'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages([messages[0]])}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-black hover:bg-slate-200'
                  }`}
                  title={language === 'pt' ? 'Reiniciar conversa' : 'Reset chat'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-black hover:bg-slate-200'
                  }`}
                  title={language === 'pt' ? 'Fechar' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className={`flex-1 p-3.5 overflow-y-auto space-y-3 text-xs ${
              darkMode ? 'bg-slate-950/60' : 'bg-slate-50'
            }`}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-sky-400' : 'bg-slate-200 border-slate-300 text-sky-500'
                    }`}>
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2`}>
                    <div
                      className={`p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                        msg.sender === 'user'
                          ? darkMode
                            ? 'bg-slate-200 text-black font-medium rounded-tr-xs shadow-xs'
                            : 'bg-black text-white font-medium rounded-tr-xs shadow-xs'
                          : darkMode
                          ? 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-xs shadow-xs'
                          : 'bg-white text-black border border-slate-200 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Diagnostic Card */}
                      {msg.troubleshootingData && (
                        <div className={`mt-2 p-2.5 rounded-xl border text-[11px] space-y-1.5 ${
                          darkMode ? 'bg-slate-950/80 border-slate-700' : 'bg-slate-100 border-slate-300'
                        }`}>
                          <div className={`font-bold flex items-center gap-1 ${darkMode ? 'text-slate-200' : 'text-black'}`}>
                            <Wrench className="w-3 h-3" />
                            <span>{msg.troubleshootingData.title}</span>
                          </div>
                          <ol className={`list-decimal pl-4 space-y-0.5 ${darkMode ? 'text-slate-300' : 'text-black'}`}>
                            {msg.troubleshootingData.stepByStepSolution.map((st, i) => (
                              <li key={i}>{st}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* FAQ Card */}
                      {msg.faqMatch && (
                        <div className={`mt-2 p-2.5 rounded-xl border text-[11px] space-y-1 ${
                          darkMode ? 'bg-slate-950/80 border-slate-700' : 'bg-slate-100 border-slate-300'
                        }`}>
                          <div className={`font-bold flex items-center gap-1 ${darkMode ? 'text-slate-200' : 'text-black'}`}>
                            <HelpCircle className="w-3 h-3" />
                            <span>{msg.faqMatch.question}</span>
                          </div>
                          <p className={darkMode ? 'text-slate-300' : 'text-black'}>{msg.faqMatch.answer}</p>
                        </div>
                      )}

                      {/* Direct Action Button */}
                      {msg.actionButton && (
                        <div className="pt-1.5">
                          <button
                            onClick={() => handleActionClick(msg.actionButton!.href)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{msg.actionButton.label}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 block px-1 text-right">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-md bg-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center text-slate-400 text-xs py-1">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-sky-400' : 'bg-slate-200 border-slate-300 text-sky-500'
                  }`}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex gap-1 items-center px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips suggestions */}
            <div className={`p-2 border-t flex gap-1.5 overflow-x-auto text-[11px] ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              {quickChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(chip)}
                  className={`whitespace-nowrap px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    chip.includes('Cal.com')
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                      : darkMode
                      ? 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={language === 'pt' ? 'Escreva a sua dúvida...' : 'Type your question...'}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-400"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white transition-all cursor-pointer"
                aria-label={t.chat_send}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};
