import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import crypto from 'crypto';

import {
  initCatalogoIfEmpty,
  getCatalogo,
  createPedido,
  getPedido,
  updatePedido,
  listPedidos,
  getPropostaByToken,
  getProposta,
  listPropostas,
  saveCatalogoItem,
  CatalogoItem,
} from './src/server/db';
import {
  interpretarPedidoComGemini,
  interpretarPedidoComHeuristica,
} from './src/server/geminiService';
import { calcularEGerarProposta } from './src/server/calculatorService';
import { enviarNotificacaoAoAluno } from './src/server/emailService';
import { requireAdminAuth, AuthenticatedRequest } from './src/server/authMiddleware';

dotenv.config();

// Simple in-memory rate limiter to prevent spam submissions
const submissionTimestamps = new Map<string, number>();

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const lastTime = submissionTimestamps.get(identifier);
  if (lastTime && now - lastTime < 10000) {
    // 10-second cooldown per identifier
    return true;
  }
  submissionTimestamps.set(identifier, now);
  return false;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  // Inicializa o catálogo de demonstração caso esteja vazio
  initCatalogoIfEmpty().catch((e) => console.error('[Init] Erro ao inicializar catálogo:', e));

  // ==========================================
  // ROTAS PÚBLICAS
  // ==========================================

  /**
   * Catálogo público de produtos e serviços ativos
   */
  app.get('/api/catalogo', async (req: Request, res: Response) => {
    try {
      const itens = await getCatalogo(true);
      res.json({ itens });
    } catch (err: any) {
      console.error('[API] Erro ao carregar catálogo:', err);
      res.status(500).json({ error: 'Erro ao carregar catálogo.' });
    }
  });

  /**
   * Submissão pública de pedido de proposta
   */
  app.post('/api/pedidos', async (req: Request, res: Response): Promise<void> => {
    try {
      const { nome, email, pedidoTexto } = req.body;

      // Validação estrita de campos
      if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
        res.status(400).json({ error: 'O nome é de preenchimento obrigatório.' });
        return;
      }

      if (nome.trim().length > 100) {
        res.status(400).json({ error: 'O nome não pode exceder 100 caracteres.' });
        return;
      }

      if (!email || typeof email !== 'string' || email.trim().length === 0) {
        res.status(400).json({ error: 'O email é de preenchimento obrigatório.' });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim()) || email.trim().length > 150) {
        res.status(400).json({ error: 'Por favor, introduza um endereço de email válido.' });
        return;
      }

      if (!pedidoTexto || typeof pedidoTexto !== 'string' || pedidoTexto.trim().length === 0) {
        res.status(400).json({ error: 'O campo do pedido é de preenchimento obrigatório.' });
        return;
      }

      if (pedidoTexto.trim().length < 8) {
        res.status(400).json({
          error: 'Por favor, descreva o seu pedido com mais detalhe (mínimo 8 caracteres).',
        });
        return;
      }

      if (pedidoTexto.trim().length > 3000) {
        res.status(400).json({ error: 'O texto do pedido não pode exceder 3.000 caracteres.' });
        return;
      }

      // Proteção anti-spam básica
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
      if (isRateLimited(`${clientIp}_${email.trim().toLowerCase()}`)) {
        res.status(429).json({
          error: 'Aguarde alguns segundos antes de submeter outro pedido.',
        });
        return;
      }

      // 1. Guardar o pedido imediatamente no Firestore antes de qualquer chamada externa
      const pedidoId = `ped-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
      const novoPedido = await createPedido({
        id: pedidoId,
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        pedidoTexto: pedidoTexto.trim(),
      });

      console.log(`[API] Novo pedido guardado no Firestore: ${pedidoId}`);

      // 2. Consulta o catálogo ativo no Firestore
      const catalogoAtivo = await getCatalogo(true);
      const catalogoMap = new Map<string, CatalogoItem>();
      catalogoAtivo.forEach((c) => catalogoMap.set(c.id, c));

      // 3. Interpretação com Gemini (apenas texto e catálogo, NUNCA nome ou email)
      let interpretacao = null;
      try {
        await updatePedido(pedidoId, { estadoProcessamento: 'em_analise' });
        interpretacao = await interpretarPedidoComGemini(pedidoTexto.trim(), catalogoAtivo);

        await updatePedido(pedidoId, {
          interpretacaoIA: interpretacao,
          informacaoEmFalta: interpretacao.informacaoEmFalta || [],
          motivoRevisao: interpretacao.motivoRevisao || null,
        });
      } catch (geminiErr: any) {
        console.error('[API] Erro no processamento Gemini:', geminiErr.message || geminiErr);
        interpretacao = interpretarPedidoComHeuristica(pedidoTexto.trim(), catalogoAtivo);

        await updatePedido(pedidoId, {
          interpretacaoIA: interpretacao,
          informacaoEmFalta: interpretacao.informacaoEmFalta || [],
          motivoRevisao: `Processado com motor de catálogo alternativo (IA em alta procura temporária): ${geminiErr.message || ''}`,
        });
      }

      // 4. Cálculo da proposta no backend com preços do catálogo
      const appBaseUrl =
        process.env.APP_BASE_URL ||
        `${req.protocol}://${req.get('host')}`;

      const calculo = await calcularEGerarProposta(
        { ...novoPedido, interpretacaoIA: interpretacao },
        interpretacao,
        catalogoMap,
        appBaseUrl
      );

      // 5. Se foi gerada proposta, envia notificação interna por email ao aluno via Resend
      if (calculo.elegivel && calculo.proposta) {
        enviarNotificacaoAoAluno(calculo.proposta, pedidoId).catch((err) =>
          console.error('[API] Erro assíncrono ao notificar aluno:', err)
        );
      }

      // 6. Resposta ao cliente: Estritamente a mensagem requerida
      res.json({
        success: true,
        pedidoId,
        message: 'O seu pedido foi recebido com sucesso.',
        estadoProcessamento: calculo.elegivel ? 'proposta_criada' : 'necessita_revisao',
        propostaToken: calculo.proposta?.token || null,
      });
    } catch (err: any) {
      console.error('[API] Erro ao criar pedido:', err);
      res.status(500).json({ error: 'Ocorreu um erro interno ao processar o seu pedido.' });
    }
  });

  /**
   * Consulta pública de proposta individual por token
   * Devolve exclusivamente dados seguros da proposta (sem email do cliente ou pedidos alheios)
   */
  app.get('/api/propostas/:token', async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;

      if (!token || typeof token !== 'string' || token.length < 16) {
        res.status(400).json({ error: 'Token de proposta inválido.' });
        return;
      }

      const proposta = await getPropostaByToken(token);

      if (!proposta) {
        res.status(404).json({
          error: 'Proposta não encontrada ou link expirado.',
        });
        return;
      }

      // Retorno controlado e seguro
      res.json({
        proposta: {
          numeroProposta: proposta.numeroProposta,
          dataCriacao: proposta.dataCriacao,
          dataValidade: proposta.dataValidade,
          resumoAmbito: proposta.resumoAmbito,
          itens: proposta.itens,
          totalCentimos: proposta.totalCentimos,
          condicoes: proposta.condicoes,
          demonstracao: proposta.demonstracao,
          negocio: {
            nome: 'Fog Store & Gaming Ecosystem',
            descricao: 'A plataforma definitiva para videojogos e hardware de alto desempenho para PC.',
            contacto: 'suporte@fog.local',
          },
        },
      });
    } catch (err: any) {
      console.error('[API] Erro ao consultar proposta por token:', err);
      res.status(500).json({ error: 'Erro ao carregar proposta.' });
    }
  });

  // ==========================================
  // ROTAS ADMINISTRATIVAS PROTEGIDAS
  // ==========================================

  /**
   * Informação sobre o utilizador autenticado e estado de configuração
   */
  app.get('/api/admin/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({
      user: req.user,
      adminUidConfigurado: Boolean(process.env.ADMIN_UID),
      resendConfigured: Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_ALUNO),
      emailAluno: process.env.EMAIL_ALUNO || null,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
      appBaseUrl: process.env.APP_BASE_URL || `${req.protocol}://${req.get('host')}`,
    });
  });

  /**
   * Lista todos os pedidos com detalhes de propostas associadas
   */
  app.get('/api/admin/pedidos', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const pedidos = await listPedidos();
      const propostas = await listPropostas();
      const propostasMap = new Map<string, any>();
      propostas.forEach((p) => propostasMap.set(p.id, p));

      const pedidosCompletos = pedidos.map((p) => {
        const proposta = p.propostaId ? propostasMap.get(p.propostaId) : null;
        return {
          ...p,
          proposta: proposta
            ? {
                id: proposta.id,
                numeroProposta: proposta.numeroProposta,
                totalCentimos: proposta.totalCentimos,
                estadoNotificacao: proposta.estadoNotificacao,
                linkAcesso: proposta.linkAcesso,
                token: proposta.token,
                itens: proposta.itens || [],
              }
            : null,
        };
      });

      res.json({ pedidos: pedidosCompletos });
    } catch (err: any) {
      console.error('[API Admin] Erro ao listar pedidos:', err);
      res.status(500).json({ error: 'Erro ao listar pedidos.' });
    }
  });

  /**
   * Detalhes completos de um pedido específico
   */
  app.get('/api/admin/pedidos/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const pedido = await getPedido(req.params.id);
      if (!pedido) {
        res.status(404).json({ error: 'Pedido não encontrado.' });
        return;
      }

      let proposta = null;
      if (pedido.propostaId) {
        proposta = await getProposta(pedido.propostaId);
      }

      res.json({ pedido, proposta });
    } catch (err: any) {
      console.error('[API Admin] Erro ao obter detalhe do pedido:', err);
      res.status(500).json({ error: 'Erro ao carregar detalhe do pedido.' });
    }
  });

  /**
   * Repetir processamento com IA para um pedido existente
   */
  app.post('/api/admin/pedidos/:id/reprocessar', requireAdminAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const pedido = await getPedido(req.params.id);
      if (!pedido) {
        res.status(404).json({ error: 'Pedido não encontrado.' });
        return;
      }

      const catalogoAtivo = await getCatalogo(true);
      const catalogoMap = new Map<string, CatalogoItem>();
      catalogoAtivo.forEach((c) => catalogoMap.set(c.id, c));

      await updatePedido(pedido.id, { estadoProcessamento: 'em_analise', erroProcessamento: null });

      const interpretacao = await interpretarPedidoComGemini(pedido.pedidoTexto, catalogoAtivo);

      await updatePedido(pedido.id, {
        interpretacaoIA: interpretacao,
        informacaoEmFalta: interpretacao.informacaoEmFalta || [],
        motivoRevisao: interpretacao.motivoRevisao || null,
      });

      const appBaseUrl =
        process.env.APP_BASE_URL ||
        `${req.protocol}://${req.get('host')}`;

      const calculo = await calcularEGerarProposta(
        { ...pedido, interpretacaoIA: interpretacao },
        interpretacao,
        catalogoMap,
        appBaseUrl
      );

      if (calculo.elegivel && calculo.proposta) {
        enviarNotificacaoAoAluno(calculo.proposta, pedido.id).catch((e) =>
          console.error('[API Admin] Erro ao enviar notificação:', e)
        );
      }

      const pedidoAtualizado = await getPedido(pedido.id);
      res.json({
        success: true,
        pedido: pedidoAtualizado,
        proposta: calculo.proposta || null,
        calculo,
      });
    } catch (err: any) {
      console.error('[API Admin] Erro ao reprocessar pedido:', err);
      await updatePedido(req.params.id, {
        estadoProcessamento: 'erro',
        erroProcessamento: err.message || 'Erro durante reprocessamento',
      });
      res.status(500).json({ error: err.message || 'Erro ao reprocessar pedido.' });
    }
  });

  /**
   * Resolver manualmente um pedido em revisão e calcular proposta
   */
  app.post('/api/admin/pedidos/:id/recalcular', requireAdminAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { itens, resumoCustomizado } = req.body;
      const pedido = await getPedido(req.params.id);

      if (!pedido) {
        res.status(404).json({ error: 'Pedido não encontrado.' });
        return;
      }

      if (!Array.isArray(itens) || itens.length === 0) {
        res.status(400).json({ error: 'Deverá indicar pelo menos um item para orçamentação.' });
        return;
      }

      const catalogoAtivo = await getCatalogo(false);
      const catalogoMap = new Map<string, CatalogoItem>();
      catalogoAtivo.forEach((c) => catalogoMap.set(c.id, c));

      const interpretacaoManual = {
        resumo: resumoCustomizado || pedido.interpretacaoIA?.resumo || 'Proposta aprovada manualmente pelo administrador.',
        itens: itens.map((it: any) => ({
          catalogoId: it.catalogoId,
          quantidade: Number(it.quantidade),
          evidencia: 'Seleção manual realizada pelo administrador na área de gestão.',
        })),
        prazoPedido: pedido.interpretacaoIA?.prazoPedido || null,
        informacaoEmFalta: [],
        necessitaRevisao: false,
        motivoRevisao: null,
      };

      const appBaseUrl =
        process.env.APP_BASE_URL ||
        `${req.protocol}://${req.get('host')}`;

      const calculo = await calcularEGerarProposta(
        pedido,
        interpretacaoManual,
        catalogoMap,
        appBaseUrl
      );

      if (calculo.elegivel && calculo.proposta) {
        enviarNotificacaoAoAluno(calculo.proposta, pedido.id).catch((e) =>
          console.error('[API Admin] Erro ao enviar notificação:', e)
        );
      }

      const pedidoAtualizado = await getPedido(pedido.id);
      res.json({
        success: true,
        pedido: pedidoAtualizado,
        proposta: calculo.proposta,
      });
    } catch (err: any) {
      console.error('[API Admin] Erro ao recalcular proposta manualmente:', err);
      res.status(500).json({ error: err.message || 'Erro ao recalcular proposta.' });
    }
  });

  /**
   * Alterar o estado de um pedido / proposta pelo administrador
   */
  app.patch('/api/admin/pedidos/:id/estado', requireAdminAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { estadoProcessamento, motivoRevisao } = req.body;
      const pedido = await getPedido(req.params.id);

      if (!pedido) {
        res.status(404).json({ error: 'Pedido não encontrado.' });
        return;
      }

      const estadosValidos = [
        'necessita_revisao',
        'proposta_criada',
        'aceite',
        'em_analise',
        'rejeitado',
        'recebido',
        'erro',
      ];
      if (!estadosValidos.includes(estadoProcessamento)) {
        res.status(400).json({ error: 'Estado de processamento inválido.' });
        return;
      }

      const updates: any = {
        estadoProcessamento,
      };

      if (motivoRevisao !== undefined) {
        updates.motivoRevisao = motivoRevisao;
      }

      // Se o administrador colocar novamente em revisão manual
      if (estadoProcessamento === 'necessita_revisao') {
        updates.necessitaRevisao = true;
        if (pedido.interpretacaoIA) {
          updates.interpretacaoIA = {
            ...pedido.interpretacaoIA,
            necessitaRevisao: true,
            motivoRevisao:
              motivoRevisao ||
              pedido.interpretacaoIA.motivoRevisao ||
              'Colocado em revisão manual pelo administrador para correção.',
          };
        }
      }

      await updatePedido(pedido.id, updates);
      const pedidoAtualizado = await getPedido(pedido.id);

      // Obter proposta associada se existir
      const propostas = await listPropostas();
      const proposta = propostas.find((p) => p.pedidoId === pedido.id) || null;

      res.json({
        success: true,
        pedido: {
          ...pedidoAtualizado,
          proposta,
        },
      });
    } catch (err: any) {
      console.error('[API Admin] Erro ao alterar estado do pedido:', err);
      res.status(500).json({ error: err.message || 'Erro ao alterar estado do pedido.' });
    }
  });

  /**
   * Reenviar notificação interna por email ao aluno
   */
  app.post('/api/admin/propostas/:id/reenviar-notificacao', requireAdminAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const proposta = await getProposta(req.params.id);
      if (!proposta) {
        res.status(404).json({ error: 'Proposta não encontrada.' });
        return;
      }

      const resultado = await enviarNotificacaoAoAluno(proposta, proposta.pedidoId);
      const propostaAtualizada = await getProposta(proposta.id);

      res.json({
        success: resultado.estado === 'aceite',
        resultado,
        proposta: propostaAtualizada,
      });
    } catch (err: any) {
      console.error('[API Admin] Erro ao reenviar notificação:', err);
      res.status(500).json({ error: err.message || 'Erro ao reenviar notificação.' });
    }
  });

  /**
   * Gestão do catálogo: listar todos
   */
  app.get('/api/admin/catalogo', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const itens = await getCatalogo(false);
      res.json({ itens });
    } catch (err: any) {
      console.error('[API Admin] Erro ao listar catálogo:', err);
      res.status(500).json({ error: 'Erro ao listar catálogo.' });
    }
  });

  /**
   * Gestão do catálogo: criar ou editar item
   */
  app.post('/api/admin/catalogo', requireAdminAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id, nome, descricao, unidade, precoUnitarioCentimos, ativo, condicoes } = req.body;

      if (!id || !nome || !unidade || typeof precoUnitarioCentimos !== 'number') {
        res.status(400).json({ error: 'Campos obrigatórios em falta ou inválidos.' });
        return;
      }

      const novoItem: CatalogoItem = {
        id: String(id).trim().toUpperCase(),
        nome: String(nome).trim(),
        descricao: String(descricao || '').trim(),
        unidade: unidade as 'unidade' | 'hora' | 'pacote',
        precoUnitarioCentimos: Math.round(precoUnitarioCentimos),
        moeda: 'EUR',
        ativo: Boolean(ativo),
        condicoes: String(condicoes || 'Preço fictício de demonstração pedagógica.').trim(),
        demonstracao: true,
      };

      await saveCatalogoItem(novoItem);
      res.json({ success: true, item: novoItem });
    } catch (err: any) {
      console.error('[API Admin] Erro ao guardar item do catálogo:', err);
      res.status(500).json({ error: 'Erro ao guardar item no catálogo.' });
    }
  });

  /**
   * Gestão do catálogo: alterar estado ativo/inativo
   */
  app.put('/api/admin/catalogo/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const campos = req.body;

      const catalogo = await getCatalogo(false);
      const existente = catalogo.find((c) => c.id === id);

      if (!existente) {
        res.status(404).json({ error: 'Item do catálogo não encontrado.' });
        return;
      }

      const atualizado: CatalogoItem = {
        ...existente,
        ...campos,
        id: existente.id, // ID não muda
      };

      await saveCatalogoItem(atualizado);
      res.json({ success: true, item: atualizado });
    } catch (err: any) {
      console.error('[API Admin] Erro ao atualizar item do catálogo:', err);
      res.status(500).json({ error: 'Erro ao atualizar item no catálogo.' });
    }
  });

  // ==========================================
  // MONTAGEM DO VITE / FICHEIROS ESTÁTICOS
  // ==========================================
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Servidor backend a correr em http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Falha fatal no arranque do servidor:', err);
  process.exit(1);
});
