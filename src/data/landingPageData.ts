import { Persona, FeatureItem, FAQItem, ShowcaseGame } from '../types/landingPage';
import { Language } from '../context/LanguageContext';

export const HERO_DATA_EN = {
  problemStatement: "PC gaming shouldn't require juggling seven bloated launchers, losing save files between devices, or gambling $70 on games that flop without refunds.",
  headline: "Your Entire Gaming Universe. One Seamless, Risk-Free Library.",
  subheadline: "Instant access to 50,000+ titles, transparent peer reviews, cross-device cloud saves, and a 14-day no-questions-asked refund guarantee on every single game.",
  primaryCtaText: "Install Fog — It's Free",
  secondaryCtaText: "Explore 50,000+ Games",
  stats: [
    { value: "35,420,000+", label: "Concurrent Players Online" },
    { value: "50,000+", label: "Games & Software Titles" },
    { value: "100%", label: "Cloud Save Sync Reliability" },
    { value: "14 Days", label: "No-Risk Refund Window" }
  ]
};

export const HERO_DATA_PT = {
  problemStatement: "O gaming no PC não devia exigir gerir sete lançadores pesados, perder ficheiros de gravação entre dispositivos ou arriscar 70€ em jogos que desiludem sem direito a reembolso.",
  headline: "Todo o Teu Universo de Jogos. Uma Biblioteca Segura.",
  subheadline: "Acesso imediato a +50.000 títulos, análises transparentes da comunidade, gravações na cloud entre dispositivos e garantia de reembolso incondicional de 14 dias em todos os jogos.",
  primaryCtaText: "Instalar Fog — É Grátis",
  secondaryCtaText: "Explorar +50.000 Jogos",
  stats: [
    { value: "35.420.000+", label: "Jogadores em Simultâneo" },
    { value: "50.000+", label: "Jogos & Títulos Disponíveis" },
    { value: "100%", label: "Fiabilidade de Gravação Cloud" },
    { value: "14 Dias", label: "Prazo de Devolução Sem Risco" }
  ]
};

export const HERO_DATA = HERO_DATA_PT;

export const PERSONAS_DATA_EN: Persona[] = [
  {
    id: "pc-enthusiast",
    role: "The Hardcore PC Enthusiast & Competitive Gamer",
    badge: "Maximum Performance",
    iconName: "Cpu",
    tagline: "Wants zero launcher overhead, uncompromised frame rates, and low-latency servers.",
    keyFrustration: "Dealing with fragmented, sluggish third-party launchers, bloated background services that hurt frame rates, and losing precision controller calibrations.",
    desiredOutcome: "A centralized, lightweight launcher with pre-compiled Vulkan/DirectX shaders, universal controller mapping, and instant low-ping matchmaking.",
    heroQuote: "I built a high-end rig to play games, not to troubleshoot four different proprietary stores every time I launch an FPS.",
    steamSolution: "Automated shader caching, native Fog Input for 300+ controllers, and low-overhead server infrastructure.",
    statsHighlight: "+15% faster boot times via automated shader precaching"
  },
  {
    id: "handheld-nomad",
    role: "The Handheld & On-The-Go Explorer",
    badge: "Play Anywhere",
    iconName: "Gamepad2",
    tagline: "Refuses to buy console ports twice or worry if games will run on handheld devices.",
    keyFrustration: "Being tethered to a desk, losing save games when switching between PC and portable hardware, and guessing whether a game supports analog sticks.",
    desiredOutcome: "Seamless progression across desktop and handheld (Fog Deck), verified hardware performance ratings, and instant cloud resume.",
    heroQuote: "I want to start a 100-hour RPG on my desktop and continue playing from my couch or a train with zero friction.",
    steamSolution: "Fog Deck Verified program, instant dynamic cloud synchronization, and offline gameplay support.",
    statsHighlight: "14,000+ Fog Deck Verified & Playable titles ready out of the box"
  },
  {
    id: "value-explorer",
    role: "The Value-Conscious Weekend Explorer",
    badge: "Zero Buyer Remorse",
    iconName: "Sparkles",
    tagline: "Prioritizes high-value bargains, genuine player consensus, and financial safety.",
    keyFrustration: "Spending $70 on overhyped titles only to discover bugs, deceptive trailers, and zero refund recourse from traditional digital storefronts.",
    desiredOutcome: "Legitimate sales up to 90% off, transparent peer review scores from actual verified buyers, and a hassle-free money-back guarantee.",
    heroQuote: "I don't trust sponsored marketing. I want real player reviews and the confidence that if a game doesn't work, I get my money back.",
    steamSolution: "Automated 14-day / 2-hour refund policy, seasonal festivals with deep discounts, and transparent review sentiment breakdowns.",
    statsHighlight: "$1.4B+ saved annually by players during Fog Seasonal Sales"
  }
];

