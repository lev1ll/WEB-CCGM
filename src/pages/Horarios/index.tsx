import { useState, useEffect, useMemo } from 'react'
import { SeoHead } from '@/components/shared/SeoHead'
import { PageHero } from '@/components/shared/PageHero'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { HorarioCelda, AtencionApoderado } from '@/types/noticias.types'

const CURSOS = ['1°', '2°', '3°', '4°', '5°', '6°', '7°', '8°']
const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'] as const
const DIA_LABELS: Record<string, string> = {
  lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
  jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado',
}

function formatHora(h: string) {
  return h.replace(/^0/, '')
}

export default function HorariosPage() {
  const { select } = useSupabaseQuery()
  const [atencion, setAtencion] = useState<AtencionApoderado[]>([])
  const [horarios, setHorarios] = useState<HorarioCelda[]>([])
  const [selectedCurso, setSelectedCurso] = useState('1°')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [at, ho] = await Promise.all([
        select<AtencionApoderado>('atencion_apoderados', { order: { column: 'orden', ascending: true } }),
        select<HorarioCelda>('horarios', { order: { column: 'hora_inicio', ascending: true } }),
      ])
      setAtencion(at)
      setHorarios(ho)
      setLoading(false)
    }
    load()
  }, [])

  const celdas = useMemo(
    () => horarios.filter(h => h.curso === selectedCurso),
    [horarios, selectedCurso],
  )

  const bloques = useMemo(() => {
    const seen = new Set<string>()
    const result: { hora_inicio: string; hora_fin: string }[] = []
    celdas.forEach(c => {
      const key = `${c.hora_inicio}|${c.hora_fin}`
      if (!seen.has(key)) { seen.add(key); result.push({ hora_inicio: c.hora_inicio, hora_fin: c.hora_fin }) }
    })
    return result.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
  }, [celdas])

  function getAsignatura(dia: string, hi: string, hf: string) {
    return celdas.find(c => c.dia === dia && c.hora_inicio === hi && c.hora_fin === hf)?.asignatura ?? ''
  }

  return (
    <>
      <SeoHead
        title="Horarios | Escuela Gabriela Mistral"
        description="Horario de atención de apoderados y horarios semanales por curso de la Escuela Gabriela Mistral, Nueva Imperial."
        canonicalPath="/horarios"
      />

      <PageHero
        title="Horarios"
        subtitle="Horarios semanales por curso y atención de apoderados"
        breadcrumb="Horarios"
      />

      {/* ── Horarios por Curso ── */}
      <SectionWrapper className="bg-muted/40">
        <SectionTitle
          title="Horarios por Curso"
          subtitle="Selecciona el curso para ver el horario semanal"
        />

        {/* Selector de curso */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          {CURSOS.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCurso(c)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                selectedCurso === c
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-gray-700 border border-border hover:border-primary hover:text-primary'
              }`}
            >
              {c} Básico
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12 text-muted-foreground mt-8">Cargando...</div>
        ) : bloques.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 mt-8">
            Horario no disponible para {selectedCurso} Básico.
          </p>
        ) : (
          <AnimatedSection direction="up" key={selectedCurso}>
            <div className="overflow-x-auto rounded-xl border border-border mt-8 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="px-4 py-3.5 text-center text-xs font-semibold min-w-[90px]">Horario</th>
                    {DIAS.map(d => (
                      <th key={d} className="px-4 py-3.5 text-center text-xs font-semibold min-w-[110px]">
                        {DIA_LABELS[d]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bloques.map((bloque, i) => (
                    <tr key={`${bloque.hora_inicio}|${bloque.hora_fin}`} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                      <td className="px-3 py-3 text-center font-bold text-secondary text-xs whitespace-nowrap">
                        {formatHora(bloque.hora_inicio)}<br />
                        <span className="text-muted-foreground font-normal">{formatHora(bloque.hora_fin)}</span>
                      </td>
                      {DIAS.map(dia => {
                        const asig = getAsignatura(dia, bloque.hora_inicio, bloque.hora_fin)
                        return (
                          <td key={dia} className="px-3 py-3 text-center text-sm text-foreground">
                            {asig || <span className="text-muted-foreground/30 select-none">—</span>}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        )}
      </SectionWrapper>

      {/* ── Atención de Apoderados ── */}
      <SectionWrapper>
        <SectionTitle
          title="Atención de Apoderados"
          subtitle="Horario de atención por docente"
        />

        {loading ? (
          <div className="flex justify-center py-12 text-muted-foreground">Cargando...</div>
        ) : atencion.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 mt-8">Información no disponible aún.</p>
        ) : (
          <AnimatedSection direction="up">
            <div className="overflow-x-auto rounded-xl border border-border mt-8 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-white">
                    {['Nombre', 'Cargo', 'Día', 'Horario'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {atencion.map((item, i) => (
                    <tr key={item.id} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/30'}>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{item.nombre}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{item.cargo}</td>
                      <td className="px-5 py-3.5 text-muted-foreground capitalize">
                        {DIA_LABELS[item.dia] ?? item.dia}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-secondary">
                        {formatHora(item.hora_inicio)} – {formatHora(item.hora_fin)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        )}
      </SectionWrapper>

    </>
  )
}
