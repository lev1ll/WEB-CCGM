import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumb: string
  backgroundClass?: string
}

export function PageHero({
  title,
  subtitle,
  breadcrumb,
  backgroundClass = 'bg-navy-deep',
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'relative flex items-center min-h-[280px] md:min-h-[360px]',
        backgroundClass
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection direction="up" delay={0}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-white/70 mb-4">
            <Link to="/" className="hover:text-white transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">{breadcrumb}</span>
          </nav>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-3 text-lg text-white/80 max-w-xl">{subtitle}</p>
          )}
        </AnimatedSection>
      </div>
    </section>
  )
}
