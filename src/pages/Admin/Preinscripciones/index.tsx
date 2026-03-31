import { useEffect, useState } from 'react'
import {
  Search, User, Mail, Phone, GraduationCap, MessageSquare,
  Calendar, ChevronRight, Loader2, AlertCircle, StickyNote, Save,
} from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Preinscripcion, PreinscripcionEstado } from '@/types/noticias.types'
import { formatDate } from '@/lib/utils'

// ── Configuración de estados ──────────────────────────────────────────────
const ESTADOS: {
  value: PreinscripcionEstado
  label: string
  color: string
  bg: string
  border: string
  dot: string
}[] = [
  { value: 'pendiente',           label: 'Pendiente',            color: 'text-slate-700',  bg: 'bg-slate-100',   border: 'border-slate-200', dot: 'bg-slate-400'   },
  { value: 'llamar_mas_tarde',    label: 'Llamar más tarde',     color: 'text-orange-700', bg: 'bg-orange-50',   border: 'border-orange-200',dot: 'bg-orange-400'  },
  { value: 'no_contesta',         label: 'No contesta',          color: 'text-red-700',    bg: 'bg-red-50',      border: 'border-red-200',   dot: 'bg-red-400'     },
  { value: 'entrevista_agendada', label: 'Entrevista agendada',  color: 'text-purple-700', bg: 'bg-purple-50',   border: 'border-purple-200',dot: 'bg-purple-400'  },
  { value: 'contactado',          label: 'Contactado',           color: 'text-blue-700',   bg: 'bg-blue-50',     border: 'border-blue-200',  dot: 'bg-blue-400'    },
  { value: 'matriculado',         label: 'Matriculado',          color: 'text-green-700',  bg: 'bg-green-50',    border: 'border-green-200', dot: 'bg-green-500'   },
  { value: 'descartado',          label: 'Descartado',           color: 'text-gray-500',   bg: 'bg-gray-50',     border: 'border-gray-200',  dot: 'bg-gray-400'    },
]

const ESTADO_MAP = Object.fromEntries(ESTADOS.map(e => [e.value, e])) as Record<PreinscripcionEstado, typeof ESTADOS[0]>

const GRADO_LABEL: Record<string, string> = {
  '1basico': '1° Básico', '2basico': '2° Básico', '3basico': '3° Básico', '4basico': '4° Básico',
  '5basico': '5° Básico', '6basico': '6° Básico', '7basico': '7° Básico', '8basico': '8° Básico',
}

// ── Estados que se usan como columnas kanban ──────────────────────────────
const COLUMNAS: PreinscripcionEstado[] = ['pendiente', 'llamar_mas_tarde', 'no_contesta', 'entrevista_agendada', 'contactado', 'matriculado', 'descartado']

