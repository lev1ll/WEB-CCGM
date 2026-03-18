import { HeroSeccion } from './sections/HeroSeccion'
import { Historia } from './sections/Historia'
import { MisionVision } from './sections/MisionVision'
import { ValoresInstitucionales } from './sections/ValoresInstitucionales'
import { Instalaciones } from './sections/Instalaciones'
// import { EquipoEscuela } from './sections/EquipoEscuela' // ← activar cuando haya datos del personal

export function NosotrosPage() {
  return (
    <>
      <HeroSeccion />
      <Historia />
      <MisionVision />
      <ValoresInstitucionales />
      <Instalaciones />
      {/* <EquipoEscuela /> — pendiente: agregar nombres y fotos del personal */}
    </>
  )
}
