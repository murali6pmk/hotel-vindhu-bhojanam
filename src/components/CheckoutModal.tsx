import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Copy, X, Phone, User, MapPin, MessageSquare } from 'lucide-react';
import { getSettings, createOrder, generateId, type UpiSettings } from '../lib/api';
import { type CartItem } from './OrderCart';

interface Props {
  cart: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'details' | 'payment' | 'success';

export default function CheckoutModal({ cart, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>('details');
  const [upiSettings, setUpiSettings] = useState<UpiSettings | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash'>('upi');
  const [copied, setCopied] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState('');

  const total = cart.reduce((s, c) => s + c.item.price * c.qty, 0);

  useEffect(() => {
    getSettings().then(setUpiSettings).catch(() => setUpiSettings({ upi_id: '', upi_name: 'Hotel Vindhu Bhojanam', upi_note: 'Pay for your order' }));
  }, []);

  const upiString = upiSettings?.upi_id
    ? `upi://pay?pa=${upiSettings.upi_id}&pn=${encodeURIComponent(upiSettings.upi_name)}&am=${total}&cu=INR&tn=${encodeURIComponent(upiSettings.upi_note || 'Food Order')}`
    : '';

  const copyUPI = () => {
    if (upiSettings?.upi_id) {
      navigator.clipboard.writeText(upiSettings.upi_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openUPIApp = (app: string) => {
    const urls: Record<string, string> = {
      gpay: `gpay://upi/pay?pa=${upiSettings?.upi_id}&pn=${encodeURIComponent(upiSettings?.upi_name||'')}&am=${total}&cu=INR`,
      phonepe: `phonepe://pay?pa=${upiSettings?.upi_id}&pn=${encodeURIComponent(upiSettings?.upi_name||'')}&am=${total}&cu=INR`,
      paytm: `paytmmp://pay?pa=${upiSettings?.upi_id}&pn=${encodeURIComponent(upiSettings?.upi_name||'')}&am=${total}&cu=INR`,
      bhim: `bhim://pay?pa=${upiSettings?.upi_id}&pn=${encodeURIComponent(upiSettings?.upi_name||'')}&am=${total}&cu=INR`,
    };
    window.location.href = urls[app] || upiString;
  };

  const placeOrder = async (paid: boolean) => {
    setPlacing(true);
    const id = generateId('ORD');
    setOrderId(id);
    try {
      await createOrder({
        id,
        customerName: name,
        customerPhone: phone,
        tableNo: tableNo || 'Takeaway',
        items: cart.map(c => ({ itemId: c.item.id, itemName: c.item.name, qty: c.qty, price: c.item.price })),
        total,
        status: 'pending',
        paymentStatus: paid ? 'paid' : 'unpaid',
        paymentMethod: paid ? paymentMethod : '',
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setStep('success');
    } catch (e) {
      alert('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const upiApps = [
    { id: 'gpay', name: 'GPay', emoji: '🟢', color: '#4285F4' },
    { id: 'phonepe', name: 'PhonePe', emoji: '💜', color: '#5f259f' },
    { id: 'paytm', name: 'Paytm', emoji: '🔵', color: '#00BAF2' },
    { id: 'bhim', name: 'BHIM', emoji: '🇮🇳', color: '#138808' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a0f06, #0d0804)', border: '1px solid rgba(212,160,23,0.25)', maxHeight: '92vh', overflowY: 'auto' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(212,160,23,0.2)' }}>
          <div>
            <h2 className="font-playfair text-gold font-bold text-lg">
              {step === 'details' ? '📋 Order Details' : step === 'payment' ? '💳 Payment' : '✅ Order Placed!'}
            </h2>
            <p className="text-cream/50 text-xs mt-0.5">Hotel Vindhu Bhojanam</p>
          </div>
          {step !== 'success' && (
            <button onClick={onClose} className="text-cream/50 hover:text-cream"><X size={20} /></button>
          )}
        </div>

        <div className="p-5">

          {/* ── STEP 1: DETAILS ── */}
          {step === 'details' && (
            <div className="space-y-4">
              {/* Order summary */}
              <div className="rounded-2xl p-4 border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-cream/50 text-xs uppercase tracking-wide mb-3">Order Summary</p>
                <div className="space-y-2">
                  {cart.map(c => (
                    <div key={c.item.id} className="flex justify-between text-sm">
                      <span className="text-cream/80">{c.item.name} × {c.qty}</span>
                      <span className="text-gold">₹{c.item.price * c.qty}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold pt-2 border-t border-white/10">
                    <span className="text-cream">Total</span>
                    <span className="text-gold text-lg">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Customer details */}
              <div className="space-y-3">
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/50" />
                  <input value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your Name *"
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-cream text-sm outline-none placeholder-cream/30"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }} />
                </div>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/50" />
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="Phone Number *"
                    type="tel"
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-cream text-sm outline-none placeholder-cream/30"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }} />
                </div>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/50" />
                  <input value={tableNo} onChange={e => setTableNo(e.target.value)}
                    placeholder="Table No. (or Takeaway)"
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-cream text-sm outline-none placeholder-cream/30"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }} />
                </div>
                <div className="relative">
                  <MessageSquare size={15} className="absolute left-3 top-3 text-gold/50" />
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Special instructions (optional)"
                    rows={2}
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-cream text-sm outline-none placeholder-cream/30 resize-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }} />
                </div>
              </div>

              <button
                onClick={() => setStep('payment')}
                disabled={!name || !phone}
                className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-40 transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 25px rgba(232,102,10,0.35)' }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* ── STEP 2: PAYMENT ── */}
          {step === 'payment' && (
            <div className="space-y-5">
              {/* Amount */}
              <div className="text-center py-3 rounded-2xl border border-gold/30" style={{ background: 'rgba(212,160,23,0.08)' }}>
                <p className="text-cream/60 text-sm">Amount to Pay</p>
                <p className="text-gold font-yatra text-4xl mt-1">₹{total.toLocaleString('en-IN')}</p>
                <p className="text-cream/40 text-xs mt-1">{cart.length} items · {name}</p>
              </div>

              {/* Payment method tabs */}
              <div className="flex gap-2">
                <button onClick={() => setPaymentMethod('upi')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${ paymentMethod === 'upi' ? 'text-white' : 'text-cream/60 border border-white/20' }`}
                  style={paymentMethod === 'upi' ? { background: 'linear-gradient(135deg, #e8660a, #d4a017)' } : {}}>
                  📱 Pay Online (UPI)
                </button>
                <button onClick={() => setPaymentMethod('cash')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${ paymentMethod === 'cash' ? 'text-white' : 'text-cream/60 border border-white/20' }`}
                  style={paymentMethod === 'cash' ? { background: 'linear-gradient(135deg, #3a6b35, #2a5028)' } : {}}>
                  💵 Pay at Counter
                </button>
              </div>

              {/* UPI Payment */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  {upiSettings?.upi_id ? (
                    <>
                      {/* QR Code */}
                      <div className="flex flex-col items-center p-5 rounded-2xl border border-gold/20" style={{ background: 'rgba(255,255,255,0.96)' }}>
                        <QRCodeSVG
                          value={upiString}
                          size={180}
                          bgColor="#ffffff"
                          fgColor="#1a0f06"
                          level="H"
                          includeMargin
                        />
                        <p className="text-deep-brown font-bold text-sm mt-2">{upiSettings.upi_name}</p>
                        <p className="text-deep-brown/70 text-xs">{upiSettings.upi_id}</p>
                        <p className="text-deep-brown/50 text-xs mt-1">Scan with any UPI app</p>
                      </div>

                      {/* UPI ID copy */}
                      <div className="flex items-center gap-2 p-3 rounded-xl border border-gold/20" style={{ background: 'rgba(212,160,23,0.08)' }}>
                        <div className="flex-1">
                          <p className="text-cream/50 text-xs">UPI ID</p>
                          <p className="text-gold font-mono font-bold">{upiSettings.upi_id}</p>
                        </div>
                        <button onClick={copyUPI}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
                          style={{ background: copied ? 'rgba(58,107,53,0.3)' : 'rgba(212,160,23,0.2)', color: copied ? '#4ade80' : '#d4a017', border: `1px solid ${copied ? 'rgba(58,107,53,0.5)' : 'rgba(212,160,23,0.3)'}` }}>
                          {copied ? <><CheckCircle size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                        </button>
                      </div>

                      {/* UPI App buttons */}
                      <div>
                        <p className="text-cream/50 text-xs mb-2 text-center">Or open directly in your app</p>
                        <div className="grid grid-cols-4 gap-2">
                          {upiApps.map(app => (
                            <button key={app.id} onClick={() => openUPIApp(app.id)}
                              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/10 hover:border-white/30 transition-all hover:scale-105"
                              style={{ background: 'rgba(255,255,255,0.05)' }}>
                              <span className="text-2xl">{app.emoji}</span>
                              <span className="text-cream/70 text-xs">{app.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <p className="text-cream/40 text-xs text-center">After paying, click the button below to confirm your order</p>

                      <button onClick={() => placeOrder(true)} disabled={placing}
                        className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg, #3a6b35, #2a5028)', boxShadow: '0 8px 25px rgba(58,107,53,0.3)' }}>
                        {placing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={18} />}
                        {placing ? 'Placing Order...' : 'I Have Paid — Confirm Order ✓'}
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8 rounded-2xl border border-orange-500/30" style={{ background: 'rgba(232,102,10,0.1)' }}>
                      <p className="text-4xl mb-3">⚠️</p>
                      <p className="text-orange-400 font-semibold">UPI not configured</p>
                      <p className="text-cream/50 text-sm mt-1">Please ask staff or pay at counter</p>
                    </div>
                  )}
                </div>
              )}

              {/* Cash Payment */}
              {paymentMethod === 'cash' && (
                <div className="space-y-4">
                  <div className="text-center py-6 rounded-2xl border border-green-500/30" style={{ background: 'rgba(58,107,53,0.1)' }}>
                    <p className="text-5xl mb-3">💵</p>
                    <p className="text-green-400 font-semibold text-lg">Pay ₹{total.toLocaleString('en-IN')} at Counter</p>
                    <p className="text-cream/50 text-sm mt-2">Place your order now and pay when food arrives</p>
                  </div>
                  <button onClick={() => placeOrder(false)} disabled={placing}
                    className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 25px rgba(232,102,10,0.35)' }}>
                    {placing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🍛'}
                    {placing ? 'Placing Order...' : 'Place Order — Pay at Counter'}
                  </button>
                </div>
              )}

              <button onClick={() => setStep('details')} className="w-full text-cream/40 text-sm hover:text-cream transition-colors py-2">
                ← Back to Details
              </button>
            </div>
          )}

          {/* ── STEP 3: SUCCESS ── */}
          {step === 'success' && (
            <div className="text-center space-y-5 py-4">
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3a6b35, #2a5028)', boxShadow: '0 0 40px rgba(58,107,53,0.4)' }}>
                <CheckCircle size={40} className="text-white" />
              </div>
              <div>
                <h3 className="font-yatra text-gold text-2xl">Order Placed!</h3>
                <p className="text-cream/60 mt-1 text-sm">Thank you, {name}!</p>
              </div>

              <div className="rounded-2xl p-4 border border-gold/20 text-left space-y-2" style={{ background: 'rgba(212,160,23,0.06)' }}>
                <div className="flex justify-between text-sm">
                  <span className="text-cream/60">Order ID</span>
                  <span className="text-gold font-mono font-bold">{orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cream/60">Amount</span>
                  <span className="text-gold font-bold">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cream/60">Payment</span>
                  <span className={paymentMethod === 'upi' ? 'text-green-400' : 'text-orange-400'}>
                    {paymentMethod === 'upi' ? '✓ UPI Paid' : '⏳ Pay at Counter'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cream/60">Table</span>
                  <span className="text-cream">{tableNo || 'Takeaway'}</span>
                </div>
              </div>

              <div className="rounded-2xl p-4 border border-saffron/20" style={{ background: 'rgba(232,102,10,0.08)' }}>
                <p className="text-saffron text-sm font-medium">🍛 Your order is being prepared!</p>
                <p className="text-cream/50 text-xs mt-1">Our staff will bring it to your table shortly.</p>
              </div>

              <button onClick={onSuccess}
                className="w-full py-3.5 rounded-2xl text-white font-bold transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
                Back to Menu 🍽️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
