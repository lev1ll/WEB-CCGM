import { BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { NIVELES } from '@/constants/niveles'
import { cn } from '@/lib/utils'

const ICON_MAP = { BookOpen, GraduationCap } as const
type IconName = keyof typeof ICON_MAP

function NivelCardV3() {
  return (
    <SectionWrapper>
      <SectionTitle
        title="Programas por nivel"
        subtitle="Todo el detalle de cada nivel en un solo vistazo"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {NIVELES.map((nivel, i) => {
          const Icon = ICON_MAP[nivel.icon as IconName] ?? BookOpen
          return (
            <AnimatedSection key={nivel.id} direction="up" delay={i * 0.08}>
              <div className={cn('rounded-2xl p-6 h-full border border-border/60', nivel.bgColor)}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center shrink-0">
                    <Icon className={cn('w-5 h-5', nivel.color)} />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground leading-tight">{nivel.name}</h3>
                    <p className={cn('text-xs font-semibold', nivel.color)}>{nivel.grades}</p>
                    <p className="text-xs text-muted-foreground">{nivel.ageRange}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{nivel.description}</p>

                <ul className="space-y-1.5">
                  {nivel.highlights.map(h => (
                    <li key={h} className="flex items-start gap-2">
                      <CheckCircle2 className={cn('h-3.5 w-3.5 shrink-0 mt-0.5', nivel.color)} />
                      <span className="text-xs text-muted-foreground">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          )
        })}
      </div>
    </SectionWrapper>
  )
}

export function NivelCard() {
  return <NivelCardV3 />
}