export const PERSONAS_DATA_PT: Persona[] = [
  {
    id: "pc-enthusiast",
    role: "O Entusiasta de PC & Jogador Competitivo",
    badge: "Desempenho Máximo",
    iconName: "Cpu",
    tagline: "Exige zero sobrecarga de launcher, taxas de frames intactas e servidores de latência ultra-baixa.",
    keyFrustration: "Lidar com launchers pesados e lentos de terceiros, processos de fundo que reduzem FPS e perda de calibrações de comandos.",
    desiredOutcome: "Um launcher centralizado e leve com shaders Vulkan/DirectX pré-compilados, suporte universal a comandos e emparelhamento de baixa latência.",
    heroQuote: "Montei um computador de topo para desfrutar de jogos, não para resolver avarias de 4 lojas diferentes antes de abrir um FPS.",
    steamSolution: "Pré-carregamento automático de shaders, suporte Fog Input para mais de 300 comandos e servidores otimizados.",
    statsHighlight: "+15% arranques mais rápidos com pré-cache de shaders"
  },
  {
    id: "handheld-nomad",
    role: "O Explorador Portátil & Em Movimento",
    badge: "Joga Onde Quiseres",
    iconName: "Gamepad2",
    tagline: "Recusa pagar duas vezes pelo mesmo jogo ou duvidar se o título corre bem em consolas portáteis.",
    keyFrustration: "Estar preso à secretária, perder saves ao alternar entre PC e consola portátil, e adivinhar se um jogo suporta comandos analógicos.",
    desiredOutcome: "Progressão imediata entre computador e consola portátil (Fog Deck), garantias de fluidez e retoma automática na cloud.",
    heroQuote: "Quero começar um RPG de 100 horas no meu escritório e continuar a jogá-lo no sofá ou no comboio com zero esforço.",
    steamSolution: "Selo Fog Deck Verified, sincronização imediata na Cloud e suporte offline completo.",
    statsHighlight: "+14.000 títulos Verificados e Jogáveis no Fog Deck"
  },
  {
    id: "value-explorer",
    role: "O Explorador de Fim de Semana Consciente do Valor",
    badge: "Sem Remorsos de Compra",
    iconName: "Sparkles",
    tagline: "Prioriza promoções genuínas, opiniões reais de jogadores e segurança financeira total.",
    keyFrustration: "Gastar 70€ em jogos que prometem mundos e fundos apenas para encontrar erros, trailers enganadores e sem qualquer opção de reembolso.",
    desiredOutcome: "Promoções autênticas até 90% de desconto, avaliações sinceras de compradores verificados e reembolso imediato sem complicações.",
    heroQuote: "Não confio em marketing patrocinado. Quero análises de quem jogou e a garantia de ter o meu dinheiro de volta se o jogo desiludir.",
    steamSolution: "Política incondicional de 14 dias / menos de 2 horas, festivais sazonais e filtros contra review bombing.",
    statsHighlight: "+1.4 mil milhões de dólares poupados anualmente em saldos Fog"
  }
];

export const PERSONAS_DATA = PERSONAS_DATA_PT;