export default function AdminPreinscripciones() {
  const { select, update, isLoading, error } = useSupabaseQuery()
  const [items, setItems] = useState<Preinscripcion[]>([])
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState<PreinscripcionEstado | 'todos'>('todos')
  const [selected, setSelected] = useState<Preinscripcion | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [notasDraft, setNotasDraft] = useState('')
  const [savingNotas, setSavingNotas] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const data = await select<Preinscripcion>('preinscripciones', {
      order: { column: 'created_at', ascending: false },
    })
    setItems(data)
  }

  async function handleEstadoChange(p: Preinscripcion, estado: PreinscripcionEstado) {
    if (p.estado === estado) return
    setUpdatingId(p.id)
    setUpdateError(null)
    const result = await update('preinscripciones', p.id, { estado } as Record<string, unknown>)
    if (result.success) {
      setItems(prev => prev.map(x => x.id === p.id ? { ...x, estado } : x))
      if (selected?.id === p.id) setSelected(prev => prev ? { ...prev, estado } : null)
    } else {
      setUpdateError(result.error ?? 'Error al actualizar')
    }
    setUpdatingId(null)
  }

  async function handleSaveNotas() {
    if (!selected) return
    setSavingNotas(true)
    const result = await update('preinscripciones', selected.id, { notas: notasDraft } as Record<string, unknown>)
    if (result.success) {
      setItems(prev => prev.map(x => x.id === selected.id ? { ...x, notas: notasDraft } : x))
      setSelected(prev => prev ? { ...prev, notas: notasDraft } : null)
    } else {
      setUpdateError(result.error ?? 'Error al guardar notas')
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

  const countByEstado = (e: PreinscripcionEstado) => items.filter(p => p.estado === e).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Pre-inscripciones</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {items.length} postulación{items.length !== 1 ? 'es' : ''} recibida{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
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

      {/* Filtros por estado */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterEstado('todos')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
            ${filterEstado === 'todos' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
        >
          Todos ({items.length})
        </button>
        {ESTADOS.map(e => {
          const count = countByEstado(e.value)
          if (count === 0) return null
          return (
            <button
              key={e.value}
              onClick={() => setFilterEstado(filterEstado === e.value ? 'todos' : e.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                ${filterEstado === e.value ? `${e.bg} ${e.color} ${e.border}` : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${e.dot}`} />
              {e.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Error */}
      {(updateError || error) && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {updateError || error}
        </div>
      )}

      {/* Loading */}
      {isLoading && items.length === 0 && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
        </div>
      )}

      {/* Lista */}
      {!isLoading && filtered.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-12">No hay resultados.</p>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[540px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="text-left px-4 py-3">Postulante</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Apoderado</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Curso</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Fecha</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => {
                const est = ESTADO_MAP[p.estado]
                const isUpdating = updatingId === p.id
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{p.child_name}</p>
                      {p.notas && (
                        <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                          <StickyNote className="w-3 h-3" /> Tiene notas
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{p.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                      {GRADO_LABEL[p.current_grade] ?? p.current_grade}
                    </td>
                    <td className="px-4 py-3">
                      {/* Selector de estado inline */}
                      <select
                        value={p.estado}
                        disabled={isUpdating}
                        onChange={e => handleEstadoChange(p, e.target.value as PreinscripcionEstado)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border appearance-none cursor-pointer
                          disabled:opacity-60 ${est.color} ${est.bg} ${est.border}`}
                      >
                        {ESTADOS.map(e => (
                          <option key={e.value} value={e.value}>{e.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openDetail(p)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors opacity-0 group-hover:opacity-100"
                        title="Ver detalle"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Resumen rápido por estado */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {ESTADOS.map(e => (
          <button
            key={e.value}
            onClick={() => setFilterEstado(e.value)}
            className={`rounded-xl border px-3 py-3 text-center transition-all hover:shadow-sm
              ${filterEstado === e.value ? `${e.bg} ${e.border} shadow-sm` : 'bg-white border-gray-100 hover:border-gray-200'}`}
          >
            <p className={`text-2xl font-extrabold ${filterEstado === e.value ? e.color : 'text-gray-700'}`}>
              {countByEstado(e.value)}
            </p>
            <p className="text-[10px] text-gray-500 mt-1 leading-tight">{e.label}</p>
          </button>
        ))}
      </div>

      {/* Detalle modal */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Postulación — {selected.child_name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              {/* Estado */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Estado</p>
                <select
                  value={selected.estado}
                  disabled={updatingId === selected.id}
                  onChange={e => handleEstadoChange(selected, e.target.value as PreinscripcionEstado)}
                  className={`text-sm font-semibold rounded-lg px-4 py-2 border appearance-none cursor-pointer w-full
                    ${ESTADO_MAP[selected.estado].color} ${ESTADO_MAP[selected.estado].bg} ${ESTADO_MAP[selected.estado].border}`}
                >
                  {ESTADOS.map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>

              <hr className="border-gray-100" />

              {/* Info apoderado */}
              <InfoSection title="Apoderado">
                <InfoRow icon={<User className="w-3.5 h-3.5" />} value={selected.name} />
                <InfoRow icon={<Mail className="w-3.5 h-3.5" />} value={selected.email} />
                {selected.phone && <InfoRow icon={<Phone className="w-3.5 h-3.5" />} value={selected.phone} />}
              </InfoSection>

              {/* Info alumno */}
              <InfoSection title="Postulante">
                <InfoRow icon={<User className="w-3.5 h-3.5" />} value={selected.child_name} />
                <InfoRow icon={<GraduationCap className="w-3.5 h-3.5" />} value={GRADO_LABEL[selected.current_grade] ?? selected.current_grade} />
              </InfoSection>

              {selected.message && (
                <InfoSection title="Mensaje del apoderado">
                  <div className="flex gap-2 text-gray-700">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
                    <p>{selected.message}</p>
                  </div>
                </InfoSection>
              )}

              {/* Notas internas */}
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
                  className="mt-2 flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingNotas ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                  Guardar nota
                </button>
              </div>

              <p className="text-xs text-gray-400">Recibida el {formatDate(selected.created_at)}</p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{title}</p>
      <div className="bg-gray-50 rounded-lg px-3 py-2 space-y-1.5">{children}</div>
    </div>
  )
}

function InfoRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-700 text-sm">
      <span className="text-gray-400">{icon}</span>
      {value}
    </div>
  )
}
