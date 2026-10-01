import React, { useEffect, useState } from 'react';
import {
  FileText,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  Download,
  Printer,
  Moon,
  Sun,
  CheckCircle2,
  Building,
  Mail,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ProposalItem {
  catalogoId: string;
  nome: string;
  descricao: string;
  unidade: string;
  precoUnitarioCentimos: number;
  quantidade: number;
  subtotalCentimos: number;
  condicoes?: string;
}

interface ProposalData {
  numeroProposta: string;
  dataCriacao: string;
  dataValidade: string;
  resumoAmbito: string;
  itens: ProposalItem[];
  totalCentimos: number;
  condicoes: string;
  demonstracao: boolean;
  negocio: {
    nome: string;
    descricao: string;
    contacto: string;
  };
}

interface ProposalViewProps {
  token: string;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onBackToHome: () => void;
}

export const ProposalView: React.FC<ProposalViewProps> = ({
  token,
  darkMode,
  setDarkMode,
  onBackToHome,
}) => {
  const { language, setLanguage } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proposta, setProposta] = useState<ProposalData | null>(null);

  useEffect(() => {
    // Adiciona meta tag noindex para impedir indexação por motores de busca
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');

    return () => {
      meta?.setAttribute('content', 'index, follow');
    };
  }, []);

  useEffect(() => {
    const fetchProposta = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/propostas/${token}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || (language === 'pt' ? 'Não foi possível encontrar a proposta solicitada.' : 'Could not find the requested proposal.'));
        }

        setProposta(data.proposta);
      } catch (err: any) {
        console.error('Erro ao carregar proposta:', err);
        setError(err.message || (language === 'pt' ? 'Erro ao carregar a proposta.' : 'Error loading proposal.'));
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProposta();
    }
  }, [token, language]);

  const formatEuro = (centimos: number) => {
    return (centimos / 100).toLocaleString(language === 'pt' ? 'pt-PT' : 'en-GB', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 flex flex-col ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Topo / Barra de Ações */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/95 border-slate-200'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              darkMode
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-black hover:bg-slate-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'pt' ? 'Voltar ao Início' : 'Back to Home'}</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher: PT vs EN */}
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

            <button
              onClick={() => window.print()}
              className={`p-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:text-black hover:bg-slate-100'
              }`}
              title={language === 'pt' ? 'Imprimir ou Guardar em PDF' : 'Print or Save to PDF'}
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'pt' ? 'Imprimir / PDF' : 'Print / PDF'}</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                darkMode ? 'bg-slate-800 text-amber-300' : 'bg-slate-200 text-slate-700'
              }`}
              aria-label="Alternar tema"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal da Proposta */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-400">
                {language === 'pt' ? 'A carregar proposta comercial...' : 'Loading commercial proposal...'}
              </p>
            </div>
          ) : error ? (
            <div
              className={`rounded-2xl p-8 border text-center space-y-4 shadow-xl ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold">
                {language === 'pt' ? 'Proposta Não Encontrada' : 'Proposal Not Found'}
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">{error}</p>
              <div className="pt-2">
                <button
                  onClick={onBackToHome}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-sky-600 hover:bg-sky-500 text-white transition-all cursor-pointer"
                >
                  {language === 'pt' ? 'Voltar à Página Principal' : 'Back to Main Page'}
                </button>
              </div>
            </div>
          ) : proposta ? (
            <div
              className={`rounded-3xl border shadow-2xl overflow-hidden transition-all print:border-none print:shadow-none ${
                darkMode
                  ? 'bg-slate-900/90 border-slate-800 text-white'
                  : 'bg-white border-slate-300 text-black'
              }`}
            >
              {/* Aviso Pedagógico de Proposta de Demonstração */}
              {proposta.demonstracao && (
                <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>
                      {language === 'pt'
                        ? 'Exercício de Aprendizagem: Esta proposta utiliza preços fictícios de demonstração gerados pelo sistema.'
                        : 'Learning Exercise: This proposal uses fictitious demonstration prices generated by the system.'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] hidden sm:inline">
                    {language === 'pt' ? 'Modo Demonstração' : 'Demo Mode'}
                  </span>
                </div>
              )}

              {/* Cabeçalho da Proposta */}
              <div
                className={`p-6 sm:p-10 border-b ${
                  darkMode ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-sm">
                        F
                      </div>
                      <span className="text-lg font-black tracking-tight">FOG ECOSYSTEM</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                      {language === 'pt' ? 'Proposta Comercial' : 'Commercial Proposal'}
                    </h1>
                    <span className="inline-block mt-1 font-mono text-sm font-bold text-sky-500">
                      {language === 'pt' ? 'N.º' : 'No.'} {proposta.numeroProposta}
                    </span>
                  </div>

                  {/* Metadados: Emissão e Validade */}
                  <div className="space-y-1.5 text-xs sm:text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                        {language === 'pt' ? 'Data de emissão:' : 'Issue date:'}
                      </span>
                      <strong className="font-bold">{formatDate(proposta.dataCriacao)}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sky-500 shrink-0" />
                      <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                        {language === 'pt' ? 'Validade da proposta:' : 'Proposal validity:'}
                      </span>
                      <strong className="font-bold text-sky-500">
                        {formatDate(proposta.dataValidade)} {language === 'pt' ? '(15 dias)' : '(15 days)'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Resumo do Âmbito */}
                <div
                  className={`mt-6 p-4 rounded-2xl border text-sm leading-relaxed ${
                    darkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-300'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <strong className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
                    {language === 'pt' ? 'Resumo do Âmbito da Proposta:' : 'Scope Summary of Proposal:'}
                  </strong>
                  <p>{proposta.resumoAmbito}</p>
                </div>
              </div>

              {/* Tabela de Produtos / Serviços */}
              <div className="p-6 sm:p-10 space-y-6">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>{language === 'pt' ? 'Produtos e Serviços Incluídos' : 'Included Products and Services'}</span>
                </h3>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr
                        className={`text-xs uppercase tracking-wider font-semibold border-b ${
                          darkMode
                            ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                            : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        <th className="py-3 px-4">{language === 'pt' ? 'Item' : 'Item'}</th>
                        <th className="py-3 px-3 text-center">{language === 'pt' ? 'Unidade' : 'Unit'}</th>
                        <th className="py-3 px-3 text-center">{language === 'pt' ? 'Qtd.' : 'Qty'}</th>
                        <th className="py-3 px-4 text-right">{language === 'pt' ? 'Preço Unitário' : 'Unit Price'}</th>
                        <th className="py-3 px-4 text-right">{language === 'pt' ? 'Subtotal' : 'Subtotal'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {proposta.itens.map((item, idx) => (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-4 px-4 align-top">
                            <span className="font-bold block">{item.nome}</span>
                            <span
                              className={`text-xs mt-0.5 block leading-relaxed ${
                                darkMode ? 'text-slate-400' : 'text-slate-600'
                              }`}
                            >
                              {item.descricao}
                            </span>
                            {item.condicoes && (
                              <span className="text-[11px] text-slate-400 italic block mt-1">
                                {item.condicoes}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-3 align-top text-center font-mono text-xs text-slate-400 uppercase">
                            {item.unidade}
                          </td>
                          <td className="py-4 px-3 align-top text-center font-bold font-mono">
                            {item.quantidade}
                          </td>
                          <td className="py-4 px-4 align-top text-right font-mono">
                            {formatEuro(item.precoUnitarioCentimos)}
                          </td>
                          <td className="py-4 px-4 align-top text-right font-mono font-bold">
                            {formatEuro(item.subtotalCentimos)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bloco de Destaque: Total sem IVA */}
                <div className="flex flex-col sm:flex-row justify-end pt-2">
                  <div
                    className={`rounded-2xl p-6 border text-right min-w-[300px] space-y-1 shadow-lg ${
                      darkMode
                        ? 'bg-slate-950 border-sky-500/30'
                        : 'bg-sky-50/70 border-sky-200'
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                      {language === 'pt' ? 'Total sem IVA' : 'Total excluding VAT'}
                    </span>
                    <span className="text-3xl sm:text-4xl font-black font-mono text-sky-500 block">
                      {formatEuro(proposta.totalCentimos)}
                    </span>
                    <span className="text-[11px] text-slate-400 block pt-1">
                      {language === 'pt'
                        ? 'Valores líquidos em Euros (€) • Sem impostos calculados'
                        : 'Net values in Euros (€) • Taxes not calculated'}
                    </span>
                  </div>
                </div>

                {/* Condições e Validade */}
                <div
                  className={`mt-6 p-5 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                    darkMode
                      ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <strong className="block text-slate-300 font-bold uppercase tracking-wider">
                    {language === 'pt' ? 'Condições Comerciais e Garantia:' : 'Commercial Terms & Warranty:'}
                  </strong>
                  <p>{proposta.condicoes}</p>
                </div>

                {/* Contactos do Negócio */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-slate-500">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-400" />
                    <span>{proposta.negocio?.nome || 'Fog Store & Gaming Ecosystem'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{language === 'pt' ? 'Contacto:' : 'Contact:'} {proposta.negocio?.contacto || 'suporte@fog.local'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};
