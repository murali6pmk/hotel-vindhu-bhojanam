import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit3, CheckCircle, IndianRupee, X, Save } from 'lucide-react';
import { getOrders, createOrder, updateOrder, deleteOrder, getMenuItems, generateId, type Order, type MenuItem } from '../lib/api';
import { StatusBadge, PaymentBadge } from './AdminDashboard';

interface Props { onRefresh: () => void; }

export default function AdminOrders({ onRefresh }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [o, m] = await Promise.all([getOrders(), getMenuItems()]);
      setOrders(o); setMenuItems(m);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleUpdatePayment = async (id: string, paymentStatus: Order['paymentStatus'], paymentMethod: Order['paymentMethod']) => {
    try {
      await updateOrder(id, { paymentStatus, paymentMethod });
      setOrders(orders.map(o => o.id === id ? { ...o, paymentStatus, paymentMethod } : o));
      onRefresh();
    } catch (e: any) { alert(e.message); }
  };

  const handleUpdateStatus = async (id: string, status: Order['status']) => {
    try {
      await updateOrder(id, { status });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      onRefresh();
    } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this order?')) return;
    try {
      await deleteOrder(id);
      setOrders(orders.filter(o => o.id !== id));
      onRefresh();
    } catch (e: any) { alert(e.message); }
  };

  const handleCreate = async (order: Order) => {
    try {
      await createOrder(order);
      setOrders([order, ...orders]);
      onRefresh();
      setShowNewOrder(false);
    } catch (e: any) { alert(e.message); }
  };

  const handleEdit = async (updated: Order) => {
    try {
      await updateOrder(updated.id, updated);
      setOrders(orders.map(o => o.id === updated.id ? updated : o));
      onRefresh();
      setEditOrder(null);
    } catch (e: any) { alert(e.message); }
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.tableNo.toLowerCase().includes(search.toLowerCase());
    const matchPayment = filterPayment === 'all' || o.paymentStatus === filterPayment;
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchPayment && matchStatus;
  });

  const totalUnpaid = orders.filter(o => o.paymentStatus === 'unpaid' && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const unpaidCount = orders.filter(o => o.paymentStatus === 'unpaid' && o.status !== 'cancelled').length;
  const pendingUTR = orders.filter(o => o.paymentStatus === 'pending_verification');

  return (
    <div className="space-y-6">
      {/* UTR Verification Alert */}
      {pendingUTR.length > 0 && (
        <div className="rounded-2xl p-4 border" style={{ background: 'rgba(212,160,23,0.15)', borderColor: 'rgba(212,160,23,0.4)' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💳</span>
            <div>
              <div className="text-yellow-400 font-semibold">{pendingUTR.length} UPI Payment{pendingUTR.length > 1 ? 's' : ''} Need Verification</div>
              <div className="text-cream/60 text-sm">Customers paid and submitted UTR numbers. Verify below.</div>
            </div>
          </div>
          <div className="space-y-2">
            {pendingUTR.map(order => (
              <div key={order.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="flex-1 min-w-0">
                  <span className="text-gold font-mono text-sm">{order.id}</span>
                  <span className="text-cream/70 text-sm ml-2">{order.customerName}</span>
                  <span className="text-cream font-bold ml-2">₹{order.total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cream/50 text-xs">UTR:</span>
                  <span className="text-gold font-mono text-sm">{(order as any).utrNumber || 'N/A'}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdatePayment(order.id, 'paid', 'upi')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-semibold"
                    style={{ background: 'rgba(58,107,53,0.5)', border: '1px solid rgba(58,107,53,0.7)' }}>
                    <CheckCircle size={13} /> Verify Paid
                  </button>
                  <button onClick={() => handleUpdatePayment(order.id, 'unpaid', '')}
                    className="px-3 py-1.5 rounded-xl text-red-400 text-xs"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unpaid alert */}
      {totalUnpaid > 0 && (
        <div className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: 'rgba(232,102,10,0.15)', border: '1px solid rgba(232,102,10,0.3)' }}>
          <div className="flex items-center gap-3">
            <IndianRupee size={20} className="text-saffron" />
            <div>
              <div className="text-saffron font-semibold">Pending Collections</div>
              <div className="text-cream/60 text-sm">{unpaidCount} orders · ₹{totalUnpaid.toLocaleString('en-IN')} to collect</div>
            </div>
          </div>
          <button onClick={() => setFilterPayment('unpaid')}
            className="px-4 py-2 rounded-xl text-white text-sm" style={{ background: '#e8660a' }}>View Unpaid</button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/40" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search orders, customers..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-cream text-sm placeholder-cream/30 outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }} />
        </div>
        <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-cream text-sm outline-none"
          style={{ background: 'rgba(44,26,14,0.9)', border: '1px solid rgba(212,160,23,0.2)' }}>
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="pending_verification">UTR Pending</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-cream text-sm outline-none"
          style={{ background: 'rgba(44,26,14,0.9)', border: '1px solid rgba(212,160,23,0.2)' }}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="served">Served</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={() => setShowNewOrder(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium"
          style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
          <Plus size={16} /> New Order
        </button>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && <div className="text-center py-16 text-cream/40">No orders found</div>}
          {filtered.map(order => (
            <div key={order.id} className="rounded-2xl border border-white/10 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
              <div className="flex flex-wrap items-center gap-3 p-4 cursor-pointer hover:bg-white/3 transition-colors"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-gold font-mono font-bold text-sm">{order.id}</span>
                    <StatusBadge status={order.status} />
                    <PaymentBadge status={order.paymentStatus} />
                    {order.paymentMethod === 'upi' && order.paymentStatus === 'paid' && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(58,107,53,0.2)', color: '#4ade80' }}>Paid via UPI</span>
                    )}
                  </div>
                  <div className="text-cream font-medium mt-1">{order.customerName} · {order.tableNo}</div>
                  <div className="text-cream/40 text-xs">{order.customerPhone} · {new Date(order.createdAt).toLocaleString('en-IN')}</div>
                </div>
                <div className="text-right">
                  <div className="text-cream font-bold text-lg">₹{order.total.toLocaleString('en-IN')}</div>
                  <div className="text-cream/40 text-xs">{order.items.length} items</div>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="border-t border-white/10 p-4 space-y-4">
                  <div>
                    <div className="text-cream/50 text-xs uppercase tracking-wide mb-2">Order Items</div>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="text-cream/80">{item.itemName} × {item.qty}</span>
                          <span className="text-gold">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t border-white/10 font-semibold">
                        <span className="text-cream">Total</span>
                        <span className="text-gold text-lg">₹{order.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* UTR Number display */}
                  {(order as any).utrNumber && (
                    <div className="px-3 py-2 rounded-xl text-sm" style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.2)' }}>
                      <span className="text-gold/70 text-xs">UTR / Transaction ID: </span>
                      <span className="text-gold font-mono">{(order as any).utrNumber}</span>
                    </div>
                  )}

                  {order.notes && (
                    <div className="px-3 py-2 rounded-lg text-sm text-cream/60" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      📝 {order.notes}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <select value={order.status} onChange={e => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                      className="px-3 py-2 rounded-xl text-cream text-sm outline-none"
                      style={{ background: 'rgba(44,26,14,0.9)', border: '1px solid rgba(212,160,23,0.2)' }}>
                      <option value="pending">⏳ Pending</option>
                      <option value="preparing">🍳 Preparing</option>
                      <option value="served">✅ Served</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </select>

                    {/* UTR Pending — show verify/reject */}
                    {order.paymentStatus === 'pending_verification' && (
                      <>
                        <button onClick={() => handleUpdatePayment(order.id, 'paid', 'upi')}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm"
                          style={{ background: 'rgba(58,107,53,0.4)', border: '1px solid rgba(58,107,53,0.6)' }}>
                          <CheckCircle size={14} /> Verify Paid
                        </button>
                        <button onClick={() => handleUpdatePayment(order.id, 'unpaid', '')}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-400 text-sm"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          Reject UTR
                        </button>
                      </>
                    )}

                    {/* Unpaid — show cash/upi paid buttons */}
                    {order.paymentStatus === 'unpaid' && (
                      <>
                        <button onClick={() => handleUpdatePayment(order.id, 'paid', 'cash')}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm"
                          style={{ background: 'rgba(58,107,53,0.3)', border: '1px solid rgba(58,107,53,0.5)' }}>
                          <CheckCircle size={14} /> Cash Paid
                        </button>
                        <button onClick={() => handleUpdatePayment(order.id, 'paid', 'upi')}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm"
                          style={{ background: 'rgba(58,107,53,0.3)', border: '1px solid rgba(58,107,53,0.5)' }}>
                          <CheckCircle size={14} /> UPI Paid
                        </button>
                      </>
                    )}

                    {order.paymentStatus === 'paid' && (
                      <button onClick={() => handleUpdatePayment(order.id, 'unpaid', '')}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-cream/60 text-sm"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        Mark Unpaid
                      </button>
                    )}

                    <button onClick={() => setEditOrder(order)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-cream/60 text-sm hover:text-gold"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <Edit3 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(order.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-400/70 text-sm hover:text-red-400"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showNewOrder && (
        <NewOrderModal menuItems={menuItems} onClose={() => setShowNewOrder(false)} onSave={handleCreate} />
      )}
      {editOrder && (
        <EditOrderModal order={editOrder} onClose={() => setEditOrder(null)} onSave={handleEdit} />
      )}
    </div>
  );
}

function NewOrderModal({ menuItems, onClose, onSave }: { menuItems: MenuItem[]; onClose: () => void; onSave: (o: Order) => void }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNo, setTableNo] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ itemId: string; itemName: string; qty: number; price: number }[]>([]);
  const [activeCategory, setActiveCategory] = useState('meals');
  const [saving, setSaving] = useState(false);

  const filteredItems = menuItems.filter(m => m.category === activeCategory && m.available);
  const addItem = (item: MenuItem) => {
    const existing = selectedItems.find(i => i.itemId === item.id);
    if (existing) setSelectedItems(selectedItems.map(i => i.itemId === item.id ? { ...i, qty: i.qty + 1 } : i));
    else setSelectedItems([...selectedItems, { itemId: item.id, itemName: item.name, qty: 1, price: item.price }]);
  };
  const removeItem = (itemId: string) => setSelectedItems(selectedItems.filter(i => i.itemId !== itemId));
  const updateQty = (itemId: string, qty: number) => {
    if (qty <= 0) return removeItem(itemId);
    setSelectedItems(selectedItems.map(i => i.itemId === itemId ? { ...i, qty } : i));
  };
  const total = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);

  const handleSave = async () => {
    if (!customerName || !tableNo || selectedItems.length === 0) return;
    setSaving(true);
    const order: Order = {
      id: generateId('ORD'), customerName, customerPhone, tableNo, notes,
      items: selectedItems, total, status: 'pending', paymentStatus: 'unpaid', paymentMethod: '',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    await onSave(order);
    setSaving(false);
  };

  return (
    <Modal title="New Order" onClose={onClose}>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-cream/60 text-xs mb-1 block">Customer Name *</label>
              <input value={customerName} onChange={e => setCustomerName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }} placeholder="Name" />
            </div>
            <div>
              <label className="text-cream/60 text-xs mb-1 block">Phone</label>
              <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }} placeholder="Phone" />
            </div>
          </div>
          <div>
            <label className="text-cream/60 text-xs mb-1 block">Table No *</label>
            <input value={tableNo} onChange={e => setTableNo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }} placeholder="T-3, Takeaway..." />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['meals', 'tiffin', 'dosa', 'beverages'].map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs capitalize ${activeCategory === c ? 'text-white' : 'text-cream/60 border border-white/20'}`}
                style={activeCategory === c ? { background: 'linear-gradient(135deg, #e8660a, #d4a017)' } : {}}>{c}</button>
            ))}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div><div className="text-cream text-sm">{item.name}</div><div className="text-gold text-xs">₹{item.price}</div></div>
                <button onClick={() => addItem(item)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-lg"
                  style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>+</button>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="text-cream/60 text-xs uppercase tracking-wide">Order Summary</div>
          {selectedItems.length === 0 ? (
            <div className="text-center py-8 text-cream/30 text-sm">No items added</div>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {selectedItems.map(item => (
                <div key={item.itemId} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex-1"><div className="text-cream text-sm">{item.itemName}</div><div className="text-gold text-xs">₹{item.price}</div></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.itemId, item.qty - 1)} className="w-6 h-6 rounded-full bg-white/10 text-cream text-sm flex items-center justify-center">-</button>
                    <span className="text-cream w-4 text-center text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.itemId, item.qty + 1)} className="w-6 h-6 rounded-full bg-white/10 text-cream text-sm flex items-center justify-center">+</button>
                  </div>
                  <div className="text-gold font-medium text-sm w-16 text-right">₹{item.price * item.qty}</div>
                  <button onClick={() => removeItem(item.itemId)} className="text-red-400/60 hover:text-red-400"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
          {selectedItems.length > 0 && (
            <div className="flex justify-between items-center p-3 rounded-xl" style={{ background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.2)' }}>
              <span className="text-cream font-semibold">Total</span>
              <span className="text-gold font-bold text-xl">₹{total.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div>
            <label className="text-cream/60 text-xs mb-1 block">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
              rows={2} placeholder="Special instructions..." />
          </div>
          <button onClick={handleSave} disabled={!customerName || !tableNo || selectedItems.length === 0 || saving}
            className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Create Order'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function EditOrderModal({ order, onClose, onSave }: { order: Order; onClose: () => void; onSave: (o: Order) => void }) {
  const [data, setData] = useState({ ...order });
  const [saving, setSaving] = useState(false);
  return (
    <Modal title={`Edit Order ${order.id}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[{ label: 'Customer Name', key: 'customerName' }, { label: 'Phone', key: 'customerPhone' }, { label: 'Table No', key: 'tableNo' }].map(({ label, key }) => (
            <div key={key}>
              <label className="text-cream/60 text-xs mb-1 block">{label}</label>
              <input value={(data as any)[key]} onChange={e => setData({ ...data, [key]: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }} />
            </div>
          ))}
          <div>
            <label className="text-cream/60 text-xs mb-1 block">Payment Status</label>
            <select value={data.paymentStatus} onChange={e => setData({ ...data, paymentStatus: e.target.value as Order['paymentStatus'] })}
              className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
              style={{ background: 'rgba(44,26,14,0.9)', border: '1px solid rgba(212,160,23,0.2)' }}>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="pending_verification">UTR Pending</option>
            </select>
          </div>
          <div>
            <label className="text-cream/60 text-xs mb-1 block">Payment Method</label>
            <select value={data.paymentMethod} onChange={e => setData({ ...data, paymentMethod: e.target.value as Order['paymentMethod'] })}
              className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
              style={{ background: 'rgba(44,26,14,0.9)', border: '1px solid rgba(212,160,23,0.2)' }}>
              <option value="">None</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>
          </div>
          <div>
            <label className="text-cream/60 text-xs mb-1 block">Order Status</label>
            <select value={data.status} onChange={e => setData({ ...data, status: e.target.value as Order['status'] })}
              className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
              style={{ background: 'rgba(44,26,14,0.9)', border: '1px solid rgba(212,160,23,0.2)' }}>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="served">Served</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-cream/60 text-xs mb-1 block">Notes</label>
          <textarea value={data.notes} onChange={e => setData({ ...data, notes: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none resize-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }} rows={2} />
        </div>
        <button onClick={async () => { setSaving(true); await onSave({ ...data, updatedAt: new Date().toISOString() }); setSaving(false); }}
          className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </Modal>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="w-full max-w-3xl rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a0f06, #0d0804)', border: '1px solid rgba(212,160,23,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(212,160,23,0.15)' }}>
          <h2 className="text-gold font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-cream/60 hover:text-cream"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
