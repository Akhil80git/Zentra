import React, { useEffect, useState } from 'react';
import { getStoredVideos } from '../utils/storage';
import { getVideoBlob } from '../utils/indexedDb';
import { VideoItem } from '../types';

interface EmbedPlayerViewProps {
  videoId: string;
}

export const EmbedPlayerView: React.FC<EmbedPlayerViewProps> = ({ videoId }) => {
  const [video, setVideo] = useState<VideoItem | null>(null);
  const [streamSrc, setStreamSrc] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVideo() {
      const videos = getStoredVideos();
      const found = videos.find((v) => v.id === videoId);

      if (!found) {
        // Try fetching from API if backend is running
        try {
          const res = await fetch(`/api/vcdn/videos/${videoId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.video) {
              setVideo(data.video);
              setStreamSrc(data.video.streamUrl);
              return;
            }
          }
        } catch (e) {
          // ignore
        }
        setError('Video not found on VCDN Edge');
        return;
      }

      setVideo(found);

      // Check if stored in IndexedDB (client-side upload on Vercel)
      const blob = await getVideoBlob(found.id);
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        setStreamSrc(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }

      // Check if external URL
      if (found.streamUrl?.startsWith('http') || found.streamUrl?.startsWith('blob:')) {
        setStreamSrc(found.streamUrl);
      } else {
        setStreamSrc(found.streamUrl);
      }
    }

    loadVideo();
  }, [videoId]);

  if (error) {
    return (
      <div className="w-full h-screen bg-black text-neutral-400 flex flex-col items-center justify-center font-sans text-xs">
        <p>{error}</p>
        <span className="text-[10px] text-neutral-600 mt-1 font-mono">{videoId}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center font-sans">
      {streamSrc ? (
        <video
          controls
          autoPlay
          playsInline
          poster={video?.posterUrl}
          src={streamSrc}
          className="w-full h-full object-contain"
        >
          Your browser does not support HTML5 video streaming.
        </video>
      ) : (
        <div className="text-neutral-500 text-xs font-mono">Loading stream...</div>
      )}

      {/* VCDN Watermark */}
      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-medium text-sky-400 pointer-events-none flex items-center gap-1.5 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
        <span>VCDN EDGE</span>
      </div>
    </div>
  );
};
