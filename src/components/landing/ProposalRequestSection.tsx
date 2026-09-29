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
  const { language } = useLanguage();

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
      setErrorMessage(
        language === 'pt' ? 'Por favor, indique o seu nome.' : 'Please enter your name.'
      );
      return;
    }

    if (!emailLimpo) {
      setErrorMessage(
        language === 'pt' ? 'Por favor, indique o seu email.' : 'Please enter your email.'
      );
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLimpo)) {
      setErrorMessage(
        language === 'pt'
          ? 'Por favor, introduza um endereço de email com formato válido.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    if (!textoLimpo) {
      setErrorMessage(
        language === 'pt'
          ? 'Por favor, descreva o seu pedido com detalhe.'
          : 'Please describe your request in detail.'
      );
      return;
    }

    if (textoLimpo.length < 8) {
      setErrorMessage(
        language === 'pt'
          ? 'O pedido é demasiado curto. Por favor, forneça mais contexto.'
          : 'Request description is too short. Please provide more details.'
      );
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
        throw new Error(data.error || 'Ocorreu um erro ao submeter o seu pedido.');
      }

      setSuccessSubmitted(true);
      setPedidoIdGerado(data.pedidoId || null);
      setPropostaTokenGerado(data.propostaToken || null);

      if (onSuccessSubmitted) {
        onSuccessSubmitted(data.pedidoId, data.propostaToken);
      }
    } catch (err: any) {
      console.error('Erro ao submeter pedido:', err);
      setErrorMessage(
        err.message ||
          (language === 'pt'
            ? 'Não foi possível enviar o seu pedido neste momento. Tente novamente.'
            : 'Could not submit your request at this time. Please try again.')
      );
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
            <span>
              {language === 'pt'
                ? 'Orçamentação Inteligente com IA'
                : 'AI-Powered Proposal Requests'}
            </span>
          </div>

          <h2
            className={`text-2xl sm:text-4xl font-black tracking-tight ${
              darkMode ? 'text-white' : 'text-black'
            }`}
          >
            {language === 'pt' ? 'Pedido de proposta' : 'Request a Proposal'}
          </h2>

          <p
            className={`text-sm sm:text-base leading-relaxed ${
              darkMode ? 'text-slate-400' : 'text-slate-700 font-medium'
            }`}
          >
            {language === 'pt'
              ? 'Indique as suas necessidades de hardware Fog Deck, publicação na plataforma, certificação técnica ou servidores dedicados. A nossa Inteligência Artificial analisa o seu pedido e calcula a proposta instantaneamente com base no catálogo oficial.'
              : 'Specify your needs for Fog Deck hardware, game publishing, technical verification, or dedicated servers. Our AI interprets your request and computes an instant proposal based on official catalog pricing.'}
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
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3
                    className={`text-xl sm:text-2xl font-bold ${
                      darkMode ? 'text-white' : 'text-black'
                    }`}
                  >
                    O seu pedido foi recebido com sucesso.
                  </h3>
                  <p
                    className={`text-xs sm:text-sm max-w-md mx-auto ${
                      darkMode ? 'text-slate-400' : 'text-slate-600 font-medium'
                    }`}
                  >
                    O nosso sistema registou o seu pedido na base de dados e iniciou o processamento comercial com os preços do catálogo.
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
                        Referência: {pedidoIdGerado}
                      </span>
                    </div>
                  )}
                </div>

                {propostaTokenGerado && (
                  <div className="pt-3">
                    <a
                      href={`/proposta/${propostaTokenGerado}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md hover:shadow-emerald-500/20"
                    >
                      <span>Ver Proposta Gerada</span>
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
                    Submeter outro pedido
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Erro na submissão:</span>
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
                    Nome <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="proposta-nome"
                    type="text"
                    required
                    maxLength={100}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="O seu nome ou da sua empresa"
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
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="proposta-email"
                    type="email"
                    required
                    maxLength={150}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@dominio.com"
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
                    Pedido <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="proposta-pedido"
                    required
                    rows={4}
                    maxLength={3000}
                    value={pedidoTexto}
                    onChange={(e) => setPedidoTexto(e.target.value)}
                    placeholder="Ex.: Gostaríamos de publicar 2 jogos independentes na Fog com auditoria técnica Fog Verified para cada um, e incluir 3 meses de suporte dedicado a estúdios."
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl border text-sm leading-relaxed transition-all focus:outline-none focus:ring-2 resize-y ${
                      darkMode
                        ? 'bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:ring-sky-500/40 focus:border-sky-500'
                        : 'bg-slate-50 border-slate-300 text-black placeholder-slate-400 focus:ring-slate-900/20 focus:border-slate-900'
                    }`}
                  />
                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                    <span>Mínimo 8 caracteres</span>
                    <span>{pedidoTexto.length} / 3000 caracteres</span>
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
                    Os seus dados serão utilizados exclusivamente para analisar e responder ao seu pedido com base nos serviços do ecossistema Fog.
                  </span>
                </div>

                {/* Botão de Submissão com proteção contra cliques duplicados */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white transition-all shadow-xl hover:shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>A analisar pedido com IA...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Pedir proposta</span>
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
