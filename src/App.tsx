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
import {
  getStoredVideos,
  saveStoredVideos,
  addVideoToStorage,
  deleteVideoFromStorage,
  incrementVideoViewsInStorage,
  getStoredConfig,
  saveStoredConfig,
  DEFAULT_CONFIG
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('library');
  const [videos, setVideos] = useState<VideoItem[]>(() => getStoredVideos());
  const [config, setConfig] = useState<VcdnConfig>(() => getStoredConfig());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize and background-sync with backend if active
  useEffect(() => {
    async function syncBackend() {
      try {
        const [configRes, videosRes] = await Promise.all([
          fetch('/api/vcdn/config').catch(() => null),
          fetch('/api/vcdn/videos').catch(() => null)
        ]);

        if (configRes && configRes.ok) {
          const cfgData = await configRes.json();
          if (cfgData) {
            setConfig(cfgData);
            saveStoredConfig(cfgData);
          }
        }

        if (videosRes && videosRes.ok) {
          const vidData = await videosRes.json();
          if (Array.isArray(vidData.videos) && vidData.videos.length > 0) {
            // Merge with local storage videos so no user uploaded video is lost
            const currentLocal = getStoredVideos();
            const map = new Map<string, VideoItem>();

            // Prioritize local storage (has newly uploaded items)
            currentLocal.forEach((v) => map.set(v.id, v));

            // Merge server videos if not present
            vidData.videos.forEach((v: VideoItem) => {
              if (!map.has(v.id)) {
                map.set(v.id, v);
              }
            });

            const merged = Array.from(map.values());
            setVideos(merged);
            saveStoredVideos(merged);
          }
        }
      } catch (err) {
        console.warn('Backend sync skipped, running on offline/localStorage mode');
      }
    }

    syncBackend();
  }, []);

  const handleUploadSuccess = (newVideo: VideoItem) => {
    // 1. Permanently persist in localStorage
    const updated = addVideoToStorage(newVideo);
    setVideos(updated);
  };

  const handleDeleteVideo = async (id: string) => {
    // 1. Delete from localStorage
    const updated = deleteVideoFromStorage(id);
    setVideos(updated);

    if (selectedVideo?.id === id) {
      setSelectedVideo(null);
    }

    // 2. Also try backend delete
    try {
      await fetch(`/api/vcdn/videos/${id}`, { method: 'DELETE' });
    } catch (e) {
      // Offline fallback
    }
  };

  const handleSelectVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    // Increment view count in localStorage
    const updated = incrementVideoViewsInStorage(video.id);
    setVideos(updated);

    // Sync with backend if available
    fetch(`/api/vcdn/videos/${video.id}`).catch(() => {});
  };

  const handleUpdateConfig = async (updated: Partial<VcdnConfig>) => {
    const newConfig: VcdnConfig = {
      ...config,
      ...updated
    };
    setConfig(newConfig);
    saveStoredConfig(newConfig);

    try {
      await fetch('/api/vcdn/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
    } catch (e) {
      // Handled by local persistence
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
                  onSelectVideo={handleSelectVideo}
                  onDeleteVideo={handleDeleteVideo}
                  onOpenUpload={() => setActiveTab('upload')}
                />
              )}

              {activeTab === 'upload' && (
                <UploadView
                  config={config}
                  onUploadSuccess={handleUploadSuccess}
                  onOpenPlayer={handleSelectVideo}
                />
              )}

              {activeTab === 'ingest' && (
                <RemoteIngestView
                  config={config}
                  onIngestSuccess={handleUploadSuccess}
                  onOpenPlayer={handleSelectVideo}
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
