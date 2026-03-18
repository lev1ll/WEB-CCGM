import { PageHero } from '@/components/shared/PageHero'
import { FormularioContacto } from './sections/FormularioContacto'
import { MapaInteractivo } from './sections/MapaInteractivo'
import { DatosContacto } from './sections/DatosContacto'

export function ContactoPage() {
  return (
    <>
      <PageHero
        title="Contacto"
        subtitle="Estamos aquí para responder todas tus consultas. Escríbenos o visítanos."
        breadcrumb="Contacto"
      />
      <FormularioContacto />
      <MapaInteractivo />
      <DatosContacto />
    </>
  )
}