export const FEATURES_DATA_EN: FeatureItem[] = [
  {
    id: "cloud-sync",
    name: "Ubiquitous Cloud-Synced Library",
    benefit: "Pick up right where you left off across your desktop, laptop, or Fog Deck without ever managing a save file.",
    description: "Every achievement, keybinding, and game save uploads silently to Fog Cloud. Never lose 50 hours of campaign progress to a hard drive crash or hardware upgrade again.",
    iconName: "Cloud",
    metricTag: "Zero save loss"
  },
  {
    id: "deck-verified",
    name: "Fog Deck Hardware Verification",
    benefit: "Know with 100% certainty that your game will run smoothly on handheld before you spend a single dollar.",
    description: "Valve tests each title against strict graphical, legibility, and controller standards. Four clear tiers (Verified, Playable, Unsupported, Untested) eliminate hardware guesswork.",
    iconName: "MonitorPlay",
    metricTag: "14k+ Tested Games"
  },
  {
    id: "peer-reviews",
    name: "Decentralized Peer Review System",
    benefit: "Bypass misleading influencer marketing with unfiltered, verified-buyer sentiment scores you can actually trust.",
    description: "Fog only calculates review scores from users who actually own and have played the title. See recent vs. all-time ratings, hours played per reviewer, and anti-review-bombing graphs.",
    iconName: "Star",
    metricTag: "99.4% Anti-bot accuracy"
  },
  {
    id: "workshop-mods",
    name: "Fog Workshop & Modding Engine",
    benefit: "Expand your favorite games with millions of community-crafted campaigns, skins, and total overhauls in just one click.",
    description: "No manual file editing, extraction tools, or broken directory paths. Click 'Subscribe' and Fog automatically downloads, installs, and keeps community mods updated.",
    iconName: "Wrench",
    metricTag: "10M+ Free Mods"
  },
  {
    id: "refund-shield",
    name: "Unconditional 14-Day Refund Shield",
    benefit: "Purchase with total peace of mind—test any game and receive a no-questions-asked refund if you've played under 2 hours.",
    description: "Valve guarantees full refunds for any reason—whether your PC didn't meet requirements, you purchased by mistake, or you simply didn't enjoy it—within 14 days of purchase.",
    iconName: "ShieldCheck",
    metricTag: "100% No-Risk Guarantee"
  }
];

export const FEATURES_DATA_PT: FeatureItem[] = [
  {
    id: "cloud-sync",
    name: "Biblioteca Universal na Cloud",
    benefit: "Continua a jogar exatamente onde paraste no teu PC de secretária, portátil ou Fog Deck sem copiar ficheiros de gravação.",
    description: "Cada conquista, configuração de teclas e gravação é enviada de forma silenciosa para o Fog Cloud. Nunca mais percas 50 horas de jogo por avaria de disco ou mudança de computador.",
    iconName: "Cloud",
    metricTag: "Zero perdas de gravação"
  },
  {
    id: "deck-verified",
    name: "Certificação Oficial Fog Deck",
    benefit: "Sabe com 100% de precisão se o jogo corre fluentemente na tua consola portátil antes de gastares um único cêntimo.",
    description: "A Valve testa rigorosamente cada jogo: compatibilidade de controlos analógicos, gráficos otimizados para mais de 30 FPS e texto legível a 800p sem configurações manuais.",
    iconName: "MonitorPlay",
    metricTag: "+14.000 Jogos Testados"
  },
  {
    id: "peer-reviews",
    name: "Avaliações Autênticas da Comunidade",
    benefit: "Foge ao marketing enganador com pontuações reais e sem filtros de utilizadores verificados que realmente compraram e jogaram o título.",
    description: "Apenas quem possui e jogou o jogo pode avaliar. Visualiza horas jogadas pelo autor, tendências recentes vs. globais e proteção inteligente contra campanhas de difamação.",
    iconName: "Star",
    metricTag: "99.4% Rigor anti-bot"
  },
  {
    id: "workshop-mods",
    name: "Fog Workshop & Mods num Clique",
    benefit: "Amplia os teus jogos com milhões de campanhas, mapas e melhorias visuais gratuitas criadas pela comunidade com um simples clique.",
    description: "Sem ficheiros manuais nem descompactações complexas. Clica em «Subscrever» e o Fog transfere, instala e mantém os mods atualizados automaticamente.",
    iconName: "Wrench",
    metricTag: "+10 Milhões de Mods Grátis"
  },
  {
    id: "refund-shield",
    name: "Garantia Total de Reembolso de 14 Dias",
    benefit: "Compra com total tranquilidade: experimenta qualquer título e recebe o teu dinheiro de volta sem burocracias se jogaste menos de 2 horas.",
    description: "A Valve devolve o valor integral por qualquer motivo — fraco desempenho no teu equipamento, compra acidental ou simples desagrado — até 14 dias após a compra.",
    iconName: "ShieldCheck",
    metricTag: "100% Garantia Sem Risco"
  }
];

