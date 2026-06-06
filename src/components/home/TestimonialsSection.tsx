import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Florian',
    date: 'Feb 2026',
    product: 'BLE STLTHFCKR',
    rating: 5,
    text: 'Perfect. Arrived fast. It works perfectly. I added 12dbi antennas and the range is huge! I recommend to anyone looking for a BLE jammer.',
    location: 'Europe',
  },
  {
    name: 'Danni',
    date: 'Dec 2025',
    product: 'WiFi BLE Pentest Pro',
    rating: 5,
    text: 'Super professional service, fast delivery and good customer care. Would definitely shop there again. Thank you very much!',
    location: 'Germany',
  },
  {
    name: 'Danni',
    date: 'Dec 2025',
    product: 'DisruptorX',
    rating: 5,
    text: 'Super professional service, fast delivery and good customer care. Would definitely shop there again. Thank you very much!',
    location: 'Germany',
  },
  {
    name: 'Danni',
    date: 'Dec 2025',
    product: 'RF Annihilator',
    rating: 5,
    text: 'Super professional service, fast delivery and good customer care. Would definitely shop there again.',
    location: 'Germany',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-surface-800/30">
      <div className="section-container">
        <div className="text-center mb-14">
          <p className="section-eyebrow mb-3">Customer Reviews</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Security{' '}
            <span className="gradient-text">Professionals</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-white font-bold">5.0</span>
            <span className="text-slate-500 text-sm">· 4 verified reviews · All ratings 5★</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="glow-card p-6">
              {/* Stars */}
              <div className="flex mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-300 leading-relaxed mb-5 italic">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs">{t.location} · {t.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-brand-400 text-xs font-medium">Verified Purchase</p>
                  <p className="text-slate-500 text-xs">{t.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
