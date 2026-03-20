import { useEffect, useState } from 'react'
import { Search, Mail, Phone, Reply, Trash2, CheckCheck, MailOpen, Loader2, AlertCircle, Clock } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { ContactMessage } from '@/types/noticias.types'
import { formatDate } from '@/lib/utils'

const SUBJECT_LABELS: Record<string, string> = {
  admision: 'Admisión',
  informacion: 'Información general',
  academico: 'Académico',
  otro: 'Otro',
}

export default function AdminMensajes() {
  const { select, update, remove, isLoading, error } = useSupabaseQuery()
  const [items, setItems] = useState<ContactMessage[]>([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<ContactMessage | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const data = await select<ContactMessage>('contact_messages', {
      order: { column: 'created_at', ascending: false },
    })
    setItems(data)
  }

  async function markAtendido(msg: ContactMessage) {
    setLoadingId(msg.id)
    setUpdateError(null)
    const result = await update('contact_messages', msg.id, { leido: true } as Record<string, unknown>)
    if (result.success) {
      setItems(prev => prev.map(m => m.id === msg.id ? { ...m, leido: true } : m))
      if (selected?.id === msg.id) setSelected(prev => prev ? { ...prev, leido: true } : null)
    } else {
      setUpdateError(result.error ?? 'Error al actualizar')
    }
    setLoadingId(null)
  }

  async function markPendiente(msg: ContactMessage) {
    setLoadingId(msg.id)
    setUpdateError(null)
    const result = await update('contact_messages', msg.id, { leido: false } as Record<string, unknown>)
    if (result.success) {
      setItems(prev => prev.map(m => m.id === msg.id ? { ...m, leido: false } : m))
      if (selected?.id === msg.id) setSelected(prev => prev ? { ...prev, leido: false } : null)
    } else {
      setUpdateError(result.error ?? 'Error al actualizar')
    }
    setLoadingId(null)
  }

  async function handleDelete(msg: ContactMessage) {
    setLoadingId(msg.id)
    const result = await remove('contact_messages', msg.id)
    if (result.success) {
      setItems(prev => prev.filter(m => m.id !== msg.id))
      if (selected?.id === msg.id) setSelected(null)
    } else {
      setUpdateError(result.error ?? 'Error al eliminar')
    }
    setLoadingId(null)
    setConfirmDelete(null)
  }

  async function handleOpen(msg: ContactMessage) {
    setSelected(msg)
    if (!msg.leido) await markAtendido(msg)
  }

  const q = search.toLowerCase()
  const filtered = items.filter(m =>
    !q ||
    m.name.toLowerCase().includes(q) ||
    m.email.toLowerCase().includes(q) ||
    m.subject.toLowerCase().includes(q)
  )

  const pendientes = filtered.filter(m => !m.leido)
  const atendidos  = filtered.filter(m => m.leido)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Contacto
            {pendientes.length > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                {pendientes.length}
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Mensajes del formulario de contacto</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o asunto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      {/* Errors */}
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

      {/* Two columns */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Pendientes */}
          <div className="rounded-xl border border-orange-200 overflow-hidden">
            <div className="bg-orange-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Clock className="w-4 h-4" />
                <span className="font-semibold text-sm">Por atender</span>
              </div>
              <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {pendientes.length}
              </span>
            </div>
            <div className="bg-orange-50 min-h-32 p-3 space-y-2.5">
              {pendientes.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-6">Sin mensajes pendientes</p>
              )}
              {pendientes.map(m => (
                <MensajeCard
                  key={m.id}
                  msg={m}
                  loadingId={loadingId}
                  onOpen={() => handleOpen(m)}
                  onAtendido={() => markAtendido(m)}
                  onDelete={() => setConfirmDelete(m)}
                />
              ))}
            </div>
          </div>

          {/* Atendidos */}
          <div className="rounded-xl border border-green-200 overflow-hidden">
            <div className="bg-green-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <CheckCheck className="w-4 h-4" />
                <span className="font-semibold text-sm">Atendidos</span>
              </div>
              <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {atendidos.length}
              </span>
            </div>
            <div className="bg-green-50 min-h-32 p-3 space-y-2.5">
              {atendidos.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-6">Sin mensajes atendidos</p>
              )}
              {atendidos.map(m => (
                <MensajeCard
                  key={m.id}
                  msg={m}
                  loadingId={loadingId}
                  onOpen={() => setSelected(m)}
                  onPendiente={() => markPendiente(m)}
                  onDelete={() => setConfirmDelete(m)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Error al cargar: {error}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MailOpen className="w-4 h-4 text-primary" />
                {SUBJECT_LABELS[selected.subject] ?? selected.subject}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              <div className="bg-gray-50 rounded-lg px-4 py-3 space-y-2">
                <InfoRow label="De" value={selected.name} />
                <InfoRow label="Email" value={selected.email} isEmail />
                {selected.phone && <InfoRow label="Teléfono" value={selected.phone} />}
                <InfoRow label="Fecha" value={formatDate(selected.created_at)} />
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mensaje</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg px-4 py-3">
                  {selected.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${SUBJECT_LABELS[selected.subject] ?? selected.subject} — CCGM`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Reply className="w-4 h-4" /> Responder por email
                </a>
                {selected.leido ? (
                  <button
                    onClick={() => markPendiente(selected)}
                    className="px-4 py-2.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 text-sm font-semibold hover:bg-orange-100 transition-colors"
                  >
                    Marcar pendiente
                  </button>
                ) : (
                  <button
                    onClick={() => markAtendido(selected)}
                    className="px-4 py-2.5 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors"
                  >
                    Marcar atendido
                  </button>
                )}
                <button
                  onClick={() => { setSelected(null); setConfirmDelete(selected) }}
                  className="px-3 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Confirm delete dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
        {confirmDelete && (
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>¿Eliminar mensaje?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">
              El mensaje de <strong>{confirmDelete.name}</strong> será eliminado permanentemente.
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                disabled={loadingId === confirmDelete.id}
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loadingId === confirmDelete.id
                  ? <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  : 'Eliminar'
                }
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

function MensajeCard({
  msg, loadingId, onOpen, onAtendido, onPendiente, onDelete,
}: {
  msg: ContactMessage
  loadingId: string | null
  onOpen: () => void
  onAtendido?: () => void
  onPendiente?: () => void
  onDelete: () => void
}) {
  const isLoading = loadingId === msg.id
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm hover:shadow-md transition-shadow">
      <button onClick={onOpen} className="w-full text-left mb-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-900 text-sm leading-tight">{msg.name}</p>
          <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(msg.created_at)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
          <Mail className="w-3 h-3" /> {msg.email}
          {msg.phone && <><span className="mx-1">·</span><Phone className="w-3 h-3" /> {msg.phone}</>}
        </p>
        <p className="text-sm text-gray-600 mt-1.5 font-medium">
          {SUBJECT_LABELS[msg.subject] ?? msg.subject}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{msg.message}</p>
      </button>

      <div className="flex gap-1.5 mt-3">
        <a
          href={`mailto:${msg.email}?subject=Re: ${SUBJECT_LABELS[msg.subject] ?? msg.subject} — CCGM`}
          onClick={e => e.stopPropagation()}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          <Reply className="w-3 h-3" /> Responder
        </a>
        {onAtendido && (
          <button
            disabled={isLoading}
            onClick={onAtendido}
            className="flex-1 py-1.5 text-xs font-semibold rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : '✓ Atendido'}
          </button>
        )}
        {onPendiente && (
          <button
            disabled={isLoading}
            onClick={onPendiente}
            className="flex-1 py-1.5 text-xs font-semibold rounded-md bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : '↩ Pendiente'}
          </button>
        )}
        <button
          onClick={onDelete}
          className="px-2.5 py-1.5 text-xs font-semibold rounded-md bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, value, isEmail }: { label: string; value: string; isEmail?: boolean }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-500 min-w-16">{label}:</span>
      {isEmail
        ? <a href={`mailto:${value}`} className="text-primary hover:underline font-medium">{value}</a>
        : <span className="text-gray-800 font-medium">{value}</span>
      }
    </div>
  )
}
