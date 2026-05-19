import { SeoHead } from '@/components/shared/SeoHead'
import { HeroSeccion } from './sections/HeroSeccion'
import { NivelCard } from './sections/NivelCard'
import { Extraescolares } from './sections/Extraescolares'

export function NivelesPage() {
  return (
    <>
      <SeoHead
        title="Niveles y Academias Extracurriculares"
        description="Primer y Segundo Ciclo Básico (1° a 8°) y 6 academias extracurriculares: deportes, artes, robótica y más. Formación integral en Nueva Imperial."
        canonicalPath="/niveles"
      />
      <HeroSeccion />
      <NivelCard />
      <Extraescolares />
    </>
  )
}
