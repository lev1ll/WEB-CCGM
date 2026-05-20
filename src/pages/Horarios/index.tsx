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
const DIA_LABELS_SHORT: Record<string, string> = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié', jueves: 'Jue', viernes: 'Vie',
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

  const [selectedDia, setSelectedDia] = useState<string>(() => {
    const d = new Date().getDay()
    return d >= 1 && d <= 5 ? DIAS[d - 1] : 'lunes'
  })

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

      <PageHero title="Horarios" breadcrumb="Horarios" compact />

      {/* ── Horarios por Curso ── */}
      <SectionWrapper className="bg-muted/40">
        <SectionTitle
          title="Horarios por Curso"
          subtitle="Selecciona el curso para ver el horario semanal"
        />

        {/* Selector de curso */}
        <div className="flex flex-wrap gap-1.5 mt-6 justify-center">
          {CURSOS.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCurso(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                selectedCurso === c
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'bg-white text-gray-600 border border-border hover:border-primary hover:text-primary'
              }`}
            >
              {c} <span className="hidden sm:inline">Básico</span>
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

            {/* ── Escritorio: grilla ── */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-border mt-8 shadow-sm bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-3.5 text-center text-xs font-bold text-primary bg-primary/5 border-b border-border min-w-[90px]">
                      Horario
                    </th>
                    {DIAS.map(d => (
                      <th key={d} className="px-4 py-3.5 text-center text-xs font-bold text-white bg-primary border-b border-primary/80 min-w-[120px]">
                        {DIA_LABELS[d]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bloques.map((bloque, i) => (
                    <tr key={`${bloque.hora_inicio}|${bloque.hora_fin}`}
                      className={i % 2 === 0 ? 'bg-white hover:bg-muted/20' : 'bg-muted/20 hover:bg-muted/40'}
                      style={{ transition: 'background 0.15s' }}
                    >
                      <td className="px-3 py-3.5 text-center border-r border-border bg-primary/5 whitespace-nowrap">
                        <span className="text-xs font-bold text-primary">{formatHora(bloque.hora_inicio)}</span>
                        <span className="text-xs text-muted-foreground"> – {formatHora(bloque.hora_fin)}</span>
                      </td>
                      {DIAS.map(dia => {
                        const asig = getAsignatura(dia, bloque.hora_inicio, bloque.hora_fin)
                        return (
                          <td key={dia} className="px-3 py-3.5 text-center">
                            {asig
                              ? <span className="text-sm font-medium text-foreground">{asig}</span>
                              : <span className="text-muted-foreground/25 select-none text-base">—</span>
                            }
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Móvil: día selector + lista ── */}
            <div className="md:hidden mt-5 space-y-3">
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
                {DIAS.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDia(d)}
                    className={`flex flex-col items-center px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 snap-start transition-all ${
                      selectedDia === d
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-gray-600 border border-border'
                    }`}
                  >
                    <span className="text-base leading-none mb-0.5">{DIA_LABELS_SHORT[d]}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {bloques.map(bloque => {
                  const asig = getAsignatura(selectedDia, bloque.hora_inicio, bloque.hora_fin)
                  return (
                    <div
                      key={`${bloque.hora_inicio}|${bloque.hora_fin}`}
                      className="flex items-stretch bg-white rounded-xl border border-border shadow-sm overflow-hidden"
                    >
                      <div className="w-1 bg-primary shrink-0" />
                      <div className="px-3 py-3 text-center shrink-0 flex flex-col justify-center w-20 border-r border-border">
                        <p className="text-xs font-bold text-primary leading-none">{formatHora(bloque.hora_inicio)}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{formatHora(bloque.hora_fin)}</p>
                      </div>
                      <div className="px-4 py-3 flex items-center flex-1">
                        {asig
                          ? <p className="text-sm font-semibold text-foreground">{asig}</p>
                          : <p className="text-xs text-muted-foreground italic">Sin asignatura</p>
                        }
                      </div>
                    </div>
                  )
                })}
              </div>
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
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {atencion.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-border shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="font-bold text-foreground leading-snug">{item.nombre}</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">{item.cargo}</p>
                  </div>
                  <div className="mt-auto pt-3 border-t border-border flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full capitalize">
                      {DIA_LABELS[item.dia] ?? item.dia}
                    </span>
                    <span className="text-sm font-bold text-secondary">
                      {formatHora(item.hora_inicio)} – {formatHora(item.hora_fin)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}
      </SectionWrapper>
    </>
  )
}
