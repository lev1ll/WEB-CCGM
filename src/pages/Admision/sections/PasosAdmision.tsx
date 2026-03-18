import {
  FileText,
  CalendarCheck,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { ADMISSION_STEPS } from '@/constants/admision'
import { cn } from '@/lib/utils'

const ICON_MAP = { FileText, CalendarCheck, ClipboardList, CheckCircle2 } as const
type IconName = keyof typeof ICON_MAP

export function PasosAdmision() {
  return (
    <SectionWrapper>
      <SectionTitle
        title="Pasos del proceso"
        subtitle="Cuatro pasos simples para que tu hijo forme parte de nuestra comunidad"
      />

      <div className="mt-12 relative">
        {/* Connector line (desktop) */}
        <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-border" />

        <div className="grid md:grid-cols-4 gap-6">
          {ADMISSION_STEPS.map((step, i) => {
            const Icon = ICON_MAP[step.icon as IconName]
            return (
              <AnimatedSection key={step.step} direction="up" delay={i * 0.1}>
                <div className="relative flex flex-col items-center text-center">
                  {/* Circle */}
                  <div
                    className={cn(
                      'relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background shadow-md mb-4',
                      'bg-primary text-primary-foreground'
                    )}
                  >
                    <Icon className="h-7 w-7" />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-navy-deep">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </SectionWrapper>
  )
}
