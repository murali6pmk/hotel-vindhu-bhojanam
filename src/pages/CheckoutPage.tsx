import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Smartphone, IndianRupee, CheckCircle, Copy, AlertCircle, Loader } from 'lucide-react';
import QRCode from 'qrcode';
import { useCart } from '../context/CartContext';
import { createOrder, getPaymentSettings, submitUTR, generateId, type PaymentSettings } from '../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [step, setStep] = useState<'details' | 'payment' | 'utr' | 'success'>('details');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [utrInput, setUtrInput] = useState('');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Customer details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [notes, setNotes] = useState('');
  const [payMode, setPayMode] = useState<'upi' | 'cash'>('upi');

  useEffect(() => {
    getPaymentSettings().then(setSettings).catch(console.error);
    if (cart.length === 0) navigate('/');
  }, []);

  const tax = settings ? Math.round(totalPrice * (settings.tax_percent / 100)) : 0;
  const deliveryFee = settings?.delivery_fee || 0;
  const grandTotal = totalPrice + tax + deliveryFee;

  const upiLink = settings?.upi_id
    ? `upi://pay?pa=${settings.upi_id}&pn=${encodeURIComponent(settings.merchant_name || 'Hotel Vindhu Bhojanam')}&am=${grandTotal}&cu=INR&tn=${encodeURIComponent('Food Order')}`
    : '';

  const generateQR = async () => {
    if (!upiLink) return;
    try {
      const url = await QRCode.toDataURL(upiLink, { width: 280, margin: 2, color: { dark: '#2c1a0e', light: '#fdf6e3' } });
      setQrDataUrl(url);
    } catch (e) { console.error(e); }
  };

  const handlePlaceOrder = async () => {
    if (!name || !tableNo) { toast.error('Please fill your name and table number'); return; }
    setLoading(true);
    const id = generateId('ORD');
    setOrderId(id);
    try {
      await createOrder({
        id,
        customerName: name,
        customerPhone: phone,
        tableNo,
        notes,
        items: cart.map(c => ({ itemId: c.item.id, itemName: c.item.name, qty: c.qty, price: c.item.price })),
        total: grandTotal,
        status: 'pending',
        paymentStatus: payMode === 'cash' ? 'unpaid' : 'unpaid',
        paymentMethod: payMode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      if (payMode === 'cash') {
        setStep('success');
        clearCart();
      } else {
        await generateQR();
        setStep('payment');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUTR = async () => {
    if (utrInput.length < 6) { toast.error('Please enter a valid UTR / Transaction ID'); return; }
    setLoading(true);
    try {
      await submitUTR(orderId, utrInput);
      setStep('success');
      clearCart();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(settings?.upi_id || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: 'linear-gradient(135deg, #0d0804, #2c1a0e)' }}>
        <Toaster position="top-center" />
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, #3a6b35, #2a5028)', boxShadow: '0 0 50px rgba(58,107,53,0.4)' }}>
            <CheckCircle size={48} className="text-green-400" />
          </div>
          <h1 className="font-yatra text-3xl text-gold mb-2">Order Placed!</h1>
          <p className="text-cream/70 mb-2">Order ID: <span className="text-gold font-mono">{orderId}</span></p>
          {payMode === 'upi' ? (
            <p className="text-cream/60 text-sm mb-6">Your UTR has been submitted. Admin will verify your payment shortly.</p>
          ) : (
            <p className="text-cream/60 text-sm mb-6">Your order is confirmed. Please pay ₹{grandTotal} at the counter.</p>
          )}
          <div className="space-y-3">
            <button onClick={() => navigate('/')}
              className="w-full py-3.5 rounded-2xl text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
              🍛 Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(135deg, #0d0804, #2c1a0e)' }}>
        <Toaster position="top-center" />
        <div className="max-w-sm mx-auto">
          <button onClick={() => setStep('details')} className="flex items-center gap-2 text-cream/60 hover:text-gold mb-6 transition-colors">
            <ArrowLeft size={18} /> Back
          </button>

          <div className="text-center mb-6">
            <h1 className="font-yatra text-3xl text-gold">Pay via UPI</h1>
            <p className="text-cream/60 text-sm mt-1">Scan QR or use UPI ID to pay</p>
          </div>

          {/* Amount */}
          <div className="rounded-2xl p-5 mb-5 text-center border border-gold/30"
            style={{ background: 'rgba(44,26,14,0.9)' }}>
            <p className="text-cream/60 text-sm">Total Amount</p>
            <p className="font-yatra text-5xl text-gold mt-1">₹{grandTotal}</p>
            <p className="text-cream/40 text-xs mt-1">Order: {orderId}</p>
          </div>

          {/* QR Code */}
          {qrDataUrl && (
            <div className="rounded-2xl p-5 mb-5 text-center border border-white/10"
              style={{ background: 'rgba(253,246,227,0.95)' }}>
              <img src={qrDataUrl} alt="UPI QR" className="mx-auto rounded-xl" style={{ width: 220 }} />
              <p className="text-deep-brown text-xs mt-3 font-medium">Scan with GPay, PhonePe, Paytm or any UPI app</p>
            </div>
          )}

          {/* UPI ID */}
          {settings?.upi_id && (
            <div className="rounded-2xl p-4 mb-5 border border-white/10" style={{ background: 'rgba(44,26,14,0.8)' }}>
              <p className="text-cream/50 text-xs mb-2">Or pay directly to UPI ID:</p>
              <div className="flex items-center gap-3">
                <span className="text-gold font-mono font-bold flex-1">{settings.upi_id}</span>
                <button onClick={copyUPI}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors"
                  style={{ background: copied ? 'rgba(58,107,53,0.3)' : 'rgba(212,160,23,0.2)', color: copied ? '#4ade80' : '#d4a017' }}>
                  {copied ? <><CheckCircle size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            </div>
          )}

          {/* UPI App Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { name: 'GPay', color: '#4285f4', emoji: '🔵' },
              { name: 'PhonePe', color: '#5f259f', emoji: '🟣' },
              { name: 'Paytm', color: '#00b9f1', emoji: '🔷' },
            ].map(app => (
              <a key={app.name} href={upiLink}
                className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-white text-xs font-medium transition-all hover:scale-105"
                style={{ background: `${app.color}30`, border: `1px solid ${app.color}50` }}>
                <span className="text-2xl">{app.emoji}</span>
                {app.name}
              </a>
            ))}
          </div>

          {/* UTR Input */}
          <div className="rounded-2xl p-5 border border-gold/20" style={{ background: 'rgba(44,26,14,0.9)' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-saffron" />
              <p className="text-cream font-semibold text-sm">After Payment — Enter Transaction ID</p>
            </div>
            <p className="text-cream/50 text-xs mb-3">Enter the UTR / Transaction Reference Number shown in your UPI app after payment</p>
            <input
              value={utrInput}
              onChange={e => setUtrInput(e.target.value)}
              placeholder="e.g. 425678901234"
              className="w-full px-4 py-3 rounded-xl text-cream font-mono outline-none mb-3"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(212,160,23,0.3)' }}
            />
            <button onClick={handleSubmitUTR} disabled={loading || utrInput.length < 6}
              className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #3a6b35, #2a5028)' }}>
              {loading ? <Loader size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              {loading ? 'Submitting...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step: details
  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(135deg, #0d0804, #2c1a0e)' }}>
      <Toaster position="top-center" />
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-cream/60 hover:text-gold mb-6 transition-colors">
          <ArrowLeft size={18} /> Back to Menu
        </button>

        <h1 className="font-yatra text-3xl text-gold mb-6">Order Summary</h1>

        {/* Order Items */}
        <div className="rounded-2xl border border-white/10 overflow-hidden mb-5"
          style={{ background: 'rgba(44,26,14,0.9)' }}>
          <div className="p-4 border-b border-white/10">
            <h3 className="text-gold font-semibold flex items-center gap-2"><ShoppingBag size={18} /> Your Items</h3>
          </div>
          <div className="divide-y divide-white/5">
            {cart.map(({ item, qty }) => (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-cream text-sm font-medium">{item.name}</p>
                  <p className="text-cream/40 text-xs">₹{item.price} × {qty}</p>
                </div>
                <p className="text-gold font-bold">₹{item.price * qty}</p>
              </div>
            ))}
          </div>
          {/* Bill Summary */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <div className="flex justify-between text-sm text-cream/70">
              <span>Subtotal</span><span>₹{totalPrice}</span>
            </div>
            {tax > 0 && <div className="flex justify-between text-sm text-cream/70">
              <span>Tax ({settings?.tax_percent}%)</span><span>₹{tax}</span>
            </div>}
            {deliveryFee > 0 && <div className="flex justify-between text-sm text-cream/70">
              <span>Delivery Fee</span><span>₹{deliveryFee}</span>
            </div>}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
              <span className="text-cream">Total</span>
              <span className="text-gold">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="rounded-2xl border border-white/10 p-5 mb-5" style={{ background: 'rgba(44,26,14,0.9)' }}>
          <h3 className="text-gold font-semibold mb-4">Your Details</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-cream/50 text-xs mb-1 block">Name *</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
                  placeholder="Your name" />
              </div>
              <div>
                <label className="text-cream/50 text-xs mb-1 block">Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
                  placeholder="Phone number" />
              </div>
            </div>
            <div>
              <label className="text-cream/50 text-xs mb-1 block">Table Number *</label>
              <input value={tableNo} onChange={e => setTableNo(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
                placeholder="e.g. T-3, Takeaway" />
            </div>
            <div>
              <label className="text-cream/50 text-xs mb-1 block">Special Instructions</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
                placeholder="Less spice, no onion..." />
            </div>
          </div>
        </div>

        {/* Payment Mode */}
        <div className="rounded-2xl border border-white/10 p-5 mb-6" style={{ background: 'rgba(44,26,14,0.9)' }}>
          <h3 className="text-gold font-semibold mb-4">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPayMode('upi')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all"
              style={{
                background: payMode === 'upi' ? 'rgba(232,102,10,0.15)' : 'rgba(255,255,255,0.03)',
                borderColor: payMode === 'upi' ? '#e8660a' : 'rgba(255,255,255,0.1)',
              }}>
              <Smartphone size={24} className={payMode === 'upi' ? 'text-saffron' : 'text-cream/40'} />
              <span className={`text-sm font-medium ${payMode === 'upi' ? 'text-saffron' : 'text-cream/50'}`}>Pay via UPI</span>
              <span className="text-xs text-cream/30">GPay, PhonePe, Paytm</span>
            </button>
            <button onClick={() => setPayMode('cash')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all"
              style={{
                background: payMode === 'cash' ? 'rgba(58,107,53,0.15)' : 'rgba(255,255,255,0.03)',
                borderColor: payMode === 'cash' ? '#3a6b35' : 'rgba(255,255,255,0.1)',
              }}>
              <IndianRupee size={24} className={payMode === 'cash' ? 'text-leaf' : 'text-cream/40'} />
              <span className={`text-sm font-medium ${payMode === 'cash' ? 'text-leaf' : 'text-cream/50'}`}>Pay Cash</span>
              <span className="text-xs text-cream/30">Pay at counter</span>
            </button>
          </div>
          {payMode === 'upi' && !settings?.upi_id && (
            <div className="mt-3 flex items-center gap-2 text-xs text-orange-400 px-3 py-2 rounded-xl" style={{ background: 'rgba(232,102,10,0.1)' }}>
              <AlertCircle size={14} /> UPI not configured by restaurant yet. Please pay cash.
            </div>
          )}
        </div>

        <button onClick={handlePlaceOrder} disabled={loading || !name || !tableNo || (payMode === 'upi' && !settings?.upi_id)}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 transition-all hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 25px rgba(232,102,10,0.4)' }}>
          {loading ? <Loader size={22} className="animate-spin" /> : <IndianRupee size={22} />}
          {loading ? 'Placing Order...' : `Place Order — ₹${grandTotal}`}
        </button>
      </div>
    </div>
  );
}
