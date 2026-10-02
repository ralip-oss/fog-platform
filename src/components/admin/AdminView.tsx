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
  Sun,
  Moon,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  getLocalizedCatalogItem,
  getLocalizedAIText,
  getLocalizedUnit,
} from '../../utils/catalogLocalization';

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
    itens?: any[];
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
  setDarkMode?: (val: boolean) => void;
  onBackToHome: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ darkMode, setDarkMode, onBackToHome }) => {
  const { language, setLanguage } = useLanguage();
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
  const [showManualEditor, setShowManualEditor] = useState(false);
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

      if (!res.ok) throw new Error(data.error || (language === 'pt' ? 'Falha ao reenviar notificação.' : 'Failed to resend notification.'));

      setActionMessage({
        type: 'success',
        text:
          language === 'pt'
            ? `Notificação enviada ao aluno! Estado: ${data.resultado?.estado || 'aceite'}`
            : `Notification sent to student! Status: ${
                data.resultado?.estado === 'aceite' ? 'accepted' : data.resultado?.estado || 'accepted'
              }`,
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
      alert(
        language === 'pt'
          ? 'Adicione pelo menos um item do catálogo para a proposta.'
          : 'Please add at least one catalog item for the proposal.'
      );
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

      setActionMessage({
        type: 'success',
        text: language === 'pt' ? 'Proposta calculada e aprovada com sucesso!' : 'Proposal calculated and approved successfully!',
      });
      await fetchAdminData();
      setSelectedPedido(data.pedido);
      setShowManualEditor(false);
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAlterarEstadoPedido = async (pedidoId: string, novoEstado: string, motivo?: string) => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/pedidos/${pedidoId}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          estadoProcessamento: novoEstado,
          motivoRevisao: motivo || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao alterar estado do pedido.');

      setActionMessage({
        type: 'success',
        text: language === 'pt' ? 'Estado atualizado com sucesso!' : 'Status updated successfully!',
      });
      await fetchAdminData();
      if (selectedPedido && selectedPedido.id === pedidoId) {
        setSelectedPedido(data.pedido);
        if (novoEstado === 'necessita_revisao') {
          setShowManualEditor(true);
        }
      }
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.message || (language === 'pt' ? 'Erro ao atualizar estado.' : 'Error updating status.'),
      });
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-500 border border-sky-500/30">
            <CheckCircle2 className="w-3 h-3" /> {language === 'pt' ? 'Proposta Criada' : 'Proposal Created'}
          </span>
        );
      case 'aceite':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> {language === 'pt' ? 'Aceite' : 'Accepted'}
          </span>
        );
      case 'rejeitado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3 h-3" /> {language === 'pt' ? 'Rejeitado' : 'Rejected'}
          </span>
        );
      case 'necessita_revisao':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/30">
            <AlertCircle className="w-3 h-3" /> {language === 'pt' ? 'Necessita de Revisão' : 'Needs Review'}
          </span>
        );
      case 'em_analise':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">
            <Clock className="w-3 h-3 animate-spin" /> {language === 'pt' ? 'Em Análise' : 'In Analysis'}
          </span>
        );
      case 'erro':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" /> {language === 'pt' ? 'Erro' : 'Error'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/30">
            {language === 'pt' ? 'Recebido' : 'Received'}
          </span>
        );
    }
  };

  const getNotificationBadge = (estado?: string) => {
    switch (estado) {
      case 'aceite':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
            <Check className="w-3 h-3" /> {language === 'pt' ? 'Aceite pelo serviço' : 'Accepted by service'}
          </span>
        );
      case 'falhou':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
            <AlertCircle className="w-3 h-3" /> {language === 'pt' ? 'Falhou' : 'Failed'}
          </span>
        );
      case 'nao_configurado':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-500">
            <Info className="w-3 h-3" /> {language === 'pt' ? 'Não configurado' : 'Not configured'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            {language === 'pt' ? 'Por enviar' : 'Pending'}
          </span>
        );
    }
  };

  const formatEuro = (centimos?: number) => {
    if (centimos === undefined || centimos === null) return '—';
    return (centimos / 100).toLocaleString(language === 'pt' ? 'pt-PT' : 'en-GB', {
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
              title={language === 'pt' ? 'Voltar ao Website' : 'Back to Website'}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-xs">
                F
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base leading-none block">
                  {language === 'pt' ? 'Fog • Administração' : 'Fog • Administration'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {language === 'pt' ? 'Gestão Comercial & IA' : 'Commercial & AI Management'}
                </span>
              </div>
            </div>
          </div>

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

            {/* Dark / Light Theme Toggle Button */}
            {setDarkMode && (
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg text-xs transition-colors cursor-pointer border ${
                  darkMode
                    ? 'bg-slate-900 border-slate-700/70 text-amber-300 hover:bg-slate-800'
                    : 'bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300'
                }`}
                title={language === 'pt' ? 'Alternar tema claro/escuro' : 'Toggle light/dark theme'}
                aria-label="Alternar tema"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

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
                  <span>{language === 'pt' ? 'Sair' : 'Sign out'}</span>
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
            <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400">
              {language === 'pt' ? 'A verificar sessão de administrador...' : 'Checking administrator session...'}
            </p>
          </div>
        ) : !currentUser ? (
          <div
            className={`max-w-md mx-auto rounded-3xl p-8 border text-center shadow-xl space-y-6 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-500 border border-sky-500/20 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                {language === 'pt' ? 'Área de Administração' : 'Administration Area'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'pt'
                  ? 'Acesso restrito para consulta e orçamentação de pedidos com Inteligência Artificial.'
                  : 'Restricted access for reviewing and quoting requests with Artificial Intelligence.'}
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>{language === 'pt' ? 'Entrar com Conta Google' : 'Sign in with Google Account'}</span>
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
              <h2 className="text-xl sm:text-2xl font-bold">
                {language === 'pt' ? 'Autorização Pendente' : 'Pending Authorization'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'pt'
                  ? 'O seu login com a conta Google foi concluído com sucesso, mas o seu utilizador ainda não tem privilégios de administrador atribuídos.'
                  : 'Your Google sign-in succeeded, but your account does not have administrator privileges assigned yet.'}
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
              }`}
            >
              <strong className="block text-slate-300 font-bold uppercase tracking-wider">
                {language === 'pt' ? 'O seu UID Firebase é:' : 'Your Firebase UID is:'}
              </strong>
              <div className="font-mono text-sm font-bold text-sky-400 select-all p-2 bg-black/40 rounded-lg border border-slate-700">
                {userUid}
              </div>
              <p className="text-slate-400 pt-1">
                {language === 'pt'
                  ? 'Para ter acesso, adicione este identificador como variável de ambiente no Secrets do AI Studio:'
                  : 'To gain access, add this identifier as an environment variable in AI Studio Secrets:'}
                <br />
                <code className="text-sky-400 font-mono">ADMIN_UID="{userUid}"</code>
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => verifyAdminStatus(currentUser)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white transition-all cursor-pointer"
              >
                {language === 'pt' ? 'Verificar Novamente' : 'Verify Again'}
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl font-bold text-xs border border-slate-600 hover:bg-slate-800 text-slate-300 transition-all cursor-pointer"
              >
                {language === 'pt' ? 'Terminar Sessão' : 'Sign Out'}
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
                  <strong>{language === 'pt' ? 'Modo de aula:' : 'Class mode:'}</strong>{' '}
                  {language === 'pt'
                    ? 'as notificações são enviadas apenas para o email do aluno. Os clientes não recebem emails.'
                    : 'notifications are sent only to the student\'s email. Customers do not receive emails.'}
                </span>
              </div>
              <button
                onClick={() => fetchAdminData()}
                disabled={loadingData}
                className="px-3 py-1.5 rounded-lg font-bold text-xs bg-sky-900/60 hover:bg-sky-800 border border-sky-700 text-white flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{language === 'pt' ? 'Atualizar' : 'Refresh'}</span>
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
                <span>
                  {language === 'pt' ? 'Pedidos & Propostas' : 'Requests & Proposals'} ({pedidos.length})
                </span>
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
                <span>
                  {language === 'pt' ? 'Catálogo de Produtos & Serviços' : 'Products & Services Catalog'} ({catalogo.length})
                </span>
              </button>
            </div>

            {/* CONTEÚDO DA ABA 1: PEDIDOS E PROPOSTAS */}
            {activeTab === 'pedidos' && (
              <div className="space-y-4">
                {/* Filtros por Estado */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`font-semibold mr-1 ${darkMode ? 'text-slate-400' : 'text-slate-700'}`}>
                    {language === 'pt' ? 'Filtrar por estado:' : 'Filter by status:'}
                  </span>
                  {[
                    { id: 'todos', label: language === 'pt' ? 'Todos' : 'All' },
                    { id: 'recebido', label: language === 'pt' ? 'Recebido' : 'Received' },
                    { id: 'em_analise', label: language === 'pt' ? 'Em Análise' : 'In Analysis' },
                    { id: 'necessita_revisao', label: language === 'pt' ? 'Necessita de Revisão' : 'Needs Review' },
                    { id: 'proposta_criada', label: language === 'pt' ? 'Proposta Criada' : 'Proposal Created' },
                    { id: 'aceite', label: language === 'pt' ? 'Aceite' : 'Accepted' },
                    { id: 'rejeitado', label: language === 'pt' ? 'Rejeitado' : 'Rejected' },
                    { id: 'erro', label: language === 'pt' ? 'Erro' : 'Error' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFilterEstado(f.id)}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer border ${
                        filterEstado === f.id
                          ? darkMode
                            ? 'bg-white text-black border-white'
                            : 'bg-black text-white border-black'
                          : darkMode
                          ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          : 'bg-slate-100 border-slate-300 text-black hover:text-white hover:bg-black'
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
                          <th className="py-3 px-4">{language === 'pt' ? 'Data' : 'Date'}</th>
                          <th className="py-3 px-4">{language === 'pt' ? 'Cliente' : 'Client'}</th>
                          <th className="py-3 px-4">{language === 'pt' ? 'Resumo do Pedido' : 'Request Summary'}</th>
                          <th className="py-3 px-3 text-center">{language === 'pt' ? 'Estado' : 'Status'}</th>
                          <th className="py-3 px-4 text-right">{language === 'pt' ? 'Valor da Proposta' : 'Proposal Amount'}</th>
                          <th className="py-3 px-3 text-center">{language === 'pt' ? 'Notificação ao Aluno' : 'Student Notification'}</th>
                          <th className="py-3 px-4 text-center">{language === 'pt' ? 'Ações' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredPedidos.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-12 text-slate-500">
                              {language === 'pt'
                                ? 'Nenhum pedido registado com o filtro selecionado.'
                                : 'No requests recorded with the selected filter.'}
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
                                {new Date(pedido.dataCriacao).toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-GB', {
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
                                  {getLocalizedAIText(pedido.interpretacaoIA?.resumo || pedido.pedidoTexto, language)}
                                </p>
                              </td>
                              <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                <div className="inline-flex flex-col items-center gap-1">
                                  {getStatusBadge(pedido.estadoProcessamento)}
                                  <select
                                    value={pedido.estadoProcessamento}
                                    onChange={(e) => handleAlterarEstadoPedido(pedido.id, e.target.value)}
                                    disabled={actionLoading}
                                    className={`text-[10px] py-0.5 px-1.5 rounded border font-semibold cursor-pointer ${
                                      darkMode
                                        ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                                        : 'bg-white border-slate-300 text-slate-700 hover:text-black'
                                    }`}
                                    title={language === 'pt' ? 'Alterar estado diretamente' : 'Change status directly'}
                                  >
                                    <option value="necessita_revisao">{language === 'pt' ? 'Revisão' : 'Review'}</option>
                                    <option value="proposta_criada">{language === 'pt' ? 'Proposta Criada' : 'Proposal'}</option>
                                    <option value="aceite">{language === 'pt' ? 'Aceite' : 'Accepted'}</option>
                                    <option value="em_analise">{language === 'pt' ? 'Em Análise' : 'In Analysis'}</option>
                                    <option value="recebido">{language === 'pt' ? 'Recebido' : 'Received'}</option>
                                    <option value="rejeitado">{language === 'pt' ? 'Rejeitado' : 'Rejected'}</option>
                                  </select>
                                </div>
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
                                      setShowManualEditor(false);
                                      setManualItems([]);
                                      setManualResumo(pedido.interpretacaoIA?.resumo || '');
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                    title={language === 'pt' ? 'Ver detalhes e processamento' : 'View details and processing'}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSelectedPedido(pedido);
                                      setActionMessage(null);
                                      setShowManualEditor(true);
                                      if (pedido.proposta?.itens && pedido.proposta.itens.length > 0) {
                                        setManualItems(
                                          pedido.proposta.itens.map((it: any) => ({
                                            catalogoId: it.catalogoId,
                                            quantidade: it.quantidade,
                                          }))
                                        );
                                      } else {
                                        setManualItems([]);
                                      }
                                      setManualResumo(pedido.interpretacaoIA?.resumo || '');
                                    }}
                                    className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                                    title={language === 'pt' ? 'Editar estado e itens da proposta' : 'Edit status and proposal items'}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>

                                  {pedido.proposta?.token && (
                                    <a
                                      href={`/proposta/${pedido.proposta.token}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 hover:text-emerald-300 transition-colors"
                                      title={language === 'pt' ? 'Abrir página pública da proposta' : 'Open public proposal page'}
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
                    {language === 'pt'
                      ? 'Fonte de verdade para cálculo automático de propostas pela aplicação.'
                      : 'Single source of truth for automated proposal calculations.'}
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
                        condicoes: language === 'pt' ? 'Preço fictício de demonstração pedagógica.' : 'Fictitious demo price.',
                        demonstracao: true,
                      });
                      setIsCreatingItem(true);
                    }}
                    className="px-3.5 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'pt' ? 'Adicionar Produto / Serviço' : 'Add Product / Service'}</span>
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
                          <th className="py-3 px-4">{language === 'pt' ? 'Identificador' : 'Identifier'}</th>
                          <th className="py-3 px-4">{language === 'pt' ? 'Nome & Descrição' : 'Name & Description'}</th>
                          <th className="py-3 px-3 text-center">{language === 'pt' ? 'Unidade' : 'Unit'}</th>
                          <th className="py-3 px-4 text-right">{language === 'pt' ? 'Preço Unitário' : 'Unit Price'}</th>
                          <th className="py-3 px-3 text-center">{language === 'pt' ? 'Estado' : 'Status'}</th>
                          <th className="py-3 px-4 text-center">{language === 'pt' ? 'Ações' : 'Actions'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {catalogo.map((item) => {
                          const loc = getLocalizedCatalogItem(item, language);
                          return (
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
                                <span className="font-bold block text-sm">{loc.nome}</span>
                                <span className="text-xs text-slate-400 block mt-0.5">
                                  {loc.descricao}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-center font-mono text-xs uppercase text-slate-400">
                                {loc.unidade}
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
                                {item.ativo ? (language === 'pt' ? 'Ativo' : 'Active') : (language === 'pt' ? 'Inativo' : 'Inactive')}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => {
                                  setEditingItem(item);
                                  setIsCreatingItem(false);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title={language === 'pt' ? 'Editar item' : 'Edit item'}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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
                    <span>{language === 'pt' ? 'Detalhe do Pedido' : 'Request Details'}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {selectedPedido.id}
                    </span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {language === 'pt' ? 'Cliente:' : 'Client:'} <strong>{selectedPedido.nome}</strong> ({selectedPedido.email})
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

              {/* Gestão e Edição do Estado do Pedido pelo Administrador */}
              <div
                className={`p-4 rounded-2xl border space-y-3 ${
                  darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {language === 'pt' ? 'Estado do Pedido:' : 'Request Status:'}
                      </span>
                      {getStatusBadge(selectedPedido.estadoProcessamento)}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {language === 'pt'
                        ? 'Altere o estado aqui se aceitou incorretamente ou se pretender colocar em revisão para orçamentação manual.'
                        : 'Change status here if you wrongly accepted it or wish to put in review for manual quoting.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-300 whitespace-nowrap">
                      {language === 'pt' ? 'Alterar Estado:' : 'Change Status:'}
                    </label>
                    <select
                      value={selectedPedido.estadoProcessamento}
                      onChange={(e) => handleAlterarEstadoPedido(selectedPedido.id, e.target.value)}
                      disabled={actionLoading}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                        darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-black'
                      }`}
                    >
                      <option value="necessita_revisao">
                        {language === 'pt' ? 'Necessita de Revisão (Permite Correção)' : 'Needs Review (Allows Correction)'}
                      </option>
                      <option value="proposta_criada">
                        {language === 'pt' ? 'Proposta Criada' : 'Proposal Created'}
                      </option>
                      <option value="aceite">
                        {language === 'pt' ? 'Aceite' : 'Accepted'}
                      </option>
                      <option value="em_analise">
                        {language === 'pt' ? 'Em Análise' : 'In Analysis'}
                      </option>
                      <option value="recebido">
                        {language === 'pt' ? 'Recebido' : 'Received'}
                      </option>
                      <option value="rejeitado">
                        {language === 'pt' ? 'Rejeitado' : 'Rejected'}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Texto Original */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'pt' ? 'Texto Original do Pedido:' : 'Original Request Text:'}
                </label>
                <div
                  className={`p-4 rounded-xl border font-mono text-xs leading-relaxed whitespace-pre-line ${
                    darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {language === 'pt' ? selectedPedido.pedidoTexto : getLocalizedAIText(selectedPedido.pedidoTexto, 'en')}
                  {language === 'en' && getLocalizedAIText(selectedPedido.pedidoTexto, 'en') !== selectedPedido.pedidoTexto && (
                    <span className="block mt-2 pt-2 border-t border-slate-800/50 text-[11px] text-slate-400 font-sans italic">
                      Original (PT): "{selectedPedido.pedidoTexto}"
                    </span>
                  )}
                </div>
              </div>

              {/* Interpretação da IA */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'pt' ? 'Interpretação Estruturada da IA (Gemini):' : 'Structured AI Interpretation (Gemini):'}</span>
                </label>

                {selectedPedido.interpretacaoIA ? (
                  <div
                    className={`p-4 rounded-xl border space-y-3 text-xs ${
                      darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <strong className="text-slate-400">{language === 'pt' ? 'Resumo:' : 'Summary:'}</strong>{' '}
                      <span>{getLocalizedAIText(selectedPedido.interpretacaoIA.resumo, language)}</span>
                    </div>

                    <div>
                      <strong className="text-slate-400 block mb-1">{language === 'pt' ? 'Itens Mapeados:' : 'Mapped Items:'}</strong>
                      {selectedPedido.interpretacaoIA.itens?.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-2">
                          {selectedPedido.interpretacaoIA.itens.map((it: any, i: number) => {
                            const catItem = catalogo.find(
                              (c) => c.id.toLowerCase() === (it.catalogoId || '').toLowerCase()
                            );
                            const loc = getLocalizedCatalogItem(
                              {
                                id: it.catalogoId,
                                nome: catItem?.nome || it.catalogoId,
                                descricao: catItem?.descricao,
                                condicoes: catItem?.condicoes,
                                unidade: catItem?.unidade,
                              },
                              language,
                              it.quantidade || 1
                            );
                            return (
                              <li key={i} className="py-0.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <strong className="text-sky-400 font-bold">{loc.nome}</strong>
                                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                                    {it.catalogoId}
                                  </span>
                                  <span className="text-slate-300">
                                    — {language === 'pt' ? 'Qtd:' : 'Qty:'}{' '}
                                    <strong className="font-mono text-emerald-400">
                                      {it.quantidade !== null
                                        ? `${it.quantidade} ${loc.unidade}`
                                        : language === 'pt'
                                        ? '(não especificada)'
                                        : '(not specified)'}
                                    </strong>
                                  </span>
                                </div>
                                {loc.descricao && (
                                  <span className="text-[11px] text-slate-400 block mt-0.5">
                                    {loc.descricao}
                                  </span>
                                )}
                                {it.evidencia && (
                                  <span className="text-slate-400 italic block mt-0.5">
                                    {language === 'pt' ? 'Evidência:' : 'Evidence:'} "{getLocalizedAIText(it.evidencia, language)}"
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <span className="text-slate-500 italic">
                          {language === 'pt' ? 'Nenhum item mapeado automaticamente.' : 'No items mapped automatically.'}
                        </span>
                      )}
                    </div>

                    {selectedPedido.interpretacaoIA.informacaoEmFalta?.length > 0 && (
                      <div className="text-amber-400">
                        <strong>{language === 'pt' ? 'Informação em falta:' : 'Missing information:'}</strong>
                        <ul className="list-disc pl-5 space-y-0.5 mt-1">
                          {selectedPedido.interpretacaoIA.informacaoEmFalta.map((info: string, i: number) => (
                            <li key={i}>{getLocalizedAIText(info, language)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedPedido.interpretacaoIA.motivoRevisao && (
                      <div className="text-amber-400">
                        <strong>{language === 'pt' ? 'Motivo de Revisão:' : 'Review Reason:'}</strong>{' '}
                        <span>{getLocalizedAIText(selectedPedido.interpretacaoIA.motivoRevisao, language)}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">{language === 'pt' ? 'Sem interpretação registada.' : 'No interpretation recorded.'}</p>
                )}
              </div>

              {/* Proposta Associada (se existir) */}
              {selectedPedido.proposta && (
                <div
                  className={`p-4 rounded-2xl border space-y-3 ${
                    darkMode ? 'bg-emerald-950/20 border-emerald-800/50' : 'bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-emerald-400 font-bold block">
                        {language === 'pt' ? 'Proposta Emitida:' : 'Issued Proposal:'} {selectedPedido.proposta.numeroProposta}
                      </span>
                      <span className="text-xl font-bold font-mono text-emerald-500">
                        {formatEuro(selectedPedido.proposta.totalCentimos)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          setShowManualEditor(true);
                          if (selectedPedido.proposta?.itens && selectedPedido.proposta.itens.length > 0) {
                            setManualItems(
                              selectedPedido.proposta.itens.map((it: any) => ({
                                catalogoId: it.catalogoId,
                                quantidade: it.quantidade,
                              }))
                            );
                          } else if (
                            selectedPedido.interpretacaoIA?.itens &&
                            selectedPedido.interpretacaoIA.itens.length > 0
                          ) {
                            setManualItems(
                              selectedPedido.interpretacaoIA.itens
                                .filter((it: any) => it.quantidade && it.quantidade > 0)
                                .map((it: any) => ({
                                  catalogoId: it.catalogoId,
                                  quantidade: it.quantidade || 1,
                                }))
                            );
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                        title={language === 'pt' ? 'Corrigir ou ajustar itens da proposta' : 'Correct or adjust proposal items'}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>{language === 'pt' ? 'Corrigir / Ajustar Itens' : 'Correct / Adjust Items'}</span>
                      </button>

                      <a
                        href={`/proposta/${selectedPedido.proposta.token}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{language === 'pt' ? 'Abrir Proposta' : 'Open Proposal'}</span>
                      </a>

                      <button
                        onClick={() => handleReenviarNotificacao(selectedPedido.proposta!.id)}
                        disabled={actionLoading}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{language === 'pt' ? 'Reenviar Notificação ao Aluno' : 'Resend Student Notification'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Ferramenta de Resolução Manual / Ajuste para Pedidos */}
              {(selectedPedido.estadoProcessamento === 'necessita_revisao' || showManualEditor) && (
                <div
                  className={`p-5 rounded-2xl border space-y-4 ${
                    darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      <span>{language === 'pt' ? 'Resolver / Ajustar Proposta (Orçamento Manual)' : 'Resolve / Adjust Proposal (Manual Quote)'}</span>
                    </h4>
                    {showManualEditor && selectedPedido.estadoProcessamento !== 'necessita_revisao' && (
                      <button
                        onClick={() => setShowManualEditor(false)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        {language === 'pt' ? 'Cancelar Edição' : 'Cancel Edit'}
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">
                      {language === 'pt'
                        ? 'Selecione os produtos/serviços e as respetivas quantidades a orçamentar:'
                        : 'Select the products/services and respective quantities to quote:'}
                    </p>

                    <div className="space-y-2">
                      {catalogo.filter((c) => c.ativo).map((item) => {
                        const selecionado = manualItems.find((m) => m.catalogoId === item.id);
                        const loc = getLocalizedCatalogItem(item, language, selecionado?.quantidade || 1);
                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                              selecionado
                                ? 'bg-emerald-950/30 border-emerald-600 text-white'
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            <div className="max-w-md pr-2">
                              <strong className="block text-sm">{loc.nome}</strong>
                              <span className="text-xs text-slate-400 block line-clamp-1">{loc.descricao}</span>
                              <span className="font-mono text-emerald-400">
                                {formatEuro(item.precoUnitarioCentimos)} / {loc.unidade}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {selecionado ? (
                                <div className="flex items-center gap-2">
                                  <label className="text-[11px] text-slate-400">{language === 'pt' ? 'Qtd:' : 'Qty:'}</label>
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
                                    className="p-1 rounded text-rose-400 hover:text-rose-300 cursor-pointer"
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
                                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
                                >
                                  {language === 'pt' ? '+ Incluir' : '+ Include'}
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
                        {actionLoading ? (language === 'pt' ? 'A calcular...' : 'Calculating...') : (language === 'pt' ? 'Calcular e Salvar Proposta' : 'Calculate & Save Proposal')}
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
                  <span>{language === 'pt' ? 'Repetir Processamento com IA' : 'Retry AI Processing'}</span>
                </button>

                <button
                  onClick={() => setSelectedPedido(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  {language === 'pt' ? 'Fechar' : 'Close'}
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
                  {isCreatingItem
                    ? (language === 'pt' ? 'Adicionar Produto ao Catálogo' : 'Add Product to Catalog')
                    : (language === 'pt' ? 'Editar Produto do Catálogo' : 'Edit Catalog Product')}
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
                  <label className="font-bold text-slate-300">{language === 'pt' ? 'Identificador (ID):' : 'Identifier (ID):'}</label>
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
                  <label className="font-bold text-slate-300">{language === 'pt' ? 'Nome do Produto / Serviço:' : 'Product / Service Name:'}</label>
                  <input
                    type="text"
                    required
                    value={editingItem.nome}
                    onChange={(e) => setEditingItem({ ...editingItem, nome: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">{language === 'pt' ? 'Descrição Comercial:' : 'Commercial Description:'}</label>
                  <textarea
                    rows={2}
                    value={editingItem.descricao}
                    onChange={(e) => setEditingItem({ ...editingItem, descricao: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">{language === 'pt' ? 'Unidade de Venda:' : 'Sales Unit:'}</label>
                    <select
                      value={editingItem.unidade}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, unidade: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-slate-700 text-xs font-mono"
                    >
                      <option value="unidade">{language === 'pt' ? 'Unidade' : 'Unit'}</option>
                      <option value="hora">{language === 'pt' ? 'Hora' : 'Hour'}</option>
                      <option value="pacote">{language === 'pt' ? 'Pacote' : 'Package'}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">{language === 'pt' ? 'Preço em Cêntimos (€):' : 'Price in Cents (€):'}</label>
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
                      {language === 'pt' ? 'Ex: 54900 cêntimos = 549,00 €' : 'E.g.: 54900 cents = €549.00'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">{language === 'pt' ? 'Condições / Âmbito:' : 'Terms / Scope:'}</label>
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
                    {language === 'pt' ? 'Item Ativo no Catálogo' : 'Active Item in Catalog'}
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                  >
                    {language === 'pt' ? 'Cancelar' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-white cursor-pointer shadow-md"
                  >
                    {language === 'pt' ? 'Guardar no Catálogo' : 'Save to Catalog'}
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
