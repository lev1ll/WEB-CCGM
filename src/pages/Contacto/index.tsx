import { MapaInteractivo } from './sections/MapaInteractivo'
import { DatosContacto } from './sections/DatosContacto'
import { MapaTransporte } from './sections/MapaTransporte'

export function ContactoPage() {
  return (
    <>
      <DatosContacto />
      <MapaInteractivo />
      <MapaTransporte />
    </>
  )
}
