import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Baby, BookOpen, GraduationCap, Smile, Lightbulb, ChevronDown, CheckCircle2 } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import type { Nivel } from '@/constants/niveles'
import { NIVELES } from '@/constants/niveles'
import { cn } from '@/lib/utils'

const ICON_MAP = { Baby, BookOpen, GraduationCap, Smile, Lightbulb } as const
type IconName = keyof typeof ICON_MAP

function NivelCardItem({ nivel, defaultOpen = false }: { nivel: Nivel; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const Icon = ICON_MAP[nivel.icon as IconName] ?? BookOpen

  return (
    <AnimatedSection direction="up">
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Header */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center gap-4 p-6 text-left"
          aria-expanded={isOpen}
        >
          <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center shrink-0', nivel.bgColor)}>
            <Icon className={cn('h-6 w-6', nivel.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground text-lg">{nivel.name}</h3>
            <p className="text-sm text-muted-foreground">
              {nivel.grades} · {nivel.ageRange}
            </p>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
          </motion.div>
        </button>

        {/* Expandable content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-border pt-4">
                <p className="text-muted-foreground leading-relaxed mb-5">{nivel.description}</p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {nivel.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedSection>
  )
}

export function NivelCard() {
  return (
    <SectionWrapper>
      <SectionTitle
        title="Programas por nivel"
        subtitle="Haz clic en cada nivel para conocer el detalle del programa"
      />

      <div className="mt-10 space-y-4">
        {NIVELES.map((nivel, i) => (
          <NivelCardItem key={nivel.id} nivel={nivel} defaultOpen={i === 0} />
        ))}
      </div>
    </SectionWrapper>
  )
}
