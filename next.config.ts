import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.tindie.com',
      },
      {
        protocol: 'https',
        hostname: 'media.tindie.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['nodemailer', 'razorpay'],
  },
}

export default nextConfig