export const FEATURES_DATA = FEATURES_DATA_PT;

export const SHOWCASE_GAMES_EN: ShowcaseGame[] = [
  {
    id: "game-1",
    title: "Elden Ring: Shadow of the Erdtree",
    genre: "Action RPG • Open World",
    discount: "-25%",
    originalPrice: "$39.99",
    salePrice: "$29.99",
    reviewSentiment: "Very Positive",
    reviewPercentage: 92,
    totalReviews: "142,300",
    deckVerified: true,
    tag: "Top Seller #1",
    imageThumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "game-2",
    title: "Cyberpunk 2077: Ultimate Edition",
    genre: "Sci-Fi • Cyberpunk • Story Rich",
    discount: "-50%",
    originalPrice: "$59.99",
    salePrice: "$29.99",
    reviewSentiment: "Overwhelmingly Positive",
    reviewPercentage: 95,
    totalReviews: "650,400",
    deckVerified: true,
    tag: "Weekend Deal",
    imageThumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "game-3",
    title: "Hades II",
    genre: "Roguelike • Action • Mythology",
    discount: "-15%",
    originalPrice: "$29.99",
    salePrice: "$25.49",
    reviewSentiment: "Overwhelmingly Positive",
    reviewPercentage: 98,
    totalReviews: "89,100",
    deckVerified: true,
    tag: "Early Access Hit",
    imageThumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "game-4",
    title: "Balatro",
    genre: "Deckbuilder • Roguelike • Strategy",
    discount: "-10%",
    originalPrice: "$14.99",
    salePrice: "$13.49",
    reviewSentiment: "Overwhelmingly Positive",
    reviewPercentage: 97,
    totalReviews: "48,200",
    deckVerified: true,
    tag: "Indie Phenomenon",
    imageThumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
  }
];

export const SHOWCASE_GAMES_PT: ShowcaseGame[] = [
  {
    id: "game-1",
    title: "Elden Ring: Shadow of the Erdtree",
    genre: "RPG de Ação • Mundo Aberto",
    discount: "-25%",
    originalPrice: "39,99 €",
    salePrice: "29,99 €",
    reviewSentiment: "Muito Positivas",
    reviewPercentage: 92,
    totalReviews: "142.300",
    deckVerified: true,
    tag: "Top Vendas #1",
    imageThumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "game-2",
    title: "Cyberpunk 2077: Ultimate Edition",
    genre: "Ficção Científica • Ação • Narrativa",
    discount: "-50%",
    originalPrice: "59,99 €",
    salePrice: "29,99 €",
    reviewSentiment: "Extremamente Positivas",
    reviewPercentage: 95,
    totalReviews: "650.400",
    deckVerified: true,
    tag: "Oferta de Fim de Semana",
    imageThumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "game-3",
    title: "Hades II",
    genre: "Roguelike • Ação • Mitologia",
    discount: "-15%",
    originalPrice: "29,99 €",
    salePrice: "25,49 €",
    reviewSentiment: "Extremamente Positivas",
    reviewPercentage: 98,
    totalReviews: "89.100",
    deckVerified: true,
    tag: "Sucesso de Acesso Antecipado",
    imageThumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "game-4",
    title: "Balatro",
    genre: "Construção de Baralhos • Roguelike",
    discount: "-10%",
    originalPrice: "14,99 €",
    salePrice: "13,49 €",
    reviewSentiment: "Extremamente Positivas",
    reviewPercentage: 97,
    totalReviews: "48.200",
    deckVerified: true,
    tag: "Fenómeno Indie",
    imageThumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
  }
];

export const SHOWCASE_GAMES = SHOWCASE_GAMES_PT;

export const getHeroData = (lang: Language) => lang === 'pt' ? HERO_DATA_PT : HERO_DATA_EN;
export const getPersonasData = (lang: Language) => lang === 'pt' ? PERSONAS_DATA_PT : PERSONAS_DATA_EN;
export const getFeaturesData = (lang: Language) => lang === 'pt' ? FEATURES_DATA_PT : FEATURES_DATA_EN;
export const getShowcaseGames = (lang: Language) => lang === 'pt' ? SHOWCASE_GAMES_PT : SHOWCASE_GAMES_EN;
