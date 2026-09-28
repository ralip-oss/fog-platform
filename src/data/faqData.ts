/**
 * Ficheiro de dados das Perguntas Frequentes (FAQ) com suporte bilingue PT (PT-PT) e EN.
 * 
 * Para adicionar ou modificar perguntas no futuro sem mexer no código dos componentes,
 * basta adicionar novos objetos ao array `FAQ_ITEMS` abaixo.
 */

export interface FAQItemData {
  id: string;
  category_pt: string;
  category_en: string;
  question_pt: string;
  question_en: string;
  answer_pt: string;
  answer_en: string;
  tags?: string[];
}

export const FAQ_CATEGORIES_PT = [
  'Todas',
  'Geral & Plataforma',
  'Reembolsos & Garantias',
  'Hardware & Fog Deck',
  'Jogos & Biblioteca',
  'Agendamento & Suporte'
] as const;

export const FAQ_CATEGORIES_EN = [
  'All',
  'General & Platform',
  'Refunds & Guarantees',
  'Hardware & Fog Deck',
  'Games & Library',
  'Booking & Support'
] as const;

export const FAQ_ITEMS: FAQItemData[] = [
  {
    id: 'faq-1',
    category_pt: 'Reembolsos & Garantias',
    category_en: 'Refunds & Guarantees',
    question_pt: 'Como funciona a política de reembolso incondicional de 14 dias?',
    question_en: "How does Fog's 14-day refund policy actually work?",
    answer_pt: 'A Valve emite reembolso por qualquer motivo em pedidos efetuados dentro de 14 dias após a compra, desde que o jogo tenha sido jogado por menos de 2 horas. Seja por problemas de desempenho no seu PC, compra por engano ou porque simplesmente não gostou, o valor é devolvido para a sua forma de pagamento original ou para a Carteira Fog em 24-48 horas.',
    answer_en: "Valve will issue a refund for nearly any purchase on Fog, for any reason. Whether your PC didn't meet hardware requirements, you bought a game accidentally, or you simply didn't enjoy it. As long as you submit the request within 14 days of purchase and have played for less than 2 hours, your refund is approved back to your payment method or Fog Wallet.",
    tags: ['reembolso', 'refund', 'garantia', '2 horas']
  },
  {
    id: 'faq-2',
    category_pt: 'Geral & Plataforma',
    category_en: 'General & Platform',
    question_pt: 'O cliente Fog e a criação de conta são totalmente gratuitos?',
    question_en: 'Is Fog free to install and create an account?',
    answer_pt: 'Sim, 100% gratuitos. Não existem taxas de adesão, mensalidades ou subscrições obrigatórias para instalar o cliente Fog ou criar conta. Apenas paga pelos jogos individuais ou conteúdos adicionais que escolher comprar, tendo ainda acesso a milhares de jogos Free-to-Play.',
    answer_en: 'Yes, 100% free. There are zero membership fees, zero monthly subscription tiers, and zero charges to install the Fog client or create an account. You only pay for the specific games and DLC you choose to buy, plus access to thousands of Free-to-Play titles.',
    tags: ['grátis', 'free', 'preço', 'conta']
  },
  {
    id: 'faq-3',
    category_pt: 'Geral & Plataforma',
    category_en: 'General & Platform',
    question_pt: 'Os preços apresentados já incluem impostos ou existem taxas ocultas?',
    question_en: 'Are prices all-inclusive or will I be hit with hidden fees at checkout?',
    answer_pt: 'Todos os preços apresentados na loja Fog incluem IVA e impostos locais aplicáveis por lei. O preço que visualiza na página do jogo é exatamente o valor debitado no seu cartão ou método de pagamento, sem custos de processamento ocultos.',
    answer_en: 'All pricing displayed in the Fog store includes local sales tax and VAT where applicable by regional law. The price you see on the store capsule is the exact price billed to your card or payment method—no surprise processing or gateway fees.',
    tags: ['iva', 'vat', 'impostos', 'taxas']
  },
  {
    id: 'faq-4',
    category_pt: 'Hardware & Fog Deck',
    category_en: 'Hardware & Fog Deck',
    question_pt: 'O que significa o selo "Fog Deck Verified"?',
    question_en: "What does 'Fog Deck Verified' mean?",
    answer_pt: 'O programa Fog Deck Verified é a certificação empírica da Valve para consolas portáteis. Um jogo com o selo verde "Verified" cumpre 4 critérios rigorosos: suporte total a comandos analógicos, gráficos pré-configurados para mais de 30 FPS estáveis, texto da interface perfeitamente legível a 800p e compatibilidade nativa com o FogOS.',
    answer_en: "Fog Deck Verified is Valve's empirical certification program for handheld gaming. When a game has the green 'Verified' badge, it meets four key criteria: full controller support, default graphics configured for 30+ FPS, readable in-game text at 800p, and seamless compatibility with FogOS without manual tweaks.",
    tags: ['fog deck', 'portátil', 'verificado', 'verified']
  },
  {
    id: 'faq-5',
    category_pt: 'Jogos & Biblioteca',
    category_en: 'Games & Library',
    question_pt: 'Posso jogar os meus jogos mesmo sem ligação à Internet (Modo Offline)?',
    question_en: "Can I play my Fog games when I don't have an internet connection?",
    answer_pt: 'Sim! O Fog dispõe de um Modo Offline completo. Após iniciar o jogo uma primeira vez com ligação ativa para validação de ficheiros, pode alternar para o Modo Offline e jogar todas as campanhas para um jogador em viagens de avião, comboio ou locais sem rede.',
    answer_en: 'Yes! Fog features a full Offline Mode. As long as you have launched the game once while connected to the internet to complete initial activation and shader downloads, you can switch Fog to Offline Mode and play your single-player campaigns on airplanes, trains, or off-grid locations.',
    tags: ['offline', 'sem internet', 'viagens', 'airplane']
  },
  {
    id: 'faq-6',
    category_pt: 'Jogos & Biblioteca',
    category_en: 'Games & Library',
    question_pt: 'Como funciona a sincronização de ficheiros de gravação na Cloud?',
    question_en: 'How does Fog Cloud save synchronization work?',
    answer_pt: 'O Fog Cloud envia silenciosamente os seus ficheiros de progresso, definições gráficas e mapeamento de comandos para os servidores seguros da Valve sempre que encerra um jogo. Ao abrir esse mesmo jogo noutro PC, portátil ou Fog Deck, o progresso é descarregado automaticamente.',
    answer_en: "Fog Cloud automatically syncs your save game files, config preferences, and controller mappings to Valve's secure servers whenever you exit a game. When you open that same title on another PC, laptop, or Fog Deck, your progress is automatically downloaded in the background so you can resume immediately.",
    tags: ['cloud', 'gravação', 'save game', 'sincronização']
  },
  {
    id: 'faq-7',
    category_pt: 'Hardware & Fog Deck',
    category_en: 'Hardware & Fog Deck',
    question_pt: 'Que comandos e sistemas operativos são suportados?',
    question_en: 'Which operating systems and controllers are supported?',
    answer_pt: 'O Fog funciona nativamente em Windows 10/11, macOS e Linux/FogOS. O sistema Fog Input suporta mais de 300 modelos de comandos, incluindo Xbox Wireless, PlayStation DualSense/PS4, Nintendo Switch Pro e comandos genéricos Bluetooth com remapeamento livre.',
    answer_en: 'Fog runs natively on Windows 10/11, macOS, and Linux/FogOS. Furthermore, Fog Input supports virtually every modern gamepad—including official Xbox Wireless, PlayStation DualSense/DualShock 4, Nintendo Switch Pro, and generic third-party Bluetooth controllers—with fully customizable gyro and button remapping.',
    tags: ['comandos', 'controllers', 'windows', 'mac', 'linux']
  },
  {
    id: 'faq-8',
    category_pt: 'Jogos & Biblioteca',
    category_en: 'Games & Library',
    question_pt: 'Posso partilhar a minha biblioteca com membros da família?',
    question_en: 'Can I share my purchased games with my family members?',
    answer_pt: 'Sim, através do Fog Families! Pode criar um grupo familiar com até 6 membros para partilhar o acesso a uma biblioteca conjunta. Cada membro mantém as suas próprias gravações, conquistas e histórico de jogo individual, podendo membros distintos jogar títulos diferentes em simultâneo.',
    answer_en: 'Yes, through Fog Families! You can create a family group of up to 6 members to share access to an eligible unified family library. Each family member maintains their own separate saves, achievements, and play history, and multiple members can play different games from the shared library simultaneously.',
    tags: ['família', 'family', 'partilha', 'sharing']
  },
  {
    id: 'faq-9',
    category_pt: 'Geral & Plataforma',
    category_en: 'General & Platform',
    question_pt: 'O Fog Workshop e os mods criados pela comunidade são seguros?',
    question_en: 'What is Fog Workshop and are community mods safe?',
    answer_pt: 'Sim. O Fog Workshop é um repositório integrado onde instala modificações com apenas um clique no botão "Subscrever". Os ficheiros são alojados na CDN segura da Valve e analisados automaticamente para deteção de ameaças, eliminando o perigo de descarregar ficheiros de fontes suspeitas.',
    answer_en: "Fog Workshop is a built-in community mod repository where players can browse, share, and install user-created modifications with a single click. Mods are hosted directly on Fog's secure CDN and automatically checked for malicious files, eliminating the risks associated with downloading executable files from unknown forums.",
    tags: ['workshop', 'mods', 'segurança', 'security']
  },
  {
    id: 'faq-10',
    category_pt: 'Agendamento & Suporte',
    category_en: 'Booking & Support',
    question_pt: 'Como funciona o agendamento de reuniões e suporte direto via Cal.com?',
    question_en: 'How does meeting scheduling and direct support via Cal.com work?',
    answer_pt: 'Pode agendar uma sessão individual de suporte, demonstração técnica ou consultoria diretamente através da nossa secção de agendamento integrada com o Cal.com. A reunião fica automaticamente sincronizada com o seu Google Calendar, com envio de convites e links de videoconferência.',
    answer_en: 'You can book a 1-on-1 technical consultation or support demo directly through our integrated Cal.com scheduling system. Your meeting is automatically synced with Google Calendar, including invitations and video call links.',
    tags: ['agendamento', 'booking', 'reunião', 'cal.com', 'google calendar']
  },
  {
    id: 'faq-11',
    category_pt: 'Agendamento & Suporte',
    category_en: 'Booking & Support',
    question_pt: 'Onde posso tirar dúvidas rápidas ou resolver problemas de instalação?',
    question_en: 'Where can I ask quick questions or troubleshoot installation issues?',
    answer_pt: 'Pode utilizar o nosso ChatBot de Assistência Rápida (disponível no botão flutuante no canto inferior direito), que consulta imediatamente o nosso guia de resolução técnica. Se o problema necessitar de acompanhamento humano, pode agendar uma reunião no mesmo instante.',
    answer_en: 'You can use our Quick Support ChatBot (available via the floating button in the bottom right corner), which immediately consults our technical troubleshooting guide. If the issue requires human support, you can book a meeting instantly.',
    tags: ['chatbot', 'assistente', 'ajuda', 'suporte']
  },
  {
    id: 'faq-12',
    category_pt: 'Geral & Plataforma',
    category_en: 'General & Platform',
    question_pt: 'Como protejo a minha conta contra acessos indevidos?',
    question_en: 'How does Fog protect my account and security?',
    answer_pt: 'O Fog inclui autenticação de dois fatores Fog Guard (via aplicação móvel iOS/Android ou e-mail), além de proteção automática de trocas e Valve Anti-Cheat (VAC) para garantir integridade e proteção contra acessos não autorizados.',
    answer_en: 'Fog includes Valve Anti-Cheat (VAC) to protect multiplayer integrity from hackers and Fog Guard two-factor authentication (via the Fog Mobile App on iOS/Android or email) to ensure no unauthorized user can log into your account.',
    tags: ['segurança', 'security', 'fog guard', '2fa', 'vac']
  }
];

export const getFaqCategories = (lang: 'pt' | 'en') => {
  return lang === 'pt' ? FAQ_CATEGORIES_PT : FAQ_CATEGORIES_EN;
};

export const getFaqItems = (lang: 'pt' | 'en') => {
  return FAQ_ITEMS.map((item) => ({
    id: item.id,
    category: lang === 'pt' ? item.category_pt : item.category_en,
    question: lang === 'pt' ? item.question_pt : item.question_en,
    answer: lang === 'pt' ? item.answer_pt : item.answer_en,
    tags: item.tags
  }));
};
