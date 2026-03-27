import { FormularioPreInscripcion } from '@/pages/Admision/sections/FormularioPreInscripcion'
import { MapaInteractivo } from './sections/MapaInteractivo'
import { DatosContacto } from './sections/DatosContacto'

export function ContactoPage() {
  return (
    <>
      <FormularioPreInscripcion />
      <MapaInteractivo />
      <DatosContacto />
    </>
  )
}
