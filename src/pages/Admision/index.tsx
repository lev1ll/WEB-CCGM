import { HeroSeccion } from './sections/HeroSeccion'
import { PasosAdmision } from './sections/PasosAdmision'
import { Requisitos } from './sections/Requisitos'
import { CalendarioAdmision } from './sections/CalendarioAdmision'
import { FAQAdmision } from './sections/FAQAdmision'

export function AdmisionPage() {
  return (
    <>
      <HeroSeccion />
      <PasosAdmision />
      <Requisitos />
      <CalendarioAdmision />
      <FAQAdmision />
    </>
  )
}
