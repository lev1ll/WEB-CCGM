import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TRABAJADORES, CATEGORIA_LABELS, type CargoCategoria } from '@/constants/instalaciones'

const CATEGORIA_ORDER: CargoCategoria[] = ['directivo', 'docente', 'asistente']

export function EquipoEscuela() {
  return (
    <SectionWrapper className="bg-muted/40">
      <SectionTitle
        title="Nuestro equipo"
        subtitle="Las personas que hacen posible la Escuela Gabriela Mistral cada día"
      />

      <div className="mt-10 space-y-10">
        {CATEGORIA_ORDER.map((categoria) => {
          const miembros = TRABAJADORES.filter((t) => t.categoria === categoria)
          if (miembros.length === 0) return null

          return (
            <div key={categoria}>
              <AnimatedSection direction="up">
                <h3 className="text-sm font-bold tracking-widest text-secondary uppercase mb-5">
                  {CATEGORIA_LABELS[categoria]}
                </h3>
              </AnimatedSection>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {miembros.map((miembro, i) => (
                  <AnimatedSection key={miembro.id} direction="up" delay={i * 0.07}>
                    <motion.div
                      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                    >
                      <Card className="h-full text-center hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex flex-col items-center gap-3">
                          <Avatar className="h-20 w-20 text-xl">
                            {miembro.photo
                              ? <AvatarImage src={miembro.photo} alt={miembro.name} />
                              : null
                            }
                            <AvatarFallback initials={miembro.initials} className="text-lg" />
                          </Avatar>
                          <div>
                            <p className="font-bold text-foreground">
                              {miembro.name || 'Por confirmar'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-0.5">{miembro.role}</p>
                          </div>
                          <Badge variant="gold" className="text-xs">
                            {CATEGORIA_LABELS[miembro.categoria]}
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
