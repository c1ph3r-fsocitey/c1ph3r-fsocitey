import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'cyan' | 'success' | 'warning' | 'error' | 'info' | 'purple'
  className?: string
}

export default function Badge({ children, variant = 'cyan', className }: BadgeProps) {
  const variants = {
    cyan:    'bg-brand-500/10 text-brand-300 border-brand-500/25',
    success: 'bg-green-500/10 text-green-400 border-green-500/25',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/25',
    error:   'bg-red-500/10 text-red-400 border-red-500/25',
    info:    'bg-blue-500/10 text-blue-400 border-blue-500/25',
    purple:  'bg-purple-500/10 text-purple-400 border-purple-500/25',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
