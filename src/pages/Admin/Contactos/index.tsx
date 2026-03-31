import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search, Trash2, Loader2,
  AlertCircle, ChevronRight, StickyNote, Save, Check,
} from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Preinscripcion, PreinscripcionEstado } from '@/types/noticias.types'
import { formatDate } from '@/lib/utils'

const ESTADOS_PI: {
  value: PreinscripcionEstado
  label: string
  // badge selector inline
  color: string; bg: string; border: string
  // KPI card (solid)
  kpiBg: string; kpiNumColor: string; kpiLabelColor: string
}[] = [
  { value: 'pendiente',           label: 'Pendiente',           color: 'text-slate-800',  bg: 'bg-slate-200',   border: 'border-slate-300',   kpiBg: 'bg-slate-600',    kpiNumColor: 'text-white',       kpiLabelColor: 'text-slate-200'  },
  { value: 'llamar_mas_tarde',    label: 'Llamar más tarde',    color: 'text-orange-900', bg: 'bg-orange-200',  border: 'border-orange-300',  kpiBg: 'bg-orange-500',   kpiNumColor: 'text-white',       kpiLabelColor: 'text-orange-100' },
  { value: 'no_contesta',         label: 'No contesta',         color: 'text-red-900',    bg: 'bg-red-200',     border: 'border-red-300',     kpiBg: 'bg-red-600',      kpiNumColor: 'text-white',       kpiLabelColor: 'text-red-100'    },
  { value: 'entrevista_agendada', label: 'Entrevista agendada', color: 'text-purple-900', bg: 'bg-purple-200',  border: 'border-purple-300',  kpiBg: 'bg-purple-600',   kpiNumColor: 'text-white',       kpiLabelColor: 'text-purple-100' },
  { value: 'contactado',          label: 'Contactado',          color: 'text-blue-900',   bg: 'bg-blue-200',    border: 'border-blue-300',    kpiBg: 'bg-blue-600',     kpiNumColor: 'text-white',       kpiLabelColor: 'text-blue-100'   },
  { value: 'matriculado',         label: 'Matriculado',         color: 'text-green-900',  bg: 'bg-green-200',   border: 'border-green-300',   kpiBg: 'bg-green-600',    kpiNumColor: 'text-white',       kpiLabelColor: 'text-green-100'  },
  { value: 'descartado',          label: 'Descartado',          color: 'text-gray-700',   bg: 'bg-gray-200',    border: 'border-gray-300',    kpiBg: 'bg-gray-400',     kpiNumColor: 'text-white',       kpiLabelColor: 'text-gray-100'   },
]

const ESTADO_MAP = Object.fromEntries(ESTADOS_PI.map(e => [e.value, e])) as Record<PreinscripcionEstado, typeof ESTADOS_PI[0]>

const GRADO: Record<string, string> = {
  '1basico': '1° Básico', '2basico': '2° Básico', '3basico': '3° Básico', '4basico': '4° Básico',
  '5basico': '5° Básico', '6basico': '6° Básico', '7basico': '7° Básico', '8basico': '8° Básico',
}

