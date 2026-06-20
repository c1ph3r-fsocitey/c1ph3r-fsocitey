import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
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

export default async function HomePage() {
  const supabase = createClient()

  const [
    { data: featuredProducts },
    { data: researchProjects },
    { data: speakingEvents },
    { data: about },
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: true }),
    supabase
      .from('research_projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('speaking_events')
      .select('*')
      .order('date', { ascending: false })
      .limit(3),
    supabase
      .from('about_page')
      .select('name, bio, photo_url, stat_products, stat_orders, stat_rating')
      .single(),
  ])

  return (
    <>
      <HeroSection />
      <StatsSection about={about} />
      <FeaturedProducts products={featuredProducts ?? []} />
      <AboutTeaser about={about} />
      <ResearchHighlights projects={researchProjects ?? []} />
      <SpeakingTeaser events={speakingEvents ?? []} />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
