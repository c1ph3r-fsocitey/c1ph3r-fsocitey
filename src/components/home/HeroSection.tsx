'use client'

import Link from 'next/link'
import { ArrowRight, Shield, Cpu, Radio } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

const TECH_TAGS = ['ESP32', 'BLE', 'RF', 'WiFi 2.4/5GHz', 'Deauth', 'Pentest', 'Red Team', 'Open Source']

export default function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />

      {/* Floating glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-brand-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-700/10 blur-3xl pointer-events-none" />

      <div className="section-container relative z-10 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 mb-8"
          >
            <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-brand-300">Cybersecurity Hardware Research</span>
            <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight text-balance"
          >
            Hack the Signal.{' '}
            <span className="gradient-text">Own the Spectrum.</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed text-balance"
          >
            We design and build offensive security hardware from scratch —
            BLE jammers, WiFi deauthers, RF tools, and educational kits for
            ethical hackers, penetration testers, and security researchers.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/store">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Shop Hardware
              </Button>
            </Link>
            <Link href="/research">
              <Button size="lg" variant="secondary">
                View Research
              </Button>
            </Link>
          </motion.div>

          {/* Tech tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {TECH_TAGS.map(tag => (
              <span key={tag} className="tech-badge">
                {tag}
              </span>
            ))}
          </motion.div>

        </div>

        {/* Feature cards row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto"
        >
          {[
            {
              icon: <Radio className="w-6 h-6 text-brand-400" />,
              title: 'RF & Wireless Tools',
              desc: 'BLE, WiFi, 315/433MHz RF — full spectrum security assessment hardware.',
            },
            {
              icon: <Shield className="w-6 h-6 text-brand-400" />,
              title: 'Built for Red Teams',
              desc: 'Compact, open-source firmware, field-tested by security professionals.',
            },
            {
              icon: <Cpu className="w-6 h-6 text-brand-400" />,
              title: 'ESP32-Based',
              desc: 'Arduino/PlatformIO compatible. Flash custom firmware. Hack the hardware.',
            },
          ].map(card => (
            <div
              key={card.title}
              className="glow-card p-6 text-left bg-card-gradient"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