export default function AdminContactos() {
  const { select, update, remove, isLoading, error } = useSupabaseQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState<Preinscripcion[]>([])
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState<PreinscripcionEstado | 'todos'>('todos')
  const [selected, setSelected] = useState<Preinscripcion | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Preinscripcion | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [notasDraft, setNotasDraft] = useState('')
  const [savingNotas, setSavingNotas] = useState(false)
  const [notasSaved, setNotasSaved] = useState(false)

  useEffect(() => { load() }, [])

  // Auto-abrir contacto si viene desde el panel de notificaciones (?open=ID)
  useEffect(() => {
    const openId = searchParams.get('open')
    if (openId && items.length > 0) {
      const p = items.find(x => x.id === openId)
      if (p) {
        openDetail(p)
        setSearchParams({}, { replace: true })
      }
    }
  }, [searchParams, items])

  async function load() {
    const data = await select<Preinscripcion>('preinscripciones', {
      order: { column: 'created_at', ascending: false },
    })
    setItems(data)
  }

  async function changeEstado(p: Preinscripcion, estado: PreinscripcionEstado) {
    if (p.estado === estado) return
    setLoadingId(p.id)
    setActionError(null)
    const r = await update('preinscripciones', p.id, { estado } as Record<string, unknown>)
    if (r.success) {
      setItems(prev => prev.map(x => x.id === p.id ? { ...x, estado } : x))
      setSelected(prev => prev?.id === p.id ? { ...prev, estado } : prev)
    } else {
      setActionError(r.error ?? 'Error al actualizar')
    }
    setLoadingId(null)
  }

  async function handleDelete(p: Preinscripcion) {
    setLoadingId(p.id)
    const r = await remove('preinscripciones', p.id)
    if (r.success) {
      setItems(prev => prev.filter(x => x.id !== p.id))
      if (selected?.id === p.id) setSelected(null)
    } else {
      setActionError(r.error ?? 'Error al eliminar')
    }
    setLoadingId(null)
    setConfirmDelete(null)
  }

  async function handleSaveNotas() {
    if (!selected) return
    setSavingNotas(true)
    const r = await update('preinscripciones', selected.id, { notas: notasDraft } as Record<string, unknown>)
    if (r.success) {
      setItems(prev => prev.map(x => x.id === selected.id ? { ...x, notas: notasDraft } : x))
      setSelected(prev => prev ? { ...prev, notas: notasDraft } : null)
      setNotasSaved(true)
      setTimeout(() => setNotasSaved(false), 2000)
    } else {
      setActionError(r.error ?? 'Error al guardar notas')
    }
    setSavingNotas(false)
  }

  function openDetail(p: Preinscripcion) {
    setSelected(p)
    setNotasDraft(p.notas ?? '')
  }

  const q = search.toLowerCase()
  const filtered = items.filter(p => {
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.child_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
    const matchEstado = filterEstado === 'todos' || p.estado === filterEstado
    return matchSearch && matchEstado
  })

  const countBy = (e: PreinscripcionEstado) => items.filter(p => p.estado === e).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pre-inscripciones</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {items.length} postulación{items.length !== 1 ? 'es' : ''} recibida{items.length !== 1 ? 's' : ''}
            {filterEstado !== 'todos' && (
              <button onClick={() => setFilterEstado('todos')} className="ml-2 text-primary hover:underline text-xs">
                · Ver todas
              </button>
            )}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      {/* KPIs — clickeables para filtrar */}
      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 gap-1.5 sm:gap-2">
        {ESTADOS_PI.map(e => {
          const count = countBy(e.value)
          const active = filterEstado === e.value
          return (
            <button
              key={e.value}
              onClick={() => setFilterEstado(active ? 'todos' : e.value)}
              className={`rounded-xl px-1.5 py-2.5 sm:px-3 sm:py-4 text-center transition-all hover:shadow-lg hover:scale-[1.03]
                ${active ? `${e.kpiBg} shadow-lg scale-[1.03]` : 'bg-white border border-gray-200 hover:border-transparent'}`}
            >
              <p className={`text-xl sm:text-3xl font-extrabold leading-none ${active ? e.kpiNumColor : 'text-gray-300'}`}>
                {count}
              </p>
              <p className={`text-[8px] sm:text-[10px] font-semibold mt-1.5 leading-tight ${active ? e.kpiLabelColor : 'text-gray-400'}`}>
                {e.label}
              </p>
            </button>
          )
        })}
      </div>

      {(actionError || error) && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {actionError || error}
        </div>
      )}

      {isLoading && items.length === 0 && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-12">No hay resultados.</p>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="text-left px-4 py-3">Postulante</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Fecha</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => {
                const est = ESTADO_MAP[p.estado]
                const busy = loadingId === p.id
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{p.child_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {p.name} · {GRADO[p.current_grade] ?? p.current_grade}
                      </p>
                      {p.notas && (
                        <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                          <StickyNote className="w-3 h-3" /> Tiene notas
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openDetail(p)}
                        disabled={busy}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 border transition-colors disabled:opacity-60 hover:opacity-80
                          ${est.bg} ${est.color} ${est.border}`}
                      >
                        {busy ? <Loader2 className="w-3 h-3 animate-spin inline" /> : est.label}
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openDetail(p)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmDelete(p)}
                          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Detalle */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Pre-inscripción — {selected.child_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Estado</p>
                <div className="flex flex-wrap gap-1.5">
                  {ESTADOS_PI.map(e => (
                    <button
                      key={e.value}
                      type="button"
                      disabled={loadingId === selected.id}
                      onClick={() => changeEstado(selected, e.value)}
                      className={`text-xs font-semibold rounded-full px-3 py-1.5 border transition-all disabled:opacity-60
                        ${selected.estado === e.value
                          ? `${e.bg} ${e.color} ${e.border}`
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="border-gray-100" />
              <InfoBlock title="Apoderado">
                <InfoRow label="Nombre" value={selected.name} />
                <InfoRow label="Email" value={selected.email} isEmail />
                {selected.phone && <InfoRow label="Teléfono" value={selected.phone} />}
              </InfoBlock>
              <InfoBlock title="Postulante">
                <InfoRow label="Nombre" value={selected.child_name} />
                <InfoRow label="Curso" value={GRADO[selected.current_grade] ?? selected.current_grade} />
              </InfoBlock>
              {selected.message && (
                <InfoBlock title="Mensaje del apoderado">
                  <p className="text-gray-700">{selected.message}</p>
                </InfoBlock>
              )}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <StickyNote className="w-3.5 h-3.5" /> Notas internas
                </p>
                <textarea
                  value={notasDraft}
                  onChange={e => setNotasDraft(e.target.value)}
                  placeholder="Ej: Llamé el lunes, no contestó. Volver a llamar el miércoles..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-amber-50/50 px-3 py-2.5 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 placeholder:text-gray-400"
                />
                <button
                  onClick={handleSaveNotas}
                  disabled={savingNotas || notasDraft === (selected.notas ?? '')}
                  className={`mt-2 flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                    ${notasSaved ? 'bg-green-500' : 'bg-amber-500 hover:bg-amber-600'}`}
                >
                  {savingNotas
                    ? <Loader2 className="w-3 h-3 animate-spin" />
                    : notasSaved
                      ? <Check className="w-3 h-3" />
                      : <Save className="w-3 h-3" />}
                  {notasSaved ? '¡Guardado!' : 'Guardar nota'}
                </button>
              </div>
              <p className="text-xs text-gray-400">Recibida el {formatDate(selected.created_at)}</p>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Confirmar eliminar */}
      <Dialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
        {confirmDelete && (
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>¿Eliminar pre-inscripción?</DialogTitle></DialogHeader>
            <p className="text-sm text-gray-600">
              La pre-inscripción de <strong>{confirmDelete.child_name}</strong> ({confirmDelete.name}) será eliminada permanentemente.
            </p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button disabled={loadingId === confirmDelete.id} onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
                {loadingId === confirmDelete.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Eliminar'}
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{title}</p>
      <div className="bg-gray-50 rounded-lg px-3 py-2 space-y-1.5">{children}</div>
    </div>
  )
}

function InfoRow({ label, value, isEmail }: { label: string; value: string; isEmail?: boolean }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-500 min-w-16">{label}:</span>
      {isEmail
        ? <a href={`mailto:${value}`} className="text-primary hover:underline font-medium">{value}</a>
        : <span className="text-gray-800 font-medium">{value}</span>}
    </div>
  )
}

