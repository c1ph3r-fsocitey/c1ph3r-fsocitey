'use client'

import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const TINDIE_STORE = 'https://www.tindie.com/stores/c1ph3r_fsocitey/'

interface BuyOnTindieButtonProps {
  tindieUrl?: string | null
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function BuyOnTindieButton({
  tindieUrl,
  className,
  showLabel = false,
  size = 'md',
}: BuyOnTindieButtonProps) {
  const href = tindieUrl || TINDIE_STORE

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-95',
        'bg-brand-500 text-white hover:bg-brand-400 shadow-glow',
        sizeClasses[size],
        className
      )}
      aria-label="Buy on Tindie"
    >
      {/* Tindie T logo — simple SVG inline */}
      <svg
        viewBox="0 0 24 24"
        className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-13H9v2h2v7h2V9h2V7h-4z" />
      </svg>
      {showLabel && <span>Buy on Tindie</span>}
      {!showLabel && <ExternalLink className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
    </a>
  )
}
