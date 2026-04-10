import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { getMenuItems, type MenuItem } from '../lib/api';
import OrderCart, { type CartItem } from './OrderCart';
import CheckoutModal from './CheckoutModal';

const menuCategories = [
  { id: 'meals', label: '🍛 Meals' },
  { id: 'tiffin', label: '🥞 Tiffin' },
  { id: 'dosa', label: '🫓 Dosa' },
  { id: 'beverages', label: '☕ Beverages' },
];

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('meals');
  const [allItems, setAllItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    getMenuItems().then(setAllItems).catch(console.error);
  }, []);

  const items = allItems.filter(i => i.category === activeCategory && i.available);

  const cartTotal = cart.reduce((s, c) => s + c.item.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, qty: 1 }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) setCart(prev => prev.filter(c => c.item.id !== id));
    else setCart(prev => prev.map(c => c.item.id === id ? { ...c, qty } : c));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(c => c.item.id !== id));

  const getQty = (id: string) => cart.find(c => c.item.id === id)?.qty || 0;

  return (
    <section id="menu" className="relative py-24" style={{ background: 'linear-gradient(180deg, #1a0f06 0%, #2c1a0e 50%, #1a0f06 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron to-transparent" />
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 40px),
          repeating-linear-gradient(-45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 40px)`,
      }} />

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white font-bold shadow-2xl transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)', boxShadow: '0 8px 30px rgba(232,102,10,0.5)' }}
        >
          <ShoppingCart size={20} />
          <span>{cartCount} item{cartCount > 1 ? 's' : ''}</span>
          <span className="px-2 py-0.5 rounded-full text-sm" style={{ background: 'rgba(0,0,0,0.25)' }}>
            ₹{cartTotal.toLocaleString('en-IN')}
          </span>
        </button>
      )}

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14 fade-up">
          <span className="text-saffron text-sm tracking-widest uppercase font-medium">✦ Our Specialties ✦</span>
          <h2 className="font-yatra text-4xl md:text-5xl text-gold mt-2 mb-2">Menu & Order Online</h2>
          <p className="font-telugu text-saffron/80 text-xl">మెనూ & ఆన్లైన్ ఆర్డర్</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-xl">🍛</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold" />
          </div>
          <p className="text-cream/50 text-sm mt-3">Add items to cart → Order → Pay via UPI or Cash</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 fade-up">
          {menuCategories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm ${
                activeCategory === cat.id ? 'text-white scale-105 shadow-lg' : 'text-cream/70 border border-white/20 hover:border-gold/40 hover:text-gold'
              }`}
              style={{
                background: activeCategory === cat.id ? 'linear-gradient(135deg, #e8660a, #d4a017)' : 'rgba(44,26,14,0.6)',
                boxShadow: activeCategory === cat.id ? '0 8px 25px rgba(232,102,10,0.4)' : 'none',
              }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const qty = getQty(item.id);
            return (
              <div key={item.id} className="menu-card-3d rounded-2xl overflow-hidden border border-white/10 fade-up"
                style={{ background: 'linear-gradient(180deg, rgba(44,26,14,0.95) 0%, rgba(28,16,6,0.98) 100%)', transitionDelay: `${i * 0.08}s` }}>
                <div className="relative h-48 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/80 to-transparent" />
                  {item.popular && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>⭐ Popular</div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-gold font-yatra text-2xl">₹{item.price}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-playfair text-cream text-base font-semibold">{item.name}</h3>
                  <p className="font-telugu text-saffron/70 text-xs mt-0.5">{item.telugu}</p>
                  <p className="text-cream/60 text-xs mt-1.5 leading-relaxed line-clamp-2">{item.desc}</p>

                  {/* Add to Cart */}
                  <div className="mt-4">
                    {qty === 0 ? (
                      <button onClick={() => addToCart(item)}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}>
                        <Plus size={15} /> Add to Order
                      </button>
                    ) : (
                      <div className="flex items-center justify-between rounded-xl overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, rgba(232,102,10,0.2), rgba(212,160,23,0.2))', border: '1px solid rgba(212,160,23,0.4)' }}>
                        <button onClick={() => updateQty(item.id, qty - 1)}
                          className="px-4 py-2.5 text-gold font-bold text-lg hover:bg-white/10 transition-colors">
                          <Minus size={16} />
                        </button>
                        <span className="text-cream font-bold">{qty}</span>
                        <button onClick={() => updateQty(item.id, qty + 1)}
                          className="px-4 py-2.5 text-gold font-bold text-lg hover:bg-white/10 transition-colors">
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="col-span-4 text-center py-16 text-cream/40">No items available in this category.</div>
          )}
        </div>

        <div className="text-center mt-12 fade-up">
          <p className="text-cream/50 text-sm mb-4">Vindhu Bhojanam Meals · Fresh daily</p>
          <a href="/admin" className="px-8 py-3 rounded-full text-gold border border-gold/40 hover:bg-gold hover:text-deep-brown transition-all duration-300 inline-block">
            🔒 Admin Portal
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Cart Sidebar */}
      {showCart && (
        <OrderCart
          cart={cart}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onClose={() => setShowCart(false)}
          onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => { setShowCheckout(false); setCart([]); }}
        />
      )}
    </section>
  );
}
