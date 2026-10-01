import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en';

export interface Translations {
  // Navigation
  nav_main: string;
  nav_solutions: string;
  nav_guarantee: string;
  nav_faq: string;
  nav_proposal: string;
  nav_booking: string;
  nav_proposal_booking: string;
  nav_install: string;
  nav_back_to_main: string;
  
  // Hero Section
  hero_problem_tag: string;
  hero_problem: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_primary_cta: string;
  hero_secondary_cta: string;
  hero_microcopy: string;
  hero_stat_players: string;
  hero_stat_games: string;
  hero_stat_cloud: string;
  hero_stat_refund: string;
  hero_now_playing: string;
  hero_verified: string;
  hero_positive_reviews: string;

  // Personas / Target Audience
  audience_title: string;
  audience_subtitle: string;
  audience_key_frustration: string;
  audience_desired_outcome: string;
  audience_steam_solution: string;

  // Features / Solutions
  features_title: string;
  features_subtitle: string;
  features_pillar: string;

  // Showcase
  showcase_title: string;
  showcase_subtitle: string;
  showcase_all: string;
  showcase_deck_verified: string;
  showcase_specials: string;
  showcase_reviews: string;
  showcase_free: string;
  showcase_buy_now: string;

  // Refund Simulator
  simulator_title: string;
  simulator_subtitle: string;
  simulator_hours_played: string;
  simulator_days_since: string;
  simulator_reason: string;
  simulator_reason_perf: string;
  simulator_reason_mistake: string;
  simulator_reason_dislike: string;
  simulator_reason_other: string;
  simulator_status_approved: string;
  simulator_status_manual: string;
  simulator_eligible_msg: string;
  simulator_ineligible_msg: string;
  simulator_rule_1: string;
  simulator_rule_2: string;
  simulator_test_button: string;

  // CTA Section
  cta_title: string;
  cta_subtitle: string;
  cta_primary: string;
  cta_secondary: string;
  cta_badge_free: string;
  cta_badge_refund: string;
  cta_badge_crossplay: string;

  // FAQ
  faq_title: string;
  faq_subtitle: string;
  faq_search_placeholder: string;
  faq_questions_found: string;
  faq_no_results: string;
  faq_clear_filter: string;

  // Booking
  booking_title: string;
  booking_subtitle: string;
  booking_tab_calendar: string;
  booking_tab_form: string;
  booking_name_label: string;
  booking_email_label: string;
  booking_subject_label: string;
  booking_message_label: string;
  booking_submit: string;
  booking_success_msg: string;
  booking_open_cal: string;

  // ChatBot
  chat_title: string;
  chat_subtitle: string;
  chat_welcome: string;
  chat_placeholder: string;
  chat_send: string;
  chat_quick_q1: string;
  chat_quick_q2: string;
  chat_quick_q3: string;
  chat_quick_q4: string;
  chat_fallback_book: string;

  // Footer
  footer_tagline: string;
  footer_quick_links: string;
  footer_legal: string;
  footer_disclaimer: string;
  footer_rights: string;
  footer_audit_link: string;

  // Modal
  modal_title: string;
  modal_subtitle: string;
  modal_download_btn: string;
  modal_requirements: string;
  install_modal_title: string;
  install_modal_subtitle: string;
  install_modal_windows: string;
  install_modal_mac: string;
  install_modal_linux: string;
  install_modal_installer_info: string;

  // Proposal Request
  proposal_badge: string;
  proposal_title: string;
  proposal_subtitle: string;
  proposal_name_label: string;
  proposal_name_placeholder: string;
  proposal_email_label: string;
  proposal_email_placeholder: string;
  proposal_request_label: string;
  proposal_request_placeholder: string;
  proposal_min_chars: string;
  proposal_characters: string;
  proposal_privacy_note: string;
  proposal_submit_btn: string;
  proposal_submitting_btn: string;
  proposal_success_title: string;
  proposal_success_desc: string;
  proposal_reference: string;
  proposal_view_btn: string;
  proposal_submit_another: string;
  proposal_err_title: string;
  proposal_err_name: string;
  proposal_err_email: string;
  proposal_err_email_invalid: string;
  proposal_err_request: string;
  proposal_err_short: string;
  proposal_err_generic: string;
}

