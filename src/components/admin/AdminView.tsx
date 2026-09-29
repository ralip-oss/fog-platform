import React, { useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../../firebaseClient';
import {
  ShieldCheck,
  LogOut,
  LogIn,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Plus,
  Edit2,
  ExternalLink,
  Search,
  Eye,
  Send,
  Sparkles,
  Info,
  Clock,
  Layers,
  ArrowLeft,
  X,
  Check,
} from 'lucide-react';

interface PedidoAdmin {
  id: string;
  nome: string;
  email: string;
  pedidoTexto: string;
  dataCriacao: string;
  dataAtualizacao: string;
  estadoProcessamento: string;
  interpretacaoIA?: any;
  informacaoEmFalta?: string[];
  motivoRevisao?: string | null;
  erroProcessamento?: string | null;
  proposta?: {
    id: string;
    numeroProposta: string;
    totalCentimos: number;
    estadoNotificacao: string;
    linkAcesso: string;
    token: string;
  } | null;
}

interface CatalogoItemAdmin {
  id: string;
  nome: string;
  descricao: string;
  unidade: 'unidade' | 'hora' | 'pacote';
  precoUnitarioCentimos: number;
  moeda: 'EUR';
  ativo: boolean;
  condicoes: string;
  demonstracao: boolean;
}

interface AdminViewProps {
  darkMode: boolean;
  onBackToHome: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ darkMode, onBackToHome }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userUid, setUserUid] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'pedidos' | 'catalogo'>('pedidos');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  const [pedidos, setPedidos] = useState<PedidoAdmin[]>([]);
  const [catalogo, setCatalogo] = useState<CatalogoItemAdmin[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Modal de Detalhes do Pedido
  const [selectedPedido, setSelectedPedido] = useState<PedidoAdmin | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Manual Resolution state
  const [manualItems, setManualItems] = useState<{ catalogoId: string; quantidade: number }[]>([]);
  const [manualResumo, setManualResumo] = useState('');

  // Modal de Catálogo
  const [editingItem, setEditingItem] = useState<CatalogoItemAdmin | null>(null);
  const [isCreatingItem, setIsCreatingItem] = useState(false);

  // Monitoriza estado de autenticação Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (user) {
        setUserUid(user.uid);
        await verifyAdminStatus(user);
      } else {
        setIsAuthorized(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getAuthToken = async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  };

  const verifyAdminStatus = async (user: FirebaseUser) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setIsAuthorized(true);
        setAuthError(null);
        fetchAdminData(token);
      } else {
        setIsAuthorized(false);
        setAuthError(data.error || 'Acesso negado.');
      }
    } catch (err: any) {
      setIsAuthorized(false);
      setAuthError('Erro ao verificar permissões de administrador.');
    }
  };

  const fetchAdminData = async (token?: string) => {
    setLoadingData(true);
    try {
      const authToken = token || (await getAuthToken());
      if (!authToken) return;

      const [resPedidos, resCatalogo] = await Promise.all([
        fetch('/api/admin/pedidos', { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch('/api/admin/catalogo', { headers: { Authorization: `Bearer ${authToken}` } }),
      ]);

      if (resPedidos.ok) {
        const dPedidos = await resPedidos.json();
        setPedidos(dPedidos.pedidos || []);
      }

      if (resCatalogo.ok) {
        const dCatalogo = await resCatalogo.json();
        setCatalogo(dCatalogo.itens || []);
      }
    } catch (err) {
      console.error('Erro ao carregar dados administrativos:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await verifyAdminStatus(result.user);
    } catch (err: any) {
      console.error('Erro no login Google:', err);
      setAuthError(err.message || 'Falha na autenticação Google.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthorized(false);
    setPedidos([]);
    setCatalogo([]);
    setSelectedPedido(null);
  };

  const handleReprocessarPedido = async (pedidoId: string) => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/pedidos/${pedidoId}/reprocessar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Falha ao reprocessar pedido.');

      setActionMessage({ type: 'success', text: 'Pedido reprocessado com sucesso pela IA!' });
      await fetchAdminData();

      if (selectedPedido) {
        setSelectedPedido(data.pedido);
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReenviarNotificacao = async (propostaId: string) => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/propostas/${propostaId}/reenviar-notificacao`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Falha ao reenviar notificação.');

      setActionMessage({
        type: 'success',
        text: `Notificação enviada ao aluno! Estado: ${data.resultado?.estado || 'aceite'}`,
      });
      await fetchAdminData();
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleSalvarResolucaoManual = async () => {
    if (!selectedPedido) return;
    if (manualItems.length === 0) {
      alert('Adicione pelo menos um item do catálogo para a proposta.');
      return;
    }

    setActionLoading(true);
    setActionMessage(null);
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/pedidos/${selectedPedido.id}/recalcular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itens: manualItems,
          resumoCustomizado: manualResumo.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao calcular proposta manual.');

      setActionMessage({ type: 'success', text: 'Proposta calculada e aprovada com sucesso!' });
      await fetchAdminData();
      setSelectedPedido(data.pedido);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleAtivoCatalogo = async (item: CatalogoItemAdmin) => {
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/catalogo/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ativo: !item.ativo }),
      });

      if (!res.ok) throw new Error('Erro ao alterar estado do item.');
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSalvarItemCatalogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const token = await getAuthToken();
      const res = await fetch('/api/admin/catalogo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingItem),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Erro ao guardar item no catálogo.');
      }

      setEditingItem(null);
      setIsCreatingItem(false);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredPedidos = pedidos.filter((p) => {
    if (filterEstado === 'todos') return true;
    return p.estadoProcessamento === filterEstado;
  });

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'proposta_criada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Proposta Criada
          </span>
        );
      case 'necessita_revisao':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <AlertCircle className="w-3 h-3" /> Necessita de Revisão
          </span>
        );
      case 'em_analise':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Clock className="w-3 h-3 animate-spin" /> Em Análise
          </span>
        );
      case 'erro':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" /> Erro
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30">
            Recebido
          </span>
        );
    }
  };

  const getNotificationBadge = (estado?: string) => {
    switch (estado) {
      case 'aceite':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
            <Check className="w-3 h-3" /> Aceite pelo serviço
          </span>
        );
      case 'falhou':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
            <AlertCircle className="w-3 h-3" /> Falhou
          </span>
        );
      case 'nao_configurado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500">
            <Info className="w-3 h-3" /> Não configurado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            Por enviar
          </span>
        );
    }
  };

  const formatEuro = (centimos?: number) => {
    if (centimos === undefined || centimos === null) return '—';
    return (centimos / 100).toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    });
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 flex flex-col ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Barra de Navegação do Administrador */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          darkMode ? 'bg-slate-950/90 border-slate-800' : 'bg-white/95 border-slate-200'
        }`}
      >
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                darkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-black'
              }`}
              title="Voltar ao Website"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                F
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base leading-none block">
                  Fog • Administração
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Gestão Comercial & IA
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold block leading-none">
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    UID: {currentUser.uid.slice(0, 10)}...
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    darkMode
                      ? 'bg-slate-900 border-slate-700 text-rose-400 hover:bg-slate-800'
                      : 'bg-slate-100 border-slate-300 text-rose-600 hover:bg-slate-200'
                  }`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl 2xl:max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Caso 1: Não autenticado ou Carregando */}
        {authLoading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400">A verificar sessão de administrador...</p>
          </div>
        ) : !currentUser ? (
          <div
            className={`max-w-md mx-auto rounded-3xl p-8 border text-center shadow-xl space-y-6 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Área de Administração</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Acesso restrito para consulta e orçamentação de pedidos com Inteligência Artificial.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar com Conta Google</span>
            </button>
          </div>
        ) : !isAuthorized ? (
          /* Caso 2: Utilizador Google com UID não correspondente ao ADMIN_UID */
          <div
            className={`max-w-2xl mx-auto rounded-3xl p-8 border shadow-xl space-y-6 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold">Autorização Pendente</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                O seu login com a conta Google foi concluído com sucesso, mas o seu utilizador ainda não tem privilégios de administrador atribuídos.
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
              }`}
            >
              <strong className="block text-slate-300 font-bold uppercase tracking-wider">
                O seu UID Firebase é:
              </strong>
              <div className="font-mono text-sm font-bold text-emerald-400 select-all p-2 bg-black/40 rounded-lg border border-slate-700">
                {userUid}
              </div>
              <p className="text-slate-400 pt-1">
                Para ter acesso, adicione este identificador como variável de ambiente no Secrets do AI Studio:
                <br />
                <code className="text-sky-400 font-mono">ADMIN_UID="{userUid}"</code>
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => verifyAdminStatus(currentUser)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer"
              >
                Verificar Novamente
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl font-bold text-xs border border-slate-600 hover:bg-slate-800 text-slate-300 transition-all cursor-pointer"
              >
                Terminar Sessão
              </button>
            </div>
          </div>
        ) : (
          /* Caso 3: Administrador Autorizado */
          <>
            {/* Aviso Obrigatório do Modo de Aula */}
            <div className="rounded-2xl p-4 bg-sky-950/40 border border-sky-800/60 text-sky-200 text-xs sm:text-sm flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-sky-400 shrink-0" />
                <span>
                  <strong>Modo de aula:</strong> as notificações são enviadas apenas para o email do aluno. Os clientes não recebem emails.
                </span>
              </div>
              <button
                onClick={() => fetchAdminData()}
                disabled={loadingData}
                className="px-3 py-1.5 rounded-lg font-bold text-xs bg-sky-900/60 hover:bg-sky-800 border border-sky-700 text-white flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </button>
            </div>

            {/* Separadores de Gestão */}
            <div className="flex border-b border-slate-800 gap-4">
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'pedidos'
                    ? 'border-emerald-500 text-emerald-500'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Pedidos & Propostas ({pedidos.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('catalogo')}
                className={`pb-3 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'catalogo'
                    ? 'border-emerald-500 text-emerald-500'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Catálogo de Produtos & Serviços ({catalogo.length})</span>
              </button>
            </div>

            {/* CONTEÚDO DA ABA 1: PEDIDOS E PROPOSTAS */}
            {activeTab === 'pedidos' && (
              <div className="space-y-4">
                {/* Filtros por Estado */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold mr-1">Filtrar por estado:</span>
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'recebido', label: 'Recebido' },
                    { id: 'em_analise', label: 'Em Análise' },
                    { id: 'necessita_revisao', label: 'Necessita de Revisão' },
                    { id: 'proposta_criada', label: 'Proposta Criada' },
                    { id: 'erro', label: 'Erro' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilterEstado(f.id)}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer border ${
                        filterEstado === f.id
                          ? 'bg-slate-200 text-black border-slate-300 dark:bg-white dark:text-black'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Tabela de Pedidos */}
                <div
                  className={`rounded-2xl border shadow-xl overflow-hidden ${
                    darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300'
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr
                          className={`text-xs uppercase tracking-wider font-semibold border-b ${
                            darkMode
                              ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          <th className="py-3 px-4">Data</th>
                          <th className="py-3 px-4">Cliente</th>
                          <th className="py-3 px-4">Resumo do Pedido</th>
                          <th className="py-3 px-3 text-center">Estado</th>
                          <th className="py-3 px-4 text-right">Valor da Proposta</th>
                          <th className="py-3 px-3 text-center">Notificação ao Aluno</th>
                          <th className="py-3 px-4 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredPedidos.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-12 text-slate-500">
                              Nenhum pedido registado com o filtro selecionado.
                            </td>
                          </tr>
                        ) : (
                          filteredPedidos.map((pedido) => (
                            <tr
                              key={pedido.id}
                              className={`transition-colors ${
                                darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                              }`}
                            >
                              <td className="py-3.5 px-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                                {new Date(pedido.dataCriacao).toLocaleDateString('pt-PT', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="font-bold block text-sm">{pedido.nome}</span>
                                <span className="text-xs text-slate-400 font-mono">
                                  {pedido.email}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 max-w-xs">
                                <p className="truncate text-xs text-slate-300">
                                  {pedido.interpretacaoIA?.resumo || pedido.pedidoTexto}
                                </p>
                              </td>
                              <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                {getStatusBadge(pedido.estadoProcessamento)}
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                                {formatEuro(pedido.proposta?.totalCentimos)}
                              </td>
                              <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                {getNotificationBadge(pedido.proposta?.estadoNotificacao)}
                              </td>
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => {
                                      setSelectedPedido(pedido);
                                      setActionMessage(null);
                                      setManualItems([]);
                                      setManualResumo(pedido.interpretacaoIA?.resumo || '');
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                    title="Ver detalhes e processamento"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  {pedido.proposta?.token && (
                                    <a
                                      href={`/proposta/${pedido.proposta.token}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 hover:text-emerald-300 transition-colors"
                                      title="Abrir página pública da proposta"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* CONTEÚDO DA ABA 2: CATÁLOGO DE PRODUTOS & SERVIÇOS */}
            {activeTab === 'catalogo' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm text-slate-400">
                    Fonte de verdade para cálculo automático de propostas pela aplicação.
                  </p>
                  <button
                    onClick={() => {
                      setEditingItem({
                        id: `FOG-CUSTOM-${Date.now().toString().slice(-4)}`,
                        nome: '',
                        descricao: '',
                        unidade: 'unidade',
                        precoUnitarioCentimos: 10000,
                        moeda: 'EUR',
                        ativo: true,
                        condicoes: 'Preço fictício de demonstração pedagógica.',
                        demonstracao: true,
                      });
                      setIsCreatingItem(true);
                    }}
                    className="px-3.5 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Produto / Serviço</span>
                  </button>
                </div>

                <div
                  className={`rounded-2xl border shadow-xl overflow-hidden ${
                    darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-300'
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr
                          className={`text-xs uppercase tracking-wider font-semibold border-b ${
                            darkMode
                              ? 'bg-slate-950/60 border-slate-800 text-slate-400'
                              : 'bg-slate-100 border-slate-200 text-slate-600'
                          }`}
                        >
                          <th className="py-3 px-4">Identificador</th>
                          <th className="py-3 px-4">Nome & Descrição</th>
                          <th className="py-3 px-3 text-center">Unidade</th>
                          <th className="py-3 px-4 text-right">Preço Unitário</th>
                          <th className="py-3 px-3 text-center">Estado</th>
                          <th className="py-3 px-4 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {catalogo.map((item) => (
                          <tr
                            key={item.id}
                            className={`transition-colors ${
                              item.ativo
                                ? darkMode
                                  ? 'hover:bg-slate-800/40'
                                  : 'hover:bg-slate-50'
                                : 'opacity-60 bg-slate-950/20'
                            }`}
                          >
                            <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                              {item.id}
                            </td>
                            <td className="py-3.5 px-4 max-w-sm">
                              <span className="font-bold block text-sm">{item.nome}</span>
                              <span className="text-xs text-slate-400 block mt-0.5">
                                {item.descricao}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-center font-mono text-xs uppercase text-slate-400">
                              {item.unidade}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                              {formatEuro(item.precoUnitarioCentimos)}
                            </td>
                            <td className="py-3.5 px-3 text-center">
                              <button
                                onClick={() => handleToggleAtivoCatalogo(item)}
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer border ${
                                  item.ativo
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400 border-slate-700'
                                }`}
                              >
                                {item.ativo ? 'Ativo' : 'Inativo'}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setIsCreatingItem(false);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="Editar item"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* MODAL: DETALHES E RESOLUÇÃO DO PEDIDO */}
        {selectedPedido && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div
              className={`w-full max-w-3xl rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto ${
                darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <span>Detalhe do Pedido</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {selectedPedido.id}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    Cliente: <strong>{selectedPedido.nome}</strong> ({selectedPedido.email})
                  </span>
                </div>
                <button
                  onClick={() => setSelectedPedido(null)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {actionMessage && (
                <div
                  className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center gap-2 ${
                    actionMessage.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  {actionMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{actionMessage.text}</span>
                </div>
              )}

              {/* Texto Original */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Texto Original do Pedido:
                </label>
                <div
                  className={`p-4 rounded-xl border font-mono text-xs leading-relaxed whitespace-pre-line ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {selectedPedido.pedidoTexto}
                </div>
              </div>

              {/* Interpretação da IA */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interpretação Estruturada da IA (Gemini):</span>
                </label>

                {selectedPedido.interpretacaoIA ? (
                  <div
                    className={`p-4 rounded-xl border space-y-3 text-xs ${
                      darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <strong className="text-slate-400">Resumo:</strong>{' '}
                      <span>{selectedPedido.interpretacaoIA.resumo}</span>
                    </div>

                    <div>
                      <strong className="text-slate-400 block mb-1">Itens Mapeados:</strong>
                      {selectedPedido.interpretacaoIA.itens?.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedPedido.interpretacaoIA.itens.map((it: any, i: number) => (
                            <li key={i}>
                              <strong className="font-mono text-emerald-400">{it.catalogoId}</strong>{' '}
                              — Qtd: {it.quantidade !== null ? it.quantidade : '(não especificada)'}
                              {it.evidencia && (
                                <span className="text-slate-400 italic block">
                                  Evidência: "{it.evidencia}"
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-slate-500 italic">Nenhum item mapeado automaticamente.</span>
                      )}
                    </div>

                    {selectedPedido.interpretacaoIA.informacaoEmFalta?.length > 0 && (
                      <div className="text-amber-400">
                        <strong>Informação em falta:</strong>
                        <ul className="list-disc pl-5 space-y-0.5 mt-1">
                          {selectedPedido.interpretacaoIA.informacaoEmFalta.map((info: string, i: number) => (
                            <li key={i}>{info}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedPedido.interpretacaoIA.motivoRevisao && (
                      <div className="text-amber-400">
                        <strong>Motivo de Revisão:</strong>{' '}
                        <span>{selectedPedido.interpretacaoIA.motivoRevisao}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Sem interpretação registada.</p>
                )}
              </div>

              {/* Proposta Associada (se existir) */}
              {selectedPedido.proposta && (
                <div
                  className={`p-4 rounded-2xl border space-y-3 ${
                    darkMode ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-emerald-400 font-bold block">
                        Proposta Emitida: {selectedPedido.proposta.numeroProposta}
                      </span>
                      <span className="text-xl font-bold font-mono text-emerald-500">
                        {formatEuro(selectedPedido.proposta.totalCentimos)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/proposta/${selectedPedido.proposta.token}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir Proposta</span>
                      </a>

                      <button
                        onClick={() => handleReenviarNotificacao(selectedPedido.proposta!.id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reenviar Notificação ao Aluno</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Ferramenta de Resolução Manual para Pedidos em Revisão */}
              {selectedPedido.estadoProcessamento === 'necessita_revisao' && (
                <div
                  className={`p-5 rounded-2xl border space-y-4 ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
                  }`}
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    <span>Resolver Pedido em Revisão (Orçamento Manual)</span>
                  </h4>

                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">
                      Selecione os produtos/serviços e as respetivas quantidades a orçamentar:
                    </p>

                    <div className="space-y-2">
                      {catalogo.filter((c) => c.ativo).map((item) => {
                        const selecionado = manualItems.find((m) => m.catalogoId === item.id);
                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                              selecionado
                                ? 'bg-emerald-950/30 border-emerald-600 text-white'
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            <div>
                              <strong className="block text-sm">{item.nome}</strong>
                              <span className="font-mono text-emerald-400">
                                {formatEuro(item.precoUnitarioCentimos)} / {item.unidade}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {selecionado ? (
                                <div className="flex items-center gap-2">
                                  <label className="text-[11px] text-slate-400">Qtd:</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={selecionado.quantidade}
                                    onChange={(e) => {
                                      const val = Math.max(1, parseInt(e.target.value) || 1);
                                      setManualItems((prev) =>
                                        prev.map((m) =>
                                          m.catalogoId === item.id ? { ...m, quantidade: val } : m
                                        )
                                      );
                                    }}
                                    className="w-16 px-2 py-1 rounded bg-black border border-slate-700 text-center font-bold text-white text-xs"
                                  />
                                  <button
                                    onClick={() =>
                                      setManualItems((prev) =>
                                        prev.filter((m) => m.catalogoId !== item.id)
                                      )
                                    }
                                    className="p-1 rounded text-rose-400 hover:text-rose-300"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() =>
                                    setManualItems((prev) => [
                                      ...prev,
                                      { catalogoId: item.id, quantidade: 1 },
                                    ])
                                  }
                                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold"
                                >
                                  + Incluir
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSalvarResolucaoManual}
                        disabled={actionLoading || manualItems.length === 0}
                        className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white cursor-pointer shadow-md"
                      >
                        {actionLoading ? 'A calcular...' : 'Calcular e Aprovar Proposta'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleReprocessarPedido(selectedPedido.id)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-950 border border-sky-800 text-sky-300 hover:bg-sky-900 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
                  <span>Repetir Processamento com IA</span>
                </button>

                <button
                  onClick={() => setSelectedPedido(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CRIAR OU EDITAR PRODUTO NO CATÁLOGO */}
        {editingItem && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div
              className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-5 ${
                darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold">
                  {isCreatingItem ? 'Adicionar Produto ao Catálogo' : 'Editar Produto do Catálogo'}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSalvarItemCatalogo} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Identificador (ID):</label>
                  <input
                    type="text"
                    required
                    disabled={!isCreatingItem}
                    value={editingItem.id}
                    onChange={(e) => setEditingItem({ ...editingItem, id: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 font-mono text-xs uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Nome do Produto / Serviço:</label>
                  <input
                    type="text"
                    required
                    value={editingItem.nome}
                    onChange={(e) => setEditingItem({ ...editingItem, nome: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Descrição Comercial:</label>
                  <textarea
                    rows={2}
                    value={editingItem.descricao}
                    onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Unidade de Venda:</label>
                    <select
                      value={editingItem.unidade}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, unidade: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-xs font-mono"
                    >
                      <option value="unidade">Unidade</option>
                      <option value="hora">Hora</option>
                      <option value="pacote">Pacote</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Preço em Cêntimos (€):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editingItem.precoUnitarioCentimos}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          precoUnitarioCentimos: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-xs font-mono text-emerald-400"
                    />
                    <span className="text-[10px] text-slate-500">
                      Ex: 54900 cêntimos = 549,00 €
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Condições / Âmbito:</label>
                  <input
                    type="text"
                    value={editingItem.condicoes}
                    onChange={(e) => setEditingItem({ ...editingItem, condicoes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="item-ativo"
                    checked={editingItem.ativo}
                    onChange={(e) => setEditingItem({ ...editingItem, ativo: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600"
                  />
                  <label htmlFor="item-ativo" className="font-bold text-slate-300">
                    Item Ativo no Catálogo
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white cursor-pointer shadow-md"
                  >
                    Guardar no Catálogo
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
