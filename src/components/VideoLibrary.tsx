import React, { useState } from 'react';
import {
  Play,
  Copy,
  Trash2,
  ExternalLink,
  Code2,
  Check,
  LayoutGrid,
  List,
  Eye,
  Film
} from 'lucide-react';
import { VideoItem } from '../types';

interface VideoLibraryProps {
  videos: VideoItem[];
  searchQuery: string;
  onSelectVideo: (video: VideoItem) => void;
  onDeleteVideo: (id: string) => void;
  onOpenUpload: () => void;
}

export const VideoLibrary: React.FC<VideoLibraryProps> = ({
  videos,
  searchQuery,
  onSelectVideo,
  onDeleteVideo,
  onOpenUpload
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'public'
        ? video.access === 'public'
        : statusFilter === 'unlisted'
        ? video.access === 'unlisted'
        : statusFilter === 'private'
        ? video.access === 'private'
        : true;

    return matchesSearch && matchesStatus;
  });

  const handleCopyLink = (video: VideoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = video.streamUrl.startsWith('http')
      ? video.streamUrl
      : window.location.origin + video.streamUrl;
    navigator.clipboard.writeText(link);
    setCopiedId(video.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Controls: Filter & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3 sm:pb-4">
        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'All Videos' },
            { id: 'public', label: 'Public' },
            { id: 'unlisted', label: 'Unlisted' },
            { id: 'private', label: 'Private' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap min-h-[36px] ${
                statusFilter === tab.id
                  ? 'bg-neutral-800 text-white shadow-xs font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Mode & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs text-neutral-400 font-mono tabular-nums">
            {filteredVideos.length} / {videos.length} videos
          </span>

          <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 sm:p-1.5 rounded-md transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
                viewMode === 'grid' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 sm:p-1.5 rounded-md transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center ${
                viewMode === 'table' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-neutral-900/30 border border-dashed border-neutral-800 rounded-xl">
          <Film className="w-8 h-8 text-neutral-400 mx-auto" />
          <h3 className="text-sm font-semibold text-neutral-300">No videos found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchQuery
              ? `No videos match the query "${searchQuery}". Clear your search to see all.`
              : 'Your VCDN storage is currently empty. Upload your first video to start streaming.'}
          </p>
          <button
            onClick={onOpenUpload}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Upload First Video
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              className="group bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-neutral-950 overflow-hidden">
                {video.posterUrl ? (
                  <img
                    src={video.posterUrl}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-indigo-950/30 text-neutral-600">
                    <Film className="w-8 h-8 mb-1" />
                    <span className="text-[11px] font-mono text-neutral-500">VCDN Edge Ready</span>
                  </div>
                )}

                {/* Subtle scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-11 h-11 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[11px] text-neutral-200 tabular-nums">
                  {video.formattedDuration}
                </span>

                {/* Access indicator */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs font-mono text-[10px] text-neutral-300 uppercase">
                  {video.access}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-neutral-100 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {video.title}
                  </h3>

                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono tabular-nums">
                    <span>{video.formattedSize}</span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span>{video.views.toLocaleString()} views</span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span>{timeAgo(video.createdAt)}</span>
                  </div>
                </div>

                {/* Tags & Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
                  <span className="text-[11px] text-neutral-300 truncate max-w-[140px]">
                    {video.tags.join(' / ')}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleCopyLink(video, e)}
                      className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="Copy Stream Link"
                    >
                      {copiedId === video.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVideo(video);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="View Player & Embed"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Remove "${video.title}" from VCDN storage?`)) {
                          onDeleteVideo(video.id);
                        }
                      }}
                      className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
                      title="Delete Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* High-Density Table View */
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-300 font-semibold bg-neutral-950/50">
                <th className="py-3 px-4">Title & ID</th>
                <th className="py-3 px-4">Access</th>
                <th className="py-3 px-4 text-right">Size</th>
                <th className="py-3 px-4 text-right">Duration</th>
                <th className="py-3 px-4 text-right">Views</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filteredVideos.map((video) => (
                <tr
                  key={video.id}
                  onClick={() => onSelectVideo(video)}
                  className="hover:bg-neutral-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-neutral-950 flex items-center justify-center text-neutral-400 shrink-0 overflow-hidden">
                        {video.posterUrl ? (
                          <img src={video.posterUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Film className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-200 truncate max-w-xs">
                          {video.title}
                        </div>
                        <div className="font-mono text-[10px] text-neutral-400 truncate">
                          {video.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-400 uppercase">
                    {video.access}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-300 tabular-nums text-right">
                    {video.formattedSize}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-300 tabular-nums text-right">
                    {video.formattedDuration}
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-300 tabular-nums text-right">
                    {video.views.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                    {timeAgo(video.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => handleCopyLink(video, e)}
                        className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                        title="Copy Stream Link"
                      >
                        {copiedId === video.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectVideo(video);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                        title="Watch & Embed"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove "${video.title}"?`)) onDeleteVideo(video.id);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-neutral-800 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
