import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

export function MapaInteractivo() {
  return (
    <SectionWrapper variant="dark">
      <SectionTitle title="Encuéntranos" subtitle="Estamos en Nueva Imperial, Región de La Araucanía" />

      <AnimatedSection direction="up" delay={0.1} className="mt-10">
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-sm">
          <iframe
            title="Ubicación Escuela Gabriela Mistral"
            src="https://maps.google.com/maps?q=Escuela+Gabriela+Mistral+General+Urrutia+763+Nueva+Imperial+Chile&t=&z=16&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}
