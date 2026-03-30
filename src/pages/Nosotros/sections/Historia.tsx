import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { HISTORIA_TIMELINE } from '@/constants/nosotros'

// ── Variante 1: Timeline alternado izq/der (original) ─────────────────
function HistoriaV1() {
  return (
    <SectionWrapper>
      <SectionTitle title="Nuestra historia" subtitle="Hitos que han marcado el camino del CCGM" />

      <div className="mt-12 relative max-w-3xl mx-auto">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-border hidden md:block" />
        <div className="space-y-10">
          {HISTORIA_TIMELINE.map((hito, i) => {
            const isLeft = i % 2 === 0
            return (
              <AnimatedSection key={hito.year} direction={isLeft ? 'left' : 'right'} delay={i * 0.07}>
                <div className={`md:flex items-start gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="md:w-[calc(50%-2rem)] bg-card rounded-xl border border-border p-5 shadow-sm">
                    <span className="inline-block rounded-full bg-secondary/20 text-secondary font-bold text-sm px-3 py-1 mb-2">
                      {hito.year}
                    </span>
                    <h3 className="font-bold text-foreground">{hito.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{hito.description}</p>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-4 shrink-0">
                    <div className="h-4 w-4 rounded-full bg-primary border-4 border-background shadow" />
                  </div>
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

// ── Variante 2: Timeline con línea izquierda — puntos y años ──────────
function HistoriaV2() {
  return (
    <SectionWrapper>
      <SectionTitle title="Nuestra historia" subtitle="Hitos que han marcado el camino del CCGM" />

      <div className="mt-12 relative max-w-2xl">
        {/* Left vertical line */}
        <div className="absolute left-[1.875rem] top-2 bottom-2 w-0.5 bg-border" />

        <div className="space-y-8">
          {HISTORIA_TIMELINE.map((hito, i) => (
            <AnimatedSection key={hito.year} direction="left" delay={i * 0.07}>
              <div className="flex gap-6">
                {/* Year + dot */}
                <div className="flex flex-col items-center shrink-0 w-[3.75rem]">
                  <div className="w-[1.875rem] h-[1.875rem] rounded-full bg-primary flex items-center justify-center z-10 ring-4 ring-background">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                  </div>
                  <span className="text-[10px] font-bold text-primary mt-1 text-center leading-tight">
                    {hito.year}
                  </span>
                </div>

                {/* Content */}
                <div className="pb-6 flex-1">
                  <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                    <h3 className="font-bold text-foreground">{hito.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{hito.description}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}

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
