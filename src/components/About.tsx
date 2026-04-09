import { MapPin, Navigation, Phone, Share2, Bookmark } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="relative py-24 rangoli-bg">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 fade-up">
          <span className="text-saffron text-sm tracking-widest uppercase font-medium">✦ About Us ✦</span>
          <h2 className="font-yatra text-4xl md:text-5xl text-gold mt-2 mb-2">Find Us Here</h2>
          <p className="font-telugu text-saffron/80 text-xl">మా గురించి</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Map placeholder */}
          <div className="fade-up">
            <div
              className="rounded-3xl overflow-hidden border border-gold/20 relative"
              style={{ height: '400px', background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(28,16,6,0.95))' }}
            >
              {/* Stylized map */}
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center pulse-glow"
                  style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}
                >
                  <MapPin size={40} className="text-white" />
                </div>
                <div className="text-center">
                  <div className="font-yatra text-gold text-2xl">Hotel Vindhu Bhojanam</div>
                  <div className="text-cream/70 text-sm mt-1">Ongole, Andhra Pradesh</div>
                  <div className="text-cream/50 text-xs mt-1">G26M+CP Ongole, Andhra Pradesh</div>
                </div>
                <a
                  href="https://maps.google.com/?q=Hotel+Vindhu+Bhojanam+Ongole"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 px-6 py-2.5 rounded-full text-white font-medium text-sm flex items-center gap-2 hover:scale-105 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}
                >
                  <Navigation size={16} />
                  Open in Google Maps
                </a>
              </div>

              {/* Decorative grid lines */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `linear-gradient(rgba(212,160,23,0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(212,160,23,0.5) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />
            </div>
          </div>

          {/* Info + Actions */}
          <div className="space-y-6 fade-up">
            {/* Address card */}
            <div
              className="rounded-2xl p-6 border border-gold/20"
              style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(28,16,6,0.95))' }}
            >
              <h3 className="font-playfair text-gold text-xl mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-saffron" /> Address
              </h3>
              <p className="text-cream/80 leading-relaxed">
                Old bypass road, opposite to Padma Towers,<br />
                beside Reliance Smart, Pandaripuram,<br />
                <strong className="text-gold">Ongole, Andhra Pradesh 523002</strong>
              </p>
              <div className="mt-3 text-cream/50 text-sm">
                📌 Located in: Reliance SMART Superstore
              </div>
              <div className="mt-2 text-cream/40 text-xs font-mono">Plus Code: G26M+CP Ongole</div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Navigation, label: 'Directions', sub: 'Get route', color: '#e8660a', href: 'https://maps.google.com/?q=Hotel+Vindhu+Bhojanam+Ongole' },
                { icon: Phone, label: 'Call Now', sub: '081436 68888', color: '#d4a017', href: 'tel:08143668888' },
                { icon: Bookmark, label: 'Save', sub: 'Add to list', color: '#3a6b35', href: '#' },
                { icon: Share2, label: 'Share', sub: 'Tell friends', color: '#7b1c1c', href: '#' },
              ].map(({ icon: Icon, label, sub, color, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="card-3d flex flex-col items-center gap-2 p-5 rounded-2xl border border-white/10 hover:border-gold/30 transition-all duration-300 text-center"
                  style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(28,16,6,0.95))' }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: `${color}20`, border: `2px solid ${color}40` }}
                  >
                    <Icon size={22} style={{ color }} />
                  </div>
                  <div className="text-cream font-semibold text-sm">{label}</div>
                  <div className="text-cream/50 text-xs">{sub}</div>
                </a>
              ))}
            </div>

            {/* Popular times */}
            <div
              className="rounded-2xl p-6 border border-gold/20"
              style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(28,16,6,0.95))' }}
            >
              <h3 className="font-playfair text-gold text-xl mb-4">⏰ Popular Times (Wednesday)</h3>
              <div className="flex items-end gap-1 h-16">
                {[
                  { time: '6a', height: 20 },
                  { time: '8a', height: 50 },
                  { time: '10a', height: 80 },
                  { time: '12p', height: 100 },
                  { time: '2p', height: 75 },
                  { time: '4p', height: 45 },
                  { time: '6p', height: 90 },
                  { time: '8p', height: 85 },
                  { time: '10p', height: 40 },
                ].map(({ time, height }) => (
                  <div key={time} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm transition-all duration-500"
                      style={{
                        height: `${height}%`,
                        background: height >= 80
                          ? 'linear-gradient(180deg, #e8660a, #d4a017)'
                          : 'rgba(212,160,23,0.3)',
                      }}
                    />
                    <span className="text-cream/40 text-xs">{time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-saffron animate-pulse" />
                <span className="text-saffron text-xs font-medium">Live · Busier than usual right now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    </section>
  );
}