const translations: Record<Language, Translations> = {
  pt: {
    // Navigation
    nav_main: 'Menu Principal',
    nav_solutions: 'Soluções',
    nav_guarantee: 'Garantia',
    nav_faq: 'FAQ',
    nav_proposal: 'Pedido de Proposta',
    nav_booking: 'Agendamento',
    nav_proposal_booking: 'Pedido de Proposta e Agendamento',
    nav_install: 'Instalar o Fog Agora',
    nav_back_to_main: 'Voltar ao Menu Principal',

    // Hero Section
    hero_problem_tag: 'O Problema:',
    hero_problem: 'O gaming no PC não devia exigir gerir múltiplos lançadores pesados, perder gravações entre máquinas ou gastar 70€ em jogos que desiludem sem direito a reembolso.',
    hero_headline: 'Todo o Teu Universo de Jogos. Uma Biblioteca Segura.',
    hero_subheadline: 'Acesso imediato a +50.000 títulos, avaliações honestas de jogadores reais, gravações na cloud entre dispositivos e garantia de reembolso incondicional de 14 dias em todos os jogos.',
    hero_primary_cta: 'Instalar Fog — É Grátis',
    hero_secondary_cta: 'Explorar +50.000 Jogos',
    hero_microcopy: 'Compatível com Windows, macOS, Linux & Fog Deck • Sem subscrições obrigatórias',
    hero_stat_players: 'Jogadores em Simultâneo',
    hero_stat_games: 'Jogos & Softwares',
    hero_stat_cloud: 'Sincronização Cloud Fiável',
    hero_stat_refund: 'Janela de Reembolso Sem Risco',
    hero_now_playing: 'Agora em Destaque',
    hero_verified: 'Fog Deck Verificado',
    hero_positive_reviews: 'Análises Muito Positivas',

    // Personas / Target Audience
    audience_title: 'Desenhado Para Cada Perfil de Jogador',
    audience_subtitle: 'Descobre como a infraestrutura Fog elimina os teus maiores problemas de desempenho, mobilidade e valor financeiro.',
    audience_key_frustration: 'Frustração Principal',
    audience_desired_outcome: 'Resultado Desejado',
    audience_steam_solution: 'Solução Fog',

    // Features / Solutions
    features_title: '5 Pilares Que Fazem do Fog a Referência Global',
    features_subtitle: 'Cada recurso foi rigorosamente arquitetado para maximizar as tuas horas de jogo e proteger os teus investimentos digitais.',
    features_pillar: 'Pilar',

    // Showcase
    showcase_title: 'Montra de Jogos & Ofertas em Tempo Real',
    showcase_subtitle: 'Explora os títulos mais aclamados, promoções sazonais ativas e certificações de hardware oficiais.',
    showcase_all: 'Todos os Destaques',
    showcase_deck_verified: 'Fog Deck Verificado',
    showcase_specials: 'Grandes Promoções',
    showcase_reviews: 'análises',
    showcase_free: 'Grátis para Jogar',
    showcase_buy_now: 'Ver no Fog',

    // Refund Simulator
    simulator_title: 'Simulador da Política de Reembolso de 14 Dias',
    simulator_subtitle: 'Valida instantaneamente se uma compra é elegível para devolução incondicional em menos de 24 horas.',
    simulator_hours_played: 'Tempo de Jogo Registado',
    simulator_days_since: 'Dias desde a Data de Compra',
    simulator_reason: 'Motivo da Solicitação',
    simulator_reason_perf: 'Mau desempenho / Computador não aguenta',
    simulator_reason_mistake: 'Comprado por engano ou duplicado',
    simulator_reason_dislike: 'Não correspondeu às expectativas / Não gostei',
    simulator_reason_other: 'Outro motivo técnico ou pessoal',
    simulator_status_approved: '100% Elegível para Devolução Automática',
    simulator_status_manual: 'Sujeito a Revisão Manual de Suporte',
    simulator_eligible_msg: 'Cumpre integralmente a regra dos 14 dias / menos de 2 horas. O valor é creditado na Carteira Fog ou método original.',
    simulator_ineligible_msg: 'Excede os limites automatizados (mais de 2 horas de jogo ou mais de 14 dias de posse). Poderá submeter um pedido especial para análise humana pela Valve.',
    simulator_rule_1: 'Menos de 2 horas de tempo de jogo acumulado',
    simulator_rule_2: 'Compra efetuada há menos de 14 dias corridos',
    simulator_test_button: 'Testar Cenário',

    // CTA Section
    cta_title: 'Pronto Para Jogar Sem Risco Nem Frustrações?',
    cta_subtitle: 'Junta-te a mais de 35 milhões de jogadores online. Instala o Fog gratuitamente e começa a jogar em menos de 2 minutos.',
    cta_primary: 'Instalar Fog Grátis',
    cta_secondary: 'Agendar Demonstração / Reunião',
    cta_badge_free: '100% Gratuito sem Mensalidade',
    cta_badge_refund: 'Garantia Incondicional de 14 Dias',
    cta_badge_crossplay: 'Multiplataforma Windows, Mac, Linux',

    // FAQ
    faq_title: 'Perguntas Frequentes (FAQ)',
    faq_subtitle: 'Esclarece todas as tuas questões sobre garantias de devolução, funcionamento da plataforma, hardware e apoio ao cliente.',
    faq_search_placeholder: 'Pesquisar dúvidas, termos ou categorias...',
    faq_questions_found: 'perguntas encontradas',
    faq_no_results: 'Nenhuma pergunta encontrada com o termo pesquisado.',
    faq_clear_filter: 'Limpar Filtros',

    // Booking
    booking_title: 'Agendamento de Reunião & Apoio',
    booking_subtitle: 'Marca uma sessão personalizada de 30 minutos com a nossa equipa especializada ou envia a tua questão técnica.',
    booking_tab_calendar: 'Calendário Interativo (Cal.com)',
    booking_tab_form: 'Formulário Direto',
    booking_name_label: 'O Teu Nome',
    booking_email_label: 'Endereço de E-mail',
    booking_subject_label: 'Assunto da Reunião',
    booking_message_label: 'Detalhes ou Mensagem',
    booking_submit: 'Confirmar Pedido de Reunião',
    booking_success_msg: 'Pedido registado com sucesso! Receberás a confirmação e o link de videoconferência no teu e-mail.',
    booking_open_cal: 'Abrir no Cal.com',

    // ChatBot
    chat_title: 'Fogger',
    chat_subtitle: 'Apoio técnico & diagnóstico em segundos',
    chat_welcome: 'Olá! Sou o Fogger, o teu assistente de suporte técnico. Posso ajudar-te com políticas de reembolso, Fog Deck, sincronização Cloud ou agendamento de reuniões. Em que posso ajudar?',
    chat_placeholder: 'Escreve a tua pergunta aqui...',
    chat_send: 'Enviar',
    chat_quick_q1: 'Como funciona o reembolso?',
    chat_quick_q2: 'O que é o Fog Deck Verified?',
    chat_quick_q3: 'Como funciona a Cloud?',
    chat_quick_q4: 'Marcar uma reunião com a equipa',
    chat_fallback_book: 'Não tenho a certeza absoluta sobre essa questão específica. Se preferires, podes agendar uma reunião de 30 minutos com a nossa equipa para um esclarecimento detalhado e personalizado!',

    // Footer
    footer_tagline: 'A plataforma definitiva para jogar, criar e partilhar no PC, consola portátil e dispositivos compatíveis.',
    footer_quick_links: 'Navegação Rápida',
    footer_legal: 'Informações Legais',
    footer_disclaimer: 'Fog e o logótipo Fog são marcas registadas da Valve Corporation. Todos os direitos reservados.',
    footer_rights: '© Valve Corporation. Todos os direitos reservados.',
    footer_audit_link: 'Ver Auditoria CRO & Blueprint',

    // Modal
    modal_title: 'Instalar o Cliente Fog',
    modal_subtitle: 'Transfere gratuitamente o cliente oficial para teres acesso instantâneo a toda a tua biblioteca.',
    modal_download_btn: 'Transferir Instalador Oficial',
    modal_requirements: 'Requisitos Mínimos: Windows 10/11, macOS 10.15+, Ubuntu 20.04+ com 2GB RAM e 5GB de disco disponível.',
    install_modal_title: 'Instalar o Cliente Fog',
    install_modal_subtitle: 'Seleciona o teu sistema operativo para descarregar o instalador oficial. 100% gratuito com atualizações automáticas em segundo plano.',
    install_modal_windows: 'Descarregar para Windows',
    install_modal_mac: 'Descarregar para macOS',
    install_modal_linux: 'Descarregar para Linux / FogOS',
    install_modal_installer_info: 'Instalador oficial verificado da Valve Corporation',

    // Proposal Request
    proposal_badge: 'Orçamentação Inteligente com IA',
    proposal_title: 'Pedido de proposta',
    proposal_subtitle: 'Indique as suas necessidades de hardware Fog Deck, publicação na plataforma, certificação técnica ou servidores dedicados. A nossa Inteligência Artificial analisa o seu pedido e calcula a proposta instantaneamente com base no catálogo oficial.',
    proposal_name_label: 'Nome',
    proposal_name_placeholder: 'O seu nome ou da sua empresa',
    proposal_email_label: 'Email',
    proposal_email_placeholder: 'exemplo@dominio.com',
    proposal_request_label: 'Pedido',
    proposal_request_placeholder: 'Ex.: Gostaríamos de publicar 2 jogos independentes na Fog com auditoria técnica Fog Verified para cada um, e incluir 3 meses de suporte dedicado a estúdios.',
    proposal_min_chars: 'Mínimo 8 caracteres',
    proposal_characters: 'caracteres',
    proposal_privacy_note: 'Os seus dados serão utilizados exclusivamente para analisar e responder ao seu pedido com base nos serviços do ecossistema Fog.',
    proposal_submit_btn: 'Pedir proposta',
    proposal_submitting_btn: 'A analisar pedido com IA...',
    proposal_success_title: 'O seu pedido foi recebido com sucesso.',
    proposal_success_desc: 'O nosso sistema registou o seu pedido na base de dados e iniciou o processamento comercial com os preços do catálogo.',
    proposal_reference: 'Referência:',
    proposal_view_btn: 'Ver Proposta Gerada',
    proposal_submit_another: 'Submeter outro pedido',
    proposal_err_title: 'Erro na submissão:',
    proposal_err_name: 'Por favor, indique o seu nome.',
    proposal_err_email: 'Por favor, indique o seu email.',
    proposal_err_email_invalid: 'Por favor, introduza um endereço de email com formato válido.',
    proposal_err_request: 'Por favor, descreva o seu pedido com detalhe.',
    proposal_err_short: 'O pedido é demasiado curto. Por favor, forneça mais contexto.',
    proposal_err_generic: 'Não foi possível enviar o seu pedido neste momento. Tente novamente.'
  },
  en: {
    // Navigation
    nav_main: 'Main Menu',
    nav_solutions: 'Solutions',
    nav_guarantee: 'Guarantee',
    nav_faq: 'FAQ',
    nav_proposal: 'Proposal Request',
    nav_booking: 'Booking',
    nav_proposal_booking: 'Proposal Request and Booking',
    nav_install: 'Install Fog Now',
    nav_back_to_main: 'Back to Main Menu',

    // Hero Section
    hero_problem_tag: 'The Problem:',
    hero_problem: "PC gaming shouldn't require juggling multiple bloated launchers, losing save files between machines, or risking $70 on games that flop without refunds.",
    hero_headline: 'Your Entire Gaming Universe. One Seamless, Risk-Free Library.',
    hero_subheadline: 'Instant access to 50,000+ titles, transparent peer reviews from actual verified buyers, cross-device cloud saves, and a 14-day no-questions-asked refund guarantee on every game.',
    hero_primary_cta: "Install Fog — It's Free",
    hero_secondary_cta: 'Explore 50,000+ Games',
    hero_microcopy: 'Compatible with Windows, macOS, Linux & Fog Deck • No subscription required',
    hero_stat_players: 'Concurrent Players Online',
    hero_stat_games: 'Games & Software Titles',
    hero_stat_cloud: 'Cloud Save Sync Reliability',
    hero_stat_refund: 'No-Risk Refund Window',
    hero_now_playing: 'Now in Spotlight',
    hero_verified: 'Fog Deck Verified',
    hero_positive_reviews: 'Overwhelmingly Positive',

    // Personas / Target Audience
    audience_title: 'Engineered For Every Type of Player',
    audience_subtitle: 'Discover how the Fog ecosystem solves your biggest performance, mobility, and value headaches.',
    audience_key_frustration: 'Key Frustration',
    audience_desired_outcome: 'Desired Outcome',
    audience_steam_solution: 'Fog Solution',

    // Features / Solutions
    features_title: '5 Pillars That Make Fog the Gold Standard',
    features_subtitle: 'Every feature engineered to maximize your playtime and protect your gaming investments.',
    features_pillar: 'Pillar',

    // Showcase
    showcase_title: 'Live Featured Showcase & Specials',
    showcase_subtitle: 'Explore top-played titles, seasonal sales, and real-time hardware certifications.',
    showcase_all: 'All Featured',
    showcase_deck_verified: 'Fog Deck Verified',
    showcase_specials: 'Top Specials',
    showcase_reviews: 'reviews',
    showcase_free: 'Free to Play',
    showcase_buy_now: 'View on Fog',

    // Refund Simulator
    simulator_title: '14-Day Refund Policy Simulator',
    simulator_subtitle: 'Check instantly if your purchase qualifies for an automatic full refund in under 24 hours.',
    simulator_hours_played: 'Recorded Playtime',
    simulator_days_since: 'Days Since Purchase Date',
    simulator_reason: 'Reason for Refund',
    simulator_reason_perf: 'Poor performance / PC does not meet requirements',
    simulator_reason_mistake: 'Purchased by mistake or duplicate copy',
    simulator_reason_dislike: "Did not meet expectations / Didn't like it",
    simulator_reason_other: 'Other technical or personal reason',
    simulator_status_approved: '100% Eligible for Automatic Refund',
    simulator_status_manual: 'Subject to Manual Support Review',
    simulator_eligible_msg: 'Fully meets the 14-day / under 2-hour criteria. The full balance will be credited to your Fog Wallet or original payment method.',
    simulator_ineligible_msg: 'Exceeds automated refund thresholds (over 2 hours of playtime or over 14 days of ownership). You may still submit a special request for manual review by Valve.',
    simulator_rule_1: 'Under 2 hours of cumulative recorded playtime',
    simulator_rule_2: 'Purchased within the last 14 calendar days',
    simulator_test_button: 'Test Scenario',

    // CTA Section
    cta_title: 'Ready to Experience Risk-Free PC Gaming?',
    cta_subtitle: 'Join over 35 million players online. Download Fog for free and jump into your next adventure in less than 2 minutes.',
    cta_primary: 'Install Fog For Free',
    cta_secondary: 'Schedule Demo / Meeting',
    cta_badge_free: '100% Free with No Monthly Fees',
    cta_badge_refund: 'Unconditional 14-Day Money-Back Guarantee',
    cta_badge_crossplay: 'Cross-Platform Windows, Mac, Linux',

    // FAQ
    faq_title: 'Frequently Asked Questions (FAQ)',
    faq_subtitle: 'Clear answers about refund policies, platform mechanics, hardware compatibility, and direct customer support.',
    faq_search_placeholder: 'Search questions, topics or tags...',
    faq_questions_found: 'questions found',
    faq_no_results: 'No questions found matching your search term.',
    faq_clear_filter: 'Clear Filters',

    // Booking
    booking_title: 'Meeting & Support Scheduling',
    booking_subtitle: 'Book a 30-minute tailored session with our specialist team or send us your direct technical inquiry.',
    booking_tab_calendar: 'Interactive Calendar (Cal.com)',
    booking_tab_form: 'Direct Form',
    booking_name_label: 'Your Name',
    booking_email_label: 'Email Address',
    booking_subject_label: 'Meeting Topic',
    booking_message_label: 'Details or Inquiries',
    booking_submit: 'Confirm Meeting Request',
    booking_success_msg: 'Request registered successfully! You will receive confirmation and the video conference link via email.',
    booking_open_cal: 'Open in Cal.com',

    // ChatBot
    chat_title: 'Fogger',
    chat_subtitle: 'Technical support & diagnostics in seconds',
    chat_welcome: "Hello! I am Fogger. I can guide you through refund policies, Fog Deck verification, Cloud saves, or scheduling meetings. How can I help you?",
    chat_placeholder: 'Type your question here...',
    chat_send: 'Send',
    chat_quick_q1: 'How do refunds work?',
    chat_quick_q2: 'What is Fog Deck Verified?',
    chat_quick_q3: 'How does Cloud sync work?',
    chat_quick_q4: 'Book a meeting with the team',
    chat_fallback_book: "I'm not completely certain about that specific inquiry. If you'd like, you can schedule a 30-minute meeting with our support team for personalized assistance!",

    // Footer
    footer_tagline: 'The ultimate entertainment platform to play, connect, and create across PC, handheld, and cross-platform devices.',
    footer_quick_links: 'Quick Links',
    footer_legal: 'Legal Information',
    footer_disclaimer: 'Fog and the Fog logo are registered trademarks of Valve Corporation. All rights reserved.',
    footer_rights: '© Valve Corporation. All rights reserved.',
    footer_audit_link: 'View CRO Audit & Blueprint',

    // Modal
    modal_title: 'Install the Fog Client',
    modal_subtitle: 'Download the official client for free to instantly unlock your entire games library.',
    modal_download_btn: 'Download Official Installer',
    modal_requirements: 'Minimum Requirements: Windows 10/11, macOS 10.15+, Ubuntu 20.04+ with 2GB RAM and 5GB available storage.',
    install_modal_title: 'Install Fog Client',
    install_modal_subtitle: 'Select your operating system to download the official installer. 100% free with automatic background updates.',
    install_modal_windows: 'Download for Windows',
    install_modal_mac: 'Download for macOS',
    install_modal_linux: 'Download for Linux / FogOS',
    install_modal_installer_info: 'Official verified installer from Valve Corporation',

    // Proposal Request
    proposal_badge: 'AI-Powered Proposal Requests',
    proposal_title: 'Request a Proposal',
    proposal_subtitle: 'Specify your needs for Fog Deck hardware, platform publishing, technical certification, or dedicated servers. Our Artificial Intelligence analyzes your request and calculates the proposal instantly based on the official catalog.',
    proposal_name_label: 'Name',
    proposal_name_placeholder: 'Your name or company name',
    proposal_email_label: 'Email',
    proposal_email_placeholder: 'example@domain.com',
    proposal_request_label: 'Request',
    proposal_request_placeholder: 'E.g.: We would like to publish 2 indie games on Fog with Fog Verified technical audit for each, and include 3 months of dedicated studio support.',
    proposal_min_chars: 'Minimum 8 characters',
    proposal_characters: 'characters',
    proposal_privacy_note: 'Your data will be used exclusively to analyze and respond to your request based on Fog ecosystem services.',
    proposal_submit_btn: 'Request proposal',
    proposal_submitting_btn: 'Analyzing request with AI...',
    proposal_success_title: 'Your request has been successfully received.',
    proposal_success_desc: 'Our system has recorded your request in the database and started commercial processing using catalog prices.',
    proposal_reference: 'Reference:',
    proposal_view_btn: 'View Generated Proposal',
    proposal_submit_another: 'Submit another request',
    proposal_err_title: 'Submission error:',
    proposal_err_name: 'Please enter your name.',
    proposal_err_email: 'Please enter your email.',
    proposal_err_email_invalid: 'Please enter a valid email address.',
    proposal_err_request: 'Please describe your request in detail.',
    proposal_err_short: 'Request description is too short. Please provide more details.',
    proposal_err_generic: 'Could not submit your request at this time. Please try again.'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return (saved === 'en' || saved === 'pt') ? saved : 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'pt' ? 'en' : 'pt';
    setLanguage(next);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
