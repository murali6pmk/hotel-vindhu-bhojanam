import { Download, Github, FileCode, FolderOpen, Globe, Database, Shield } from 'lucide-react';

export default function DownloadPage() {
  const files = [
    { path: 'src/App.tsx', desc: 'Main app + routing' },
    { path: 'src/components/', desc: 'Hero, Navbar, Menu, Reviews, Gallery, About, Footer' },
    { path: 'src/admin/', desc: 'Admin portal — Login, Dashboard, Orders, Menu Manager, Settings' },
    { path: 'src/lib/api.ts', desc: 'API client (talks to Supabase)' },
    { path: 'api/_db.js', desc: 'Supabase database connection' },
    { path: 'api/auth/', desc: 'Login & credentials API' },
    { path: 'api/menu/', desc: 'Menu CRUD API' },
    { path: 'api/orders/', desc: 'Orders CRUD API' },
    { path: 'public/uploads/', desc: 'Your restaurant photo' },
    { path: 'vercel.json', desc: 'Vercel deployment config' },
    { path: 'package.json', desc: 'Dependencies & scripts' },
  ];

  return (
    <div className="min-h-screen py-16 px-4"
      style={{ background: 'linear-gradient(135deg, #0d0804 0%, #2c1a0e 50%, #0d0804 100%)' }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-4"
            style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 0 40px rgba(232,102,10,0.4)' }}>
            🍛
          </div>
          <h1 className="font-yatra text-4xl text-gold mb-2">Project Ownership</h1>
          <p className="text-cream/60">Hotel Vindhu Bhojanam — Full Source Code</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-saffron">✦</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </div>

        {/* Download Card */}
        <div className="rounded-3xl p-8 border border-gold/30 mb-8 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.95), rgba(20,12,5,0.98))', boxShadow: '0 0 60px rgba(212,160,23,0.1)' }}>
          <div className="text-6xl mb-4">📦</div>
          <h2 className="font-playfair text-2xl text-gold mb-2">Download Full Source Code</h2>
          <p className="text-cream/60 text-sm mb-6">
            All 53 files — React frontend, Node.js API, config files, images.<br />
            Everything you need to own, edit and redeploy this project.
          </p>
          <a
            href="/hotel-vindhu-bhojanam.zip"
            download="hotel-vindhu-bhojanam.zip"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 30px rgba(232,102,10,0.4)' }}
          >
            <Download size={22} />
            Download hotel-vindhu-bhojanam.zip
          </a>
          <p className="text-cream/30 text-xs mt-3">887 KB · 53 files · No node_modules</p>
        </div>

        {/* What's Inside */}
        <div className="rounded-3xl p-6 border border-white/10 mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
          <h3 className="text-gold font-semibold text-lg mb-4 flex items-center gap-2">
            <FolderOpen size={20} className="text-saffron" /> What's Inside the ZIP
          </h3>
          <div className="space-y-2">
            {files.map(f => (
              <div key={f.path} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                <FileCode size={14} className="text-saffron mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gold font-mono text-sm">{f.path}</span>
                  <span className="text-cream/50 text-xs ml-2">— {f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* After Download Steps */}
        <div className="rounded-3xl p-6 border border-white/10 mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
          <h3 className="text-gold font-semibold text-lg mb-5 flex items-center gap-2">
            <Github size={20} className="text-saffron" /> Push to GitHub in 4 Commands
          </h3>
          <div className="space-y-3">
            {[
              { label: '1. Extract ZIP and open terminal inside the folder', cmd: null },
              { label: '2. Install dependencies', cmd: 'npm install' },
              { label: '3. Initialize git & push', cmd: null },
              { label: '', cmd: 'git init\ngit add .\ngit commit -m "Hotel Vindhu Bhojanam"\ngit branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/hotel-vindhu-bhojanam.git\ngit push -u origin main' },
            ].map((step, i) => (
              <div key={i}>
                {step.label && <p className="text-cream/60 text-sm mb-1">{step.label}</p>}
                {step.cmd && (
                  <pre className="px-4 py-3 rounded-xl text-sm text-green-400 font-mono overflow-x-auto"
                    style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {step.cmd}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Deploy + DB */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl p-5 border border-white/10"
            style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
            <h4 className="text-gold font-semibold mb-3 flex items-center gap-2">
              <Globe size={16} className="text-saffron" /> Deploy on Vercel (Free)
            </h4>
            <ol className="text-cream/60 text-sm space-y-1.5 list-none">
              <li>1. Go to <span className="text-gold">vercel.com</span></li>
              <li>2. Click <span className="text-gold">Import Project</span></li>
              <li>3. Connect your GitHub repo</li>
              <li>4. Add env variables</li>
              <li>5. Click <span className="text-gold">Deploy</span> ✅</li>
            </ol>
          </div>
          <div className="rounded-2xl p-5 border border-white/10"
            style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
            <h4 className="text-gold font-semibold mb-3 flex items-center gap-2">
              <Database size={16} className="text-saffron" /> Database (Supabase — Free 🇮🇳)
            </h4>
            <ol className="text-cream/60 text-sm space-y-1.5 list-none">
              <li>1. Sign up at <span className="text-gold">supabase.com</span></li>
              <li>2. Create project → Singapore</li>
              <li>3. Run SQL from README</li>
              <li>4. Copy URL + anon key</li>
              <li>5. Add to Vercel env vars ✅</li>
            </ol>
          </div>
        </div>

        {/* Env vars */}
        <div className="rounded-2xl p-5 border border-gold/20 mb-8"
          style={{ background: 'rgba(212,160,23,0.05)' }}>
          <h4 className="text-gold font-semibold mb-3 flex items-center gap-2">
            <Shield size={16} className="text-saffron" /> Required Environment Variables
          </h4>
          <div className="space-y-2">
            {[
              { name: 'SUPABASE_URL', val: 'https://xxxx.supabase.co', desc: 'From Supabase → Settings → API' },
              { name: 'SUPABASE_ANON_KEY', val: 'eyJhbGci...', desc: 'From Supabase → Settings → API' },
            ].map(v => (
              <div key={v.name} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-mono text-green-400 bg-black/30 px-2 py-0.5 rounded">{v.name}</span>
                <span className="text-cream/40">=</span>
                <span className="font-mono text-cream/50 text-xs">{v.val}</span>
                <span className="text-cream/30 text-xs">({v.desc})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin credentials */}
        <div className="rounded-2xl p-5 border border-saffron/20 text-center mb-6"
          style={{ background: 'rgba(232,102,10,0.08)' }}>
          <p className="text-cream/60 text-sm">
            🔐 Default Admin Login: <span className="text-gold font-mono">admin</span> / <span className="text-gold font-mono">vindhu@2025</span>
            <br /><span className="text-cream/40 text-xs">Change this immediately after first login in Admin → Settings</span>
          </p>
        </div>

        <div className="text-center">
          <a href="/" className="text-cream/40 hover:text-gold text-sm transition-colors">← Back to Restaurant Website</a>
        </div>
      </div>
    </div>
  );
}
