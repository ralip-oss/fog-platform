import crypto from 'crypto';
import {
  CatalogoItem,
  InterpretacaoIA,
  Pedido,
  Proposta,
  PropostaItem,
  createProposta,
  updateProposta,
  listPropostas,
  updatePedido,
} from './db';

export interface ResultadoCalculo {
  elegivel: boolean;
  proposta?: Proposta;
  motivoRevisao?: string;
  informacaoEmFalta?: string[];
}

/**
 * Calcula e gera uma proposta comercial baseada estritamente no código do backend,
 * utilizando os preços do catálogo do Firestore.
 */
export async function calcularEGerarProposta(
  pedido: Pedido,
  interpretacao: InterpretacaoIA,
  catalogoMap: Map<string, CatalogoItem>,
  appBaseUrl: string
): Promise<ResultadoCalculo> {
  // Se a IA sinalizou necessidade de revisão humana ou se faltar informação essencial
  if (interpretacao.necessitaRevisao) {
    await updatePedido(pedido.id, {
      estadoProcessamento: 'necessita_revisao',
      motivoRevisao: interpretacao.motivoRevisao || 'Pedido incompleto ou necessita de validação humana.',
      informacaoEmFalta: interpretacao.informacaoEmFalta || [],
    });

    return {
      elegivel: false,
      motivoRevisao: interpretacao.motivoRevisao || 'Pedido necessita de revisão comercial.',
      informacaoEmFalta: interpretacao.informacaoEmFalta || [],
    };
  }

  // Se não existirem itens válidos
  if (!interpretacao.itens || interpretacao.itens.length === 0) {
    const motivo = 'Nenhum item válido do catálogo foi identificado para orçamentação.';
    await updatePedido(pedido.id, {
      estadoProcessamento: 'necessita_revisao',
      motivoRevisao: motivo,
      informacaoEmFalta: ['Quais os produtos ou serviços da Fog pretendidos?'],
    });

    return {
      elegivel: false,
      motivoRevisao: motivo,
      informacaoEmFalta: ['Quais os produtos ou serviços pretendidos?'],
    };
  }

  const itensCalculados: PropostaItem[] = [];
  let totalCentimos = 0;

  for (const itemPedido of interpretacao.itens) {
    const produto = catalogoMap.get(itemPedido.catalogoId);

    // Validação de segurança: item deve existir e estar ativo
    if (!produto || !produto.ativo) {
      const motivo = `O produto/serviço "${itemPedido.catalogoId}" não está ativo no catálogo.`;
      await updatePedido(pedido.id, {
        estadoProcessamento: 'necessita_revisao',
        motivoRevisao: motivo,
      });
      return { elegivel: false, motivoRevisao: motivo };
    }

    // Quantidade tem de ser um número positivo válido
    const qtd = itemPedido.quantidade;
    if (qtd === null || qtd === undefined || typeof qtd !== 'number' || qtd <= 0 || isNaN(qtd)) {
      const motivo = `Quantidade inválida ou não especificada para o item "${produto.nome}".`;
      await updatePedido(pedido.id, {
        estadoProcessamento: 'necessita_revisao',
        motivoRevisao: motivo,
      });
      return { elegivel: false, motivoRevisao: motivo };
    }

    // Fórmula obrigatória: subtotal do item = quantidade * preço unitário
    const subtotal = Math.round(qtd * produto.precoUnitarioCentimos);
    totalCentimos += subtotal;

    // Guarda snapshot congelado dos dados do catálogo para garantir imutabilidade
    itensCalculados.push({
      catalogoId: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      unidade: produto.unidade,
      precoUnitarioCentimos: produto.precoUnitarioCentimos,
      quantidade: qtd,
      subtotalCentimos: subtotal,
      condicoes: produto.condicoes,
    });
  }

  // Gera número sequencial de proposta amigável
  const propostasExistentes = await listPropostas();
  const propostasDoPedido = propostasExistentes.filter((p) => p.pedidoId === pedido.id);

  // Se já existe proposta para este pedido, atualiza-a com os novos itens e totais corrigidos
  if (propostasDoPedido.length > 0) {
    const propostaExistente = propostasDoPedido[0];
    const camposAtualizados = {
      resumoAmbito: interpretacao.resumo || 'Fornecimento e prestação de serviços no ecossistema Fog.',
      itens: itensCalculados,
      totalCentimos,
    };
    await updateProposta(propostaExistente.id, camposAtualizados);
    await updatePedido(pedido.id, {
      estadoProcessamento: 'proposta_criada',
      propostaId: propostaExistente.id,
      motivoRevisao: null,
      interpretacaoIA: interpretacao,
    });
    return {
      elegivel: true,
      proposta: {
        ...propostaExistente,
        ...camposAtualizados,
      },
    };
  }

  const numeroProposta = `PROP-2026-${String(propostasExistentes.length + 1).padStart(3, '0')}`;
  const propostaId = `prop-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const token = crypto.randomBytes(24).toString('hex'); // Token longo e criptograficamente seguro

  // Validade de 15 dias para demonstração
  const dataCriacao = new Date().toISOString();
  const dataValidade = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();

  const baseUrl = (appBaseUrl || '').replace(/\/$/, '');
  const linkAcesso = baseUrl ? `${baseUrl}/proposta/${token}` : `/proposta/${token}`;

  const novaProposta: Proposta = {
    id: propostaId,
    numeroProposta,
    pedidoId: pedido.id,
    dataCriacao,
    dataValidade,
    resumoAmbito: interpretacao.resumo || 'Fornecimento e prestação de serviços no ecossistema Fog.',
    itens: itensCalculados,
    totalCentimos,
    condicoes:
      'Proposta válida por 15 dias. Valores apresentados em Euros (€) líquidos de impostos (Total sem IVA). Preços e itens congelados na data de emissão. Sujeito aos termos de serviço e garantia da plataforma Fog.',
    token,
    linkAcesso,
    estadoNotificacao: 'por_enviar',
    demonstracao: true,
  };

  await createProposta(novaProposta);

  // Atualiza o pedido com sucesso e ligação à proposta
  await updatePedido(pedido.id, {
    estadoProcessamento: 'proposta_criada',
    propostaId: novaProposta.id,
    motivoRevisao: null,
  });

  return { elegivel: true, proposta: novaProposta };
}
