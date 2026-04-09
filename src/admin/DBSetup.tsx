import { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, Copy, RefreshCw, AlertTriangle } from 'lucide-react';

interface HealthStatus {
  ok: boolean;
  database: 'connected' | 'not_configured' | 'tables_missing' | 'error';
  message: string;
}

const SQL_SETUP = `-- Run this in Supabase → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS credentials (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL DEFAULT 'admin',
  password TEXT NOT NULL DEFAULT 'vindhu@2025',
  owner_name TEXT DEFAULT 'Hotel Vindhu Bhojanam',
  email TEXT DEFAULT 'vindhu@gmail.com',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  telugu TEXT DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  img TEXT DEFAULT '/images/food1.jpg',
  popular BOOLEAN DEFAULT false,
  category TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  table_no TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  payment_method TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`;

export default function DBSetup({ onConnected }: { onConnected: () => void }) {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [checking, setChecking] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setStatus(data);
      if (data.database === 'connected') setTimeout(onConnected, 1200);
    } catch {
      setStatus({ ok: false, database: 'error', message: 'Cannot reach API. Check deployment.' });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => { checkHealth(); }, []);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2500);
  };

  const isConnected = status?.database === 'connected';
  const needsTables = status?.database === 'tables_missing';

  const statusColor = isConnected ? '#3a6b35' : needsTables ? '#d4a017' : '#e8660a';
  const statusBg = isConnected ? 'rgba(58,107,53,0.2)' : needsTables ? 'rgba(212,160,23,0.15)' : 'rgba(232,102,10,0.12)';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0d0804 0%, #2c1a0e 50%, #0d0804 100%)' }}
    >
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 text-4xl"
            style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 0 40px rgba(232,102,10,0.4)' }}>
            🍛
          </div>
          <h1 className="font-yatra text-3xl text-gold">Database Setup</h1>
          <p className="text-cream/50 mt-2 text-sm">Using <strong className="text-green-400">Supabase</strong> — Free PostgreSQL with Mumbai servers 🇮🇳</p>
        </div>

        {/* Status */}
        <div className="rounded-2xl p-4 mb-6 flex items-center gap-4 border"
          style={{ background: statusBg, borderColor: `${statusColor}50` }}>
          {checking
            ? <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin flex-shrink-0" />
            : isConnected
            ? <CheckCircle size={24} style={{ color: statusColor }} className="flex-shrink-0" />
            : <AlertTriangle size={24} style={{ color: statusColor }} className="flex-shrink-0" />
          }
          <div className="flex-1">
            <div className="font-semibold text-sm" style={{ color: statusColor }}>
              {checking ? 'Checking connection...'
                : isConnected ? '✓ Database connected! Opening admin portal...'
                : needsTables ? '⚠ Connected but tables missing — run the SQL below'
                : '⚠ Database not configured yet'}
            </div>
            <div className="text-cream/40 text-xs mt-0.5">{status?.message}</div>
          </div>
          {!checking && !isConnected && (
            <button onClick={checkHealth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border transition-colors hover:bg-white/5"
              style={{ color: '#d4a017', borderColor: 'rgba(212,160,23,0.3)' }}>
              <RefreshCw size={13} /> Retry
            </button>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-3">

          {/* Step 1 */}
          <StepCard num={1} title="Sign up at Supabase — Free, India Servers 🇮🇳">
            <p className="text-cream/60 text-sm mb-3">
              Supabase is free forever (500MB), has <strong className="text-gold">Mumbai servers</strong>, and works great from India.
              Sign up with Google or GitHub — no credit card needed.
            </p>
            <a href="https://supabase.com" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3ecf8e, #1a9e68)' }}>
              Open Supabase.com — Sign Up Free <ExternalLink size={14} />
            </a>
          </StepCard>

          {/* Step 2 */}
          <StepCard num={2} title="Create a New Project">
            <div className="space-y-1.5 text-sm text-cream/70">
              <Row n="1">Click <Tag>New Project</Tag></Row>
              <Row n="2">Set project name: <Tag>vindhu-bhojanam</Tag></Row>
              <Row n="3">Set a database password (save it somewhere)</Row>
              <Row n="4">Region: choose <Tag>Southeast Asia (Singapore)</Tag> — closest to India</Row>
              <Row n="5">Click <Tag>Create new project</Tag> — wait ~1 minute</Row>
            </div>
          </StepCard>

          {/* Step 3 */}
          <StepCard num={3} title="Run SQL to Create Tables">
            <p className="text-cream/60 text-sm mb-3">
              In your Supabase project → click <Tag>SQL Editor</Tag> (left sidebar) → <Tag>New Query</Tag> → paste this → click <Tag>Run</Tag>
            </p>
            <div className="relative rounded-xl overflow-hidden"
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                <span className="text-cream/40 text-xs font-mono">SQL Setup Script</span>
                <button onClick={() => copy(SQL_SETUP, 'sql')}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition-colors hover:bg-white/10"
                  style={{ color: copied === 'sql' ? '#3ecf8e' : '#d4a017' }}>
                  {copied === 'sql' ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy SQL</>}
                </button>
              </div>
              <pre className="text-xs text-green-400/80 p-4 overflow-x-auto leading-relaxed max-h-48 overflow-y-auto">
                {SQL_SETUP}
              </pre>
            </div>
          </StepCard>

          {/* Step 4 */}
          <StepCard num={4} title="Get Your API Keys">
            <p className="text-cream/60 text-sm mb-3">
              In Supabase → <Tag>Project Settings</Tag> (gear icon) → <Tag>API</Tag> → copy these two values:
            </p>
            <div className="space-y-2">
              <KeyRow label="Project URL" example="https://abcdefgh.supabase.co" varName="SUPABASE_URL" onCopy={copy} copied={copied} />
              <KeyRow label="anon / public key" example="eyJhbGciOiJIUzI1NiIs..." varName="SUPABASE_ANON_KEY" onCopy={copy} copied={copied} />
            </div>
          </StepCard>

          {/* Step 5 */}
          <StepCard num={5} title="Add Keys to Vercel & Redeploy">
            <p className="text-cream/60 text-sm mb-3">
              Go to <strong className="text-gold">Vercel Dashboard</strong> → your project → <Tag>Settings</Tag> → <Tag>Environment Variables</Tag> → add both variables above → then <Tag>Redeploy</Tag>
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:scale-105"
                style={{ background: '#000', border: '1px solid rgba(255,255,255,0.2)' }}>
                Vercel Dashboard <ExternalLink size={13} />
              </a>
              <button onClick={checkHealth} disabled={checking}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:scale-105 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
                <RefreshCw size={13} className={checking ? 'animate-spin' : ''} />
                {checking ? 'Checking...' : 'Check Again'}
              </button>
            </div>
          </StepCard>

        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-1">
          <p className="text-cream/25 text-xs">🔒 Free tier: 500MB storage · Unlimited API calls · No credit card · Data stays in Singapore/Mumbai</p>
          <a href="/" className="text-cream/40 text-sm hover:text-gold transition-colors block">← Back to Restaurant Website</a>
        </div>
      </div>
    </div>
  );
}

function StepCard({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 border border-white/10"
      style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
          {num}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-gold font-semibold mb-2 text-sm">{title}</h3>
          {children}
        </div>
      </div>
    </div>
  );
}

function Row({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-saffron font-bold flex-shrink-0">{n}.</span>
      <span>{children}</span>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-1.5 py-0.5 rounded text-xs font-mono text-gold"
      style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.25)' }}>
      {children}
    </span>
  );
}

function KeyRow({ label, example, varName, onCopy, copied }: {
  label: string; example: string; varName: string;
  onCopy: (t: string, k: string) => void; copied: string | null;
}) {
  return (
    <div className="rounded-xl p-3 border border-white/10" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-cream/50 text-xs">{label} →</span>
        <button onClick={() => onCopy(varName, varName)}
          className="flex items-center gap-1 text-xs transition-colors"
          style={{ color: copied === varName ? '#3ecf8e' : '#d4a017' }}>
          {copied === varName ? <><CheckCircle size={11} /> Copied</> : <><Copy size={11} /> Copy var name</>}
        </button>
      </div>
      <div className="font-mono text-xs">
        <span className="text-green-400">{varName}</span>
        <span className="text-cream/30 ml-2">= {example}</span>
      </div>
    </div>
  );
}
