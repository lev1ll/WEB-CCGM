import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Trophy, Circle, Wind, Music, Star, Mic,
  Bot, Code, Palette, Calculator, Globe, MessageSquare,
  FlaskConical, Drama,
} from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { EXTRAESCOLARES, CATEGORY_LABELS, type ExtraescolarCategory } from '@/constants/niveles'
import { cn } from '@/lib/utils'

const ICON_MAP = {
  Trophy, Circle, Wind, Music, Star, Mic,
  Bot, Code, Palette, Calculator, Globe, MessageSquare,
  FlaskConical, Drama,
} as const
type IconName = keyof typeof ICON_MAP

const ALL_CATEGORIES: Array<ExtraescolarCategory | 'all'> = [
  'all', 'deportivo', 'artistico', 'tecnologico', 'academico',
]

const CATEGORY_COLORS: Record<ExtraescolarCategory, string> = {
  deportivo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  artistico: 'bg-pink-50 text-pink-700 border-pink-200',
  tecnologico: 'bg-blue-50 text-blue-700 border-blue-200',
  academico: 'bg-amber-50 text-amber-700 border-amber-200',
}

export function Extraescolares() {
  const [active, setActive] = useState<ExtraescolarCategory | 'all'>('all')

  const filtered =
    active === 'all' ? EXTRAESCOLARES : EXTRAESCOLARES.filter((e) => e.category === active)

  return (
    <SectionWrapper variant="accent">
      <SectionTitle
        title="Academias"
        subtitle="Talleres que potencian los talentos de nuestros estudiantes"
      />

      <AnimatedSection direction="up" delay={0.1} className="mt-10">
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors border',
                active === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
              )}
            >
              {cat === 'all' ? 'Todos' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Badge grid */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((extra) => {
              const Icon = ICON_MAP[extra.icon as IconName] ?? Star
              return (
                <motion.div
                  key={extra.name}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <span
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border',
                      CATEGORY_COLORS[extra.category]
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {extra.name}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </AnimatedSection>
    </SectionWrapper>
  )
}
