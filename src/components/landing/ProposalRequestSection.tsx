import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles, Shield, Loader2, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ProposalRequestSectionProps {
  darkMode: boolean;
  onSuccessSubmitted?: (pedidoId: string, propostaToken?: string | null) => void;
}

export const ProposalRequestSection: React.FC<ProposalRequestSectionProps> = ({
  darkMode,
  onSuccessSubmitted,
}) => {
  const { language, t } = useLanguage();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [pedidoTexto, setPedidoTexto] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successSubmitted, setSuccessSubmitted] = useState(false);
  const [pedidoIdGerado, setPedidoIdGerado] = useState<string | null>(null);
  const [propostaTokenGerado, setPropostaTokenGerado] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);

    // Validações no frontend
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();
    const textoLimpo = pedidoTexto.trim();

    if (!nomeLimpo) {
      setErrorMessage(language === 'pt' ? 'Por favor, indique o seu nome.' : 'Please enter your name.');
      return;
    }

    if (!emailLimpo) {
      setErrorMessage(language === 'pt' ? 'Por favor, indique o seu email.' : 'Please enter your email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLimpo)) {
      setErrorMessage(language === 'pt' ? 'Por favor, introduza um endereço de email com formato válido.' : 'Please enter a valid email address.');
      return;
    }

    if (!textoLimpo) {
      setErrorMessage(language === 'pt' ? 'Por favor, descreva a sua proposta com detalhe.' : 'Please describe your proposal in detail.');
      return;
    }

    if (textoLimpo.length < 8) {
      setErrorMessage(language === 'pt' ? 'A descrição da proposta é demasiado curta. Por favor, forneça mais contexto.' : 'The proposal description is too short. Please provide more context.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nomeLimpo,
          email: emailLimpo,
          pedidoTexto: textoLimpo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || (language === 'pt' ? 'Não foi possível enviar o seu pedido neste momento. Tente novamente.' : 'Could not submit your request at this time. Please try again.'));
      }

      setSuccessSubmitted(true);
      setPedidoIdGerado(data.pedidoId || null);
      setPropostaTokenGerado(data.propostaToken || null);

      if (onSuccessSubmitted) {
        onSuccessSubmitted(data.pedidoId, data.propostaToken);
      }
    } catch (err: any) {
      console.error('Erro ao submeter pedido:', err);
      setErrorMessage(err.message || t.proposal_err_generic);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setNome('');
    setEmail('');
    setPedidoTexto('');
    setSuccessSubmitted(false);
    setErrorMessage(null);
    setPedidoIdGerado(null);
    setPropostaTokenGerado(null);
  };

  return (
    <section
      id="pedido-proposta"
      className={`py-16 md:py-24 border-t transition-colors ${
        darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-300'
      }`}
    >
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Cabeçalho da Secção */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              darkMode
                ? 'bg-sky-950/70 text-sky-300 border-sky-800'
                : 'bg-sky-100 text-sky-900 border-sky-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.proposal_badge}</span>
          </div>

          <h2
            className={`text-2xl sm:text-4xl font-black tracking-tight ${
              darkMode ? 'text-white' : 'text-black'
            }`}
          >
            {t.proposal_title}
          </h2>

          <p
            className={`text-sm sm:text-base leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-700 font-medium'
            }`}
          >
            {t.proposal_subtitle}
          </p>
        </div>

        {/* Caixa do Formulário */}
        <div className="max-w-2xl mx-auto">
          <div
            className={`rounded-3xl p-6 sm:p-10 border shadow-2xl transition-all ${
              darkMode
                ? 'bg-slate-950/90 border-slate-800 text-white'
                : 'bg-white border-slate-300 text-black'
            }`}
          >
            {successSubmitted ? (
              <div className="text-center py-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-500">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3
                    className={`text-xl sm:text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-black'
                    }`}
                  >
                    {t.proposal_success_title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm max-w-md mx-auto ${
                      darkMode ? 'text-slate-400' : 'text-slate-600 font-medium'
                    }`}
                  >
                    {t.proposal_success_desc}
                  </p>
                  {pedidoIdGerado && (
                    <div className="pt-2">
                      <span
                        className={`inline-block font-mono text-xs px-3 py-1 rounded-md border ${
                          darkMode
                            ? 'bg-slate-900 border-slate-700 text-slate-300'
                            : 'bg-slate-100 border-slate-300 text-slate-800'
                        }`}
                      >
                        {t.proposal_reference} {pedidoIdGerado}
                      </span>
                    </div>
                  )}
                </div>

                {propostaTokenGerado && (
                  <div className="pt-3">
                    <a
                      href={`/proposta/${propostaTokenGerado}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-md hover:shadow-sky-500/20 cursor-pointer"
                    >
                      <span>{t.proposal_view_btn}</span>
                    </a>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-800/40">
                  <button
                    onClick={handleResetForm}
                    className={`text-xs font-semibold underline cursor-pointer ${
                      darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    {t.proposal_submit_another}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">{t.proposal_err_title}</span>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Campo 1: Nome */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="proposta-nome"
                    className={`block text-xs sm:text-sm font-bold ${
                      darkMode ? 'text-slate-200' : 'text-slate-900'
                    }`}
                  >
                    {language === 'pt' ? 'Nome' : 'Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="proposta-nome"
                    type="text"
                    required
                    maxLength={100}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder={language === 'pt' ? 'O seu nome ou da sua empresa' : 'Your name or company name'}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      darkMode
                        ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:ring-sky-500/40 focus:border-sky-500'
                        : 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:ring-slate-900/20 focus:border-slate-900'
                    }`}
                  />
                </div>

                {/* Campo 2: Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="proposta-email"
                    className={`block text-xs sm:text-sm font-bold ${
                      darkMode ? 'text-slate-200' : 'text-slate-900'
                    }`}
                  >
                    {language === 'pt' ? 'Email' : 'Email Address'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="proposta-email"
                    type="email"
                    required
                    maxLength={150}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={language === 'pt' ? 'exemplo@dominio.com' : 'example@domain.com'}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                      darkMode
                        ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:ring-sky-500/40 focus:border-sky-500'
                        : 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:ring-slate-900/20 focus:border-slate-900'
                    }`}
                  />
                </div>

                {/* Campo 3: Pedido (Texto aberto com várias linhas) */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="proposta-pedido"
                    className={`block text-xs sm:text-sm font-bold ${
                      darkMode ? 'text-slate-200' : 'text-slate-900'
                    }`}
                  >
                    {language === 'pt' ? 'Pedido de Proposta' : 'Proposal Request Details'} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="proposta-pedido"
                    required
                    rows={4}
                    maxLength={3000}
                    value={pedidoTexto}
                    onChange={(e) => setPedidoTexto(e.target.value)}
                    placeholder={
                      language === 'pt'
                        ? 'Ex.: Gostaríamos de encomendar 2 consolas Fog Deck OLED com auditoria técnica Fog Verified para cada um, e incluir 3 meses de suporte dedicado a estúdios.'
                        : 'E.g.: We would like to order 2 Fog Deck OLED devices with Fog Verified technical audit for each, and include 3 months of dedicated studio support.'
                    }
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl border text-sm leading-relaxed transition-all focus:outline-none focus:ring-2 resize-y ${
                      darkMode
                        ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:ring-sky-500/40 focus:border-sky-500'
                        : 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:ring-slate-900/20 focus:border-slate-900'
                    }`}
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                    <span>{language === 'pt' ? 'Mínimo 8 caracteres' : 'Minimum 8 characters'}</span>
                    <span>{pedidoTexto.length} / 3000 {language === 'pt' ? 'caracteres' : 'characters'}</span>
                  </div>
                </div>

                {/* Nota de privacidade e proteção de dados */}
                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                    darkMode
                      ? 'bg-slate-900/50 border-slate-800 text-slate-400'
                      : 'bg-slate-100/90 border-slate-200 text-slate-600 font-medium'
                  }`}
                >
                  <Info className="w-4 h-4 shrink-0 text-sky-500 mt-0.5" />
                  <span>
                    {language === 'pt'
                      ? 'Os seus dados serão utilizados exclusivamente para analisar e responder ao seu pedido com base nos serviços do ecossistema Fog.'
                      : 'Your data will be used exclusively to analyze and respond to your request based on Fog ecosystem services.'}
                  </span>
                </div>

                {/* Botão de Submissão com gradiente entre o azul oficial e cinzento-cinza/ash claro sem linha azul à direita */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-sky-600 via-slate-500 to-slate-400 hover:from-sky-500 hover:via-slate-400 hover:to-slate-300 border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{language === 'pt' ? 'A analisar pedido com IA...' : 'Analyzing request with AI...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{language === 'pt' ? 'Pedir proposta' : 'Request Proposal'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
