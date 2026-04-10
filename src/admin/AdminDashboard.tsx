import { useState, useEffect } from 'react';
import {
  LayoutDashboard, UtensilsCrossed, ShoppingBag,
  Settings, LogOut, TrendingUp, IndianRupee,
  Clock, CheckCircle, XCircle, ChefHat, Menu, CreditCard
} from 'lucide-react';
import { getOrders, type Order } from '../lib/api';
import AdminMenuManager from './AdminMenuManager';
import AdminOrders from './AdminOrders';
import AdminSettings from './AdminSettings';
import AdminPaymentSettings from './AdminPaymentSettings';

interface Props { onLogout: () => void; }
type Tab = 'dashboard' | 'menu' | 'orders' | 'payments' | 'settings';

export default function AdminDashboard({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const [o] = await Promise.all([getOrders()]);
      setOrders(o);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { refresh(); }, [activeTab]);

  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);
  const pendingPayment = orders.filter(o => o.paymentStatus === 'unpaid' && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const unpaidCount = orders.filter(o => o.paymentStatus === 'unpaid' && o.status !== 'cancelled').length;
  const pendingUTR = orders.filter(o => o.paymentStatus === 'pending_verification').length;

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as Tab, label: 'Orders & Payments', icon: ShoppingBag },
    { id: 'menu' as Tab, label: 'Menu Manager', icon: UtensilsCrossed },
    { id: 'payments' as Tab, label: 'Payment Settings', icon: CreditCard },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#0d0804', fontFamily: 'Lato, sans-serif' }}>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:flex`}
        style={{ background: 'linear-gradient(180deg, #1a0f06 0%, #0d0804 100%)', borderRight: '1px solid rgba(212,160,23,0.15)' }}>
        <div className="p-6 border-b" style={{ borderColor: 'rgba(212,160,23,0.15)' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>🍛</div>
            <div>
              <div className="text-gold font-bold text-sm leading-tight">Vindhu Bhojanam</div>
              <div className="text-cream/50 text-xs">Admin Portal</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === id ? 'text-white' : 'text-cream/60 hover:text-cream hover:bg-white/5'
              }`}
              style={activeTab === id ? { background: 'linear-gradient(135deg, rgba(232,102,10,0.25), rgba(212,160,23,0.15))', border: '1px solid rgba(232,102,10,0.3)' } : {}}>
              <Icon size={18} className={activeTab === id ? 'text-saffron' : ''} />
              {label}
              {id === 'orders' && (unpaidCount + pendingUTR) > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unpaidCount + pendingUTR}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: 'rgba(212,160,23,0.15)' }}>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-cream/60 hover:text-red-400 hover:bg-red-900/20 text-sm font-medium transition-all duration-200">
            <LogOut size={18} /> Sign Out
          </button>
          <a href="/" className="mt-2 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-cream/40 hover:text-gold text-xs transition-all duration-200">← Back to Website</a>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
          style={{ background: 'rgba(13,8,4,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,160,23,0.15)' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gold" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
            <div>
              <h1 className="text-cream font-bold text-lg">{tabs.find(t => t.id === activeTab)?.label}</h1>
              <p className="text-cream/40 text-xs">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pendingUTR > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(212,160,23,0.2)', border: '1px solid rgba(212,160,23,0.4)' }}>
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-yellow-400 text-xs font-medium">{pendingUTR} UTR pending</span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(58,107,53,0.2)', border: '1px solid rgba(58,107,53,0.4)' }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Live</span>
            </div>
            <button onClick={onLogout} className="text-cream/60 hover:text-red-400 transition-colors"><LogOut size={18} /></button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {loading && activeTab === 'dashboard' ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardHome orders={orders} totalRevenue={totalRevenue} pendingPayment={pendingPayment} unpaidCount={unpaidCount} pendingUTR={pendingUTR} setActiveTab={setActiveTab} />}
              {activeTab === 'orders' && <AdminOrders onRefresh={refresh} />}
              {activeTab === 'menu' && <AdminMenuManager onRefresh={refresh} />}
              {activeTab === 'payments' && <AdminPaymentSettings onRefresh={refresh} />}
              {activeTab === 'settings' && <AdminSettings onRefresh={refresh} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function DashboardHome({ orders, totalRevenue, pendingPayment, unpaidCount, pendingUTR, setActiveTab }: {
  orders: Order[]; totalRevenue: number;
  pendingPayment: number; unpaidCount: number; pendingUTR: number; setActiveTab: (t: Tab) => void;
}) {
  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: '#3a6b35', sub: 'Paid orders' },
    { label: 'Pending Payment', value: `₹${pendingPayment.toLocaleString('en-IN')}`, icon: Clock, color: '#e8660a', sub: `${unpaidCount} unpaid` },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: '#d4a017', sub: 'All orders' },
    { label: 'UTR Pending', value: pendingUTR, icon: CreditCard, color: pendingUTR > 0 ? '#e8660a' : '#3a6b35', sub: 'Needs verification' },
  ];
  const recent = [...orders].slice(0, 5);

  return (
    <div className="space-y-8">
      {pendingUTR > 0 && (
        <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.35)' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <div className="text-yellow-400 font-semibold">{pendingUTR} UPI Payment{pendingUTR > 1 ? 's' : ''} Awaiting Verification</div>
              <div className="text-cream/50 text-sm">Customers submitted UTR numbers. Please verify and mark as paid.</div>
            </div>
          </div>
          <button onClick={() => setActiveTab('orders')} className="px-4 py-2 rounded-xl text-white text-sm font-medium" style={{ background: '#d4a017' }}>Verify Now</button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="rounded-2xl p-5 border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                <Icon size={20} style={{ color }} />
              </div>
              <TrendingUp size={14} className="text-cream/20" />
            </div>
            <div className="text-2xl font-bold text-cream">{value}</div>
            <div className="text-cream/60 text-xs mt-1">{label}</div>
            <div className="text-cream/30 text-xs">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
          <h3 className="text-gold font-semibold mb-5 flex items-center gap-2"><IndianRupee size={18} className="text-saffron" /> Payment Overview</h3>
          <div className="space-y-4">
            {[
              { label: 'Paid', filter: (o: Order) => o.paymentStatus === 'paid', color: '#3a6b35' },
              { label: 'Unpaid', filter: (o: Order) => o.paymentStatus === 'unpaid', color: '#e8660a' },
              { label: 'UTR Pending', filter: (o: Order) => o.paymentStatus === 'pending_verification', color: '#d4a017' },
            ].map(({ label, filter, color }) => {
              const filtered = orders.filter(filter);
              const amount = filtered.reduce((s, o) => s + o.total, 0);
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-cream/70 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />{label} ({filtered.length})</span>
                    <span className="text-cream font-medium">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: `${orders.length ? (filtered.length / orders.length) * 100 : 0}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="rounded-2xl p-6 border border-white/10" style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
          <h3 className="text-gold font-semibold mb-5 flex items-center gap-2"><ShoppingBag size={18} className="text-saffron" /> Order Status</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Pending', status: 'pending', color: '#d4a017', icon: Clock },
              { label: 'Preparing', status: 'preparing', color: '#e8660a', icon: ChefHat },
              { label: 'Served', status: 'served', color: '#3a6b35', icon: CheckCircle },
              { label: 'Cancelled', status: 'cancelled', color: '#7b1c1c', icon: XCircle },
            ].map(({ label, status, color, icon: Icon }) => (
              <div key={status} className="p-4 rounded-xl text-center border border-white/10" style={{ background: `${color}10` }}>
                <Icon size={22} style={{ color }} className="mx-auto mb-2" />
                <div className="text-2xl font-bold" style={{ color }}>{orders.filter(o => o.status === status).length}</div>
                <div className="text-cream/60 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-gold font-semibold">Recent Orders</h3>
          <button onClick={() => setActiveTab('orders')} className="text-saffron text-sm hover:text-gold">View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Order ID', 'Customer', 'Table', 'Amount', 'Status', 'Payment'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-cream/50 text-xs font-medium uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(order => (
                <tr key={order.id} className="border-t border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-4 text-gold font-mono text-sm">{order.id}</td>
                  <td className="px-5 py-4"><div className="text-cream text-sm">{order.customerName}</div><div className="text-cream/40 text-xs">{order.customerPhone}</div></td>
                  <td className="px-5 py-4 text-cream/70 text-sm">{order.tableNo}</td>
                  <td className="px-5 py-4 text-cream font-semibold">₹{order.total.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-4"><PaymentBadge status={order.paymentStatus} /></td>
                </tr>
              ))}
              {recent.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-cream/30 text-sm">No orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: Order['status'] }) {
  const map = {
    pending: { color: '#d4a017', bg: 'rgba(212,160,23,0.15)', label: 'Pending' },
    preparing: { color: '#e8660a', bg: 'rgba(232,102,10,0.15)', label: 'Preparing' },
    served: { color: '#3a6b35', bg: 'rgba(58,107,53,0.15)', label: 'Served' },
    cancelled: { color: '#7b1c1c', bg: 'rgba(123,28,28,0.15)', label: 'Cancelled' },
  };
  const s = map[status];
  return <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ color: s.color, background: s.bg }}>{s.label}</span>;
}

export function PaymentBadge({ status }: { status: Order['paymentStatus'] }) {
  const map: Record<string, { color: string; bg: string; label: string }> = {
    paid: { color: '#3a6b35', bg: 'rgba(58,107,53,0.15)', label: '✓ Paid via UPI' },
    unpaid: { color: '#e8660a', bg: 'rgba(232,102,10,0.15)', label: '✗ Unpaid' },
    partial: { color: '#d4a017', bg: 'rgba(212,160,23,0.15)', label: '~ Partial' },
    pending_verification: { color: '#d4a017', bg: 'rgba(212,160,23,0.2)', label: '⏳ UTR Verify' },
  };
  const s = map[status] || map.unpaid;
  return <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ color: s.color, background: s.bg }}>{s.label}</span>;
}
