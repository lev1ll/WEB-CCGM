import { ExternalLink } from 'lucide-react'
import { HeroSeccion } from './sections/HeroSeccion'
import { PasosAdmision } from './sections/PasosAdmision'
import { Requisitos } from './sections/Requisitos'
import { CalendarioAdmision } from './sections/CalendarioAdmision'
import { FAQAdmision } from './sections/FAQAdmision'

function CTAAnotate() {
  return (
    <section className="bg-primary py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[11px] font-bold tracking-[0.25em] text-white/60 uppercase mb-4">
          Postulación 2026 · Plataforma oficial MINEDUC
        </p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
          ¿Quieres que tu hijo estudie<br />con nosotros?
        </h2>
        <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
          Anótate en la lista oficial a través de la plataforma del Ministerio de Educación.
          Una vez inscrito, te contactaremos para coordinar la visita y la matrícula.
        </p>
        <a
          href="https://registropublicodigital.mineduc.gob.cl/rpd-app-registro-apoderado/login"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-white text-primary font-extrabold
                     px-8 py-4 rounded-xl hover:bg-white/90 transition-colors text-lg shadow-lg"
        >
          <ExternalLink className="w-5 h-5 shrink-0" />
          Anótate en la lista — MINEDUC
        </a>
        <p className="mt-4 text-white/50 text-sm">
          Gratuito · Sin compromiso · Solo días hábiles
        </p>
      </div>
    </section>
  )
}

export function AdmisionPage() {
  return (
    <>
      <HeroSeccion />
      <CTAAnotate />
      <PasosAdmision />
      <Requisitos />
      <CalendarioAdmision />
      <FAQAdmision />
    </>
  )
}
