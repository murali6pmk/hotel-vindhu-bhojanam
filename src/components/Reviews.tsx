import { Star, ThumbsUp } from 'lucide-react';

const reviews = [
  {
    name: 'Ravi Kumar',
    initials: 'RK',
    rating: 5,
    date: '2 weeks ago',
    text: 'Hostel vindhu bhojanam this is natural view but food better service 70% better ok in Ongole anjaiah road near vindhu bhojanam, tiffin and tea also 👍👍',
    helpful: 24,
    color: '#e8660a',
  },
  {
    name: 'Suresh Babu',
    initials: 'SB',
    rating: 5,
    date: '1 month ago',
    text: 'Best traditional Andhra meals in Ongole! The thali is absolutely amazing — rice, sambar, rasam, 4 curries, pickle and papad all for just ₹120. Unbeatable value!',
    helpful: 31,
    color: '#3a6b35',
  },
  {
    name: 'Lakshmi Devi',
    initials: 'LD',
    rating: 4,
    date: '3 weeks ago',
    text: 'The paneer dosa is outstanding! Crispy on the outside, perfectly spiced filling inside. The filter coffee is also excellent. Will definitely come back.',
    helpful: 18,
    color: '#d4a017',
  },
  {
    name: 'Venkat Rao',
    initials: 'VR',
    rating: 5,
    date: '1 month ago',
    text: 'Village-style ambience with authentic food. The masala dosa is crispy and golden. Service is quick and the staff is very friendly. Perfect for family outings.',
    helpful: 42,
    color: '#7b1c1c',
  },
  {
    name: 'Priya Sharma',
    initials: 'PS',
    rating: 4,
    date: '2 months ago',
    text: 'Affordable and delicious! The mini meals at ₹70 is a steal. Sambar is perfectly spiced. Location near Reliance Smart makes it very convenient.',
    helpful: 15,
    color: '#e8660a',
  },
  {
    name: 'Anil Reddy',
    initials: 'AR',
    rating: 5,
    date: '3 months ago',
    text: 'Best budget restaurant in Ongole. The village theme and decor is very authentic. Food tastes homemade. Highly recommend the special biryani thali!',
    helpful: 38,
    color: '#3a6b35',
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const totalRatings = { 5: 720, 4: 220, 3: 100, 2: 34, 1: 20 };
  const total = Object.values(totalRatings).reduce((a, b) => a + b, 0);

  return (
    <section id="reviews" className="relative py-24 rangoli-bg">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron to-transparent" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 fade-up">
          <span className="text-saffron text-sm tracking-widest uppercase font-medium">✦ What People Say ✦</span>
          <h2 className="font-yatra text-4xl md:text-5xl text-gold mt-2 mb-2">Customer Reviews</h2>
          <p className="font-telugu text-saffron/80 text-xl">కస్టమర్ సమీక్షలు</p>
        </div>

        {/* Rating Summary */}
        <div
          className="rounded-3xl p-8 mb-12 border border-gold/20 fade-up"
          style={{ background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(28,16,6,0.95))' }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Big rating */}
            <div className="text-center">
              <div className="font-yatra text-8xl text-gold">4.5</div>
              <div className="flex justify-center mt-2">
                {[1,2,3,4].map(i => <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />)}
                <Star size={20} className="fill-yellow-400 text-yellow-400 opacity-50" />
              </div>
              <div className="text-cream/60 text-sm mt-1">1,094 reviews</div>
            </div>

            {/* Bars */}
            <div className="flex-1 space-y-3 w-full">
              {([5,4,3,2,1] as const).map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-cream/70 text-sm w-4">{star}</span>
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${(totalRatings[star] / total) * 100}%`,
                        background: star >= 4 ? 'linear-gradient(90deg, #e8660a, #d4a017)' : 'rgba(255,255,255,0.2)',
                      }}
                    />
                  </div>
                  <span className="text-cream/50 text-xs w-8">{totalRatings[star]}</span>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Food', score: '4.6' },
                { label: 'Service', score: '4.4' },
                { label: 'Ambience', score: '4.5' },
                { label: 'Value', score: '4.8' },
              ].map(({ label, score }) => (
                <div
                  key={label}
                  className="text-center p-3 rounded-xl border border-gold/20"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="text-gold font-bold text-xl">{score}</div>
                  <div className="text-cream/60 text-xs">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={review.name}
              className="card-3d rounded-2xl p-6 border border-white/10 fade-up"
              style={{
                background: 'linear-gradient(135deg, rgba(44,26,14,0.9), rgba(28,16,6,0.95))',
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${review.color}, ${review.color}88)` }}
                >
                  {review.initials}
                </div>
                <div>
                  <div className="text-cream font-semibold">{review.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRating rating={review.rating} />
                    <span className="text-cream/40 text-xs">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-cream/75 text-sm leading-relaxed">{review.text}</p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                <ThumbsUp size={14} className="text-gold/60" />
                <span className="text-cream/50 text-xs">{review.helpful} found this helpful</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    </section>
  );
}
