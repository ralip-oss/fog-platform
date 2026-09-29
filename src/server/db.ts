import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  Firestore,
} from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

export interface CatalogoItem {
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

export type EstadoProcessamento =
  | 'recebido'
  | 'em_analise'
  | 'necessita_revisao'
  | 'proposta_criada'
  | 'erro';

export interface InterpretacaoIA {
  resumo: string;
  itens: {
    catalogoId: string;
    quantidade: number | null;
    evidencia: string;
  }[];
  prazoPedido: string | null;
  informacaoEmFalta: string[];
  necessitaRevisao: boolean;
  motivoRevisao: string | null;
}

export interface Pedido {
  id: string;
  nome: string;
  email: string;
  pedidoTexto: string;
  dataCriacao: string;
  dataAtualizacao: string;
  estadoProcessamento: EstadoProcessamento;
  interpretacaoIA?: InterpretacaoIA | null;
  informacaoEmFalta?: string[];
  motivoRevisao?: string | null;
  propostaId?: string | null;
  erroProcessamento?: string | null;
}

export interface PropostaItem {
  catalogoId: string;
  nome: string;
  descricao: string;
  unidade: string;
  precoUnitarioCentimos: number;
  quantidade: number;
  subtotalCentimos: number;
  condicoes?: string;
}

export type EstadoNotificacao = 'por_enviar' | 'aceite' | 'falhou' | 'nao_configurado';

export interface Proposta {
  id: string;
  numeroProposta: string;
  pedidoId: string;
  dataCriacao: string;
  dataValidade: string;
  resumoAmbito: string;
  itens: PropostaItem[];
  totalCentimos: number;
  condicoes: string;
  token: string;
  linkAcesso: string;
  estadoNotificacao: EstadoNotificacao;
  emailServiceId?: string | null;
  dataTentativaEnvio?: string | null;
  erroEnvio?: string | null;
  demonstracao: boolean;
}

// 5 default demo items aligned with Fog's PC gaming platform
const ITENS_DEMO_FOG: CatalogoItem[] = [
  {
    id: 'FOG-DECK-OLED',
    nome: 'Fog Deck OLED 512GB',
    descricao: 'Consola portátil de jogos para PC com ecrã OLED 90Hz HDR, 16GB LPDDR5 e Fog OS nativo.',
    unidade: 'unidade',
    precoUnitarioCentimos: 54900, // 549,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Garantia de 2 anos de hardware. Preço fictício de demonstração para fins pedagógicos.',
    demonstracao: true,
  },
  {
    id: 'FOG-DEV-LICENSE',
    nome: 'Licença de Publicação Fogworks (por jogo)',
    descricao: 'Taxa de integração e publicação de título independente no ecossistema global Fog e APIs da loja.',
    unidade: 'unidade',
    precoUnitarioCentimos: 9900, // 99,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Inclui acesso integral ao SDK Fogworks e telemetria de vendas. Preço fictício de demonstração.',
    demonstracao: true,
  },
  {
    id: 'FOG-VERIFIED-AUDIT',
    nome: "Auditoria e Certificação Técnica 'Fog Deck Verified'",
    descricao: 'Avaliação técnica de compatibilidade de comandos, estabilidade de framerate e legibilidade de texto.',
    unidade: 'unidade',
    precoUnitarioCentimos: 35000, // 350,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Relatório de validação e selo oficial emitido em até 7 dias úteis. Preço fictício de demonstração.',
    demonstracao: true,
  },
  {
    id: 'FOG-STUDIO-SUPPORT',
    nome: 'Pacote de Suporte Dedicado a Estúdios (mensal)',
    descricao: 'Apoio de engenharia prioritário 24/7 para integração de backend multiplayer, cloud saves e anti-cheat.',
    unidade: 'pacote',
    precoUnitarioCentimos: 25000, // 250,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Acesso a canal de comunicação direto com a equipa técnica. Preço fictício de demonstração.',
    demonstracao: true,
  },
  {
    id: 'FOG-DEDICATED-SERVER',
    nome: 'Servidor Dedicado Fog Multiplayer (pacote mensal)',
    descricao: 'Instância em cloud otimizada para matchmaking e relay de baixa latência em data centers europeus.',
    unidade: 'pacote',
    precoUnitarioCentimos: 12000, // 120,00 €
    moeda: 'EUR',
    ativo: true,
    condicoes: 'Capacidade até 1.000 utilizadores em simultâneo. Preço fictício de demonstração pedagógica.',
    demonstracao: true,
  },
];

let firestoreInstance: Firestore | null = null;

export function getDb(): Firestore {
  if (firestoreInstance) return firestoreInstance;

  const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  let config: Record<string, any> = {};

  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (e) {
      console.error('[DB] Erro ao ler firebase-applet-config.json:', e);
    }
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  firestoreInstance = getFirestore(app, config.firestoreDatabaseId || undefined);
  return firestoreInstance;
}

/**
 * Inicializa o catálogo com os 5 registos de demonstração sem duplicar
 * nem substituir alterações já feitas pelo aluno.
 */
export async function initCatalogoIfEmpty(): Promise<void> {
  const db = getDb();
  try {
    const colRef = collection(db, 'catalogo');
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      console.log('[DB] Catálogo vazio. A inicializar com 5 registos de demonstração pedagógica...');
      for (const item of ITENS_DEMO_FOG) {
        await setDoc(doc(db, 'catalogo', item.id), item);
      }
      console.log('[DB] Catálogo inicializado com sucesso.');
    }
  } catch (err) {
    console.error('[DB] Erro ao verificar/inicializar catálogo:', err);
  }
}

