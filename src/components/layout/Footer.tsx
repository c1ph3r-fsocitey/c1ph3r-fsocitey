import Link from 'next/link'
import { Shield, Instagram, Github } from 'lucide-react'

const FOOTER_LINKS = {
  Company: [
    { label: 'About Rahul', href: '/about' },
    { label: 'Research', href: '/research' },
    { label: 'Speaking', href: '/speaking' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  Store: [
    { label: 'All Products', href: '/store' },
    { label: 'BLE Tools', href: '/store?category=ble-tools' },
    { label: 'WiFi Tools', href: '/store?category=wifi-tools' },
    { label: 'RF Tools', href: '/store?category=rf-tools' },
    { label: 'Media', href: '/media' },
  ],
  Legal: [
    { label: 'Terms of Use', href: '/legal/terms' },
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Disclaimer', href: '/legal/disclaimer' },
    { label: 'Return Policy', href: '/legal/returns' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-brand-subtle bg-surface-900">
      {/* Legal warning banner */}
      <div className="bg-amber-900/20 border-b border-amber-700/30">
        <div className="section-container py-3">
          <p className="text-xs text-amber-400/80 text-center leading-relaxed">
            ⚠️ All products are intended strictly for <strong>ethical hacking, security research, and educational purposes only</strong>.
            Buyers are solely responsible for compliance with all applicable local laws. Buyers must be <strong>18+</strong>.
          </p>
        </div>
      </div>

      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-9 h-9 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
                <Shield className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <div className="font-bold text-white text-base tracking-tight">C1PH3R FSOCIETY</div>
                <div className="text-brand-400 text-xs tracking-widest uppercase">Hardware Research</div>
              </div>
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Robotics Engineer by profession, hardware hacker by passion.
              Building offensive security tools from scratch since 2024.
              Based in Delhi, India.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/c1ph3r.fsocitey/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-surface-700 border border-brand-subtle flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-medium transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/c1ph3r-fsocitey"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-surface-700 border border-brand-subtle flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-medium transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.tindie.com/stores/c1ph3r_fsocitey/?ref=offsite_badges&utm_source=sellers_C1PH3R_FSOCITEY&utm_medium=badges&utm_campaign=badge_large"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="I sell on Tindie"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://static.tindie.com/badges/tindie-larges.png"
                  alt="I sell on Tindie"
                  width={200}
                  height={104}
                  className="hover:opacity-90 transition-opacity"
                />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-400">{category}</h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-brand-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} C1PH3R FSociety. All rights reserved.
            All intellectual property remains the property of C1PH3R FSociety.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600">Made with ⚡ in Delhi, India</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
