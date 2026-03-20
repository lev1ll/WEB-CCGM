import { useEffect, useState } from 'react'
import { Search, User, Mail, Phone, GraduationCap, MessageSquare, Calendar, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Preinscripcion, PreinscripcionEstado } from '@/types/noticias.types'
import { formatDate } from '@/lib/utils'

const ESTADOS: { value: PreinscripcionEstado; label: string; color: string; bg: string; border: string; headerBg: string }[] = [
  {
    value: 'pendiente',
    label: 'Pendientes',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    headerBg: 'bg-amber-500',
  },
  {
    value: 'contactado',
    label: 'Contactados',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    headerBg: 'bg-blue-500',
  },
  {
    value: 'matriculado',
    label: 'Matriculados',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    headerBg: 'bg-green-500',
  },
]

const BADGE: Record<PreinscripcionEstado, string> = {
  pendiente: 'bg-amber-100 text-amber-700',
  contactado: 'bg-blue-100 text-blue-700',
  matriculado: 'bg-green-100 text-green-700',
}

const GRADO_LABEL: Record<string, string> = {
  '1basico': '1° Básico', '2basico': '2° Básico', '3basico': '3° Básico',
  '4basico': '4° Básico', '5basico': '5° Básico', '6basico': '6° Básico',
  '7basico': '7° Básico', '8basico': '8° Básico',
}

export default function AdminPreinscripciones() {
  const { select, update, isLoading, error } = useSupabaseQuery()
  const [items, setItems] = useState<Preinscripcion[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Preinscripcion | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)

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

  const q = search.toLowerCase()
  const filtered = items.filter(p =>
    !q ||
    p.name.toLowerCase().includes(q) ||
    p.child_name.toLowerCase().includes(q) ||
    p.email.toLowerCase().includes(q)
  )

  const byEstado = (estado: PreinscripcionEstado) => filtered.filter(p => p.estado === estado)

  return (
    <div className="space-y-6">
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

      {/* Error update */}
      {updateError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {updateError}
        </div>
      )}

      {/* Loading */}
      {isLoading && items.length === 0 && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
        </div>
      )}

      {/* Kanban columns */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {ESTADOS.map(col => {
            const rows = byEstado(col.value)
            return (
              <div key={col.value} className={`rounded-xl border ${col.border} overflow-hidden`}>
                {/* Column header */}
                <div className={`${col.headerBg} px-4 py-3 flex items-center justify-between`}>
                  <span className="text-white font-semibold text-sm">{col.label}</span>
                  <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {rows.length}
                  </span>
                </div>

                {/* Cards */}
                <div className={`${col.bg} min-h-32 p-3 space-y-2.5`}>
                  {rows.length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-6">Sin registros</p>
                  )}
                  {rows.map(p => (
                    <div
                      key={p.id}
                      className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Name + detail link */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{p.child_name}</p>
                          <p className="text-xs text-gray-500">{p.name}</p>
                        </div>
                        <button
                          onClick={() => setSelected(p)}
                          className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                          title="Ver detalle"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                        <GraduationCap className="w-3 h-3" />
                        {GRADO_LABEL[p.current_grade] ?? p.current_grade}
                        <span className="mx-1">·</span>
                        <Calendar className="w-3 h-3" />
                        {formatDate(p.created_at)}
                      </div>

                      {/* Move to estado buttons */}
                      <div className="flex gap-1.5">
                        {ESTADOS.filter(e => e.value !== col.value).map(target => (
                          <button
                            key={target.value}
                            disabled={updatingId === p.id}
                            onClick={() => handleEstadoChange(p, target.value)}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-colors
                              ${target.color} ${target.bg} ${target.border}
                              hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {updatingId === p.id
                              ? <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                              : `→ ${target.label.replace('s', '')}`
                            }
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Error general (fetch) */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Error al cargar: {error}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Postulación — {selected.child_name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              {/* Estado actual */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Estado actual</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize ${BADGE[selected.estado]}`}>
                  {selected.estado}
                </span>
              </div>

              {/* Cambiar estado */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mover a</p>
                <div className="flex gap-2">
                  {ESTADOS.filter(e => e.value !== selected.estado).map(target => (
                    <button
                      key={target.value}
                      disabled={updatingId === selected.id}
                      onClick={() => handleEstadoChange(selected, target.value)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors
                        ${target.color} ${target.bg} ${target.border}
                        hover:opacity-80 disabled:opacity-50`}
                    >
                      {updatingId === selected.id
                        ? <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                        : target.label
                      }
                    </button>
                  ))}
                </div>
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
                <InfoSection title="Mensaje">
                  <div className="flex gap-2 text-gray-700">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
                    <p>{selected.message}</p>
                  </div>
                </InfoSection>
              )}

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
