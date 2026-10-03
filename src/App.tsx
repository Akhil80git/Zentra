import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { VideoLibrary } from './components/VideoLibrary';
import { UploadView } from './components/UploadView';
import { RemoteIngestView } from './components/RemoteIngestView';
import { AnalyticsView } from './components/AnalyticsView';
import { ApiDocsView } from './components/ApiDocsView';
import { SettingsView } from './components/SettingsView';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { ActiveTab, VideoItem, VcdnConfig } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('library');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [config, setConfig] = useState<VcdnConfig | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch initial config and videos
  useEffect(() => {
    async function init() {
      try {
        const [configRes, videosRes] = await Promise.all([
          fetch('/api/vcdn/config'),
          fetch('/api/vcdn/videos')
        ]);

        if (configRes.ok) {
          const cfgData = await configRes.json();
          setConfig(cfgData);
        }

        if (videosRes.ok) {
          const vidData = await videosRes.json();
          if (vidData.videos) {
            setVideos(vidData.videos);
          }
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const handleUploadSuccess = (newVideo: VideoItem) => {
    setVideos((prev) => [newVideo, ...prev]);
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      const res = await fetch(`/api/vcdn/videos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v.id !== id));
        if (selectedVideo?.id === id) {
          setSelectedVideo(null);
        }
      }
    } catch (e) {
      console.error('Failed to delete video:', e);
    }
  };

  const handleUpdateConfig = async (updated: Partial<VcdnConfig>) => {
    const res = await fetch('/api/vcdn/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    if (res.ok) {
      const data = await res.json();
      setConfig(data.config);
    }
  };

  // Calculate total size formatted
  const totalSizeBytes = videos.reduce((acc, v) => acc + (v.size || 0), 0);
  const totalSizeFormatted =
    totalSizeBytes > 1024 * 1024 * 1024
      ? `${(totalSizeBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
      : `${(totalSizeBytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* Sidebar Navigation (Permanent on Desktop, Slide-over Drawer on Mobile) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        videoCount={videos.length}
        totalSizeFormatted={totalSizeFormatted}
        config={config}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          region={config?.region?.split(' ')[0] || 'ap-south-1'}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* View Switcher: on mobile add pb-24 so bottom bar never obstructs content */}
        <main className="flex-1 pb-24 md:pb-12">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 text-neutral-500 text-xs font-mono">
              Loading VCDN Studio...
            </div>
          ) : (
            <>
              {activeTab === 'library' && (
                <VideoLibrary
                  videos={videos}
                  searchQuery={searchQuery}
                  onSelectVideo={setSelectedVideo}
                  onDeleteVideo={handleDeleteVideo}
                  onOpenUpload={() => setActiveTab('upload')}
                />
              )}

              {activeTab === 'upload' && (
                <UploadView
                  config={config}
                  onUploadSuccess={handleUploadSuccess}
                  onOpenPlayer={setSelectedVideo}
                />
              )}

              {activeTab === 'ingest' && (
                <RemoteIngestView
                  config={config}
                  onIngestSuccess={handleUploadSuccess}
                  onOpenPlayer={setSelectedVideo}
                />
              )}

              {activeTab === 'analytics' && <AnalyticsView videos={videos} />}

              {activeTab === 'api-docs' && <ApiDocsView config={config} />}

              {activeTab === 'settings' && (
                <SettingsView config={config} onUpdateConfig={handleUpdateConfig} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Video Player & Embed Modal */}
      {selectedVideo && (
        <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}
