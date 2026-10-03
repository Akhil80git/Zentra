import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Key,
  ShieldCheck,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { VcdnConfig } from '../types';

interface ApiDocsViewProps {
  config: VcdnConfig | null;
}

export const ApiDocsView: React.FC<ApiDocsViewProps> = ({ config }) => {
  const [activeLang, setActiveLang] = useState<'curl' | 'node' | 'python'>('curl');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [testingPing, setTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<any>(null);

  const apiKey = config?.apiKey || 'vcdn_sk_867ea542bb48b7653b5d0f13412826ce4e18f41e675bc72e';
  const baseUrl = config?.baseUrl || 'https://api.vcdn.io/v1';

  const curlSnippet = `# Upload video file with your VCDN API key
curl -X POST "${window.location.origin}/api/vcdn/upload" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "x-api-key: ${apiKey}" \\
  -F "video=@/path/to/movie.mp4" \\
  -F "title=My First VCDN Video" \\
  -F "access=public" \\
  -F "hls=true"`;

  const nodeSnippet = `// Node.js (v18+) or Browser Fetch
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

async function uploadToVCDN() {
  const form = new FormData();
  form.append('video', fs.createReadStream('./movie.mp4'));
  form.append('title', 'Product Launch 2026');
  form.append('access', 'public');

  const response = await fetch('${window.location.origin}/api/vcdn/upload', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ${apiKey}',
      'x-api-key': '${apiKey}',
      ...form.getHeaders()
    },
    body: form
  });

  const result = await response.json();
  console.log('Stream URL:', result.video.streamUrl);
  console.log('HLS Manifest:', result.video.hlsUrl);
}

uploadToVCDN();`;

  const pythonSnippet = `import requests

url = "${window.location.origin}/api/vcdn/upload"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "x-api-key": "${apiKey}"
}

files = {
    "video": open("movie.mp4", "rb")
}
data = {
    "title": "Cosmic Aurora 4K",
    "access": "public",
    "hls": "true"
}

response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())`;

  const getActiveCode = () => {
    switch (activeLang) {
      case 'curl':
        return curlSnippet;
      case 'node':
        return nodeSnippet;
      case 'python':
        return pythonSnippet;
      default:
        return curlSnippet;
    }
  };

  const handleTestConnection = async () => {
    setTestingPing(true);
    setPingResult(null);
    try {
      const res = await fetch('/api/vcdn/test-connection');
      const data = await res.json();
      setPingResult(data);
    } catch (e: any) {
      setPingResult({ success: false, error: e.message || 'Connection test failed' });
    } finally {
      setTestingPing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">VCDN API & Upload Integration</h2>
        <p className="text-xs text-neutral-400">
          Programmatic video uploading, stream ingestion, and player embedding via your VCDN secret key.
        </p>
      </div>

      {/* Key Display Card */}
      <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
            <Key className="w-4 h-4 text-indigo-400" />
            <span>Configured VCDN Secret Key</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Key Valid
          </span>
        </div>

        <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
          <code className="text-xs font-mono text-indigo-300 break-all flex-1">
            {apiKey}
          </code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(apiKey);
              setCopiedKey(true);
              setTimeout(() => setCopiedKey(false), 2000);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors cursor-pointer shrink-0"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
          </button>
        </div>

        {/* Live Test Button */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-neutral-400">Validate secret key authentication & edge ping:</span>
          <button
            onClick={handleTestConnection}
            disabled={testingPing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            <Activity className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin text-indigo-400' : 'text-neutral-400'}`} />
            <span>{testingPing ? 'Testing Connection...' : 'Test API Connection'}</span>
          </button>
        </div>

        {/* Ping Result Output */}
        {pingResult && (
          <div className={`p-3 rounded-lg border text-xs ${
            pingResult.success
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-red-950/40 border-red-800/60 text-red-300'
          }`}>
            <div className="flex items-center gap-2 font-semibold mb-1">
              {pingResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
              <span>{pingResult.success ? 'VCDN Connection Verified' : 'Connection Error'}</span>
            </div>
            <p className="font-mono text-[11px] text-neutral-300">
              {pingResult.note || `Service: ${pingResult.service} · Status: ${pingResult.status} · Node: ${pingResult.nodeLocation}`}
            </p>
          </div>
        )}
      </div>

      {/* Code Snippets Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold text-white">Upload Code Examples</h3>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-neutral-900 border border-neutral-800 rounded-lg">
            {(['curl', 'node', 'python'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer uppercase ${
                  activeLang === lang
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-neutral-300'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <pre className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-300 overflow-x-auto">
            <code>{getActiveCode()}</code>
          </pre>

          <button
            onClick={() => {
              navigator.clipboard.writeText(getActiveCode());
              setCopiedSnippet(true);
              setTimeout(() => setCopiedSnippet(false), 2000);
            }}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors cursor-pointer"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSnippet ? 'Copied' : 'Copy Snippet'}</span>
          </button>
        </div>
      </div>

      {/* Hindi & English Guidance Box */}
      <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-2 text-xs text-neutral-400">
        <div className="flex items-center gap-2 text-neutral-200 font-semibold">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          <span>VCDN Setup & API Details (जानकारी)</span>
        </div>
        <p>
          Aapki API key (<code className="text-indigo-300 font-mono text-[11px]">{apiKey.slice(0, 14)}...</code>) successfully integrate ho chuki hai. Aap is studio se:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-neutral-300">
          <li><strong>Upload Video tab</strong> se direct MP4/WebM video drag & drop karke upload kar sakte hain.</li>
          <li><strong>URL Ingestion tab</strong> se kisi bhi video URL ko seedhe VCDN cache me import kar sakte hain.</li>
          <li>Video upload hone ke baad automated HLS (.m3u8), 1080p/720p transcoding aur direct iFrame embed code milta hai.</li>
          <li>CURL ya Python script se upload karne ke liye upar diye gaye ready-made code snippets use kar sakte hain.</li>
        </ul>
      </div>
    </div>
  );
};