/**
 * Devolve todos os itens do catálogo (ou apenas os ativos).
 */
export async function getCatalogo(activeOnly = false): Promise<CatalogoItem[]> {
  const db = getDb();
  await initCatalogoIfEmpty();
  const colRef = collection(db, 'catalogo');
  const snapshot = await getDocs(colRef);
  const items: CatalogoItem[] = [];

  snapshot.forEach((d) => {
    const data = d.data() as CatalogoItem;
    if (!activeOnly || data.ativo !== false) {
      items.push({ ...data, id: d.id });
    }
  });

  return items;
}

/**
 * Guarda ou atualiza um item no catálogo.
 */
export async function saveCatalogoItem(item: CatalogoItem): Promise<void> {
  const db = getDb();
  const docRef = doc(db, 'catalogo', item.id);
  await setDoc(docRef, item, { merge: true });
}

/**
 * Guarda um novo pedido de proposta no Firestore.
 */
export async function createPedido(
  pedido: Omit<Pedido, 'dataCriacao' | 'dataAtualizacao' | 'estadoProcessamento'>
): Promise<Pedido> {
  const db = getDb();
  const now = new Date().toISOString();
  const novoPedido: Pedido = {
    ...pedido,
    dataCriacao: now,
    dataAtualizacao: now,
    estadoProcessamento: 'recebido',
  };

  const docRef = doc(db, 'pedidos', novoPedido.id);
  await setDoc(docRef, novoPedido);
  return novoPedido;
}

/**
 * Atualiza o estado e campos de um pedido existente.
 */
export async function updatePedido(
  pedidoId: string,
  campos: Partial<Pedido>
): Promise<void> {
  const db = getDb();
  const docRef = doc(db, 'pedidos', pedidoId);
  await updateDoc(docRef, {
    ...campos,
    dataAtualizacao: new Date().toISOString(),
  });
}

/**
 * Obtém um pedido pelo ID.
 */
export async function getPedido(pedidoId: string): Promise<Pedido | null> {
  const db = getDb();
  const docRef = doc(db, 'pedidos', pedidoId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { ...(snap.data() as Pedido), id: snap.id };
}

/**
 * Lista todos os pedidos ordenados por data decrescente.
 */
export async function listPedidos(): Promise<Pedido[]> {
  const db = getDb();
  const colRef = collection(db, 'pedidos');
  const snap = await getDocs(colRef);
  const pedidos: Pedido[] = [];

  snap.forEach((d) => {
    pedidos.push({ ...(d.data() as Pedido), id: d.id });
  });

  // Ordena pelo mais recente
  return pedidos.sort((a, b) => (b.dataCriacao || '').localeCompare(a.dataCriacao || ''));
}

/**
 * Cria uma nova proposta comercial no Firestore.
 */
export async function createProposta(proposta: Proposta): Promise<Proposta> {
  const db = getDb();
  const docRef = doc(db, 'propostas', proposta.id);
  await setDoc(docRef, proposta);
  return proposta;
}

/**
 * Obtém uma proposta através do token único aleatório.
 */
export async function getPropostaByToken(token: string): Promise<Proposta | null> {
  const db = getDb();
  const colRef = collection(db, 'propostas');
  const q = query(colRef, where('token', '==', token));
  const snap = await getDocs(q);

  if (snap.empty) return null;
  const d = snap.docs[0];
  return { ...(d.data() as Proposta), id: d.id };
}

/**
 * Obtém uma proposta pelo ID.
 */
export async function getProposta(propostaId: string): Promise<Proposta | null> {
  const db = getDb();
  const docRef = doc(db, 'propostas', propostaId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { ...(snap.data() as Proposta), id: snap.id };
}

/**
 * Atualiza campos de uma proposta (ex: estado de envio da notificação).
 */
export async function updateProposta(
  propostaId: string,
  campos: Partial<Proposta>
): Promise<void> {
  const db = getDb();
  const docRef = doc(db, 'propostas', propostaId);
  await updateDoc(docRef, campos);
}

/**
 * Lista todas as propostas existentes.
 */
export async function listPropostas(): Promise<Proposta[]> {
  const db = getDb();
  const colRef = collection(db, 'propostas');
  const snap = await getDocs(colRef);
  const propostas: Proposta[] = [];

  snap.forEach((d) => {
    propostas.push({ ...(d.data() as Proposta), id: d.id });
  });

  return propostas.sort((a, b) => (b.dataCriacao || '').localeCompare(a.dataCriacao || ''));
}
