import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Shield, User, Lock, Mail, Store, CheckCircle, Smartphone } from 'lucide-react';
import { getCredentials, saveCredentials, getSettings, saveSettings } from '../lib/api';

interface Props { onRefresh: () => void; }

export default function AdminSettings({ onRefresh }: Props) {
  const [creds, setCreds] = useState({ username: '', password: '', owner_name: '', email: '' });
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [upiSaved, setUpiSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [upiSettings, setUpiSettings] = useState({ upi_id: '', upi_name: 'Hotel Vindhu Bhojanam', upi_note: 'Pay for your food order' });
  const [savingUpi, setSavingUpi] = useState(false);

  useEffect(() => {
    Promise.all([
      getCredentials().catch(() => ({ username: 'admin', owner_name: '', email: '' })),
      getSettings().catch(() => ({ upi_id: '', upi_name: 'Hotel Vindhu Bhojanam', upi_note: 'Pay for your food order' })),
    ]).then(([c, s]) => {
      setCreds({ username: c.username || 'admin', password: '', owner_name: c.owner_name || '', email: c.email || '' });
      setUpiSettings({ upi_id: s.upi_id || '', upi_name: s.upi_name || 'Hotel Vindhu Bhojanam', upi_note: s.upi_note || 'Pay for your food order' });
      setLoading(false);
    });
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

  const handleSaveUpi = async () => {
    setSavingUpi(true);
    try {
      await saveSettings(upiSettings);
      setUpiSaved(true);
      setTimeout(() => setUpiSaved(false), 3000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSavingUpi(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-8">

      {/* UPI Settings Card */}
      <div className="rounded-3xl p-8 border border-gold/20 space-y-5"
        style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
        <h3 className="text-gold font-bold text-lg flex items-center gap-2">
          <Smartphone size={20} className="text-saffron" /> UPI Payment Settings
        </h3>
        {upiSaved && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(58,107,53,0.2)', border: '1px solid rgba(58,107,53,0.4)' }}>
            <CheckCircle size={18} className="text-green-400" />
            <span className="text-green-400 text-sm font-medium">UPI settings saved! Customers can now pay online.</span>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="text-cream/60 text-sm mb-2 block">UPI ID *</label>
            <input value={upiSettings.upi_id} onChange={e => setUpiSettings({ ...upiSettings, upi_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-cream outline-none font-mono"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              placeholder="yourname@upi  or  9876543210@paytm" />
            <p className="text-cream/30 text-xs mt-1">e.g. vindhu@ybl &nbsp;|&nbsp; 9876543210@paytm &nbsp;|&nbsp; vindhu@okicici</p>
          </div>
          <div>
            <label className="text-cream/60 text-sm mb-2 block">Display Name (shown on QR)</label>
            <input value={upiSettings.upi_name} onChange={e => setUpiSettings({ ...upiSettings, upi_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-cream outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              placeholder="Hotel Vindhu Bhojanam" />
          </div>
          <div>
            <label className="text-cream/60 text-sm mb-2 block">Payment Note</label>
            <input value={upiSettings.upi_note} onChange={e => setUpiSettings({ ...upiSettings, upi_note: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-cream outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              placeholder="Pay for your food order" />
          </div>
          {upiSettings.upi_id && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(58,107,53,0.1)', border: '1px solid rgba(58,107,53,0.3)' }}>
              <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
              <div>
                <p className="text-green-400 text-sm font-medium">UPI Active ✓</p>
                <p className="text-cream/50 text-xs">Customers will see QR code + GPay, PhonePe, Paytm, BHIM buttons</p>
              </div>
            </div>
          )}
          <button onClick={handleSaveUpi} disabled={savingUpi || !upiSettings.upi_id}
            className="w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 25px rgba(232,102,10,0.3)' }}>
            {savingUpi ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            {savingUpi ? 'Saving...' : 'Save UPI Settings'}
          </button>
        </div>
      </div>

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
          <div className="text-cream/60 text-sm mt-1">
            Credentials are securely stored in your SQL database. Changes take effect immediately.
          </div>
        </div>
      </div>

      <div className="rounded-3xl p-8 border border-white/10 space-y-6"
        style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
        <h3 className="text-gold font-bold text-lg flex items-center gap-2">
          <User size={20} className="text-saffron" /> Profile & Login
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-cream/60 text-sm mb-2 flex items-center gap-2">
              <Store size={14} /> Restaurant / Owner Name
            </label>
            <input value={creds.owner_name} onChange={e => setCreds({ ...creds, owner_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-cream outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              placeholder="Hotel Vindhu Bhojanam" />
          </div>
          <div>
            <label className="text-cream/60 text-sm mb-2 flex items-center gap-2">
              <Mail size={14} /> Email Address
            </label>
            <input type="email" value={creds.email} onChange={e => setCreds({ ...creds, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-cream outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              placeholder="owner@email.com" />
          </div>
          <div className="h-px bg-white/10" />
          <div>
            <label className="text-cream/60 text-sm mb-2 flex items-center gap-2">
              <User size={14} /> Admin Username
            </label>
            <input value={creds.username} onChange={e => setCreds({ ...creds, username: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-cream outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              placeholder="username" />
          </div>
          <div>
            <label className="text-cream/60 text-sm mb-2 flex items-center gap-2">
              <Lock size={14} /> New Password
            </label>
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
            <label className="text-cream/60 text-sm mb-2 flex items-center gap-2">
              <Lock size={14} /> Confirm Password
            </label>
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
