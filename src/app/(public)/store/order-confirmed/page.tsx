import Link from 'next/link'
import { CheckCircle, Package, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function OrderConfirmedPage({ searchParams }: { searchParams: { id?: string } }) {
  return (
    <div className="section-container section-padding">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-24 h-24 rounded-3xl bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">Order Confirmed!</h1>
        <p className="text-slate-400 text-lg mb-2">
          Thank you for your purchase.
        </p>
        {searchParams.id && (
          <p className="text-brand-400 font-mono text-sm mb-6">
            Order ID: {searchParams.id.slice(0, 8).toUpperCase()}
          </p>
        )}

        <div className="glow-card p-6 text-left mb-8 space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-medium text-sm">Confirmation Email Sent</p>
              <p className="text-slate-500 text-sm">Check your inbox for your order details.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-brand-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-white font-medium text-sm">Processing & Shipping</p>
              <p className="text-slate-500 text-sm">Orders are typically processed within 1–2 business days and shipped from Delhi, India.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/store"><Button>Continue Shopping</Button></Link>
          <Link href="/contact?type=support"><Button variant="secondary">Need Help?</Button></Link>
        </div>

        <p className="text-xs text-slate-600 mt-8">
          ⚠️ Remember: these products are for authorized security research only.
          Use responsibly and in compliance with local laws.
        </p>
      </div>
    </div>
  )
}
