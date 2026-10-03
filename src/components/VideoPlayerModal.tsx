import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Code2,
  Share2,
  Download,
  Info,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { VideoItem } from '../types';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'iframe' | 'hls' | 'direct' | 'react'>('iframe');
  const [copied, setCopied] = useState(false);
  const [showPreviewIframe, setShowPreviewIframe] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const origin = window.location.origin;
  const streamSrc = video.streamUrl.startsWith('http')
    ? video.streamUrl
    : `${origin}${video.streamUrl}`;
  const embedSrc = `${origin}${video.embedUrl}`;
  const hlsSrc = video.hlsUrl.startsWith('http')
    ? video.hlsUrl
    : `${origin}${video.hlsUrl}`;

  const iframeSnippet = `<iframe
  src="${embedSrc}"
  width="100%"
  height="480"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>`;

  const reactSnippet = `import React from 'react';

export default function VcdnVideo() {
  return (
    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
      <iframe
        src="${embedSrc}"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    </div>
  );
}`;

  const getActiveCode = () => {
    switch (activeCodeTab) {
      case 'iframe':
        return iframeSnippet;
      case 'hls':
        return hlsSrc;
      case 'direct':
        return streamSrc;
      case 'react':
        return reactSnippet;
      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="px-3.5 sm:px-5 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-lg">
              {video.title}
            </h3>
            <span className="font-mono text-[10px] text-neutral-400 uppercase hidden sm:inline">
              · {video.storageZone}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-3 sm:p-5 space-y-4 sm:space-y-6">
          {/* Video Player Box */}
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-neutral-800 shadow-inner">
            <video
              controls
              autoPlay
              playsInline
              poster={video.posterUrl}
              src={streamSrc}
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>

            {/* VCDN Edge Overlay Watermark */}
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-medium text-sky-400 pointer-events-none flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span>VCDN EDGE</span>
            </div>
          </div>

          {/* Quick Technical Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
              <span className="text-[10px] font-medium text-neutral-400 uppercase">Video ID</span>
              <p className="font-mono text-xs text-neutral-200 truncate mt-0.5">{video.id}</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
              <span className="text-[10px] font-medium text-neutral-400 uppercase">Transcoded Qualities</span>
              <p className="font-mono text-xs text-indigo-400 mt-0.5 truncate">
                {video.resolutions ? video.resolutions.join(', ') : '1080p, 720p'}
              </p>
            </div>
            <div className="p-2.5 sm:p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
              <span className="text-[10px] font-medium text-neutral-400 uppercase">Duration & Size</span>
              <p className="font-mono text-xs text-neutral-200 mt-0.5 truncate">
                {video.formattedDuration} · {video.formattedSize}
              </p>
            </div>
            <div className="p-2.5 sm:p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
              <span className="text-[10px] font-medium text-neutral-400 uppercase">Edge Views</span>
              <p className="font-mono text-xs text-neutral-200 mt-0.5 tabular-nums">
                {video.views.toLocaleString()} plays
              </p>
            </div>
          </div>

          {/* Embed & Integration Codes */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <h4 className="text-xs font-semibold text-white">Embed & Distribution Link</h4>
              </div>

              {/* Code format selector */}
              <div className="flex items-center gap-1 p-0.5 bg-neutral-950 border border-neutral-800 rounded-lg overflow-x-auto max-w-full">
                {[
                  { id: 'iframe', label: 'iFrame Embed' },
                  { id: 'hls', label: 'HLS (.m3u8)' },
                  { id: 'direct', label: 'Direct MP4' },
                  { id: 'react', label: 'React Code' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCodeTab(tab.id as any)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer whitespace-nowrap min-h-[32px] ${
                      activeCodeTab === tab.id
                        ? 'bg-neutral-800 text-white font-semibold'
                        : 'text-neutral-400 hover:text-neutral-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Box */}
            <div className="relative">
              <pre className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-300 overflow-x-auto selection:bg-indigo-500/30">
                <code>{getActiveCode()}</code>
              </pre>

              <button
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Test in standalone embed */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
              <span>Embed player includes automated adaptive bitrate & hardware acceleration.</span>
              <a
                href={embedSrc}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                <span>Open Standalone Embed</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
