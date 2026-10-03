export interface VideoItem {
  id: string;
  title: string;
  filename: string;
  originalName: string;
  size: number;
  formattedSize: string;
  duration: number;
  formattedDuration: string;
  resolutions: string[];
  status: 'ready' | 'processing' | 'uploaded' | 'failed';
  views: number;
  bandwidthUsedMb: number;
  storageZone: string;
  access: 'public' | 'unlisted' | 'private';
  tags: string[];
  createdAt: string;
  streamUrl: string;
  hlsUrl: string;
  embedUrl: string;
  posterUrl?: string;
  filePath?: string;
  remoteUrl?: string;
}

export interface VcdnConfig {
  apiKey: string;
  maskedKey: string;
  baseUrl: string;
  region: string;
  watermarkEnabled: boolean;
  hlsTranscode: boolean;
  adaptiveResolutions: string[];
  keyFormatValid: boolean;
}

export type ActiveTab = 'library' | 'upload' | 'ingest' | 'analytics' | 'api-docs' | 'settings';
