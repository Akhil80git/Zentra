import React, { useState } from 'react';
import { Settings, Key, Globe, Shield, Save, CheckCircle2, RotateCcw, Sliders } from 'lucide-react';
import { VcdnConfig } from '../types';

interface SettingsViewProps {
  config: VcdnConfig | null;
  onUpdateConfig: (updated: Partial<VcdnConfig>) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ config, onUpdateConfig }) => {
  const [apiKey, setApiKey] = useState(config?.apiKey || '');
  const [baseUrl, setBaseUrl] = useState(config?.baseUrl || 'https://api.vcdn.io/v1');
  const [region, setRegion] = useState(config?.region || 'ap-south-1 (Mumbai / Asia-South)');
  const [watermarkEnabled, setWatermarkEnabled] = useState(config?.watermarkEnabled || false);
  const [hlsTranscode, setHlsTranscode] = useState(config?.hlsTranscode ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await onUpdateConfig({
        apiKey,
        baseUrl,
        region,
        watermarkEnabled,
        hlsTranscode
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      alert('Failed to save configuration settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setApiKey('vcdn_sk_867ea542bb48b7653b5d0f13412826ce4e18f41e675bc72e');
    setBaseUrl('https://api.vcdn.io/v1');
    setRegion('ap-south-1 (Mumbai / Asia-South)');
  };

  return (
    <div className="max-w-4xl mx-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">VCDN Studio Settings</h2>
        <p className="text-xs text-neutral-400">
          Configure API credentials, origin endpoints, default edge caching, and encoding behaviors.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* API Credentials */}
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800 text-xs font-semibold text-white">
            <Key className="w-4 h-4 text-indigo-400" />
            <span>API Authentication & Keys</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              VCDN Secret Key (Secret API Key)
            </label>
            <div className="relative">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="vcdn_sk_..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500/80"
                required
              />
            </div>
            <p className="text-[11px] text-neutral-400">
              Starts with <code className="text-neutral-300 font-mono">vcdn_sk_</code>. All server requests and uploads are signed with this credential.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              VCDN API Base URL / Endpoint
            </label>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.vcdn.io/v1"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs font-mono text-neutral-300 focus:outline-none focus:border-indigo-500/80"
              required
            />
            <p className="text-[11px] text-neutral-400">
              Specify your VCDN provider origin or reverse proxy gateway URL.
            </p>
          </div>
        </div>

        {/* Global Edge & CDN Settings */}
        <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-800 text-xs font-semibold text-white">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Edge Infrastructure & Distribution</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">Default Edge PoP</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/80"
              >
                <option value="ap-south-1 (Mumbai / Asia-South)">Asia-South (Mumbai / India Edge)</option>
                <option value="ap-southeast-1 (Singapore)">Asia-Pacific (Singapore Edge)</option>
                <option value="eu-central-1 (Frankfurt)">Europe (Frankfurt Edge)</option>
                <option value="us-east-1 (N. Virginia)">US-East (Virginia Edge)</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={hlsTranscode}
                  onChange={(e) => setHlsTranscode(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-800 text-indigo-600 focus:ring-0"
                />
                <span>Default automated HLS (.m3u8) adaptive packaging</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                <input
                  type="checkbox"
                  checked={watermarkEnabled}
                  onChange={(e) => setWatermarkEnabled(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-800 text-indigo-600 focus:ring-0"
                />
                <span>Overlay VCDN Edge security watermark on player iframe</span>
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Your Key (vcdn_sk_867ea...)</span>
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Settings saved successfully
              </span>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
