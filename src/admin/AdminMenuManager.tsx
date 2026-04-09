import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import { getMenuItems, saveMenuItem, updateMenuItem, deleteMenuItem, generateId, type MenuItem } from '../lib/api';

interface Props { onRefresh: () => void; }

const CATEGORIES = [
  { id: 'meals', label: '🍛 Meals' },
  { id: 'tiffin', label: '🥞 Tiffin' },
  { id: 'dosa', label: '🫓 Dosa' },
  { id: 'beverages', label: '☕ Beverages' },
];

const IMG_OPTIONS = [
  { label: 'Food Thali', value: '/images/food1.jpg' },
  { label: 'Dosa', value: '/images/food2.jpg' },
  { label: 'Paneer Dosa', value: '/images/food3.jpg' },
  { label: 'Biryani', value: '/images/food4.jpg' },
  { label: 'Idli', value: '/images/food5.jpg' },
  { label: 'Chai/Coffee', value: '/images/food6.jpg' },
];

export default function AdminMenuManager({ onRefresh }: Props) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('meals');
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getMenuItems();
      setItems(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleToggleAvailable = async (item: MenuItem) => {
    try {
      await updateMenuItem(item.id, { available: !item.available });
      setItems(items.map(i => i.id === item.id ? { ...i, available: !i.available } : i));
      onRefresh();
      showSaved();
    } catch (e: any) { alert(e.message); }
  };

  const handleTogglePopular = async (item: MenuItem) => {
    try {
      await updateMenuItem(item.id, { popular: !item.popular });
      setItems(items.map(i => i.id === item.id ? { ...i, popular: !i.popular } : i));
      onRefresh();
      showSaved();
    } catch (e: any) { alert(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    try {
      await deleteMenuItem(id);
      setItems(items.filter(i => i.id !== id));
      onRefresh();
    } catch (e: any) { alert(e.message); }
  };

  const handleSave = async (item: MenuItem) => {
    try {
      await saveMenuItem(item);
      await load();
      onRefresh();
      showSaved();
      setEditItem(null);
      setShowAdd(false);
    } catch (e: any) { alert(e.message); }
  };

  const filtered = items.filter(i => i.category === activeCategory);

  return (
    <div className="space-y-6">
      {saved && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-medium"
          style={{ background: 'linear-gradient(135deg, #3a6b35, #2a4f26)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
          ✓ Saved to database!
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-gold font-bold text-xl">Menu Manager</h2>
          <p className="text-cream/50 text-sm">{items.filter(i => i.available).length} active · {items.filter(i => !i.available).length} unavailable</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
          <Plus size={18} /> Add New Item
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id ? 'text-white' : 'text-cream/60 border border-white/20'
            }`}
            style={activeCategory === cat.id ? { background: 'linear-gradient(135deg, #e8660a, #d4a017)' } : {}}>
            {cat.label} <span className="ml-1 text-xs opacity-60">({items.filter(i => i.category === cat.id).length})</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id}
              className={`rounded-2xl overflow-hidden border transition-all duration-200 ${
                item.available ? 'border-white/10' : 'border-red-900/30 opacity-60'
              }`}
              style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(20,12,5,0.95))' }}>
              <div className="relative h-36 overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {!item.available && (
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-red-600">Unavailable</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-3"><span className="text-gold font-bold text-xl">₹{item.price}</span></div>
                {item.popular && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>⭐ Popular</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-cream font-semibold text-sm">{item.name}</h3>
                <p className="text-saffron/60 text-xs mt-0.5">{item.telugu}</p>
                <p className="text-cream/50 text-xs mt-1 line-clamp-2">{item.desc}</p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                  <button onClick={() => handleToggleAvailable(item)}
                    className="flex items-center gap-1.5 text-xs transition-colors"
                    style={{ color: item.available ? '#3a6b35' : '#e8660a' }}>
                    {item.available ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    {item.available ? 'Available' : 'Off'}
                  </button>
                  <button onClick={() => handleTogglePopular(item)} className="ml-auto transition-colors"
                    style={{ color: item.popular ? '#d4a017' : 'rgba(255,255,255,0.3)' }}>
                    <Star size={15} className={item.popular ? 'fill-yellow-400' : ''} />
                  </button>
                  <button onClick={() => setEditItem(item)} className="text-cream/50 hover:text-gold transition-colors">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-400/50 hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-cream/30">No items in this category</div>
          )}
        </div>
      )}

      {(showAdd || editItem) && (
        <MenuItemModal
          item={editItem || { id: generateId('ITEM'), name: '', telugu: '', price: 0, desc: '', img: '/images/food1.jpg', popular: false, category: activeCategory, available: true }}
          onClose={() => { setShowAdd(false); setEditItem(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function MenuItemModal({ item, onClose, onSave }: { item: MenuItem; onClose: () => void; onSave: (i: MenuItem) => void }) {
  const [data, setData] = useState({ ...item });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!data.name || data.price <= 0) return;
    setSaving(true);
    await onSave(data);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a0f06, #0d0804)', border: '1px solid rgba(212,160,23,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(212,160,23,0.15)' }}>
          <h2 className="text-gold font-bold text-lg">{item.name ? 'Edit Item' : 'Add New Item'}</h2>
          <button onClick={onClose} className="text-cream/60 hover:text-cream"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="relative h-40 rounded-2xl overflow-hidden">
            <img src={data.img} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 text-gold font-bold text-2xl">₹{data.price || 0}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-cream/60 text-xs mb-1 block">Item Name *</label>
              <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
                placeholder="Item name" />
            </div>
            <div className="col-span-2">
              <label className="text-cream/60 text-xs mb-1 block">Telugu Name</label>
              <input value={data.telugu} onChange={e => setData({ ...data, telugu: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
                placeholder="తెలుగు పేరు" />
            </div>
            <div>
              <label className="text-cream/60 text-xs mb-1 block">Price (₹) *</label>
              <input type="number" value={data.price} onChange={e => setData({ ...data, price: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
                min="0" />
            </div>
            <div>
              <label className="text-cream/60 text-xs mb-1 block">Category</label>
              <select value={data.category} onChange={e => setData({ ...data, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
                style={{ background: 'rgba(44,26,14,0.9)', border: '1px solid rgba(212,160,23,0.2)' }}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-cream/60 text-xs mb-1 block">Description</label>
              <textarea value={data.desc} onChange={e => setData({ ...data, desc: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,160,23,0.2)' }}
                rows={2} placeholder="Description" />
            </div>
            <div className="col-span-2">
              <label className="text-cream/60 text-xs mb-1 block">Image</label>
              <select value={data.img} onChange={e => setData({ ...data, img: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-cream text-sm outline-none"
                style={{ background: 'rgba(44,26,14,0.9)', border: '1px solid rgba(212,160,23,0.2)' }}>
                {IMG_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            {[{ key: 'popular', label: 'Popular', color: 'bg-yellow-500' }, { key: 'available', label: 'Available', color: 'bg-green-600' }].map(({ key, label, color }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={data[key as keyof MenuItem] as boolean}
                  onChange={e => setData({ ...data, [key]: e.target.checked })} className="hidden" />
                <div className={`w-10 h-6 rounded-full transition-colors relative ${ data[key as keyof MenuItem] ? color : 'bg-white/20' }`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${ data[key as keyof MenuItem] ? 'translate-x-5' : 'translate-x-1' }`} />
                </div>
                <span className="text-cream/70 text-sm">{label}</span>
              </label>
            ))}
          </div>

          <button onClick={handleSubmit} disabled={!data.name || data.price <= 0 || saving}
            className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save to Database'}
          </button>
        </div>
      </div>
    </div>
  );
}
