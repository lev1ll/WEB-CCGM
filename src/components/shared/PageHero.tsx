import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumb: string
  compact?: boolean
  backgroundClass?: string // mantenido por compatibilidad, ya no se usa
}

export function PageHero({ title, subtitle, breadcrumb, compact = false }: PageHeroProps) {
  return (
    <section className="border-b border-border bg-background">
      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${compact ? 'py-4 md:py-5' : 'py-10 md:py-14'}`}>
        <AnimatedSection direction="up" delay={0}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
            <Link to="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground font-medium">{breadcrumb}</span>
          </nav>

          {/* Accent line + title */}
          <div className="flex items-start gap-3">
            <div className={`mt-1 w-1 rounded-full bg-primary shrink-0 ${compact ? 'h-6' : 'h-10 mt-1.5'}`} />
            <div>
              <h1 className={`font-bold text-foreground tracking-tight leading-tight ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl md:text-4xl'}`}>
                {title}
              </h1>
              {subtitle && !compact && (
                <p className="mt-3 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
