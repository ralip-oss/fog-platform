/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LandingNavbar, LandingSection } from './components/landing/LandingNavbar';
import { HeroSection } from './components/landing/HeroSection';
import { TargetAudienceSection } from './components/landing/TargetAudienceSection';
import { FeaturesSection } from './components/landing/FeaturesSection';
import { InteractiveShowcase } from './components/landing/InteractiveShowcase';
import { RefundSimulator } from './components/landing/RefundSimulator';
import { CTASection } from './components/landing/CTASection';
import { FAQSection } from './components/landing/FAQSection';
import { MeetingScheduler } from './components/booking/MeetingScheduler';
import { SupportChatBot } from './components/chat/SupportChatBot';
import { LandingFooter } from './components/landing/LandingFooter';
import { InstallModal } from './components/landing/InstallModal';
import { ProposalRequestSection } from './components/landing/ProposalRequestSection';
import { ProposalView } from './components/proposal/ProposalView';
import { AdminView } from './components/admin/AdminView';

// CRO Audit Components
import { Header } from './components/Header';
import { SectionMappingView } from './components/SectionMappingView';
import { CopywritingFormulasView } from './components/CopywritingFormulasView';
import { MessagingStrategyView } from './components/MessagingStrategyView';
import { MicroCopyTriggersView } from './components/MicroCopyTriggersView';
import { BlueprintReplicatorView } from './components/BlueprintReplicatorView';
import { RawCopyViewer } from './components/RawCopyViewer';
import { generateMarkdownReport } from './utils/generateMarkdownReport';

import { 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  LayoutTemplate, 
  FileText, 
  MonitorPlay,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight
} from 'lucide-react';
import { TARGET_URL } from './data/steamAuditData';
import { useLanguage } from './context/LanguageContext';

type ViewMode = 'landing' | 'audit';
type TabType = 'sections' | 'formulas' | 'messaging' | 'triggers' | 'blueprint' | 'raw';

