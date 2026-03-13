import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function SectionWrapper({ children, className, id }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn('w-full py-16 md:py-24', className)}
    >
      <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8')}>
        {children}
      </div>
    </section>
  )
}
