import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { HISTORIA_TIMELINE } from '@/constants/nosotros'

// ── Variante 3: Hitos en bloques grandes — estilo editorial ───────────
function HistoriaV3() {
  return (
    <SectionWrapper variant="warm">
      <SectionTitle title="Nuestra historia" subtitle="Hitos que han marcado el camino del CCGM" />

      <div className="mt-12 divide-y divide-border">
        {HISTORIA_TIMELINE.map((hito, i) => (
          <AnimatedSection key={hito.year} direction="up" delay={i * 0.06}>
            <div className="py-10 grid md:grid-cols-[10rem_1fr] gap-6 items-start">
              {/* Year — giant, faded */}
              <div className="flex items-start">
                <span className="text-7xl font-extrabold leading-none text-primary/45 select-none">
                  {hito.year}
                </span>
              </div>
              {/* Content */}
              <div>
                <span className="inline-block text-xs font-bold tracking-widest text-secondary uppercase mb-2">
                  {hito.year}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-2">{hito.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{hito.description}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </SectionWrapper>
  )
}

export function Historia() {
  return <HistoriaV3 />
}
