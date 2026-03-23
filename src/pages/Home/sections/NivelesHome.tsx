import { Link } from 'react-router-dom'
import { Smile, BookOpen, Lightbulb, GraduationCap, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Card, CardContent } from '@/components/ui/card'

const NIVELES = [
  {
    icon: Smile,
    name: '1° y 2° Básico',
    ages: '6 – 8 años',
    description: 'Lectoescritura, matemática concreta y hábitos escolares en un ambiente cálido y estructurado.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: BookOpen,
    name: '3° y 4° Básico',
    ages: '8 – 10 años',
    description: 'Comprensión lectora, ciencias y matemática con énfasis en la resolución de problemas.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Lightbulb,
    name: '5° y 6° Básico',
    ages: '10 – 12 años',
    description: 'Pensamiento crítico, investigación y trabajo colaborativo en todas las asignaturas.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    icon: GraduationCap,
    name: '7° y 8° Básico',
    ages: '12 – 14 años',
    description: 'Preparación sólida para la educación media con orientación vocacional y liderazgo.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

export function NivelesHome() {
  return (
    <SectionWrapper variant="dark">
      <SectionTitle
        title="Niveles educativos"
        subtitle="De 1° a 8° Básico — Acompañamos a cada estudiante en cada etapa de su crecimiento"
      />

      <AnimatedSection direction="up" delay={0.1}>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {NIVELES.map((nivel) => {
            const Icon = nivel.icon
            return (
              <motion.div
                key={nivel.name}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 flex flex-col gap-3 h-full">
                    <div className={`h-11 w-11 rounded-xl ${nivel.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${nivel.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{nivel.name}</h3>
                      <p className="text-xs text-secondary font-semibold mt-0.5">{nivel.ages}</p>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {nivel.description}
                      </p>
                    </div>
                    <Link
                      to="/niveles"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-secondary transition-colors"
                    >
                      Ver más <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}
