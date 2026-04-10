import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { Noticia } from '@/types/noticias.types'

interface EventoCalendario {
  id: string
  titulo: string
  descripcion: string | null
  fecha_inicio: string
  fecha_fin: string | null
  tipo: string
}

const TIPO_STYLE: Record<string, { dot: string; pill: string; badge: string; label: string }> = {
  feriado:   { dot: 'bg-red-500',   pill: 'bg-red-100 text-red-700',     badge: 'bg-red-100 text-red-700',     label: 'Feriado / Suspensión' },
  academico: { dot: 'bg-blue-600',  pill: 'bg-blue-100 text-blue-700',   badge: 'bg-blue-100 text-blue-700',   label: 'Académico' },
  evento:    { dot: 'bg-amber-500', pill: 'bg-amber-100 text-amber-700', badge: 'bg-amber-100 text-amber-700', label: 'Evento / Actividad' },
  general:   { dot: 'bg-gray-400',  pill: 'bg-gray-100 text-gray-600',   badge: 'bg-gray-100 text-gray-600',   label: 'General' },
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS_SEMANA_L = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']
const DIAS_SEMANA_S = ['L','M','X','J','V','S','D']

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function getFirstDay(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7 }
function pad(n: number) { return String(n).padStart(2, '0') }

function eventoEnFecha(ev: EventoCalendario, d: string) {
  if (!ev.fecha_fin || ev.fecha_fin === ev.fecha_inicio) return ev.fecha_inicio === d
  return d >= ev.fecha_inicio && d <= ev.fecha_fin
}

function formatFecha(d: string) {
  const [y, m, day] = d.split('-')
  return `${parseInt(day)} de ${MESES[parseInt(m) - 1]} de ${y}`
}

function formatFechaCorta(d: string) {
  const [, m, day] = d.split('-')
  return `${parseInt(day)} ${MESES[parseInt(m) - 1].slice(0, 3)}`
}

export default function CalendarioPage() {
  const { select, isLoading } = useSupabaseQuery()
  const [eventos, setEventos] = useState<EventoCalendario[]>([])
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  function loadData() {
    select<EventoCalendario>('calendario_eventos', {
      order: { column: 'fecha_inicio', ascending: true },
    }).then(setEventos)
    select<Noticia>('noticias', {
      filter: { publicado: true },
      order: { column: 'created_at', ascending: false },
      limit: 4,
    }).then(setNoticias)
  }

  useEffect(() => {
    loadData()
    function onVisible() { if (document.visibilityState === 'visible') loadData() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  function prevMonth() {
    setSelectedDay(null)
    if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1)
  }
  function nextMonth() {
    setSelectedDay(null)
    if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1)
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDay(year, month)
  const blanks = Array(firstDay).fill(null)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

  function getEvs(day: number) {
    const d = `${year}-${pad(month + 1)}-${pad(day)}`
    return eventos.filter(ev => eventoEnFecha(ev, d))
  }

  const selectedEventos = selectedDay ? eventos.filter(ev => eventoEnFecha(ev, selectedDay)) : []

  const proximos = eventos
    .filter(ev => (ev.fecha_fin ?? ev.fecha_inicio) >= todayStr)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header compacto */}
        <div className="mb-6">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary uppercase mb-1">Año escolar</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Calendario Escolar 2026</h1>
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(TIPO_STYLE).map(([key, s]) => (
            <span key={key} className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.badge}`}>
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          ))}
        </div>

        {isLoading && eventos.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-primary rounded-full animate-spin mr-2" />
            Cargando...
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_280px] gap-6">

            {/* ── Columna principal ── */}
            <div className="space-y-4">

              {/* Calendario */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Nav mes */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <button onClick={prevMonth} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-base font-bold text-gray-900">{MESES[month]} {year}</h2>
                  <button onClick={nextMonth} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Días semana */}
                <div className="grid grid-cols-7 border-b border-gray-100">
                  {DIAS_SEMANA_L.map((d, i) => (
                    <div key={d} className="py-2 text-center">
                      <span className="hidden sm:inline text-[11px] font-bold text-gray-400 uppercase tracking-wider">{d}</span>
                      <span className="sm:hidden text-[11px] font-bold text-gray-400 uppercase">{DIAS_SEMANA_S[i]}</span>
                    </div>
                  ))}
                </div>

                {/* Celdas */}
                <div className="grid grid-cols-7">
                  {blanks.map((_, i) => (
                    <div key={`b${i}`} className="h-16 sm:h-20 border-r border-b border-gray-50" />
                  ))}
                  {days.map(day => {
                    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
                    const evs = getEvs(day)
                    const isToday = dateStr === todayStr
                    const isSelected = selectedDay === dateStr
                    const col = (blanks.length + day - 1) % 7
                    const isWeekend = col === 5 || col === 6
                    const shown = evs.slice(0, 2)
                    const extra = evs.length - 2

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(isSelected ? null : dateStr)}
                        className={`
                          h-16 sm:h-20 flex flex-col items-start justify-start p-1 sm:p-1.5
                          border-r border-b border-gray-50 transition-colors text-left
                          ${isWeekend ? 'bg-gray-50/60' : ''}
                          ${isSelected ? 'bg-primary/5 ring-1 ring-inset ring-primary/30' : 'hover:bg-gray-50'}
                        `}
                      >
                        <span className={`
                          w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold mb-0.5 flex-shrink-0
                          ${isToday ? 'bg-primary text-white' : isSelected ? 'text-primary font-bold' : 'text-gray-700'}
                        `}>
                          {day}
                        </span>

                        {/* Desktop: pills con texto */}
                        <div className="hidden sm:flex flex-col gap-0.5 w-full">
                          {shown.map(ev => {
                            const s = TIPO_STYLE[ev.tipo] ?? TIPO_STYLE.general
                            return (
                              <span key={ev.id} className={`block w-full rounded px-1 py-0.5 text-[9px] font-medium leading-tight truncate ${s.pill}`}>
                                {ev.titulo}
                              </span>
                            )
                          })}
                          {extra > 0 && (
                            <span className="text-[9px] text-gray-400 font-medium pl-1">+{extra} más</span>
                          )}
                        </div>

                        {/* Mobile: puntos */}
                        <div className="sm:hidden flex gap-0.5 flex-wrap pl-0.5">
                          {evs.slice(0, 3).map(ev => (
                            <span key={ev.id} className={`w-1.5 h-1.5 rounded-full ${TIPO_STYLE[ev.tipo]?.dot ?? 'bg-gray-400'}`} />
                          ))}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Panel día seleccionado */}
              <AnimatePresence>
                {selectedDay && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900 text-sm">{formatFecha(selectedDay)}</h3>
                      <button onClick={() => setSelectedDay(null)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {selectedEventos.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-6">Sin eventos este día.</p>
                    ) : (
                      <div className="divide-y divide-gray-50">
                        {selectedEventos.map(ev => {
                          const s = TIPO_STYLE[ev.tipo] ?? TIPO_STYLE.general
                          return (
                            <div key={ev.id} className="flex items-start gap-3 px-4 py-3">
                              <span className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${s.dot}`} />
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{ev.titulo}</p>
                                {ev.fecha_fin && ev.fecha_fin !== ev.fecha_inicio && (
                                  <p className="text-xs text-gray-400 mt-0.5">Hasta el {formatFecha(ev.fecha_fin)}</p>
                                )}
                                {ev.descripcion && (
                                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{ev.descripcion}</p>
                                )}
                                <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>
                                  {s.label}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Próximos eventos */}
              {proximos.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Próximos eventos</h2>
                  </div>
                  <div className="space-y-2">
                    {proximos.map(ev => {
                      const s = TIPO_STYLE[ev.tipo] ?? TIPO_STYLE.general
                      return (
                        <div key={ev.id} className="bg-white rounded-xl border border-gray-200 flex items-center gap-3 px-4 py-3">
                          <span className={`flex-shrink-0 w-2 h-2 rounded-full ${s.dot}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm truncate">{ev.titulo}</p>
                            <p className="text-xs text-gray-400">{formatFechaCorta(ev.fecha_inicio)}{ev.fecha_fin && ev.fecha_fin !== ev.fecha_inicio ? ` → ${formatFechaCorta(ev.fecha_fin)}` : ''}</p>
                          </div>
                          <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar noticias ── */}
            {noticias.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Últimas noticias</h2>
                </div>
                <div className="space-y-3">
                  {noticias.map(n => (
                    <Link
                      key={n.id}
                      to={`/noticias/${n.slug}`}
                      className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-3 hover:shadow-sm hover:border-primary/30 transition-all group"
                    >
                      {n.imagen_portada ? (
                        <img
                          src={n.imagen_portada}
                          alt={n.titulo}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <CalendarDays className="w-5 h-5 text-primary/50" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {n.titulo}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatFechaCorta(n.created_at.slice(0, 10))}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/noticias"
                  className="block text-center text-xs font-semibold text-primary hover:underline py-1"
                >
                  Ver todas las noticias →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
