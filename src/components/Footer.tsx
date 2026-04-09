import { Phone, MapPin, Clock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="relative pt-16 pb-8"
      style={{ background: 'linear-gradient(180deg, #2c1a0e 0%, #0d0804 100%)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, #e8660a, #d4a017, #3a6b35, #d4a017, #e8660a)' }}
      />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-2xl shadow-lg">
                🍛
              </div>
              <div>
                <div className="font-yatra text-gold text-xl">Hotel Vindhu Bhojanam</div>
                <div className="font-telugu text-saffron text-base">హోటల్ విందు భోజనం</div>
              </div>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed">
              Authentic village-style Andhra cuisine in the heart of Ongole.
              Serving traditional meals with love since over a decade.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex">
                {[1,2,3,4].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                <span className="text-yellow-400/50 text-sm">★</span>
              </div>
              <span className="text-cream/60 text-sm">4.5 · 1,094 reviews</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-playfair text-gold text-lg mb-5">Quick Links</h4>
            <div className="space-y-3">
              {[
                { label: 'Overview', id: 'overview' },
                { label: 'Menu & Highlights', id: 'menu' },
                { label: 'Customer Reviews', id: 'reviews' },
                { label: 'Photo Gallery', id: 'gallery' },
                { label: 'Find Us', id: 'about' },
              ].map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-cream/60 hover:text-gold text-sm transition-colors duration-200 text-left"
                >
                  → {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair text-gold text-lg mb-5">Contact & Hours</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-saffron mt-0.5 flex-shrink-0" />
                <span className="text-cream/60 text-sm">
                  Old bypass road, beside Reliance Smart,<br />
                  Ongole, AP 523002
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-saffron flex-shrink-0" />
                <a href="tel:08143668888" className="text-cream/60 hover:text-gold text-sm transition-colors">
                  081436 68888
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-saffron mt-0.5 flex-shrink-0" />
                <div className="text-cream/60 text-sm">
                  <div>Daily: 6:00 AM – 10:30 PM</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-leaf animate-pulse" />
                    <span className="text-leaf">Open Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/40 text-sm">
            © 2025 Hotel Vindhu Bhojanam · Ongole, Andhra Pradesh
          </p>
          <p className="text-cream/40 text-sm flex items-center gap-1.5">
            Made with <Heart size={12} className="text-saffron fill-saffron" /> for authentic Andhra flavors
          </p>
          <div className="flex gap-4 items-center">
            <span className="text-cream/40 text-xs">🍽️ Dine-in</span>
            <span className="text-cream/40 text-xs">🛵 Delivery</span>
            <span className="text-cream/40 text-xs">☕ Tiffin</span>
            <a href="/admin" className="text-cream/30 hover:text-gold text-xs transition-colors">🔒 Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
