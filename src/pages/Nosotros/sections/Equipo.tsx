import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { EQUIPO } from '@/constants/nosotros'

export function Equipo() {
  return (
    <SectionWrapper>
      <SectionTitle
        title="Equipo directivo"
        subtitle="Las personas que lideran nuestra misión educativa"
      />

      <AnimatedSection direction="up" delay={0.1} className="mt-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EQUIPO.map((miembro) => (
            <motion.div
              key={miembro.name}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            >
              <Card className="h-full text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <Avatar className="h-20 w-20 text-xl">
                    {miembro.photo ? (
                      <AvatarImage src={miembro.photo} alt={miembro.name} />
                    ) : null}
                    <AvatarFallback initials={miembro.initials} className="text-lg" />
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-foreground">{miembro.name}</h3>
                    <p className="text-sm text-secondary font-semibold mt-0.5">{miembro.role}</p>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {miembro.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}
