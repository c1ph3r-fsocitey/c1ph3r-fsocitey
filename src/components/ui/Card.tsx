import { cn } from '@/lib/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-surface-800 border border-brand-subtle overflow-hidden',
        hover && 'transition-all duration-300 hover:border-brand-medium hover:shadow-card-hover hover:-translate-y-1',
        glow && 'shadow-glow',
        className
      )}
    >
      {children}
    </div>
  )
}
