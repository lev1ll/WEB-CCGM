import { motion } from 'framer-motion'
import {
  BadgeCheck, Bus, Trophy, HeartHandshake,
  Palette, Clock, Heart, Monitor,
} from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { BENEFICIOS } from '@/constants/admision'

const ICON_MAP = {
  BadgeCheck, Bus, Trophy, HeartHandshake, Palette, Clock, Heart, Monitor,
} as const
type IconName = keyof typeof ICON_MAP

export function BeneficiosAdmision() {
  return (
    <SectionWrapper variant="warm">
      <SectionTitle
        title="¿Por qué elegirnos?"
        subtitle="Beneficios concretos para tu familia desde el primer día"
      />

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BENEFICIOS.map((b, i) => {
          const Icon = ICON_MAP[b.icon as IconName]
          return (
            <motion.div
              key={b.title}
              className="rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-foreground leading-tight mb-2 text-sm">{b.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
            </motion.div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
