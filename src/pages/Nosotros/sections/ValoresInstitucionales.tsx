import { Heart, Users, Handshake, CheckCircle, Flame, Globe, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { VALORES_INSTITUCIONALES } from '@/constants/nosotros'

const ICON_MAP = { Heart, Users, Handshake, CheckCircle, Flame, Globe, Star } as const
type IconName = keyof typeof ICON_MAP

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function ValoresInstitucionales() {
  return (
    <SectionWrapper variant="accent">
      <SectionTitle
        title="Valores institucionales"
        subtitle="Los principios que guían cada decisión en la Escuela Gabriela Mistral"
      />

      <motion.div
        className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
      >
        {VALORES_INSTITUCIONALES.map((valor) => {
          const Icon = ICON_MAP[valor.icon as IconName]
          return (
            <motion.div
              key={valor.title}
              variants={itemVariants}
              className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
            >
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg">{valor.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{valor.description}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </SectionWrapper>
  )
}
