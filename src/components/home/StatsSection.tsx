const STATS = [
  { value: '9+',   label: 'Hardware Products',    sub: 'Designed from scratch' },
  { value: '63+',  label: 'Orders Shipped',        sub: 'Since Jun 2025' },
  { value: '5.0',  label: 'Average Rating',        sub: '4 verified reviews' },
  { value: '100%', label: 'Open-Source Firmware',  sub: 'Arduino / PlatformIO' },
]

export default function StatsSection() {
  return (
    <section className="border-y border-brand-subtle bg-surface-800/40">
      <div className="section-container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-brand-subtle">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center px-6">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm font-semibold text-slate-200">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
