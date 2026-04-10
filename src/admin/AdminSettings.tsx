import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Shield, User, Lock, Mail, Store, CheckCircle } from 'lucide-react';
import { getCredentials, saveCredentials } from '../lib/api';

interface Props { onRefresh: () => void; }

export default function AdminSettings({ onRefresh }: Props) {
  const [creds, setCreds] = useState({ username: '', password: '', owner_name: '', email: '' });
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCredentials().then(c => {
      setCreds({ username: c.username || 'admin', password: '', owner_name: c.owner_name || '', email: c.email || '' });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setError('');
    if (!creds.username.trim()) { setError('Username cannot be empty'); return; }
    if (creds.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (creds.password !== confirmPw) { setError('Passwords do not match'); return; }
    setSaving(true);
    try {
      await saveCredentials(creds);
      onRefresh();
      setSaved(true);
      setConfirmPw('');
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-8">
      {saved && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl"
          style={{ background: 'rgba(58,107,53,0.2)', border: '1px solid rgba(58,107,53,0.4)' }}>
          <CheckCircle size={20} className="text-green-400" />
          <div>
            <div className="text-green-400 font-semibold">Credentials saved to database!</div>
            <div className="text-cream/50 text-sm">Your new login credentials are now active.</div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-4 p-5 rounded-2xl"
        style={{ background: 'rgba(232,102,10,0.1)', border: '1px solid rgba(232,102,10,0.25)' }}>
        <Shield size={22} className="text-saffron mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-saffron font-semibold">Admin Credentials — Stored in PostgreSQL</div>
          <div className="text-cream/60 text-sm mt-1">Credentials are securely stored in your SQL database. Changes take effect immediately.</div>
        </div>
      </div>

      <div className="rounded-3xl p-8 border border-white/10 space-y-6"
        style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
        <h3 className="text-gold font-bold text-lg flex items-center gap-2">
          <User size={20} className="text-saffron" /> Profile & Login
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-cream/60 text-sm mb-2 flex items-center gap-2"><Store size={14} /> Restaurant / Owner Name</label>
            <input value={creds.owner_name} onChange={e => setCreds({ ...creds, owner_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-cream outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              placeholder="Hotel Vindhu Bhojanam" />
          </div>
          <div>
            <label className="text-cream/60 text-sm mb-2 flex items-center gap-2"><Mail size={14} /> Email Address</label>
            <input type="email" value={creds.email} onChange={e => setCreds({ ...creds, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-cream outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              placeholder="owner@email.com" />
          </div>
          <div className="h-px bg-white/10" />
          <div>
            <label className="text-cream/60 text-sm mb-2 flex items-center gap-2"><User size={14} /> Admin Username</label>
            <input value={creds.username} onChange={e => setCreds({ ...creds, username: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-cream outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              placeholder="username" />
          </div>
          <div>
            <label className="text-cream/60 text-sm mb-2 flex items-center gap-2"><Lock size={14} /> New Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={creds.password}
                onChange={e => setCreds({ ...creds, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 rounded-xl text-cream outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
                placeholder="Min 6 characters" />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50 hover:text-gold">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-cream/60 text-sm mb-2 flex items-center gap-2"><Lock size={14} /> Confirm Password</label>
            <div className="relative">
              <input type={showConfirm ? 'text' : 'password'} value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl text-cream outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
                placeholder="Re-enter password" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50 hover:text-gold">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPw && creds.password !== confirmPw && <p className="text-red-400 text-xs mt-1">Passwords do not match</p>}
            {confirmPw && creds.password === confirmPw && confirmPw.length >= 6 && (
              <p className="text-green-400 text-xs mt-1 flex items-center gap-1"><CheckCircle size={12} /> Passwords match</p>
            )}
          </div>
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <button onClick={handleSave} disabled={saving}
            className="w-full py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 25px rgba(232,102,10,0.3)' }}>
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving to Database...' : 'Save Credentials'}
          </button>
        </div>
      </div>
    </div>
  );
}
