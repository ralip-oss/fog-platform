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
  FileText,
  Loader2,
  AlertCircle,
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
  proposalForm?: boolean;
}

interface SupportChatBotProps {
  darkMode: boolean;
  onNavigateToSection?: (sectionId: string) => void;
}

const ChatProposalForm: React.FC<{
  darkMode: boolean;
  language: 'pt' | 'en';
  onSubmitSuccess: (pedidoId: string, propostaToken: string) => void;
  onNavigateToProposalPage: () => void;
}> = ({ darkMode, language, onSubmitSuccess, onNavigateToProposalPage }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [pedidoTexto, setPedidoTexto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nome.trim()) {
      setError(language === 'pt' ? 'Indique o seu nome.' : 'Please enter your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError(language === 'pt' ? 'Indique um email válido.' : 'Please enter a valid email.');
      return;
    }
    if (pedidoTexto.trim().length < 8) {
      setError(language === 'pt' ? 'Descrição com mínimo 8 caracteres.' : 'Minimum 8 characters description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nome.trim(), email: email.trim(), pedidoTexto: pedidoTexto.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (language === 'pt' ? 'Erro ao submeter pedido.' : 'Error submitting request.'));
      }
      onSubmitSuccess(data.pedidoId, data.propostaToken);
    } catch (err: any) {
      setError(err.message || (language === 'pt' ? 'Erro na comunicação.' : 'Communication error.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`mt-2.5 p-3 rounded-xl border text-xs space-y-2.5 ${
      darkMode ? 'bg-slate-900/90 border-slate-700/80 text-white' : 'bg-slate-50 border-slate-300 text-black'
    }`}>
      <div className="font-bold text-[11px] text-sky-400 flex items-center justify-between">
        <span>{language === 'pt' ? 'Assistente Rápido de Proposta' : 'Quick Proposal Assistant'}</span>
        <span className="text-[10px] text-slate-400 font-mono">IA</span>
      </div>

      {error && (
        <div className="text-[10px] text-rose-500 bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
          {language === 'pt' ? 'Nome:' : 'Name:'}
        </label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder={language === 'pt' ? 'O seu nome ou estúdio' : 'Your name or studio'}
          className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
            darkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
          }`}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
          {language === 'pt' ? 'Email:' : 'Email:'}
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@dominio.com"
          className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
            darkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
          }`}
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
          {language === 'pt' ? 'O que pretende orçamentar?' : 'What would you like to quote?'}
        </label>
        <textarea
          rows={2}
          value={pedidoTexto}
          onChange={(e) => setPedidoTexto(e.target.value)}
          placeholder={language === 'pt' ? 'Ex.: 2 consolas Fog Deck OLED e certificação Fog Verified' : 'E.g.: 2 Fog Deck OLED consoles and Fog Verified certification'}
          className={`w-full px-2 py-1.5 rounded-lg border text-xs resize-none ${
            darkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
          }`}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-wrap gap-1">
        {[
          language === 'pt' ? '2x Fog Deck OLED' : '2x Fog Deck OLED',
          language === 'pt' ? 'Publicação de Jogo' : 'Game Publishing',
          language === 'pt' ? 'Auditoria Fog Verified' : 'Fog Verified Audit',
        ].map((tag) => (
          <button
            type="button"
            key={tag}
            onClick={() => setPedidoTexto((prev) => (prev ? `${prev} + ${tag}` : tag))}
            className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
              darkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-300 text-slate-700 hover:text-black'
            }`}
          >
            + {tag}
          </button>
        ))}
      </div>

      <div className="pt-1 flex flex-col gap-1.5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-3 rounded-lg font-bold text-xs bg-gradient-to-r from-sky-600 via-slate-500 to-slate-400 hover:from-sky-500 hover:via-slate-400 hover:to-slate-300 border border-white/10 text-white transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{language === 'pt' ? 'A calcular com IA...' : 'Calculating with AI...'}</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'pt' ? 'Pedir Proposta' : 'Request Proposal'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onNavigateToProposalPage}
          className="w-full py-0.5 text-[10px] text-sky-400 hover:text-sky-300 underline text-center cursor-pointer"
        >
          {language === 'pt' ? 'Ou abrir página dedicada de pedido de proposta' : 'Or open dedicated proposal request page'}
        </button>
      </div>
    </form>
  );
};

