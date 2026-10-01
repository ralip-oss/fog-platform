/**
 * GUIA INTERNO DE RESOLUÇÃO DE PROBLEMAS (TROUBLESHOOTING GUIDE)
 * 
 * ATENÇÃO: Este ficheiro funciona como a base de conhecimento interna e invisível
 * ao utilizador final. O ChatBot consulta este guia de diagnóstico antes de
 * fornecer qualquer resposta genérica.
 */

export interface TroubleshootingEntry {
  problemId: string;
  category: 'Instalação & Downloads' | 'Fog Cloud & Gravações' | 'Comandos & Hardware' | 'Reembolsos & Finanças' | 'Desempenho & Arranque' | 'Agendamento & Reuniões' | 'Conta & Segurança' | 'Orçamentação & Propostas';
  title: string;
  symptoms: string[];
  quickDiagnosis: string;
  stepByStepSolution: string[];
  actionSuggestion?: {
    label: string;
    targetSection?: string;
    actionType?: 'schedule_meeting' | 'open_faq' | 'install_client' | 'refund_calc' | 'proposal_request';
  };
  notes?: string;
}

export const INTERNAL_TROUBLESHOOTING_GUIDE: TroubleshootingEntry[] = [
  {
    problemId: 'trouble-cloud-sync-error',
    category: 'Fog Cloud & Gravações',
    title: 'Erro de Sincronização do Fog Cloud / Conflito de Ficheiros',
    symptoms: [
      'nuvem', 'cloud', 'sincronização', 'conflito', 'perdi o save', 'save corrompido',
      'progresso perdido', 'conflito de ficheiros', 'cloud sync error', 'nuvem desatualizada'
    ],
    quickDiagnosis: 'Ocorre quando o jogo foi encerrado sem ligação à Internet ou quando o Fog foi terminado antes do upload do save terminar nos servidores da Valve.',
    stepByStepSolution: [
      'Não selecione logo "Substituir ficheiros" se surgir a janela de aviso de conflito.',
      'Compare a data e hora do ficheiro Local versus ficheiro na Nuvem (escolha sempre o ficheiro com carimbo temporal mais recente).',
      'No Fog, clique com o botão direito no jogo > Propriedades > Geral > desative e volte a ativar a opção "Manter as gravações do jogo no Fog Cloud".',
      'Reinicie o cliente Fog com privilégios de administrador para desimpedir a sincronização de rede.'
    ],
    actionSuggestion: {
      label: 'Ler mais sobre o Fog Cloud na FAQ',
      targetSection: 'faq',
      actionType: 'open_faq'
    }
  },
  {
    problemId: 'trouble-refund-not-processed',
    category: 'Reembolsos & Finanças',
    title: 'Dúvidas ou Dificuldades no Processamento de Reembolso',
    symptoms: [
      'reembolso', 'devolução', 'devolver dinheiro', 'dinheiro de volta', 'cancelar compra',
      'reembolso recusado', 'como pedir reembolso', 'tempo de reembolso', '2 horas', '14 dias'
    ],
    quickDiagnosis: 'O sistema de reembolso automático da Valve exige que o pedido seja feito dentro de 14 dias após a compra e com menos de 2 horas de jogo registadas.',
    stepByStepSolution: [
      'Aceda ao portal oficial de suporte: help.fogpowered.com com o seu login habitual.',
      'Selecione "Compras recentes" ou procure pelo título pretendido.',
      'Escolha "Tenho um problema com esta compra" > "Gostaria de solicitar um reembolso".',
      'Indique a preferência de devolução: saldo na Carteira Fog (rápido, ~24 horas) ou método de pagamento bancário original (3-5 dias úteis).',
      'Se ultrapassou ligeiramente as 2 horas devido a um crash ou bug impeditivo, explique isso detalhadamente no campo de texto para análise manual.'
    ],
    actionSuggestion: {
      label: 'Simulador de Elegibilidade de Reembolso',
      targetSection: 'guarantee',
      actionType: 'refund_calc'
    }
  },
  {
    problemId: 'trouble-controller-not-detected',
    category: 'Comandos & Hardware',
    title: 'Comando Não Detetado ou Botões Trocados (Fog Input)',
    symptoms: [
      'comando', 'controlador', 'controller', 'gamepad', 'joystick', 'não deteta comando',
      'dualsense', 'xbox', 'switch pro', 'botões trocados', 'vibração não funciona'
    ],
    quickDiagnosis: 'Geralmente causado por conflito entre a configuração nativa do jogo e o driver intermediário Fog Input, ou drivers proprietários de terceiros.',
    stepByStepSolution: [
      'Verifique se o comando está ligado por cabo USB ou Bluetooth com bateria suficiente.',
      'No Fog, aceda a: Definições > Controlador > e confirme se a opção "Ativar entrada Fog para comandos Xbox/PlayStation/Switch" está ativada.',
      'Se o jogo específico tiver problemas, clique com o botão direito no jogo na biblioteca > Propriedades > Controlador > e altere para "Ativar Entrada Fog" (ou "Desativar" se o jogo tiver suporte nativo DualSense).',
      'Abra o modo "Big Picture" para testar o mapeamento de botões e calibração de giroscópio e analógicos.'
    ],
    actionSuggestion: {
      label: 'Consultar Secção de Hardware & Compatibilidade',
      targetSection: 'solutions',
      actionType: 'open_faq'
    }
  },
  {
    problemId: 'trouble-download-stuck',
    category: 'Instalação & Downloads',
    title: 'Download ou Atualização Bloqueada a 0 Bytes / Corrompida',
    symptoms: [
      'download preso', 'download bloqueado', '0 bytes', 'não descarrega', 'instalação parada',
      'erro de escrita no disco', 'disco cheio', 'ficheiro corrompido', 'velocidade lenta'
    ],
    quickDiagnosis: 'Geralmente decorre de cache de transferências sobrecarregada, servidor de download regional com saturação ou antivírus a bloquear a escrita.',
    stepByStepSolution: [
      'No Fog, clique em: Fog (menu superior) > Definições > Transferências.',
      'Clique no botão "Limpar cache de transferências" e aguarde que o Fog reinicie e peça novo login.',
      'No mesmo menu de Transferências, altere a "Região de transferências" para uma alternativa geograficamente próxima (ex: Portugal ou Espanha).',
      'Verifique se o seu disco tem pelo menos 20% de espaço livre em relação ao tamanho total do jogo.',
      'No jogo com erro: Propriedades > Ficheiros instalados > "Verificar integridade dos ficheiros do jogo".'
    ],
    actionSuggestion: {
      label: 'Instalar ou Atualizar Cliente Fog',
      targetSection: 'problem',
      actionType: 'install_client'
    }
  },
  {
    problemId: 'trouble-game-crash-startup',
    category: 'Desempenho & Arranque',
    title: 'Jogo Fecha Imediatamente no Arranque ou Ecrã Preto',
    symptoms: [
      'jogo não inicia', 'ecrã preto', 'crash', 'fecha sozinho', 'jogo fecha',
      'directx error', 'vulkan runtime', 'visual c++ missing', 'erro de arranque'
    ],
    quickDiagnosis: 'Falta de pacotes de runtime do sistema (DirectX, Visual C++ Redistributable) ou drivers gráficos desatualizados.',
    stepByStepSolution: [
      'Atualize os drivers da sua placa gráfica (NVIDIA GeForce Experience, AMD Adrenalin ou Intel Graphics).',
      'No Fog: Botão direito no jogo > Propriedades > Ficheiros instalados > "Verificar integridade dos ficheiros".',
      'Desative temporariamente softwares de overlay de terceiros (ex: Discord Overlay, MSI Afterburner, RivaTuner).',
      'Nas opções de arranque do jogo (Propriedades > Geral > Opções de arranque), experimente adicionar "-dx11" ou "-vulkan" se a sua placa for compatível.'
    ],
    actionSuggestion: {
      label: 'Agendar Reunião com Equipa Técnica',
      targetSection: 'agendamento',
      actionType: 'schedule_meeting'
    }
  },
  {
    problemId: 'trouble-schedule-meeting-help',
    category: 'Agendamento & Reuniões',
    title: 'Como Agendar Reunião / Sincronizar com Google Calendar via Cal.com',
    symptoms: [
      'agendar', 'marcar reunião', 'reunião', 'google calendar', 'cal.com', 'falar com especialista',
      'suporte humano', 'sessão', 'consultoria', 'demo', 'demonstração', 'contacto'
    ],
    quickDiagnosis: 'O utilizador deseja agendar um momento dedicado para suporte, demonstração ou consultoria da plataforma.',
    stepByStepSolution: [
      'Aceda diretamente à nossa secção de "Agendamento de Reunião" integrada nesta página (#agendamento).',
      'Utilize o embed do Cal.com (ligado a cal.com/respo_0/30min com sincronização automática para o Google Calendar) ou o formulário rápido de agendamento.',
      'Selecione a data, hora pretendida para a sua sessão de 30 minutos.',
      'O convite é gerado automaticamente no seu Google Calendar com link de videoconferência e lembrete.'
    ],
    actionSuggestion: {
      label: 'Agendar Sessão de 30 min (Cal.com)',
      targetSection: 'agendamento',
      actionType: 'schedule_meeting'
    }
  },
  {
    problemId: 'trouble-steam-deck-optimization',
    category: 'Comandos & Hardware',
    title: 'Dúvidas de Otimização e Desempenho no Fog Deck',
    symptoms: [
      'fog deck', 'bateria a descarregar', 'fps no deck', 'jogar portátil', 'fogos',
      'deck verified', 'proton', 'texto pequeno'
    ],
    quickDiagnosis: 'Geralmente resolvido ajustando o limitador de TDP e taxa de atualização no painel de Acesso Rápido do Fog Deck.',
    stepByStepSolution: [
      'Pressione o botão de Acesso Rápido (...) no lado direito do Fog Deck.',
      'No menu de Desempenho, defina o Limite de Fotogramas para 45 FPS ou 40 Hz (proporciona fluidez quase idêntica a 60 FPS com até +40% de autonomia de bateria).',
      'Ative o FSR (FidelityFX Super Resolution) no menu de escala caso o jogo esteja a correr a uma resolução inferior a 800p.',
      'Verifique se o jogo tem selo "Fog Deck Verified" na nossa loja antes de comprar.'
    ],
    actionSuggestion: {
      label: 'Ver Jogos Fog Deck Verified',
      targetSection: 'showcase',
      actionType: 'open_faq'
    }
  },
  {
    problemId: 'trouble-steam-guard-2fa',
    category: 'Conta & Segurança',
    title: 'Problemas de Autenticação Fog Guard ou Código 2FA Não Recebido',
    symptoms: [
      'fog guard', 'código 2fa', 'não recebo código', 'perdi o telemóvel', 'login bloqueado',
      'autenticação', 'segurança', 'recuperar conta'
    ],
    quickDiagnosis: 'Pode ocorrer devido a dessincronização de relógio no smartphone ou filtro de spam na caixa de correio eletrónico.',
    stepByStepSolution: [
      'Se utiliza a app móvel Fog Mobile: abra a aplicação, aceda ao separador Fog Guard e puxe o ecrã para baixo para forçar atualização do código.',
      'Verifique se a hora do seu telemóvel está configurada para "Automática / Fornecida pela rede". Horários manuais causam códigos expirados.',
      'Se o código é enviado por e-mail, verifique a pasta de "Spam / Lixo Eletrónico" e adicione support@fogpowered.com aos remetentes seguros.',
      'Caso tenha perdido acesso ao dispositivo móvel, utilize o seu código de recuperação R (anotado aquando da configuração inicial) no portal de recuperação.'
    ],
    actionSuggestion: {
      label: 'Mais Informações de Segurança na FAQ',
      targetSection: 'faq',
      actionType: 'open_faq'
    }
  },
  {
    problemId: 'trouble-proposal-request-workflow',
    category: 'Orçamentação & Propostas',
    title: 'Como Criar ou Resolver Dúvidas no Pedido de Proposta com IA',
    symptoms: [
      'proposta', 'pedir proposta', 'orçamento', 'orcamento', 'quanto custa', 'publicar jogo',
      'custo fog deck', 'proposta com ia', 'erro ao pedir proposta', 'proposta token',
      'proposal', 'quote', 'request proposal', 'proposal request', 'pricing'
    ],
    quickDiagnosis: 'O utilizador pretende orçamentar produtos ou serviços do ecossistema Fog (Fog Deck, publicação, auditoria técnica ou suporte a estúdios) ou esclarecer o fluxo de cálculo.',
    stepByStepSolution: [
      'Aceda ao separador "Pedido de Proposta" na barra superior (ou requisite assistência no chat ao Fogger).',
      'Preencha o Nome, Email de contacto e a descrição detalhada do pedido (mínimo de 8 caracteres).',
      'Indique com clareza as quantidades pretendidas (exemplo: 2 consolas Fog Deck, 1 publicação e 3 meses de suporte a estúdio).',
      'Ao submeter, a IA mapeia os itens ao catálogo oficial e calcula os valores líquidos em Euros sem IVA com validade de 15 dias.',
      'Clique em "Ver Proposta Gerada" para consultar a discriminação completa e imprimir ou guardar em formato PDF.'
    ],
    actionSuggestion: {
      label: 'Aceder a Pedido de Proposta',
      targetSection: 'proposta',
      actionType: 'proposal_request'
    }
  },
  {
    problemId: 'trouble-proposal-validation-errors',
    category: 'Orçamentação & Propostas',
    title: 'Erro de Validação na Submissão do Pedido de Proposta',
    symptoms: [
      'erro na submissao', 'minimo 8 caracteres', 'email invalido', 'nome obrigatorio',
      'proposta rejeitada', 'submission error', 'invalid email format', 'invalid proposal'
    ],
    quickDiagnosis: 'Geralmente ocorre quando o campo da proposta tem menos de 8 caracteres, o e-mail não cumpre a sintaxe correta ou o nome está vazio.',
    stepByStepSolution: [
      'Verifique se o campo do Nome está devidamente preenchido.',
      'Confirme que o endereço de e-mail segue o formato padrão nome@dominio.com sem espaços extras.',
      'No campo do pedido, descreva o contexto e os serviços pretendidos com pelo menos 8 caracteres explicativos.',
      'Se necessitar de um esclarecimento personalizado antes de pedir a proposta, agende uma sessão de 30 minutos com a nossa equipa no Cal.com.'
    ],
    actionSuggestion: {
      label: 'Agendar Reunião Técnica (Cal.com)',
      targetSection: 'agendamento',
      actionType: 'schedule_meeting'
    }
  },
  {
    problemId: 'trouble-proposal-needs-review',
    category: 'Orçamentação & Propostas',
    title: 'Pedido de Proposta com Estado "Necessita de Revisão"',
    symptoms: [
      'necessita de revisao', 'proposta em analise', 'revisao manual', 'por que nao recebi proposta',
      'needs review', 'pending proposal review'
    ],
    quickDiagnosis: 'Ocorre quando o pedido submetido inclui serviços à medida, itens não identificados de imediato no catálogo ou quantidades omissas.',
    stepByStepSolution: [
      'O sistema regista o pedido na base de dados com a nota de revisão detalhada.',
      'A equipa administrativa analisa o texto original no painel de administração e valida as condições técnicas.',
      'O administrador orçamenta manualmente os itens adequados e aprova a proposta.',
      'A proposta fica disponível na mesma ligação protegida por token, refletindo os valores atualizados.'
    ],
    actionSuggestion: {
      label: 'Consultar FAQ sobre Propostas',
      targetSection: 'faq',
      actionType: 'open_faq'
    }
  }
];

/**
 * Função interna consultada pelo ChatBot para encontrar a solução precisa
 * no guia de resolução de problemas antes de responder genericamente.
 */
export function searchTroubleshootingGuide(query: string): TroubleshootingEntry | null {
  if (!query || query.trim().length < 2) return null;

  const normalized = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  let bestMatch: TroubleshootingEntry | null = null;
  let highestScore = 0;

  for (const entry of INTERNAL_TROUBLESHOOTING_GUIDE) {
    let score = 0;

    // Check title match
    const normalizedTitle = entry.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes(normalizedTitle)) {
      score += 10;
    }

    // Check symptoms match
    for (const symptom of entry.symptoms) {
      const normalizedSymptom = symptom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalized.includes(normalizedSymptom)) {
        score += 4;
      }
    }

    // Check category match
    const normalizedCategory = entry.category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes(normalizedCategory)) {
      score += 2;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  // Only return if there is meaningful relevance
  if (highestScore >= 3) {
    return bestMatch;
  }

  return null;
}
