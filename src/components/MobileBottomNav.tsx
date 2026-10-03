import React from 'react';
import { Film, UploadCloud, Link2, Settings, Menu } from 'lucide-react';
import { ActiveTab } from '../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMenu
}) => {
  const tabs = [
    { id: 'library' as ActiveTab, label: 'Library', icon: Film },
    { id: 'upload' as ActiveTab, label: 'Upload', icon: UploadCloud },
    { id: 'ingest' as ActiveTab, label: 'Ingest', icon: Link2 },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800 px-2 py-1.5 flex items-center justify-around h-14 select-none safe-bottom shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors rounded-lg ${
              isActive ? 'text-indigo-400 font-semibold' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}

      {/* More / All Tabs Drawer Trigger */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center flex-1 h-full min-h-[44px] text-neutral-400 hover:text-neutral-200 transition-colors rounded-lg"
      >
        <Menu className="w-4 h-4 mb-0.5" />
        <span className="text-[10px] tracking-tight">Menu</span>
      </button>
    </nav>
  );
};
