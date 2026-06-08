'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Save, Globe, Mail, Phone, MapPin, Instagram, Github, Twitter,
  Linkedin, Youtube, CreditCard, AlertTriangle, Megaphone, Shield
} from 'lucide-react'
import Button from '@/components/ui/Button'
import type { SiteSettings } from '@/types'

const DEFAULTS: SiteSettings = {
  site_name: 'C1ph3r Fsociety',
  tagline: 'Cybersecurity Hardware Research',
  description: '',
  contact_email: '',
  contact_phone: '',
  address: '',
  instagram_url: '',
  github_url: '',
  twitter_url: '',
  linkedin_url: '',
  youtube_url: '',
  upi_id: '',
  razorpay_enabled: true,
  paypal_enabled: true,
  maintenance_mode: false,
  announcement_banner: '',
  banner_enabled: false,
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('settings').select('*').single()
      if (data) setSettings({ ...DEFAULTS, ...data })
      setLoading(false)
    }
    load()
  }, [])

  const set = (key: keyof SiteSettings, value: unknown) =>
    setSettings(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setError('')
    setSaving(true)
    const supabase = createClient()

    // Upsert — assumes a single-row settings table with a fixed id
    const { error: err } = await supabase
      .from('settings')
      .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() })

    setSaving(false)
    if (err) {
      setError(err.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading) return <div className="text-slate-500 text-sm">Loading settings...</div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-500 text-sm">Site-wide configuration</p>
        </div>
        <Button onClick={handleSave} disabled={saving} leftIcon={<Save className="w-4 h-4" />}>
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}

      {/* General */}
      <Section title="General" icon={<Globe className="w-4 h-4" />}>
        <Field label="Site Name">
          <input value={settings.site_name} onChange={e => set('site_name', e.target.value)} className={INPUT} />
        </Field>
        <Field label="Tagline">
          <input value={settings.tagline} onChange={e => set('tagline', e.target.value)} className={INPUT} />
        </Field>
        <Field label="Description">
          <textarea value={settings.description} onChange={e => set('description', e.target.value)}
            rows={3} className={INPUT + ' resize-none'} />
        </Field>
      </Section>

      {/* Contact */}
      <Section title="Contact Info" icon={<Mail className="w-4 h-4" />}>
        <Field label="Contact Email">
          <input type="email" value={settings.contact_email} onChange={e => set('contact_email', e.target.value)}
            placeholder="hello@c1ph3r.dev" className={INPUT} />
        </Field>
        <Field label="Phone">
          <input value={settings.contact_phone ?? ''} onChange={e => set('contact_phone', e.target.value)}
            placeholder="+91 ..." className={INPUT} />
        </Field>
        <Field label="Address">
          <textarea value={settings.address ?? ''} onChange={e => set('address', e.target.value)}
            rows={2} placeholder="Optional public address..." className={INPUT + ' resize-none'} />
        </Field>
      </Section>

      {/* Social */}
      <Section title="Social Links" icon={<Instagram className="w-4 h-4" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="GitHub">
            <input value={settings.github_url ?? ''} onChange={e => set('github_url', e.target.value)}
              placeholder="https://github.com/..." className={INPUT} />
          </Field>
          <Field label="Instagram">
            <input value={settings.instagram_url ?? ''} onChange={e => set('instagram_url', e.target.value)}
              placeholder="https://instagram.com/..." className={INPUT} />
          </Field>
          <Field label="Twitter / X">
            <input value={settings.twitter_url ?? ''} onChange={e => set('twitter_url', e.target.value)}
              placeholder="https://x.com/..." className={INPUT} />
          </Field>
          <Field label="LinkedIn">
            <input value={settings.linkedin_url ?? ''} onChange={e => set('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/..." className={INPUT} />
          </Field>
          <Field label="YouTube">
            <input value={settings.youtube_url ?? ''} onChange={e => set('youtube_url', e.target.value)}
              placeholder="https://youtube.com/@..." className={INPUT} />
          </Field>
        </div>
      </Section>

      {/* Payments */}
      <Section title="Payments" icon={<CreditCard className="w-4 h-4" />}>
        <Field label="UPI ID">
          <input value={settings.upi_id ?? ''} onChange={e => set('upi_id', e.target.value)}
            placeholder="yourname@upi" className={INPUT} />
        </Field>
        <div className="flex flex-col gap-3 mt-2">
          <Toggle label="Enable Razorpay (INR / India)" value={settings.razorpay_enabled} onChange={v => set('razorpay_enabled', v)} />
          <Toggle label="Enable PayPal (USD / International)" value={settings.paypal_enabled} onChange={v => set('paypal_enabled', v)} />
        </div>
      </Section>

      {/* Announcement banner */}
      <Section title="Announcement Banner" icon={<Megaphone className="w-4 h-4" />}>
        <Toggle label="Show banner on site" value={settings.banner_enabled} onChange={v => set('banner_enabled', v)} />
        <Field label="Banner Message">
          <input value={settings.announcement_banner ?? ''} onChange={e => set('announcement_banner', e.target.value)}
            placeholder="e.g. 🔥 New products dropping soon! Stay tuned." className={INPUT} />
        </Field>
      </Section>

      {/* Danger zone */}
      <Section title="Danger Zone" icon={<AlertTriangle className="w-4 h-4 text-red-400" />} danger>
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-white">Maintenance Mode</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Takes the public site offline. Admin panel still accessible. Use during deploys.
            </p>
          </div>
          <Toggle label="" value={settings.maintenance_mode} onChange={v => set('maintenance_mode', v)} danger />
        </div>
      </Section>

      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} disabled={saving} leftIcon={<Save className="w-4 h-4" />}>
          {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, icon, children, danger }: { title: string; icon: React.ReactNode; children: React.ReactNode; danger?: boolean }) {
  return (
    <div className={`glow-card p-6 space-y-4 ${danger ? 'border-red-500/20' : ''}`}>
      <div className={`flex items-center gap-2 text-sm font-semibold ${danger ? 'text-red-400' : 'text-slate-300'}`}>
        {icon}
        {title}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Toggle({ label, value, onChange, danger }: { label: string; value: boolean; onChange: (v: boolean) => void; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      {label && <span className="text-sm text-slate-400">{label}</span>}
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
          value ? (danger ? 'bg-red-500' : 'bg-brand-500') : 'bg-surface-600'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

const INPUT = 'w-full px-3 py-2 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30'
