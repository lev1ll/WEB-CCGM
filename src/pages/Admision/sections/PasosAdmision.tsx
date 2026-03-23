import {
  FileText,
  CalendarCheck,
  ClipboardList,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { ADMISSION_STEPS } from '@/constants/admision'
import { cn } from '@/lib/utils'
import { useVariant } from '@/context/VariantContext'

const ICON_MAP = { FileText, CalendarCheck, ClipboardList, CheckCircle2 } as const
type IconName = keyof typeof ICON_MAP

// ── Variante 1: Círculos horizontales con línea conectora (original) ──
function PasosAdmisionV1() {
  return (
    <SectionWrapper>
      <SectionTitle
        title="Pasos del proceso"
        subtitle="Cuatro pasos simples para que tu hijo forme parte de nuestra comunidad"
      />
      <div className="mt-12 relative">
        <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-border" />
        <div className="grid md:grid-cols-4 gap-6">
          {ADMISSION_STEPS.map((step, i) => {
            const Icon = ICON_MAP[step.icon as IconName]
            return (
              <AnimatedSection key={step.step} direction="up" delay={i * 0.1}>
                <div className="relative flex flex-col items-center text-center">
                  <div className={cn(
                    'relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background shadow-md mb-4',
                    'bg-primary text-primary-foreground'
                  )}>
                    <Icon className="h-7 w-7" />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-navy-deep">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}

// ── Variante 2: Lista vertical con números grandes y línea izquierda ──
function PasosAdmisionV2() {
  return (
    <SectionWrapper>
      <SectionTitle
        title="Pasos del proceso"
        subtitle="Cuatro pasos simples para que tu hijo forme parte de nuestra comunidad"
      />
      <div className="mt-12 max-w-2xl mx-auto relative">
        <div className="absolute left-[1.875rem] top-4 bottom-4 w-0.5 bg-border" />
        <div className="space-y-0">
          {ADMISSION_STEPS.map((step, i) => {
            const Icon = ICON_MAP[step.icon as IconName]
            const isLast = i === ADMISSION_STEPS.length - 1
            return (
              <AnimatedSection key={step.step} direction="left" delay={i * 0.1}>
                <div className="flex gap-6 pb-10 last:pb-0">
                  {/* Number bubble */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-[3.75rem] h-[3.75rem] rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10 shrink-0 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  {/* Content */}
                  <div className={cn('flex-1 pt-3', !isLast && 'pb-4')}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                        Paso {step.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}

// ── Variante 3: Cards grandes con número de fondo y flecha entre pasos ─
function PasosAdmisionV3() {
  return (
    <SectionWrapper>
      <SectionTitle
        title="Pasos del proceso"
        subtitle="Cuatro pasos simples para que tu hijo forme parte de nuestra comunidad"
      />
      <div className="mt-12 grid md:grid-cols-4 gap-4">
        {ADMISSION_STEPS.map((step, i) => {
          const Icon = ICON_MAP[step.icon as IconName]
          const isLast = i === ADMISSION_STEPS.length - 1
          return (
            <div key={step.step} className="flex items-stretch gap-4">
              <AnimatedSection direction="up" delay={i * 0.1} className="flex-1">
                <div className="relative h-full rounded-2xl bg-card border border-border p-6 overflow-hidden shadow-sm">
                  {/* Big background number */}
                  <span className="absolute -bottom-4 -right-2 text-[6rem] font-extrabold text-primary/8 leading-none select-none">
                    {step.step}
                  </span>
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </AnimatedSection>
              {!isLast && (
                <div className="hidden md:flex items-center shrink-0 text-border">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}

// ── Entrada ────────────────────────────────────────────────────────────
export function PasosAdmision() {
  const { variant } = useVariant()
  if (variant === 2) return <PasosAdmisionV2 />
  if (variant === 3) return <PasosAdmisionV3 />
  return <PasosAdmisionV1 />
}
