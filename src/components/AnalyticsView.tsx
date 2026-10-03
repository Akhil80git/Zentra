import React from 'react';
import { BarChart3, Globe, HardDrive, Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import { VideoItem } from '../types';

interface AnalyticsViewProps {
  videos: VideoItem[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ videos }) => {
  const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0);
  const totalBandwidthMb = videos.reduce((acc, v) => acc + (v.bandwidthUsedMb || 0), 0);
  const totalSize = videos.reduce((acc, v) => acc + (v.size || 0), 0);

  const formatGb = (mb: number) => {
    return (mb / 1024).toFixed(2) + ' GB';
  };

  const edgeNodes = [
    { name: 'Asia-South (Mumbai POP)', latency: '12ms', traffic: '62%', status: 'Optimal' },
    { name: 'Asia-Southeast (Singapore)', latency: '34ms', traffic: '21%', status: 'Optimal' },
    { name: 'Europe (Frankfurt POP)', latency: '78ms', traffic: '11%', status: 'Optimal' },
    { name: 'US-East (Virginia)', latency: '112ms', traffic: '6%', status: 'Optimal' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">CDN Traffic & Edge Performance</h2>
        <p className="text-xs text-neutral-400">
          Real-time global edge delivery metrics, cache hit efficiency, and bandwidth distribution.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Total Bandwidth</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {formatGb(totalBandwidthMb)}
          </div>
          <p className="text-[11px] text-neutral-400">Transferred across global edge</p>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Cache Hit Ratio</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            98.7%
          </div>
          <p className="text-[11px] text-emerald-400">Edge cached without origin hit</p>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Total Video Plays</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {totalViews.toLocaleString()}
          </div>
          <p className="text-[11px] text-neutral-400">Stream sessions served</p>
        </div>

        <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-medium">Stored Media Assets</span>
            <HardDrive className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {videos.length} <span className="text-xs font-normal text-neutral-400">videos</span>
          </div>
          <p className="text-[11px] text-neutral-400 font-mono tabular-nums">{(totalSize / (1024 * 1024)).toFixed(1)} MB total</p>
        </div>
      </div>

      {/* Edge Nodes Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold text-white">Active VCDN Edge PoP Locations</h3>
          </div>
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> All 4 Nodes Healthy
          </span>
        </div>

        <table className="w-full text-left text-xs min-w-[500px]">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400 bg-neutral-950/40">
              <th className="py-2.5 px-4 font-semibold">PoP Location</th>
              <th className="py-2.5 px-4 font-semibold">RTT Latency</th>
              <th className="py-2.5 px-4 font-semibold">Traffic Share</th>
              <th className="py-2.5 px-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800 font-mono tabular-nums">
            {edgeNodes.map((node) => (
              <tr key={node.name} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 px-4 text-neutral-200 font-sans font-medium">{node.name}</td>
                <td className="py-3 px-4 text-neutral-300">{node.latency}</td>
                <td className="py-3 px-4 text-neutral-300">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: node.traffic }} />
                    </div>
                    <span>{node.traffic}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-emerald-400 text-[11px] font-sans font-medium">
                    {node.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
