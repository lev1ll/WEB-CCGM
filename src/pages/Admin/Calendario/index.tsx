import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, AlertCircle, CalendarDays, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface EventoCalendario {
  id: string
  titulo: string
  descripcion: string | null
  fecha_inicio: string
  fecha_fin: string | null
  tipo: string
  created_at: string
}

const TIPOS = [
  { value: 'feriado',   label: 'Feriado / Suspensión' },
  { value: 'academico', label: 'Académico' },
  { value: 'evento',    label: 'Evento / Actividad' },
  { value: 'general',   label: 'General' },
]

const TIPO_STYLE: Record<string, { dot: string; pill: string; badge: string }> = {
  feriado:   { dot: 'bg-red-500',   pill: 'bg-red-100 text-red-700',     badge: 'bg-red-100 text-red-700'     },
  academico: { dot: 'bg-blue-600',  pill: 'bg-blue-100 text-blue-700',   badge: 'bg-blue-100 text-blue-700'   },
  evento:    { dot: 'bg-amber-500', pill: 'bg-amber-100 text-amber-700', badge: 'bg-amber-100 text-amber-700' },
  general:   { dot: 'bg-gray-400',  pill: 'bg-gray-100 text-gray-600',   badge: 'bg-gray-100 text-gray-600'   },
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS_SEMANA = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function getFirstDay(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7 }
function pad(n: number) { return String(n).padStart(2, '0') }

function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

const EMPTY_FORM = { titulo: '', descripcion: '', fecha_inicio: '', fecha_fin: '', tipo: 'general' }

export default function AdminCalendario() {
  const { select, upsert, remove, isLoading, error } = useSupabaseQuery()
  const [eventos, setEventos] = useState<EventoCalendario[]>([])
  const [vista, setVista] = useState<'calendario' | 'lista'>('calendario')
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<EventoCalendario | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<EventoCalendario | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    load()
    function onVisible() { if (document.visibilityState === 'visible') load() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  async function load() {
    const data = await select<EventoCalendario>('calendario_eventos', {
      order: { column: 'fecha_inicio', ascending: true },
    })
    setEventos(data)
  }

  function openNew(fechaPre?: string) {
    setEditing(null)
    setForm({ ...EMPTY_FORM, fecha_inicio: fechaPre ?? '' })
    setActionError(null)
    setDialogOpen(true)
  }

  function openEdit(e: EventoCalendario, stopEv?: React.MouseEvent) {
    stopEv?.stopPropagation()
    setEditing(e)
    setForm({
      titulo: e.titulo,
      descripcion: e.descripcion ?? '',
      fecha_inicio: e.fecha_inicio,
      fecha_fin: e.fecha_fin ?? '',
      tipo: e.tipo,
    })
    setActionError(null)
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.titulo.trim() || !form.fecha_inicio) {
      setActionError('El título y la fecha de inicio son obligatorios.')
      return
    }
    setSaving(true)
    setActionError(null)
    const payload = {
      ...(editing ? { id: editing.id } : {}),
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim() || null,
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin || null,
      tipo: form.tipo,
    }
    const r = await upsert('calendario_eventos', payload as Record<string, unknown>)
    if (r.success) {
      await load()
      setDialogOpen(false)
    } else {
      setActionError(r.error ?? 'Error al guardar')
    }
    setSaving(false)
  }

  async function handleDelete(e: EventoCalendario) {
    setDeletingId(e.id)
    const r = await remove('calendario_eventos', e.id)
    if (r.success) {
      setEventos(prev => prev.filter(x => x.id !== e.id))
    } else {
      setActionError(r.error ?? 'Error al eliminar')
    }
    setDeletingId(null)
    setConfirmDelete(null)
  }

  // ── Calendario helpers ──
  function prevMonth() { if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1) }
  function nextMonth() { if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1) }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDay(year, month)
  const blanks = Array(firstDay).fill(null)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

  function getEvs(day: number) {
    const d = `${year}-${pad(month + 1)}-${pad(day)}`
    return eventos.filter(ev => {
      if (!ev.fecha_fin || ev.fecha_fin === ev.fecha_inicio) return ev.fecha_inicio === d
      return d >= ev.fecha_inicio && d <= ev.fecha_fin
    })
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendario Escolar</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestiona los eventos y actividades del año</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle vista */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden bg-white">
            <button
              onClick={() => setVista('calendario')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${vista === 'calendario' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <CalendarDays className="w-4 h-4" /> Calendario
            </button>
            <button
              onClick={() => setVista('lista')}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${vista === 'lista' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" /> Lista
            </button>
          </div>
          <button
            onClick={() => openNew()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </div>
      </div>

      {actionError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {actionError}
        </div>
      )}

      {isLoading && eventos.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
        </div>
      ) : (
        <>
          {/* ── Vista Calendario ── */}
          {vista === 'calendario' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                {DIAS_SEMANA.map(d => (
                  <div key={d} className="py-2 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">{d}</div>
                ))}
              </div>

              {/* Celdas */}
              <div className="grid grid-cols-7">
                {blanks.map((_, i) => (
                  <div key={`b${i}`} className="h-20 lg:h-24 border-r border-b border-gray-50" />
                ))}
                {days.map(day => {
                  const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
                  const evs = getEvs(day)
                  const isToday = dateStr === todayStr
                  const col = (blanks.length + day - 1) % 7
                  const isWeekend = col === 5 || col === 6
                  const shown = evs.slice(0, 3)
                  const extra = evs.length - 3

                  return (
                    <div
                      key={day}
                      onClick={() => openNew(dateStr)}
                      title="Click para agregar evento en este día"
                      className={`
                        h-20 lg:h-24 flex flex-col items-start justify-start p-1.5
                        border-r border-b border-gray-50 transition-colors
                        ${isWeekend ? 'bg-gray-50/60' : ''}
                        hover:bg-primary/5 cursor-pointer group
                      `}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`
                          w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold flex-shrink-0
                          ${isToday ? 'bg-primary text-white' : 'text-gray-700 group-hover:text-primary'}
                        `}>
                          {day}
                        </span>
                        {evs.length === 0 && (
                          <Plus className="w-3 h-3 text-gray-300 group-hover:text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 w-full">
                        {shown.map(ev => {
                          const s = TIPO_STYLE[ev.tipo] ?? TIPO_STYLE.general
                          return (
                            <button
                              key={ev.id}
                              onClick={(e) => openEdit(ev, e)}
                              title="Click para editar"
                              className={`block w-full rounded px-1 py-0.5 text-[9px] font-medium leading-tight truncate text-left hover:opacity-80 transition-opacity ${s.pill}`}
                            >
                              {ev.titulo}
                            </button>
                          )
                        })}
                        {extra > 0 && (
                          <span className="text-[9px] text-gray-400 font-medium pl-1">+{extra} más</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="text-xs text-gray-400 text-center py-2 border-t border-gray-50">
                Click en un día para agregar · Click en un evento para editar
              </p>
            </div>
          )}

          {/* ── Vista Lista ── */}
          {vista === 'lista' && (
            <>
              {/* Leyenda */}
              <div className="flex flex-wrap gap-2">
                {TIPOS.map(t => {
                  const s = TIPO_STYLE[t.value]
                  return (
                    <span key={t.value} className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.badge}`}>
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      {t.label}
                    </span>
                  )
                })}
              </div>

              {eventos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <CalendarDays className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">No hay eventos aún. Agrega el primero.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {eventos.map(ev => {
                      const s = TIPO_STYLE[ev.tipo] ?? TIPO_STYLE.general
                      return (
                        <div key={ev.id} className="flex items-start gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <span className={`mt-1 flex-shrink-0 w-2.5 h-2.5 rounded-full ${s.dot}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm">{ev.titulo}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatDate(ev.fecha_inicio)}
                              {ev.fecha_fin && ev.fecha_fin !== ev.fecha_inicio && ` → ${formatDate(ev.fecha_fin)}`}
                            </p>
                            {ev.descripcion && (
                              <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{ev.descripcion}</p>
                            )}
                          </div>
                          <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>
                            {TIPOS.find(t => t.value === ev.tipo)?.label ?? ev.tipo}
                          </span>
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={(e) => openEdit(ev, e)} className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setConfirmDelete(ev)} className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> Error al cargar: {error}
        </div>
      )}

      {/* Dialog agregar / editar */}
      <Dialog open={dialogOpen} onOpenChange={open => !open && setDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar evento' : 'Agregar evento'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Título *</label>
              <input
                type="text"
                value={form.titulo}
                onChange={e => setForm(prev => ({ ...prev, titulo: e.target.value }))}
                placeholder="Ej: Inicio clases primer semestre"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Tipo *</label>
              <select
                value={form.tipo}
                onChange={e => setForm(prev => ({ ...prev, tipo: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Fecha inicio *</label>
                <input
                  type="date"
                  value={form.fecha_inicio}
                  onChange={e => setForm(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Fecha fin</label>
                <input
                  type="date"
                  value={form.fecha_fin}
                  min={form.fecha_inicio}
                  onChange={e => setForm(prev => ({ ...prev, fecha_fin: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <p className="text-xs text-gray-400">Opcional</p>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Detalles adicionales (opcional)"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>
            {actionError && (
              <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">{actionError}</p>
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setDialogOpen(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : editing ? 'Guardar cambios' : 'Agregar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <Dialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
        {confirmDelete && (
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>¿Eliminar evento?</DialogTitle></DialogHeader>
            <p className="text-sm text-gray-600">
              <strong>{confirmDelete.titulo}</strong> será eliminado permanentemente.
            </p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button disabled={deletingId === confirmDelete.id} onClick={() => handleDelete(confirmDelete)} className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
                {deletingId === confirmDelete.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Eliminar'}
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
