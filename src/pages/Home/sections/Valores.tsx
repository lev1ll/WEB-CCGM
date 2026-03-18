import {
  Heart,
  Star,
  Users,
  Shield,
  Lightbulb,
  BookOpen,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { HOME_VALORES } from '@/constants/home'
import { cn } from '@/lib/utils'

const ICON_MAP = { Heart, Star, Users, Shield, Lightbulb, BookOpen } as const
type IconName = keyof typeof ICON_MAP

const BG_VARIANTS = [
  'bg-primary/5 hover:bg-primary/10',
  'bg-secondary/15 hover:bg-secondary/25',
  'bg-accent/10 hover:bg-accent/20',
  'bg-primary/5 hover:bg-primary/10',
  'bg-muted hover:bg-muted/80',
  'bg-secondary/15 hover:bg-secondary/25',
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Valores() {
  return (
    <SectionWrapper>
      <SectionTitle
        title="Nuestros valores"
        subtitle="Principios que guían cada decisión en nuestra comunidad educativa"
      />

      <motion.div
        className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={containerVariants}
      >
        {HOME_VALORES.map((valor, i) => {
          const Icon = ICON_MAP[valor.icon as IconName]
          const isLarge = i < 2
          return (
            <motion.div
              key={valor.title}
              variants={itemVariants}
              className={cn(
                'rounded-2xl p-6 transition-colors cursor-default',
                BG_VARIANTS[i % BG_VARIANTS.length],
                isLarge && 'sm:col-span-1 col-span-2 sm:col-span-1'
              )}
              whileHover={{ scale: 1.02 }}
            >
              <Icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold text-foreground text-lg">{valor.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {valor.description}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </SectionWrapper>
  )
}
