import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { HISTORIA_TIMELINE } from '@/constants/nosotros'

export function Historia() {
  return (
    <SectionWrapper>
      <SectionTitle
        title="Nuestra historia"
        subtitle="Hitos que han marcado el camino del CCGM"
      />

      <div className="mt-12 relative max-w-3xl mx-auto">
        {/* Vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-border hidden md:block" />

        <div className="space-y-10">
          {HISTORIA_TIMELINE.map((hito, i) => {
            const isLeft = i % 2 === 0
            return (
              <AnimatedSection
                key={hito.year}
                direction={isLeft ? 'left' : 'right'}
                delay={i * 0.07}
              >
                <div
                  className={`md:flex items-start gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content */}
                  <div className="md:w-[calc(50%-2rem)] bg-card rounded-xl border border-border p-5 shadow-sm">
                    <span className="inline-block rounded-full bg-secondary/20 text-secondary font-bold text-sm px-3 py-1 mb-2">
                      {hito.year}
                    </span>
                    <h3 className="font-bold text-foreground">{hito.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {hito.description}
                    </p>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex items-center justify-center w-4 shrink-0">
                    <div className="h-4 w-4 rounded-full bg-primary border-4 border-background shadow" />
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
