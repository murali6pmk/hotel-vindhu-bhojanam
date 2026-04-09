import { useState } from 'react';
import { X } from 'lucide-react';

const photos = [
  { src: '/uploads/upload_1.png', caption: 'Restaurant Exterior', category: 'exterior' },
  { src: '/images/food1.jpg', caption: 'Traditional Thali', category: 'food' },
  { src: '/images/food2.jpg', caption: 'Crispy Dosa', category: 'food' },
  { src: '/images/food3.jpg', caption: 'Paneer Dosa', category: 'food' },
  { src: '/images/food4.jpg', caption: 'Special Biryani', category: 'food' },
  { src: '/images/food5.jpg', caption: 'Idli Sambar', category: 'food' },
  { src: '/images/food6.jpg', caption: 'Masala Chai', category: 'beverages' },
  { src: '/images/interior.jpg', caption: 'Cozy Interior', category: 'interior' },
];

export default function Gallery() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? photos : photos.filter(p => p.category === filter);

  return (
    <section id="gallery" className="relative py-24" style={{ background: 'linear-gradient(180deg, #1a0f06 0%, #2c1a0e 50%, #1a0f06 100%)' }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 fade-up">
          <span className="text-saffron text-sm tracking-widest uppercase font-medium">✦ Visual Tour ✦</span>
          <h2 className="font-yatra text-4xl md:text-5xl text-gold mt-2 mb-2">Photos & Videos</h2>
          <p className="font-telugu text-saffron/80 text-xl">ఫోటోలు & వీడియోలు</p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 fade-up">
          {['all', 'food', 'exterior', 'interior', 'beverages'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm capitalize transition-all duration-300 ${
                filter === cat
                  ? 'text-white'
                  : 'text-cream/60 border border-white/20 hover:border-gold/40'
              }`}
              style={{
                background: filter === cat ? 'linear-gradient(135deg, #e8660a, #d4a017)' : 'transparent',
              }}
            >
              {cat === 'all' ? '🌟 All' : cat}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((photo, i) => (
            <div
              key={photo.src + i}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group fade-up ${
                i === 0 ? 'col-span-2 row-span-2' : ''
              }`}
              style={{ aspectRatio: i === 0 ? '1/1' : '4/3', transitionDelay: `${i * 0.07}s` }}
              onClick={() => setSelected(photo.src)}
            >
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-medium text-sm">{photo.caption}</p>
              </div>
              <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/40 rounded-2xl transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.95)' }}
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setSelected(null)}
          >
            <X size={20} />
          </button>
          <img
            src={selected}
            alt="Gallery"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron to-transparent" />
    </section>
  );
}