export const SupportChatBot: React.FC<SupportChatBotProps> = ({
  darkMode,
  onNavigateToSection,
}) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [chatSize, setChatSize] = useState({ width: 420, height: 580 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);

  const startResize = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    resizeRef.current = {
      startX: clientX,
      startY: clientY,
      startW: chatSize.width,
      startH: chatSize.height,
    };
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isResizing || !resizeRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = resizeRef.current.startX - clientX;
      const dy = resizeRef.current.startY - clientY;

      const maxWidth = Math.min(window.innerWidth - 32, 900);
      const maxHeight = Math.min(window.innerHeight - 32, 850);

      const newW = Math.max(320, Math.min(maxWidth, resizeRef.current.startW + dx));
      const newH = Math.max(400, Math.min(maxHeight, resizeRef.current.startH + dy));

      setChatSize({ width: newW, height: newH });
    };

    const handleEnd = () => {
      if (isResizing) {
        setIsResizing(false);
        resizeRef.current = null;
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isResizing]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: language === 'pt'
        ? 'Olá! Sou o Fogger, o assistente técnico e de suporte da Fog. Posso ajudar com pedidos de proposta comercial com IA, políticas de reembolso, consola Fog Deck, sincronização Cloud ou agendamento de reuniões. Em que posso ser útil?'
        : 'Hello! I am Fogger, the technical and support assistant for Fog. I can help with AI proposal requests, refund policies, Fog Deck hardware, Cloud synchronization, or meeting scheduling. How may I assist you?',
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

  // Suggested prompt chips based on language (strictly no emojis)
  const quickChips = language === 'pt'
    ? [
        'Pedir proposta com IA',
        'Como pedir reembolso?',
        'Erro de sincronização da Cloud',
        'Jogo crasha no arranque',
        'Marcar reunião de 30 min (Cal.com)',
      ]
    : [
        'Request proposal with AI',
        'How do I request a refund?',
        'Cloud synchronization error',
        'Game crashes on startup',
        'Schedule 30-min meeting (Cal.com)',
      ];

  const handleChatProposalSuccess = (pedidoId: string, propostaToken: string) => {
    const successMsg: Message = {
      id: `bot-prop-success-${Date.now()}`,
      sender: 'bot',
      text: language === 'pt'
        ? `O seu pedido de proposta comercial foi gerado com sucesso pela nossa IA! Referência: ${pedidoId}.\n\nPode consultar a discriminação completa, valores líquidos e termos oficiais no link seguro abaixo:`
        : `Your commercial proposal request has been generated successfully by our AI! Reference: ${pedidoId}.\n\nYou can review the itemized breakdown and official terms using the secure link below:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionButton: {
        label: language === 'pt' ? 'Ver Proposta Gerada' : 'View Generated Proposal',
        href: `/proposta/${propostaToken}`,
      },
    };
    setMessages((prev) => [...prev, successMsg]);
  };

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

      // 0. Proposal Request Intent
      const isProposalIntent = [
        'proposta', 'orçamento', 'orcamento', 'pedir proposta', 'preco', 'preço', 'publicar jogo',
        'quanto custa', 'fog deck oled', 'custo de publicacao', 'proposal', 'quote', 'quotation',
        'pricing', 'request proposal', 'cost', 'estimate'
      ].some((term) => normalizedQuery.includes(term));

      if (isProposalIntent) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'pt'
            ? 'Pode pedir uma proposta comercial calculada por Inteligência Artificial preenchendo os dados diretamente aqui abaixo no assistente de proposta, ou se preferir, aceder ao formulário completo na página dedicada.'
            : 'You can request an AI-calculated commercial proposal right here through our assistant below, or visit the full proposal page if you prefer.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          proposalForm: true,
          actionButton: {
            label: language === 'pt' ? 'Ir para Pedido de Proposta' : 'Go to Proposal Request',
            href: '#proposta',
          },
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
        return;
      }

      // 1. Scheduling Intent
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
            ? 'Pode marcar uma reunião individual de 30 minutos diretamente através do Cal.com (cal.com/respo_0/30min). O horário fica reservado e sincronizado com o seu Google Calendar com link de videoconferência.'
            : 'You can schedule a 1-on-1 30-minute session directly through Cal.com (cal.com/respo_0/30min). The slot is automatically reserved and synchronized with your Google Calendar with a video meeting link.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionButton: {
            label: language === 'pt' ? 'Abrir Agendamento (Cal.com)' : 'Open Booking (Cal.com)',
            href: '#agendamento',
          },
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
        return;
      }

      // 2. Troubleshooting Guide
      const guideMatch = searchTroubleshootingGuide(query);

      if (guideMatch) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: language === 'pt'
            ? `Encontrei uma solução direta no Guia de Diagnóstico Técnico para "${guideMatch.title}":`
            : `Found a direct solution in our Technical Diagnostics Guide for "${guideMatch.title}":`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          troubleshootingData: guideMatch,
          actionButton: guideMatch.actionSuggestion
            ? {
                label: guideMatch.actionSuggestion.label,
                href: `#${guideMatch.actionSuggestion.targetSection || 'proposta'}`,
              }
            : undefined,
        };
      } else {
        // 3. FAQ Items
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
              ? 'Aqui está a resposta oficial direta sobre este tema:'
              : 'Here is the official direct answer on this topic:',
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
          // 4. Fallback to Cal.com meeting
          botResponse = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            text: language === 'pt'
              ? 'Não tenho uma resposta exata ou direta para esta pergunta no meu guia rápido de suporte.\n\nPara lhe fornecer um acompanhamento rigoroso, pode marcar uma reunião rápida de 30 minutos (via Cal.com: cal.com/respo_0/30min) com a nossa equipa especializada para esclarecer a questão diretamente.'
              : 'I do not have an exact direct answer for this specific question in my quick guide.\n\nTo ensure you receive personalized support, you can schedule a quick 30-minute session (via Cal.com: cal.com/respo_0/30min) with our specialized team.',
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
    }, 300);
  };

  const handleActionClick = (href: string) => {
    if (href.startsWith('/proposta/')) {
      window.location.href = href;
      return;
    }
    const target = href.startsWith('#') ? href.substring(1) : href;
    if (onNavigateToSection) {
      onNavigateToSection(target);
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
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-sky-500 border-2 border-slate-950 rounded-full animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
          </button>
        ) : (
          <div
            style={{
              width: `min(${chatSize.width}px, 95vw)`,
              height: `min(${chatSize.height}px, 88vh)`,
            }}
            className={`relative rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 ${
              isResizing ? 'select-none' : ''
            } ${
              darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
            }`}
          >
            {/* Top-Left Corner Resize Handle */}
            <div
              onMouseDown={startResize}
              onTouchStart={startResize}
              className="absolute top-0 left-0 w-6 h-6 z-50 cursor-nwse-resize group flex items-start justify-start p-1.5 select-none"
              title={language === 'pt' ? 'Redimensionar janela' : 'Resize chat window'}
            >
              <div className="w-2.5 h-2.5 border-t-2 border-l-2 border-slate-400 group-hover:border-sky-400 rounded-tl-xs transition-colors" />
            </div>

            {/* Top Edge Resize Bar */}
            <div
              onMouseDown={startResize}
              onTouchStart={startResize}
              className="absolute top-0 left-6 right-0 h-1.5 z-40 cursor-ns-resize hover:bg-sky-500/30 transition-colors"
              title={language === 'pt' ? 'Redimensionar altura' : 'Resize height'}
            />

            {/* Left Edge Resize Bar */}
            <div
              onMouseDown={startResize}
              onTouchStart={startResize}
              className="absolute top-6 left-0 bottom-0 w-1.5 z-40 cursor-ew-resize hover:bg-sky-500/30 transition-colors"
              title={language === 'pt' ? 'Redimensionar largura' : 'Resize width'}
            />

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
                    <span className="w-2 h-2 rounded-full bg-sky-400 inline-block shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
                  </h4>
                  <span className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {language === 'pt'
                      ? 'FAQ • Diagnóstico • Pedido de Proposta • Cal.com'
                      : 'FAQ • Diagnosis • Request Proposal • Cal.com'}
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

                      {/* Proposal Request Inline Assistant Form */}
                      {msg.proposalForm && (
                        <ChatProposalForm
                          darkMode={darkMode}
                          language={language}
                          onSubmitSuccess={handleChatProposalSuccess}
                          onNavigateToProposalPage={() => handleActionClick('#proposta')}
                        />
                      )}

                      {/* Direct Action Button */}
                      {msg.actionButton && (
                        <div className="pt-1.5">
                          <button
                            onClick={() => handleActionClick(msg.actionButton!.href)}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                          >
                            {msg.actionButton.href.includes('proposta') ? (
                              <FileText className="w-3.5 h-3.5" />
                            ) : (
                              <Calendar className="w-3.5 h-3.5" />
                            )}
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
