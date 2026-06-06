'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Instagram, Github, Send, Mic, ShoppingBag, HelpCircle, Briefcase, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const schema = z.object({
  name:         z.string().min(2, 'Name is required'),
  email:        z.string().email('Valid email required'),
  inquiry_type: z.string().min(1),
  subject:      z.string().min(5, 'Subject is required'),
  message:      z.string().min(20, 'Message must be at least 20 characters'),
})

type FormData = z.infer<typeof schema>

const INQUIRY_TYPES = [
  { value: 'general',   label: 'General Inquiry',  icon: <HelpCircle className="w-4 h-4" /> },
  { value: 'business',  label: 'Business',          icon: <Briefcase className="w-4 h-4" /> },
  { value: 'speaking',  label: 'Speaking / Talk',   icon: <Mic className="w-4 h-4" /> },
  { value: 'support',   label: 'Order Support',     icon: <Package className="w-4 h-4" /> },
  { value: 'wholesale', label: 'Wholesale',         icon: <ShoppingBag className="w-4 h-4" /> },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { inquiry_type: 'general' },
  })

  const selectedType = watch('inquiry_type')

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      toast.success('Message sent! I\'ll respond within 24 hours.')
    } catch {
      toast.error('Failed to send message. Please email directly.')
    }
  }

  if (submitted) {
    return (
      <div className="section-container section-padding text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Message Sent!</h1>
          <p className="text-slate-400">Thanks for reaching out. I typically respond within 24 hours.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-grid">
      <section className="section-padding border-b border-brand-subtle">
        <div className="section-container text-center max-w-2xl mx-auto">
          <p className="section-eyebrow mb-4">Contact</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Get in Touch</h1>
          <p className="text-slate-400 text-lg">
            Questions about orders, speaking engagements, business inquiries, or just want to say hi.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="glow-card p-7">
                  <h2 className="text-lg font-bold text-white mb-5">Inquiry Type</h2>
                  <div className="flex flex-wrap gap-2">
                    {INQUIRY_TYPES.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setValue('inquiry_type', type.value)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                          selectedType === type.value
                            ? 'bg-brand-500 text-white border-brand-500'
                            : 'bg-surface-700 text-slate-400 border-brand-subtle hover:text-slate-200 hover:border-brand-medium'
                        }`}
                      >
                        {type.icon}
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glow-card p-7 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Your Name"
                      required
                      {...register('name')}
                      error={errors.name?.message}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      required
                      {...register('email')}
                      error={errors.email?.message}
                    />
                  </div>
                  <Input
                    label="Subject"
                    required
                    {...register('subject')}
                    error={errors.subject?.message}
                    placeholder="What's this about?"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">
                      Message <span className="text-brand-400">*</span>
                    </label>
                    <textarea
                      {...register('message')}
                      rows={6}
                      placeholder="Tell me more..."
                      className="w-full px-4 py-3 rounded-xl text-sm bg-surface-700 border border-brand-subtle text-slate-200 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60 resize-none"
                    />
                    {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" size="lg" isLoading={isSubmitting} rightIcon={<Send className="w-4 h-4" />}>
                    Send Message
                  </Button>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="glow-card p-6">
                <h3 className="font-bold text-white mb-4">Direct Contact</h3>
                <div className="space-y-3">
                  <a href="mailto:rahulthegreat2001@gmail.com" className="flex items-center gap-3 text-sm text-slate-400 hover:text-brand-400 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-surface-700 border border-brand-subtle flex items-center justify-center group-hover:border-brand-medium transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    rahulthegreat2001@gmail.com
                  </a>
                  <a href="https://instagram.com/c1ph3r.fsocitey/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-slate-400 hover:text-brand-400 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-surface-700 border border-brand-subtle flex items-center justify-center group-hover:border-brand-medium transition-colors">
                      <Instagram className="w-4 h-4" />
                    </div>
                    @c1ph3r.fsocitey
                  </a>
                  <a href="https://github.com/c1ph3r-fsocitey" target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-slate-400 hover:text-brand-400 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-surface-700 border border-brand-subtle flex items-center justify-center group-hover:border-brand-medium transition-colors">
                      <Github className="w-4 h-4" />
                    </div>
                    c1ph3r-fsocitey
                  </a>
                </div>
              </div>

              <div className="glow-card p-6">
                <h3 className="font-bold text-white mb-3">Response Time</h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>General inquiries</span>
                    <span className="text-slate-300">24–48h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order support</span>
                    <span className="text-slate-300">12–24h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Business / Speaking</span>
                    <span className="text-slate-300">2–3 days</span>
                  </div>
                </div>
              </div>

              <div className="glow-card p-6">
                <h3 className="font-bold text-white mb-2">Based in</h3>
                <p className="text-slate-400 text-sm">Delhi, India</p>
                <p className="text-slate-500 text-xs mt-1">IST (UTC+5:30)</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
