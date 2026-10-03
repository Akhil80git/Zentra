import React, { useEffect } from 'react';
import {
  Film,
  UploadCloud,
  Link2,
  BarChart3,
  Code2,
  Settings,
  HardDrive,
  CheckCircle2,
  Layers,
  X
} from 'lucide-react';
import { ActiveTab, VcdnConfig } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  videoCount: number;
  totalSizeFormatted: string;
  config: VcdnConfig | null;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  videoCount,
  totalSizeFormatted,
  config,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'library' as ActiveTab, label: 'Video Library', icon: Film, count: videoCount },
    { id: 'upload' as ActiveTab, label: 'Upload Video', icon: UploadCloud },
    { id: 'ingest' as ActiveTab, label: 'URL Ingestion', icon: Link2 },
    { id: 'analytics' as ActiveTab, label: 'Bandwidth & CDN', icon: BarChart3 },
    { id: 'api-docs' as ActiveTab, label: 'API & Integration', icon: Code2 },
    { id: 'settings' as ActiveTab, label: 'Config & Keys', icon: Settings },
  ];

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpenMobile) onCloseMobile();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpenMobile, onCloseMobile]);

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full select-none">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                VCDN Studio
              </h1>
              <p className="text-[11px] text-neutral-400">Edge Streaming Engine</p>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          <p className="px-3 pt-2 pb-1.5 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap text-left cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {typeof item.count === 'number' && (
                  <span className="text-[11px] font-mono text-neutral-300 tabular-nums">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info: Storage quota & Active Key */}
      <div className="p-4 border-t border-neutral-800 space-y-3">
        {/* Storage Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-300 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-neutral-400" /> Storage Used
            </span>
            <span className="text-neutral-300 font-mono tabular-nums">{totalSizeFormatted}</span>
          </div>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: '18%' }} />
          </div>
        </div>

        {/* API Key Status Card */}
        <div className="p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/80 text-[11px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-neutral-300 text-[10px] font-medium uppercase tracking-wider">Active API Key</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Live
            </span>
          </div>
          <div className="font-mono text-neutral-300 truncate text-[11px]" title={config?.apiKey}>
            {config?.apiKey ? `${config.apiKey.slice(0, 11)}...${config.apiKey.slice(-4)}` : 'vcdn_sk_867ea...'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Permanent Sidebar */}
      <aside className="hidden md:flex w-64 bg-neutral-900 border-r border-neutral-800 flex-col shrink-0 h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {/* 2. Mobile Backdrop & Slide-over Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Drawer Menu */}
          <div className="relative w-72 max-w-[85vw] bg-neutral-900 border-r border-neutral-800 shadow-2xl h-full flex flex-col z-10 transition-transform duration-300 ease-out">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