export default function App() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [landingSection, setLandingSection] = useState<LandingSection>('main');
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('fog_theme_mode');
      if (saved !== null) {
        return saved === 'dark';
      }
    } catch {}
    return true;
  });
  const [installModalOpen, setInstallModalOpen] = useState<boolean>(false);
  const [activeAuditTab, setActiveAuditTab] = useState<TabType>('sections');
  const [copied, setCopied] = useState<boolean>(false);

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    try {
      localStorage.setItem('fog_theme_mode', darkMode ? 'dark' : 'light');
    } catch {}
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#151618';
      document.body.style.color = '#ffffff';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#e5e8ec';
      document.body.style.color = '#000000';
    }
  }, [darkMode]);

  // Rota 1: Área Privada de Administração (/admin)
  if (currentPath === '/admin') {
    return (
      <AdminView
        darkMode={darkMode}
        onBackToHome={() => navigateTo('/')}
      />
    );
  }

  // Rota 2: Página Individual da Proposta (/proposta/[token])
  if (currentPath.startsWith('/proposta/')) {
    const token = currentPath.split('/proposta/')[1] || '';
    return (
      <ProposalView
        token={token}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onBackToHome={() => navigateTo('/')}
      />
    );
  }

  const handleSelectSection = (section: LandingSection) => {
    setLandingSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportMarkdown = () => {
    const markdown = generateMarkdownReport();
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExploreClick = () => {
    const el = document.getElementById('showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'sections', label: '1. Section Mapping', icon: <Layers className="w-4 h-4" />, badge: '13' },
    { id: 'formulas', label: '2. Copy Formulas', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'messaging', label: '3. Messaging Strategy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'triggers', label: '4. Micro-Triggers', icon: <Zap className="w-4 h-4" />, badge: '8' },
    { id: 'blueprint', label: '5. Wireframe Blueprint', icon: <LayoutTemplate className="w-4 h-4" /> },
    { id: 'raw', label: 'Raw Transcribed Copy', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {viewMode === 'landing' ? (
        /* ======================== CONVERSION-OPTIMIZED LANDING PAGE ======================== */
        <div className="flex-1 flex flex-col">
          <LandingNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onOpenAudit={() => setViewMode('audit')}
            onInstallClick={() => setInstallModalOpen(true)}
            currentSection={landingSection}
            onSelectSection={handleSelectSection}
          />

          <main className="flex-1">
            {/* Canto superior esquerdo: Botão com seta a apontar para a esquerda a dizer "Voltar ao Menu Principal" */}
            {landingSection !== 'main' && (
              <div className={`border-b transition-colors ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-start">
                  <button
                    onClick={() => handleSelectSection('main')}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm group ${
                      darkMode
                        ? 'bg-slate-800 hover:bg-slate-700 text-white hover:text-slate-200 border border-slate-700'
                        : 'bg-white hover:bg-slate-100 text-slate-800 hover:text-slate-950 border border-slate-300 shadow-2xs'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>{t.nav_back_to_main}</span>
                  </button>
                </div>
              </div>
            )}

            {landingSection === 'main' ? (
              <>
                {/* 1. HERO SECTION: Problem statement, Headline (max 10 words), Subhead (max 25 words), Primary/Secondary CTAs */}
                <HeroSection
                  darkMode={darkMode}
                  onInstallClick={() => setInstallModalOpen(true)}
                  onExploreClick={handleExploreClick}
                />

                {/* 2. TARGET AUDIENCE SECTION: 3 Personas with Role, Frustration, Desired Outcome & Icons */}
                <TargetAudienceSection
                  darkMode={darkMode}
                  onInstallClick={() => setInstallModalOpen(true)}
                />

                {/* 3. SOLUTION / SERVICES: 5 Core Features with One-line outcome benefits, icons & grid */}
                <FeaturesSection
                  darkMode={darkMode}
                  onInstallClick={() => setInstallModalOpen(true)}
                />

                {/* LIVE PRODUCT DEMONSTRATION & DEALS SPOTLIGHT */}
                <InteractiveShowcase
                  darkMode={darkMode}
                  onInstallClick={() => setInstallModalOpen(true)}
                />

                {/* PEDIDO DE PROPOSTA COM IA */}
                <ProposalRequestSection darkMode={darkMode} />

                {/* RISK REVERSAL & REFUND POLICY SIMULATOR */}
                <RefundSimulator
                  darkMode={darkMode}
                  onInstallClick={() => setInstallModalOpen(true)}
                />

                {/* 4. CTA (Call-to-Action) SECTION: High-converting Primary & Secondary Buttons */}
                <CTASection
                  darkMode={darkMode}
                  onInstallClick={() => setInstallModalOpen(true)}
                  onExploreClick={handleExploreClick}
                />

                {/* 5. FAQ SECTION: Perguntas Frequentes organizadas por categoria (dados em faqData.ts) */}
                <FAQSection darkMode={darkMode} />

                {/* 6. AGENDAMENTO DE REUNIÃO: Cal.com Embed + Formulário Rápido com Google Calendar */}
                <MeetingScheduler darkMode={darkMode} />
              </>
            ) : landingSection === 'solutions' ? (
              <div className="py-6 space-y-6">
                <FeaturesSection
                  darkMode={darkMode}
                  onInstallClick={() => setInstallModalOpen(true)}
                />
                <InteractiveShowcase
                  darkMode={darkMode}
                  onInstallClick={() => setInstallModalOpen(true)}
                />
              </div>
            ) : landingSection === 'proposta' ? (
              <div className="py-6">
                <ProposalRequestSection darkMode={darkMode} />
              </div>
            ) : landingSection === 'guarantee' ? (
              <div className="py-6 space-y-6">
                <RefundSimulator
                  darkMode={darkMode}
                  onInstallClick={() => setInstallModalOpen(true)}
                />
                <CTASection
                  darkMode={darkMode}
                  onInstallClick={() => setInstallModalOpen(true)}
                  onExploreClick={handleExploreClick}
                />
              </div>
            ) : landingSection === 'faq' ? (
              <div className="py-6">
                <FAQSection darkMode={darkMode} />
              </div>
            ) : landingSection === 'agendamento' ? (
              <div className="py-6">
                <MeetingScheduler darkMode={darkMode} />
              </div>
            ) : null}

            {/* 7. CHATBOT DE SUPORTE: Mantém-se EXCLUSIVAMENTE no botão flutuante no canto inferior direito */}
            <SupportChatBot
              darkMode={darkMode}
              onNavigateToSection={(sectionId) => {
                if (['solutions', 'proposta', 'guarantee', 'faq', 'agendamento', 'main'].includes(sectionId)) {
                  handleSelectSection(sectionId as LandingSection);
                } else {
                  handleSelectSection('main');
                  setTimeout(() => {
                    const el = document.getElementById(sectionId);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
            />
          </main>

          <LandingFooter
            darkMode={darkMode}
            onInstallClick={() => setInstallModalOpen(true)}
            onOpenAudit={() => setViewMode('audit')}
            onSelectSection={handleSelectSection}
          />

          {/* Direct Install Client Modal */}
          <InstallModal
            isOpen={installModalOpen}
            onClose={() => setInstallModalOpen(false)}
            darkMode={darkMode}
          />
        </div>
      ) : (
        /* ======================== SENIOR CRO AUDIT & BLUEPRINT VIEW ======================== */
        <div className="flex-1 flex flex-col">
          <Header onExportMarkdown={handleExportMarkdown} copied={copied} />

          <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6">
            {/* Navigation Tabs */}
            <div className={`p-1.5 rounded-xl border shadow-xs flex items-center overflow-x-auto gap-1.5 scrollbar-none ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {tabs.map((tab) => {
                const isActive = activeAuditTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveAuditTab(tab.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                          isActive ? 'bg-slate-700 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Audit Tab Content Rendering */}
            <div className="transition-opacity duration-150">
              {activeAuditTab === 'sections' && <SectionMappingView />}
              {activeAuditTab === 'formulas' && <CopywritingFormulasView />}
              {activeAuditTab === 'messaging' && <MessagingStrategyView />}
              {activeAuditTab === 'triggers' && <MicroCopyTriggersView />}
              {activeAuditTab === 'blueprint' && <BlueprintReplicatorView />}
              {activeAuditTab === 'raw' && <RawCopyViewer />}
            </div>
          </main>

          <footer className={`border-t py-6 text-xs ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Senior CRO Strategist & Messaging Audit</span>
                <span>•</span>
                <span>Deconstruction of <a href={TARGET_URL} target="_blank" rel="noreferrer" className="underline hover:text-white font-mono">store.fogpowered.com</a></span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setViewMode('landing')}
                  className="text-slate-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  Switch to Live Landing Page
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span>•</span>
                <button
                  onClick={handleExportMarkdown}
                  className="text-slate-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copied ? '✓ Copied Markdown' : 'Copy Full Report (.md)'}
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
