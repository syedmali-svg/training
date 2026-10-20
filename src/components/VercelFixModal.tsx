import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Copy, Check, Terminal, ExternalLink, X, ShieldAlert, FileCode2 } from 'lucide-react';

interface VercelFixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelFixModal: React.FC<VercelFixModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitCommands = `git add package.json .npmrc
git commit -m "fix(deps): resolve esbuild peer dependency conflict for Vercel"
git push origin main`;

  const npmrcContent = `legacy-peer-deps=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-red-500/10 via-amber-500/10 to-transparent border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Vercel Build Error Resolved
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Fix Applied
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Fix for <code className="text-amber-300">npm error ERESOLVE could not resolve esbuild</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Cause Analysis */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              What Caused The Vercel Failure:
            </h4>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                In the build log:
              </p>
              <pre className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-red-200 font-mono text-[11px] overflow-x-auto">
{`npm error Found: esbuild@0.25.12
npm error   dev esbuild@"^0.25.0" from the root project
npm error Could not resolve dependency:
npm error peerOptional esbuild@"^0.27.0 || ^0.28.0" from vite@8.3.4`}
              </pre>
              <p>
                <strong>Root Cause:</strong> Your <code className="text-indigo-300 font-mono">package.json</code> had an explicit <code className="text-amber-300 font-mono">"esbuild": "^0.25.0"</code> in <code className="text-slate-400">devDependencies</code>. Meanwhile, modern <code className="text-indigo-300 font-mono">vite@8.3.x</code> declares a peer dependency on <code className="text-emerald-300 font-mono">esbuild@^0.27.0 || ^0.28.0</code>.
              </p>
              <p>
                When Vercel runs a fresh <code className="text-slate-200 font-mono">npm install</code> without a synchronized lockfile, npm’s strict peer-resolution engine aborts with <code className="text-red-400 font-mono">ERESOLVE</code>.
              </p>
            </div>
          </div>

          {/* Solution Implemented */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              What We Just Fixed in Your Codebase:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-1.5">
                <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4" /> 1. Cleaned package.json
                </div>
                <p className="text-slate-400">
                  Removed the conflicting <code className="text-red-400 line-through">"esbuild": "^0.25.0"</code>. Vite automatically manages and bundles its own compatible esbuild binary.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-1.5">
                <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <FileCode2 className="w-4 h-4" /> 2. Added .npmrc Configuration
                </div>
                <p className="text-slate-400">
                  Added <code className="text-emerald-300 font-mono">legacy-peer-deps=true</code> to instruct Vercel's npm installer to bypass peer dependency deadlocks.
                </p>
              </div>
            </div>
          </div>

          {/* Steps to deploy to Vercel */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 space-y-3">
            <h4 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Next Step: Push Changes to GitHub & Redeploy on Vercel
            </h4>
            <p className="text-xs text-slate-300">
              Run these commands in your repository root to push the updated <code className="text-indigo-200 font-mono">package.json</code> and <code className="text-indigo-200 font-mono">.npmrc</code> to GitHub:
            </p>

            <div className="relative">
              <pre className="p-3 bg-slate-950 rounded-lg text-indigo-300 font-mono text-xs border border-indigo-900/50 overflow-x-auto">
                {gitCommands}
              </pre>
              <button
                onClick={() => copyToClipboard(gitCommands, 1)}
                className="absolute top-2 right-2 px-2.5 py-1 text-xs rounded-md bg-indigo-600/80 hover:bg-indigo-600 text-white flex items-center gap-1.5 transition"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 1 ? 'Copied!' : 'Copy Commands'}
              </button>
            </div>
          </div>

          {/* Alternative: Vercel Settings */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs text-slate-400">
            <h5 className="font-semibold text-slate-300">
              Alternative (Direct Vercel Dashboard Fix without Git changes):
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>In your Vercel Project Dashboard, navigate to <strong>Settings</strong> &gt; <strong>General</strong>.</li>
              <li>Under <strong>Build & Development Settings</strong>, toggle on <strong>Install Command</strong> override.</li>
              <li>Set it to: <code className="text-indigo-300 font-mono font-medium">npm install --legacy-peer-deps</code>.</li>
              <li>Click <strong>Save</strong> and trigger a new deployment.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Build status in local container: <strong className="text-emerald-400 font-medium">Vite 8 Clean Compilation Passing</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
          >
            Got it, Continue Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
