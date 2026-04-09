import { useEffect, useRef } from 'react';
import { Star, IndianRupee } from 'lucide-react';

export default function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollY = window.scrollY;
        parallaxRef.current.style.transform = `translateY(${scrollY * 0.4}px) scale(1.05)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/uploads/upload_1.png')`,
          transformOrigin: 'center top',
          willChange: 'transform',
        }}
      />

      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-deep-brown/95" />
      <div className="absolute inset-0 bg-gradient-to-r from-deep-brown/60 via-transparent to-deep-brown/60" />

      {/* Decorative top border */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{ background: 'linear-gradient(90deg, #e8660a, #d4a017, #3a6b35, #d4a017, #e8660a)' }}
      />

      {/* Marigold garland decoration */}
      <div className="absolute top-16 left-0 right-0 flex justify-center gap-4 opacity-60">
        {['🌼', '🌸', '🌺', '🌼', '🌸', '🌺', '🌼', '🌸', '🌺', '🌼'].map((f, i) => (
          <span
            key={i}
            className="text-2xl"
            style={{ animation: `sway ${2 + (i % 3) * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
          >
            {f}
          </span>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 border border-gold/40"
          style={{ background: 'rgba(44,26,14,0.8)', backdropFilter: 'blur(10px)' }}
        >
          <span className="text-saffron text-sm">🍽️</span>
          <span className="text-gold text-sm font-medium tracking-widest uppercase">Authentic Village Flavors</span>
          <span className="text-saffron text-sm">🍽️</span>
        </div>

        {/* Telugu Title */}
        <div
          className="font-telugu text-3xl md:text-5xl text-gold mb-2 float-anim"
          style={{ textShadow: '0 0 30px rgba(212,160,23,0.5), 2px 2px 0 rgba(0,0,0,0.8)' }}
        >
          హోటల్ విందు భోజనం
        </div>

        {/* English Title */}
        <h1
          className="font-yatra text-5xl md:text-8xl mb-4"
          style={{
            background: 'linear-gradient(135deg, #f5d060 0%, #d4a017 30%, #e8660a 60%, #d4a017 80%, #f5d060 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.8))',
          }}
        >
          Hotel Vindhu
          <br />
          <span className="text-4xl md:text-6xl">Bhojanam</span>
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-gold" />
          <span className="text-saffron text-2xl">✦</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-gold" />
        </div>

        {/* Tagline */}
        <p className="font-playfair text-cream/90 text-xl md:text-2xl italic mb-8">
          "Where Every Meal is a Celebration of Tradition"
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4].map(i => <Star key={i} size={18} className="star-filled fill-yellow-400" />)}
              <Star size={18} className="star-filled fill-yellow-400 opacity-60" />
            </div>
            <span className="text-cream font-bold text-lg">4.5</span>
            <span className="text-cream/60 text-sm">(1,094 reviews)</span>
          </div>
          <span className="text-gold/40">|</span>
          <div className="flex items-center gap-2 text-cream/80">
            <IndianRupee size={16} className="text-gold" />
            <span>₹1 – ₹200 per person</span>
          </div>
          <span className="text-gold/40">|</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
            <span className="text-leaf font-semibold">Open Now</span>
            <span className="text-cream/60 text-sm">· Closes 10:30 PM</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-4 rounded-full text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #e8660a, #d4a017)' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              🍛 View Menu
            </span>
          </button>
          <a
            href="tel:08143668888"
            className="px-8 py-4 rounded-full border-2 border-gold text-gold font-semibold text-lg hover:bg-gold hover:text-deep-brown transition-all duration-300 hover:scale-105"
          >
            📞 Reserve Table
          </a>
        </div>

        {/* Info pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {['🍽️ Dine-in', '🚗 Drive-through', '🛵 Delivery', '🌿 Pure Veg'].map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 rounded-full text-sm text-cream/80 border border-cream/20"
              style={{ background: 'rgba(44,26,14,0.6)', backdropFilter: 'blur(8px)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-gold text-xs tracking-widest uppercase">Scroll Down</span>
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent animate-pulse" />
      </div>
    </section>
  );
}
