import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

export function MapaInteractivo() {
  return (
    <SectionWrapper variant="dark">
      <SectionTitle title="Encuéntranos" subtitle="Estamos en Nueva Imperial, Región de La Araucanía" />

      <AnimatedSection direction="up" delay={0.1} className="mt-10">
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border shadow-sm">
          {/* Reemplazar src con el embed de Google Maps real una vez que la dirección sea definitiva */}
          <iframe
            title="Ubicación del colegio"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153!2d-72.9488!3d-38.7402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d7b1e0000001%3A0x1!2sEscuela%20Gabriela%20Mistral%2C%20S-40%20699%2C%20Nueva%20Imperial!5e0!3m2!1ses!2scl!4v1700000000000"
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
