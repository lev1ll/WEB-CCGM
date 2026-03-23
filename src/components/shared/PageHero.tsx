import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumb: string
  backgroundClass?: string // mantenido por compatibilidad, ya no se usa
}

export function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <AnimatedSection direction="up" delay={0}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <Link to="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground font-medium">{breadcrumb}</span>
          </nav>

          {/* Accent line + title */}
          <div className="flex items-start gap-4">
            <div className="mt-1.5 w-1 h-10 rounded-full bg-primary shrink-0" />
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
                {title}
              </h1>
              {subtitle && (
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
