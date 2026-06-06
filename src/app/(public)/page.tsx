import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import ResearchHighlights from '@/components/home/ResearchHighlights'
import SpeakingTeaser from '@/components/home/SpeakingTeaser'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import CTASection from '@/components/home/CTASection'
import AboutTeaser from '@/components/home/AboutTeaser'

export const metadata: Metadata = {
  title: 'C1ph3r Fsociety — Cybersecurity Hardware Research & Store',
  description:
    'Offensive security hardware designed from scratch. BLE jammers, WiFi deauthers, RF tools, and educational kits for ethical hackers and security researchers.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedProducts />
      <AboutTeaser />
      <ResearchHighlights />
      <SpeakingTeaser />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
