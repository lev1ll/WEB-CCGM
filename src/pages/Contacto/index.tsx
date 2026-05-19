import { SeoHead } from '@/components/shared/SeoHead'
import { ContactoHero } from './sections/ContactoHero'
import { MapaTransporte } from './sections/MapaTransporte'

export function ContactoPage() {
  return (
    <>
      <SeoHead
        title="Contacto y Ubicación"
        description="Encuéntranos en General Urrutia N° 763, Nueva Imperial. Teléfono: +56 45 261 2597. Horarios de atención para apoderados y profesores."
        canonicalPath="/contacto"
      />
      <ContactoHero />
      <MapaTransporte />
    </>
  )
}
