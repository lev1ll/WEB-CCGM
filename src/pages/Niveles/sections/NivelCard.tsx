import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, GraduationCap, ChevronDown, CheckCircle2 } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import type { Nivel } from '@/constants/niveles'
import { NIVELES } from '@/constants/niveles'
import { cn } from '@/lib/utils'

const ICON_MAP = { BookOpen, GraduationCap } as const
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

// ── Variante 1: Acordeón (diseño original) ────────────────────────────
function NivelCardV1() {
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

// ── Variante 2: Tabs horizontales con panel de contenido ───────────────
function NivelCardV2() {
  const [active, setActive] = useState(NIVELES[0].id)
  const nivel = NIVELES.find(n => n.id === active)!
  const Icon = ICON_MAP[nivel.icon as IconName] ?? BookOpen

  return (
    <SectionWrapper>
      <SectionTitle
        title="Programas por nivel"
        subtitle="Selecciona un nivel para ver su programa completo"
      />

      {/* Tab buttons */}
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        {NIVELES.map(n => {
          const TabIcon = ICON_MAP[n.icon as IconName] ?? BookOpen
          const isActive = n.id === active
          return (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all',
                isActive
                  ? `${n.bgColor} ${n.color} ring-2 ring-current shadow-sm`
                  : 'bg-muted text-muted-foreground hover:bg-muted/60'
              )}
            >
              <TabIcon className="w-4 h-4 shrink-0" />
              {n.name}
            </button>
          )
        })}
      </div>

      {/* Content panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
          className="mt-6 rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        >
          {/* Header band */}
          <div className={cn('flex items-center gap-4 px-8 py-5', nivel.bgColor)}>
            <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
              <Icon className={cn('w-6 h-6', nivel.color)} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{nivel.name}</h3>
              <p className={cn('text-sm font-medium', nivel.color)}>{nivel.grades} · {nivel.ageRange}</p>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6 grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-muted-foreground leading-relaxed">{nivel.description}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Áreas de trabajo</p>
              <ul className="space-y-2">
                {nivel.highlights.map(h => (
                  <li key={h} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  )
}

// ── Variante 3: Grid de cards — todo visible de una vez ────────────────
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
