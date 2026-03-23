import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { ADMISSION_CALENDAR } from '@/constants/admision'
import { cn } from '@/lib/utils'

export function CalendarioAdmision() {
  return (
    <SectionWrapper variant="accent">
      <SectionTitle
        title="Calendario de admisión"
        subtitle="Fechas clave del proceso para el año escolar 2026"
      />

      <AnimatedSection direction="up" delay={0.1} className="mt-10 max-w-2xl mx-auto">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-8">
            {ADMISSION_CALENDAR.map((event, i) => (
              <div key={i} className="relative flex gap-6 pl-14">
                {/* Dot */}
                <div
                  className={cn(
                    'absolute left-3 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-background',
                    event.isActive ? 'border-secondary' : 'border-border'
                  )}
                >
                  {event.isActive && (
                    <motion.span
                      className="h-2.5 w-2.5 rounded-full bg-secondary"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        'text-sm font-bold',
                        event.isActive ? 'text-secondary' : 'text-primary'
                      )}
                    >
                      {event.dateRange}
                    </span>
                    {event.isActive && (
                      <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-semibold text-secondary">
                        En curso
                      </span>
                    )}
                  </div>
                  <h3 className="mt-0.5 font-semibold text-foreground flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    {event.period}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}
