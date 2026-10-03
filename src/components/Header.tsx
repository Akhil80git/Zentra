import React from 'react';
import { UploadCloud, Search, Globe, ShieldCheck, Menu } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  region?: string;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  region = 'ap-south-1',
  onOpenMobileMenu
}) => {
  const titles: Record<ActiveTab, { title: string; subtitle: string }> = {
    library: { title: 'Media Library', subtitle: 'Manage stored videos, HLS playlists, and embed links' },
    upload: { title: 'Upload Video', subtitle: 'Push MP4, WebM or MKV to VCDN edge storage' },
    ingest: { title: 'Remote Stream Ingest', subtitle: 'Import video stream directly via public URL' },
    analytics: { title: 'CDN Analytics', subtitle: 'Global edge traffic, cache hit ratio, and egress' },
    'api-docs': { title: 'API Reference', subtitle: 'Code samples with your authenticated VCDN secret key' },
    settings: { title: 'Configuration & Settings', subtitle: 'Manage credentials, edge regions, and transcoding' }
  };

  const current = titles[activeTab] || titles.library;

  return (
    <header className="h-14 sm:h-16 px-3 sm:px-6 border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-2">
      {/* Left: Mobile Menu Toggle + Breadcrumb Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-1 text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-neutral-400 min-w-0">
          <span className="hidden sm:inline">VCDN</span>
          <span className="text-neutral-600 hidden sm:inline">/</span>
          <span className="text-neutral-200 font-semibold truncate text-xs sm:text-xs">
            {current.title}
          </span>
        </div>
      </div>

      {/* Center Search (only for library) or Status info */}
      <div className="flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-6 min-w-0">
        {activeTab === 'library' ? (
          <div className="relative">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full bg-neutral-950/90 border border-neutral-800 rounded-lg pl-8 sm:pl-9 pr-3 py-1 sm:py-1.5 text-xs text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        ) : (
          <div className="hidden lg:flex items-center justify-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Edge: <strong className="text-neutral-300 font-medium">{region}</strong></span>
            </span>
            <span className="text-neutral-700">·</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Token Auth Active</span>
            </span>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {activeTab !== 'upload' && (
          <button
            onClick={() => setActiveTab('upload')}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Video</span>
            <span className="sm:hidden">Upload</span>
          </button>
        )}
      </div>
    </header>
  );
};
