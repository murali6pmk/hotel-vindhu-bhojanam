import { useState, useEffect } from 'react';
import { getMenuItems, type MenuItem } from '../lib/api';

const menuCategories = [
  { id: 'meals', label: '🍛 Meals' },
  { id: 'tiffin', label: '🥞 Tiffin' },
  { id: 'dosa', label: '🫓 Dosa' },
  { id: 'beverages', label: '☕ Beverages' },
];

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('meals');
  const [allItems, setAllItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    getMenuItems().then(setAllItems).catch(console.error);
  }, []);

  const items = allItems.filter(i => i.category === activeCategory && i.available);

  return (
    <section id="menu" className="relative py-24" style={{ background: 'linear-gradient(180deg, #1a0f06 0%, #2c1a0e 50%, #1a0f06 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron to-transparent" />

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(-45deg, #d4a017 0px, #d4a017 1px, transparent 1px, transparent 40px)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14 fade-up">
          <span className="text-saffron text-sm tracking-widest uppercase font-medium">✦ Our Specialties ✦</span>
          <h2 className="font-yatra text-4xl md:text-5xl text-gold mt-2 mb-2">Menu & Highlights</h2>
          <p className="font-telugu text-saffron/80 text-xl">మెనూ & ప్రత్యేకతలు</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold" />
            <span className="text-gold text-xl">🍛</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 fade-up">
          {menuCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm ${
                activeCategory === cat.id
                  ? 'text-white scale-105 shadow-lg'
                  : 'text-cream/70 border border-white/20 hover:border-gold/40 hover:text-gold'
              }`}
              style={{
                background: activeCategory === cat.id
                  ? 'linear-gradient(135deg, #e8660a, #d4a017)'
                  : 'rgba(44,26,14,0.6)',
                boxShadow: activeCategory === cat.id ? '0 8px 25px rgba(232,102,10,0.4)' : 'none',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="menu-card-3d rounded-2xl overflow-hidden border border-white/10 fade-up"
              style={{
                background: 'linear-gradient(180deg, rgba(44,26,14,0.95) 0%, rgba(28,16,6,0.98) 100%)',
                transitionDelay: `${i * 0.08}s`,
              }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/80 to-transparent" />
                {item.popular && (
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}
                  >
                    ⭐ Popular
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <span className="text-gold font-yatra text-2xl">₹{item.price}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-playfair text-cream text-lg font-semibold">{item.name}</h3>
                <p className="font-telugu text-saffron/70 text-sm mt-0.5">{item.telugu}</p>
                <p className="text-cream/60 text-sm mt-2 leading-relaxed">{item.desc}</p>
                <button
                  className="mt-4 w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, rgba(232,102,10,0.3), rgba(212,160,23,0.3))', border: '1px solid rgba(212,160,23,0.3)' }}
                >
                  Order Now 🛵
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-4 text-center py-16 text-cream/40">
              No items available in this category right now.
            </div>
          )}
        </div>

        <div className="text-center mt-12 fade-up">
          <p className="text-cream/50 text-sm mb-4">Vindhu Bhojanam Meals · Fresh daily</p>
          <a
            href="/admin"
            className="px-8 py-3 rounded-full text-gold border border-gold/40 hover:bg-gold hover:text-deep-brown transition-all duration-300 inline-block"
          >
            🔒 Admin Portal
          </a>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    </section>
  );
}
