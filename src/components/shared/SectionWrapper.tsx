import { cn } from '@/lib/utils'

type SectionVariant = 'default' | 'accent' | 'dark' | 'secondary'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string
  variant?: SectionVariant
}

export function SectionWrapper({ children, className, id, variant = 'default' }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        'w-full py-16 md:py-24',
        variant === 'accent'    && 'section-accent',
        variant === 'dark'      && 'section-dark',
        variant === 'secondary' && 'section-secondary',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
