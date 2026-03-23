import { Monitor, Dumbbell, TreePine, UtensilsCrossed, School } from 'lucide-react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { INSTALACIONES } from '@/constants/instalaciones'
import { cn } from '@/lib/utils'

const ICON_MAP = { Monitor, Dumbbell, TreePine, UtensilsCrossed, School } as const
type IconName = keyof typeof ICON_MAP

export function Instalaciones() {
  return (
    <SectionWrapper variant="secondary">
      <SectionTitle
        title="Nuestras instalaciones"
        subtitle="Espacios pensados para el bienestar y el aprendizaje de nuestros estudiantes"
      />

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {INSTALACIONES.map((item, i) => {
          const Icon = ICON_MAP[item.icon as IconName]
          const isWide = i === 0 // primera foto más grande

          return (
            <AnimatedSection
              key={item.id}
              direction="up"
              delay={i * 0.08}
              className={cn(isWide && 'sm:col-span-2 lg:col-span-1')}
            >
              <motion.div
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-shadow h-full"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {/* Imagen */}
                <div className="relative h-52 overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      // Placeholder mientras no hay foto real
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  {/* Fallback sin foto */}
                  <div className="hidden h-full w-full flex items-center justify-center bg-primary/5">
                    <Icon className="h-16 w-16 text-primary/30" />
                  </div>
                </div>

                {/* Contenido */}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground">{item.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
