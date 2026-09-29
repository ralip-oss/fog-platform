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
          throw new Error(data.error || 'Não foi possível encontrar a proposta solicitada.');
        }

        setProposta(data.proposta);
      } catch (err: any) {
        console.error('Erro ao carregar proposta:', err);
        setError(err.message || 'Erro ao carregar a proposta.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProposta();
    }
  }, [token]);

  const formatEuro = (centimos: number) => {
    return (centimos / 100).toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-PT', {
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
            <span>Voltar ao Início</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className={`p-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:text-black hover:bg-slate-100'
              }`}
              title="Imprimir ou Guardar em PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
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
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-400">A carregar proposta comercial...</p>
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
              <h2 className="text-xl font-bold">Proposta Não Encontrada</h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">{error}</p>
              <div className="pt-2">
                <button
                  onClick={onBackToHome}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
                >
                  Voltar à Página Principal
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
                      Exercício de Aprendizagem: Esta proposta utiliza preços fictícios de demonstração gerados pelo sistema.
                    </span>
                  </div>
                  <span className="font-mono text-[11px] hidden sm:inline">Modo Demonstração</span>
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
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                        F
                      </div>
                      <span className="text-lg font-black tracking-tight">FOG ECOSYSTEM</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                      Proposta Comercial
                    </h1>
                    <span className="inline-block mt-1 font-mono text-sm font-bold text-sky-500">
                      N.º {proposta.numeroProposta}
                    </span>
                  </div>

                  {/* Metadados: Emissão e Validade */}
                  <div className="space-y-1.5 text-xs sm:text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                        Data de emissão:
                      </span>
                      <strong className="font-bold">{formatDate(proposta.dataCriacao)}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                        Validade da proposta:
                      </span>
                      <strong className="font-bold text-emerald-500">
                        {formatDate(proposta.dataValidade)} (15 dias)
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
                    Resumo do Âmbito da Proposta:
                  </strong>
                  <p>{proposta.resumoAmbito}</p>
                </div>
              </div>

              {/* Tabela de Produtos / Serviços */}
              <div className="p-6 sm:p-10 space-y-6">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Produtos e Serviços Incluídos</span>
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
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-3 text-center">Unidade</th>
                        <th className="py-3 px-3 text-center">Qtd.</th>
                        <th className="py-3 px-4 text-right">Preço Unitário</th>
                        <th className="py-3 px-4 text-right">Subtotal</th>
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
                        ? 'bg-slate-950 border-emerald-500/30'
                        : 'bg-emerald-50/70 border-emerald-200'
                    }`}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                      Total sem IVA
                    </span>
                    <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-500 block">
                      {formatEuro(proposta.totalCentimos)}
                    </span>
                    <span className="text-[11px] text-slate-400 block pt-1">
                      Valores líquidos em Euros (€) • Sem impostos calculados
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
                    Condições Comerciais e Garantia:
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
                    <span>Contacto: {proposta.negocio?.contacto || 'suporte@fog.local'}</span>
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
