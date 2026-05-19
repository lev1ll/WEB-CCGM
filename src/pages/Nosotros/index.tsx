import { SeoHead } from '@/components/shared/SeoHead'
import { HeroSeccion } from './sections/HeroSeccion'
import { Historia } from './sections/Historia'
import { MisionVision } from './sections/MisionVision'
import { ValoresInstitucionales } from './sections/ValoresInstitucionales'
import { Instalaciones } from './sections/Instalaciones'
import { SeccionMicros } from './sections/SeccionMicros'
import { EquipoEscuela } from './sections/EquipoEscuela'

export function NosotrosPage() {
  return (
    <>
      <SeoHead
        title="Quiénes Somos"
        description="Conoce la historia, misión, visión y valores de la Escuela Gabriela Mistral. Desde 1980 formando personas íntegras en Nueva Imperial, La Araucanía."
        canonicalPath="/nosotros"
      />
      <HeroSeccion />
      <Instalaciones />
      <SeccionMicros />
      <MisionVision />
      <ValoresInstitucionales />
      <Historia />
      <EquipoEscuela />
    </>
  )
}
