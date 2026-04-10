import { useState, useEffect } from 'react';
import { Save, CheckCircle, AlertCircle, Smartphone, IndianRupee, Info } from 'lucide-react';
import { getPaymentSettings, savePaymentSettings, type PaymentSettings } from '../lib/api';

interface Props { onRefresh: () => void; }

export default function AdminPaymentSettings({ onRefresh }: Props) {
  const [settings, setSettings] = useState<PaymentSettings>({ upi_id: '', merchant_name: 'Hotel Vindhu Bhojanam', tax_percent: 0, delivery_fee: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [upiValid, setUpiValid] = useState<boolean | null>(null);

  useEffect(() => {
    getPaymentSettings().then(s => { setSettings(s); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const validateUPI = (upi: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/;
    return regex.test(upi);
  };

  const handleUPIChange = (val: string) => {
    setSettings({ ...settings, upi_id: val });
    if (val.length > 3) setUpiValid(validateUPI(val));
    else setUpiValid(null);
  };

  const handleSave = async () => {
    setError('');
    if (settings.upi_id && !validateUPI(settings.upi_id)) {
      setError('Invalid UPI ID format. Use: name@bank (e.g. vindhu@ybl)');
      return;
    }
    setSaving(true);
    try {
      await savePaymentSettings(settings);
      onRefresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const upiPreview = settings.upi_id
    ? `upi://pay?pa=${settings.upi_id}&pn=${encodeURIComponent(settings.merchant_name)}&cu=INR`
    : '';

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      {saved && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl" style={{ background: 'rgba(58,107,53,0.2)', border: '1px solid rgba(58,107,53,0.4)' }}>
          <CheckCircle size={20} className="text-green-400" />
          <span className="text-green-400 font-semibold">Payment settings saved to database!</span>
        </div>
      )}

      {/* UPI Settings */}
      <div className="rounded-3xl p-6 border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
        <h3 className="text-gold font-bold text-lg mb-1 flex items-center gap-2">
          <Smartphone size={20} className="text-saffron" /> UPI Payment Settings
        </h3>
        <p className="text-cream/50 text-sm mb-6">Customers will pay to this UPI ID. A QR code is auto-generated at checkout.</p>

        <div className="space-y-5">
          {/* Merchant Name */}
          <div>
            <label className="text-cream/60 text-sm mb-2 block">Merchant / Restaurant Name</label>
            <input value={settings.merchant_name} onChange={e => setSettings({ ...settings, merchant_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl text-cream outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              placeholder="Hotel Vindhu Bhojanam" />
            <p className="text-cream/30 text-xs mt-1">This name appears in the customer's UPI app</p>
          </div>

          {/* UPI ID */}
          <div>
            <label className="text-cream/60 text-sm mb-2 block">Merchant UPI ID *</label>
            <div className="relative">
              <input value={settings.upi_id} onChange={e => handleUPIChange(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl text-cream outline-none font-mono"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${upiValid === true ? 'rgba(58,107,53,0.6)' : upiValid === false ? 'rgba(220,38,38,0.6)' : 'rgba(212,160,23,0.2)'}`,
                }}
                placeholder="e.g. vindhu@ybl or 9876543210@paytm" />
              {upiValid === true && <CheckCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400" />}
              {upiValid === false && <AlertCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400" />}
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-cream/30 text-xs">✓ Valid formats: <span className="text-gold/60 font-mono">name@ybl · name@okaxis · 9876543210@paytm · name@upi</span></p>
              {upiValid === false && <p className="text-red-400 text-xs">✗ Invalid UPI format. Use: name@bank</p>}
              {upiValid === true && <p className="text-green-400 text-xs">✓ Valid UPI ID format</p>}
            </div>
          </div>

          {/* UPI Preview */}
          {settings.upi_id && upiValid && (
            <div className="rounded-xl p-4 border border-gold/20" style={{ background: 'rgba(212,160,23,0.05)' }}>
              <div className="flex items-start gap-2">
                <Info size={14} className="text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gold text-xs font-semibold mb-1">Payment Link Preview</p>
                  <p className="text-cream/40 font-mono text-xs break-all">{upiPreview}</p>
                  <p className="text-cream/30 text-xs mt-1">This link opens GPay / PhonePe / Paytm automatically on customer's phone</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tax & Fees */}
      <div className="rounded-3xl p-6 border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
        <h3 className="text-gold font-bold text-lg mb-1 flex items-center gap-2">
          <IndianRupee size={20} className="text-saffron" /> Tax & Fees
        </h3>
        <p className="text-cream/50 text-sm mb-5">These are automatically added to the customer's bill at checkout.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-cream/60 text-sm mb-2 block">Tax %</label>
            <input type="number" value={settings.tax_percent} onChange={e => setSettings({ ...settings, tax_percent: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl text-cream outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              placeholder="0" min="0" max="30" />
            <p className="text-cream/30 text-xs mt-1">e.g. 5 for 5% GST (0 = no tax)</p>
          </div>
          <div>
            <label className="text-cream/60 text-sm mb-2 block">Delivery Fee (₹)</label>
            <input type="number" value={settings.delivery_fee} onChange={e => setSettings({ ...settings, delivery_fee: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl text-cream outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              placeholder="0" min="0" />
            <p className="text-cream/30 text-xs mt-1">0 = free delivery / dine-in</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-900/30 border border-red-500/30">
          <p className="text-red-400 text-sm flex items-center gap-2"><AlertCircle size={14} /> {error}</p>
        </div>
      )}

      <button onClick={handleSave} disabled={saving}
        className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 25px rgba(232,102,10,0.3)' }}>
        {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
        {saving ? 'Saving...' : 'Save Payment Settings'}
      </button>
    </div>
  );
}
