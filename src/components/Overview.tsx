import { MapPin, Clock, Phone, Star, Users, Award, Utensils } from 'lucide-react';

export default function Overview() {
  return (
    <section id="overview" className="relative py-24 rangoli-bg">
      {/* Decorative top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 fade-up">
          <span className="text-saffron text-sm tracking-widest uppercase font-medium">✦ Welcome ✦</span>
          <h2 className="font-yatra text-4xl md:text-5xl text-gold mt-2 mb-4">Restaurant Overview</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-saffron" />
            <span className="text-saffron text-xl">🌿</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-saffron" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Star, value: '4.5★', label: 'Rating', sub: '1,094 reviews', color: '#f5c518' },
            { icon: Users, value: '500+', label: 'Daily Guests', sub: 'Happy customers', color: '#e8660a' },
            { icon: Utensils, value: '50+', label: 'Menu Items', sub: 'Fresh daily', color: '#3a6b35' },
            { icon: Award, value: '10+', label: 'Years', sub: 'Of excellence', color: '#d4a017' },
          ].map(({ icon: Icon, value, label, sub, color }, i) => (
            <div
              key={i}
              className="card-3d rounded-2xl p-6 text-center border border-white/10 fade-up"
              style={{
                background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(28,16,6,0.95))',
                animationDelay: `${i * 0.1}s`,
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: `${color}20`, border: `2px solid ${color}40` }}
              >
                <Icon size={24} style={{ color }} />
              </div>
              <div className="font-yatra text-3xl" style={{ color }}>{value}</div>
              <div className="text-cream font-semibold mt-1">{label}</div>
              <div className="text-cream/50 text-xs mt-1">{sub}</div>
            </div>
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Details */}
          <div
            className="rounded-3xl p-8 border border-gold/20 fade-up"
            style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(28,16,6,0.95))' }}
          >
            <h3 className="font-playfair text-2xl text-gold mb-6 flex items-center gap-3">
              <span className="text-2xl">📍</span> Location & Hours
            </h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-saffron/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin size={18} className="text-saffron" />
                </div>
                <div>
                  <div className="text-cream font-medium">Address</div>
                  <div className="text-cream/70 text-sm mt-1 leading-relaxed">
                    Old bypass road, opposite to Padma Towers,<br />
                    beside Reliance Smart, Pandaripuram,<br />
                    Ongole, Andhra Pradesh 523002
                  </div>
                  <div className="text-gold/70 text-xs mt-1">📌 Located in: Reliance SMART Superstore</div>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-gold/20 to-transparent" />

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-cream font-medium">Opening Hours</div>
                  <div className="mt-2 space-y-1">
                    {[
                      { day: 'Mon – Fri', time: '6:00 AM – 10:30 PM' },
                      { day: 'Saturday', time: '6:00 AM – 10:30 PM' },
                      { day: 'Sunday', time: '6:00 AM – 10:30 PM' },
                    ].map(({ day, time }) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="text-cream/60">{day}</span>
                        <span className="text-gold">{time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf/20 border border-leaf/30">
                    <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
                    <span className="text-leaf text-xs font-medium">Currently Open</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-gold/20 to-transparent" />

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-saffron/20 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-saffron" />
                </div>
                <div>
                  <div className="text-cream font-medium">Phone</div>
                  <a href="tel:08143668888" className="text-saffron text-lg font-semibold hover:text-gold transition-colors">
                    081436 68888
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right - About + Services */}
          <div className="space-y-6 fade-up">
            <div
              className="rounded-3xl p-8 border border-gold/20"
              style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(28,16,6,0.95))' }}
            >
              <h3 className="font-playfair text-2xl text-gold mb-4 flex items-center gap-3">
                <span>🌾</span> Our Story
              </h3>
              <p className="text-cream/80 leading-relaxed">
                Hotel Vindhu Bhojanam brings the authentic taste of Andhra Pradesh's village cuisine to Ongole.
                Our meals are prepared with traditional recipes passed down through generations, using the freshest
                local ingredients and pure ghee.
              </p>
              <p className="text-cream/70 leading-relaxed mt-3 text-sm italic">
                "Hostel vindhu bhojanam — natural view, better food, better service. Tiffin and tea also 👍"
              </p>
            </div>

            <div
              className="rounded-3xl p-8 border border-gold/20"
              style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(28,16,6,0.95))' }}
            >
              <h3 className="font-playfair text-2xl text-gold mb-5 flex items-center gap-3">
                <span>⚡</span> Services
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '🍽️', label: 'Dine-in' },
                  { icon: '🚗', label: 'Drive-through' },
                  { icon: '🛵', label: 'No-contact Delivery' },
                  { icon: '💳', label: '₹1–₹200 Budget' },
                  { icon: '🌿', label: 'Village Ambience' },
                  { icon: '☕', label: 'Tiffin & Tea' },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-gold/30 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="text-cream/80 text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    </section>
  );
}
