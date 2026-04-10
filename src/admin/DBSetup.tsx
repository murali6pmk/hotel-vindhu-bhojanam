import { useState, useEffect } from 'react';
import { CheckCircle, ExternalLink, Copy, RefreshCw, AlertTriangle, Database } from 'lucide-react';

interface HealthStatus {
  ok: boolean;
  database: 'connected' | 'not_configured' | 'tables_missing' | 'error';
  message: string;
}

const SQL_SCRIPT = `-- PASTE THIS IN SUPABASE SQL EDITOR AND CLICK RUN ▶

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
);

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  upi_id TEXT DEFAULT '',
  upi_name TEXT DEFAULT 'Hotel Vindhu Bhojanam',
  upi_note TEXT DEFAULT 'Pay for your food order',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable Row Level Security (allows app to read/write)
ALTER TABLE credentials DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- Insert default admin login
INSERT INTO credentials (username, password, owner_name, email)
VALUES ('admin', 'vindhu@2025', 'Hotel Vindhu Bhojanam', 'vindhu@gmail.com')
ON CONFLICT DO NOTHING;`;

export default function DBSetup({ onConnected }: { onConnected: () => void }) {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [checking, setChecking] = useState(true);
  const [copied, setCopied] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setStatus(data);
      if (data.database === 'connected') setTimeout(onConnected, 1000);
    } catch {
      setStatus({ ok: false, database: 'error', message: 'Cannot reach API.' });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => { checkHealth(); }, []);

  const copySQL = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const isConnected = status?.database === 'connected';
  const needsTables = status?.database === 'tables_missing';
  const notConfigured = status?.database === 'not_configured';

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0d0804 0%, #2c1a0e 50%, #0d0804 100%)' }}>
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-4"
            style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 0 40px rgba(232,102,10,0.4)' }}>
            🍛
          </div>
          <h1 className="font-yatra text-3xl text-gold">Hotel Vindhu Bhojanam</h1>
          <p className="text-cream/50 text-sm mt-1">Admin Portal — Database Setup</p>
        </div>

        {/* Status */}
        <div className="rounded-2xl p-4 mb-6 flex items-center gap-4 border"
          style={{
            background: isConnected ? 'rgba(58,107,53,0.2)' : needsTables ? 'rgba(212,160,23,0.15)' : 'rgba(232,102,10,0.12)',
            borderColor: isConnected ? 'rgba(58,107,53,0.5)' : needsTables ? 'rgba(212,160,23,0.4)' : 'rgba(232,102,10,0.35)',
          }}>
          {checking
            ? <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin flex-shrink-0" />
            : isConnected
            ? <CheckCircle size={24} className="text-green-400 flex-shrink-0" />
            : <AlertTriangle size={24} className="text-orange-400 flex-shrink-0" />
          }
          <div className="flex-1">
            <div className={`font-semibold text-sm ${isConnected ? 'text-green-400' : needsTables ? 'text-yellow-400' : 'text-orange-300'}`}>
              {checking ? 'Checking database...'
                : isConnected ? '✓ Database ready! Opening admin portal...'
                : needsTables ? '⚠ Connected! Just need to create tables (Step 2 below)'
                : notConfigured ? '⚠ Supabase keys not set in Vercel yet'
                : '⚠ ' + status?.message}
            </div>
            {!checking && !isConnected && (
              <div className="text-cream/40 text-xs mt-0.5">{status?.message}</div>
            )}
          </div>
          {!checking && !isConnected && (
            <button onClick={checkHealth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm border border-gold/30 text-gold hover:bg-gold/10 transition-colors">
              <RefreshCw size={13} /> Retry
            </button>
          )}
        </div>

        {/* Main card */}
        <div className="rounded-3xl border border-white/10 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.95), rgba(20,12,5,0.98))' }}>

          {/* Step 1 - Only show if not configured */}
          {(notConfigured || !status) && (
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>1</div>
                <h3 className="text-gold font-semibold">Add Keys to Vercel</h3>
              </div>
              <p className="text-cream/60 text-sm mb-4">
                Go to <strong className="text-gold">Vercel Dashboard</strong> → your project → <strong className="text-gold">Settings → Environment Variables</strong> → add these:
              </p>
              <div className="space-y-2 mb-4">
                <EnvRow name="SUPABASE_URL" value="https://hgvgtflwvcgnelqxqyde.supabase.co" />
                <EnvRow name="SUPABASE_ANON_KEY" value="eyJhbGci...y4wbrkZx" />
              </div>
              <p className="text-cream/40 text-xs">Then redeploy in Vercel and come back here.</p>
            </div>
          )}

          {/* Step 2 - Create tables */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
                {notConfigured ? '2' : '1'}
              </div>
              <h3 className="text-gold font-semibold">Create Tables in Supabase</h3>
              {needsTables && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Do this now!</span>}
            </div>

            <ol className="text-cream/60 text-sm space-y-1.5 mb-4">
              <li className="flex gap-2"><span className="text-saffron font-bold">1.</span>
                Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer"
                  className="text-green-400 underline inline-flex items-center gap-1">
                  supabase.com/dashboard <ExternalLink size={11} />
                </a>
              </li>
              <li className="flex gap-2"><span className="text-saffron font-bold">2.</span> Open your project <span className="text-gold font-mono text-xs">hgvgtflwvcgnelqxqyde</span></li>
              <li className="flex gap-2"><span className="text-saffron font-bold">3.</span> Click <span className="text-gold">SQL Editor</span> in left sidebar</li>
              <li className="flex gap-2"><span className="text-saffron font-bold">4.</span> Click <span className="text-gold">New Query</span></li>
              <li className="flex gap-2"><span className="text-saffron font-bold">5.</span> Copy the SQL below → Paste → Click <span className="text-gold">Run ▶</span></li>
            </ol>

            {/* SQL Box */}
            <div className="rounded-xl overflow-hidden border border-white/10">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10"
                style={{ background: 'rgba(0,0,0,0.4)' }}>
                <div className="flex items-center gap-2">
                  <Database size={14} className="text-saffron" />
                  <span className="text-cream/50 text-xs font-mono">setup.sql</span>
                </div>
                <button onClick={copySQL}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: copied ? 'rgba(58,107,53,0.3)' : 'rgba(212,160,23,0.2)',
                    color: copied ? '#4ade80' : '#d4a017',
                    border: `1px solid ${copied ? 'rgba(58,107,53,0.5)' : 'rgba(212,160,23,0.3)'}`,
                  }}>
                  {copied ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy SQL</>}
                </button>
              </div>
              <pre className="text-xs text-green-400/80 p-4 overflow-x-auto leading-relaxed max-h-52 overflow-y-auto"
                style={{ background: 'rgba(0,0,0,0.5)' }}>
                {SQL_SCRIPT}
              </pre>
            </div>
          </div>

          {/* Step 3 - Check again */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
                {notConfigured ? '3' : '2'}
              </div>
              <h3 className="text-gold font-semibold">Done! Click Check Again</h3>
            </div>
            <p className="text-cream/50 text-sm mb-4">After running the SQL in Supabase, click below to verify and open the admin portal.</p>
            <button onClick={checkHealth} disabled={checking}
              className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 25px rgba(232,102,10,0.3)' }}>
              <RefreshCw size={18} className={checking ? 'animate-spin' : ''} />
              {checking ? 'Checking...' : 'Check & Open Admin Portal'}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-cream/30 text-sm hover:text-gold transition-colors">← Back to Restaurant Website</a>
        </div>
      </div>
    </div>
  );
}

function EnvRow({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono"
      style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <span className="text-green-400 flex-shrink-0">{name}</span>
      <span className="text-cream/30">=</span>
      <span className="text-cream/40 truncate">{value}</span>
    </div>
  );
}
