import { VideoItem, VcdnConfig } from '../types';
import {
  VCDN_HARDCODED_API_KEY,
  VCDN_HARDCODED_BASE_URL,
  LOCAL_STORAGE_VIDEOS_KEY,
  LOCAL_STORAGE_CONFIG_KEY
} from '../constants';

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vcdn_vid_01k9',
    title: 'Global Tech Keynote & Live CDN Edge Architecture',
    filename: 'sample_keynote.mp4',
    originalName: 'TechKeynote_2026_Master_4K.mp4',
    size: 48920150,
    formattedSize: '46.7 MB',
    duration: 184,
    formattedDuration: '3:04',
    resolutions: ['1080p', '720p', '480p'],
    status: 'ready',
    views: 1420,
    bandwidthUsedMb: 66314,
    storageZone: 'Asia-South (Mumbai Edge)',
    access: 'public',
    tags: ['Keynote', 'Cloud', 'Architecture'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    embedUrl: '/embed/vcdn_vid_01k9',
    posterUrl: '/src/assets/images/tech_keynote_poster_1791041068529.jpg'
  },
  {
    id: 'vcdn_vid_02m8',
    title: 'Ultra-HD Cosmic Aurora Star Trail Timelapse',
    filename: 'aurora_timelapse.mp4',
    originalName: 'Aurora_Timelapse_NightSky.mp4',
    size: 89340210,
    formattedSize: '85.2 MB',
    duration: 215,
    formattedDuration: '3:35',
    resolutions: ['1080p', '720p'],
    status: 'ready',
    views: 3890,
    bandwidthUsedMb: 331428,
    storageZone: 'Global Anycast Edge',
    access: 'public',
    tags: ['Cinematography', 'Timelapse', 'Nature'],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    embedUrl: '/embed/vcdn_vid_02m8',
    posterUrl: '/src/assets/images/nature_timelapse_poster_1791041084102.jpg'
  },
  {
    id: 'vcdn_vid_03p4',
    title: 'Product Walkthrough & Developer API Quickstart',
    filename: 'api_quickstart.mp4',
    originalName: 'VCDN_SDK_Integration_Guide.mp4',
    size: 24117248,
    formattedSize: '23.0 MB',
    duration: 120,
    formattedDuration: '2:00',
    resolutions: ['1080p', '720p', '480p', '360p'],
    status: 'ready',
    views: 840,
    bandwidthUsedMb: 19320,
    storageZone: 'Singapore Edge',
    access: 'unlisted',
    tags: ['Tutorial', 'Developer', 'API'],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    embedUrl: '/embed/vcdn_vid_03p4',
    posterUrl: '/src/assets/images/tech_keynote_poster_1791041068529.jpg'
  }
];

export const DEFAULT_CONFIG: VcdnConfig = {
  apiKey: VCDN_HARDCODED_API_KEY,
  maskedKey: 'vcdn_sk_...5bc72e',
  baseUrl: VCDN_HARDCODED_BASE_URL,
  region: 'ap-south-1 (Mumbai / Asia-South)',
  watermarkEnabled: false,
  hlsTranscode: true,
  adaptiveResolutions: ['1080p', '720p', '480p', '360p'],
  keyFormatValid: true
};

export function getStoredVideos(): VideoItem[] {
  if (typeof window === 'undefined') return INITIAL_VIDEOS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VIDEOS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading localStorage videos:', err);
  }
  // Initialize with initial default videos
  saveStoredVideos(INITIAL_VIDEOS);
  return INITIAL_VIDEOS;
}

export function saveStoredVideos(videos: VideoItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(videos));
  } catch (err) {
    console.error('Error writing to localStorage:', err);
  }
}

export function addVideoToStorage(video: VideoItem): VideoItem[] {
  const current = getStoredVideos();
  // Check if exists
  const existingIndex = current.findIndex(v => v.id === video.id);
  let updated: VideoItem[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = video;
  } else {
    updated = [video, ...current];
  }
  saveStoredVideos(updated);
  return updated;
}

export function deleteVideoFromStorage(id: string): VideoItem[] {
  const current = getStoredVideos();
  const updated = current.filter(v => v.id !== id);
  saveStoredVideos(updated);
  return updated;
}

export function incrementVideoViewsInStorage(id: string): VideoItem[] {
  const current = getStoredVideos();
  const updated = current.map(v => {
    if (v.id === id) {
      return {
        ...v,
        views: (v.views || 0) + 1,
        bandwidthUsedMb: (v.bandwidthUsedMb || 0) + Math.round((v.size || 20000000) / (1024 * 1024))
      };
    }
    return v;
  });
  saveStoredVideos(updated);
  return updated;
}

export function getStoredConfig(): VcdnConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.apiKey === 'string') {
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          apiKey: parsed.apiKey || VCDN_HARDCODED_API_KEY,
          baseUrl: parsed.baseUrl || VCDN_HARDCODED_BASE_URL
        };
      }
    }
  } catch (err) {
    console.error('Error reading localStorage config:', err);
  }
  return DEFAULT_CONFIG;
}

export function saveStoredConfig(cfg: VcdnConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(cfg));
  } catch (err) {
    console.error('Error writing config to localStorage:', err);
  }
}
