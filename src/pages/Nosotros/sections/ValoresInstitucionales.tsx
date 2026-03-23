import { Heart, Scale, Handshake, Award, Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { VALORES_INSTITUCIONALES } from '@/constants/nosotros'

const ICON_MAP = { Heart, Scale, Handshake, Award, Globe } as const
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
        subtitle="Los principios que guían cada decisión en el CCGM"
      />

      <motion.div
        className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-6"
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
              className="flex flex-col items-center text-center gap-3 p-5 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow"
            >
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground">{valor.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{valor.description}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </SectionWrapper>
  )
}
