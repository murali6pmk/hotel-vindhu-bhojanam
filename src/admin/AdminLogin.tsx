import { useState } from 'react';
import { Eye, EyeOff, LogIn, Lock, User, Leaf } from 'lucide-react';
import { login } from '../lib/api';

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(username, password);
      if (result.ok) {
        sessionStorage.setItem('vb_admin_auth', 'true');
        onLogin();
      } else {
        setError('Invalid username or password');
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    } catch (err: any) {
      setError(err.message || 'Connection error. Please try again.');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d0804 0%, #2c1a0e 50%, #0d0804 100%)' }}
    >
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 60px),
          repeating-linear-gradient(-45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 60px)`,
      }} />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #e8660a, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #d4a017, transparent)' }} />

      <div
        className="relative w-full max-w-md mx-4 rounded-3xl p-8 border border-gold/20"
        style={{
          background: 'linear-gradient(160deg, rgba(44,26,14,0.95) 0%, rgba(20,12,5,0.98) 100%)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(212,160,23,0.1)',
          transform: shake ? 'translateX(-8px)' : 'translateX(0)',
          transition: 'transform 0.1s',
        }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-4"
            style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 0 40px rgba(232,102,10,0.4)' }}>
            🍛
          </div>
          <h1 className="font-yatra text-2xl text-gold">Admin Portal</h1>
          <p className="font-telugu text-saffron/70 text-sm mt-1">అడ్మిన్ పోర్టల్</p>
          <p className="text-cream/50 text-xs mt-2">Hotel Vindhu Bhojanam · Ongole</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-cream/70 text-sm mb-2 block">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-cream placeholder-cream/30 outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,160,23,0.25)' }}
                required />
            </div>
          </div>

          <div>
            <label className="text-cream/70 text-sm mb-2 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" />
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-11 pr-12 py-3.5 rounded-xl text-cream placeholder-cream/30 outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,160,23,0.25)' }}
                required />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50 hover:text-gold">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30">
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          <div className="px-4 py-3 rounded-xl border border-gold/15" style={{ background: 'rgba(212,160,23,0.05)' }}>
            <p className="text-cream/40 text-xs">Default: <span className="text-gold/60">admin</span> / <span className="text-gold/60">vindhu@2025</span></p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-xl text-white font-semibold text-base flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
            style={{ background: loading ? 'rgba(232,102,10,0.5)' : 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 30px rgba(232,102,10,0.3)' }}>
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <LogIn size={18} />}
            {loading ? 'Signing in...' : 'Sign In to Admin'}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-cream/40 text-sm hover:text-gold transition-colors flex items-center justify-center gap-2">
            <Leaf size={14} /> Back to Restaurant Website
          </a>
        </div>
      </div>
    </div>
  );
}
