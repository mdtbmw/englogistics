/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RefreshCw, 
  Server, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { FirebaseConfigState } from '../../types';
import { 
  getFirebaseConfig, 
  saveFirebaseConfig, 
  testFirebaseConnection, 
  resetDatabaseToDefaults 
} from '../../services/firebase';

interface AdminFirebaseSetupProps {
  onDatabaseReset: () => void;
}

export default function AdminFirebaseSetup({ onDatabaseReset }: AdminFirebaseSetupProps) {
  const [config, setConfig] = useState<FirebaseConfigState>(getFirebaseConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleSave = () => {
    saveFirebaseConfig(config);
    setSaveStatus('Firebase credentials updated in local vault.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const res = await testFirebaseConnection(config);
    setTesting(false);
    setTestResult(res);
  };

  const handleResetData = async () => {
    await resetDatabaseToDefaults();
    setResetConfirm(false);
    onDatabaseReset();
    setSaveStatus('Database re-seeded with 6 authoritative articles!');
    setTimeout(() => setSaveStatus(null), 4000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      
      <div>
        <h2 className="text-2xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
          <Database size={24} className="text-amber-500" />
          <span>Firebase Console &amp; Cloud Sync Center</span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500">
          Connect your Google Firebase Firestore project for real-time cloud synchronisation across devices.
        </p>
      </div>

      {/* Connection Status Banner */}
      <div className={`p-6 rounded-3xl border ${
        config.isConnected 
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
          : 'bg-blue-50/80 border-blue-200 text-blue-950'
      } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            config.isConnected ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
          }`}>
            {config.isConnected ? <CheckCircle2 size={20} /> : <Server size={20} />}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block font-mono">
              Data Storage Mode
            </span>
            <h4 className="text-base font-black">
              {config.isConnected ? `Connected to Firebase: ${config.projectId}` : 'Offline-Resilient Local Storage (Active)'}
            </h4>
          </div>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={testing}
          className="bg-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-zinc-200 hover:bg-zinc-50 transition-all cursor-pointer shadow-sm shrink-0"
        >
          {testing ? 'Testing Ping...' : 'Test Connection'}
        </button>
      </div>

      {testResult && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
          testResult.success ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Credentials Form */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 font-mono">
            Firebase Project Credentials
          </h3>
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#050548] hover:underline flex items-center gap-1"
          >
            <span>Firebase Console</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold uppercase text-zinc-500 block mb-1">API Key</label>
            <input
              type="text"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="AIzaSy..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs font-mono text-zinc-900 focus:bg-white focus:outline-none focus:border-[#050548]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-zinc-500 block mb-1">Project ID</label>
            <input
              type="text"
              value={config.projectId}
              onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
              placeholder="engraced-logistics-prod"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs font-mono text-zinc-900 focus:bg-white focus:outline-none focus:border-[#050548]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-zinc-500 block mb-1">Auth Domain</label>
            <input
              type="text"
              value={config.authDomain}
              onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
              placeholder="engraced-logistics.firebaseapp.com"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs font-mono text-zinc-900 focus:bg-white focus:outline-none focus:border-[#050548]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase text-zinc-500 block mb-1">Storage Bucket</label>
            <input
              type="text"
              value={config.storageBucket}
              onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
              placeholder="engraced-logistics.appspot.com"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2.5 text-xs font-mono text-zinc-900 focus:bg-white focus:outline-none focus:border-[#050548]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <span className="text-xs text-zinc-400">
            Keys are safely stored locally in your browser vault.
          </span>

          <button
            onClick={handleSave}
            className="bg-[#050548] hover:bg-[#030330] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Save size={14} />
            <span>Save Configuration</span>
          </button>
        </div>

        {saveStatus && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={14} />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Database Reset & Seed Box */}
      <div className="bg-zinc-50 rounded-3xl border border-zinc-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-zinc-900 mb-1">
            Database Seed &amp; Recovery
          </h4>
          <p className="text-xs text-zinc-500">
            Reset or populate your database with high-authority logistics, luxury car rental, and VIP protocol seed articles.
          </p>
        </div>

        {resetConfirm ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setResetConfirm(false)}
              className="px-3 py-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleResetData}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md"
            >
              Yes, Re-seed DB
            </button>
          </div>
        ) : (
          <button
            onClick={() => setResetConfirm(true)}
            className="px-4 py-2.5 bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
          >
            <RefreshCw size={13} />
            <span>Re-seed Database</span>
          </button>
        )}
      </div>

    </div>
  );
}
