import Link from 'next/link'
import { ShoppingCart, Mail, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function CTASection() {
  return (
    <section className="section-padding bg-grid">
      <div className="section-container">
        <div className="relative rounded-3xl overflow-hidden border border-brand-medium bg-surface-800 p-10 md:p-16 text-center">
          {/* Background glow */}
          <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="section-eyebrow mb-4">Get Started</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to{' '}
              <span className="gradient-text">Hack the Spectrum?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 text-balance">
              Shop our hardware, read the research, or reach out about speaking engagements
              and business inquiries.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/store">
                <Button size="lg" leftIcon={<ShoppingCart className="w-5 h-5" />}>
                  Shop Hardware
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="secondary" leftIcon={<Mail className="w-5 h-5" />}>
                  Get in Touch
                </Button>
              </Link>
            </div>

            <p className="text-slate-600 text-sm mt-8">
              Free worldwide shipping · 18+ only · For authorized use only
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
