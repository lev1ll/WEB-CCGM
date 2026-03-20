import { useEffect, useState } from 'react'
import {
  Search, Mail, Phone, Trash2, CheckCheck, Loader2,
  AlertCircle, Clock, GraduationCap, Calendar, ChevronRight,
  UserPlus, MessageSquare, ArrowRightLeft,
} from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Preinscripcion, PreinscripcionEstado, ContactMessage } from '@/types/noticias.types'
import { formatDate } from '@/lib/utils'

// ─── Pre-inscripciones config ────────────────────────────────────────────────

const KANBAN_COLS: {
  value: PreinscripcionEstado
  label: string
  color: string
  bg: string
  border: string
  headerBg: string
}[] = [
  { value: 'pendiente',  label: 'Pendientes',  color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200', headerBg: 'bg-amber-500'  },
  { value: 'contactado', label: 'Contactados', color: 'text-blue-700',  bg: 'bg-blue-50',   border: 'border-blue-200',  headerBg: 'bg-blue-500'   },
  { value: 'matriculado',label: 'Matriculados',color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200', headerBg: 'bg-green-500'  },
]

const BADGE_PI: Record<PreinscripcionEstado, string> = {
  pendiente:  'bg-amber-100 text-amber-700',
  contactado: 'bg-blue-100 text-blue-700',
  matriculado:'bg-green-100 text-green-700',
}

const GRADO: Record<string, string> = {
  '1basico':'1° Básico','2basico':'2° Básico','3basico':'3° Básico','4basico':'4° Básico',
  '5basico':'5° Básico','6basico':'6° Básico','7basico':'7° Básico','8basico':'8° Básico',
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminContactos() {
  const { select, update, remove, bulkInsert, isLoading, error } = useSupabaseQuery()

  // tabs
  const [tab, setTab] = useState<'preinscripciones' | 'mensajes'>('preinscripciones')

  // pre-inscripciones
  const [inscripciones, setInscripciones] = useState<Preinscripcion[]>([])
  const [searchPI, setSearchPI] = useState('')
  const [selectedPI, setSelectedPI] = useState<Preinscripcion | null>(null)

  // mensajes
  const [mensajes, setMensajes] = useState<ContactMessage[]>([])
  const [searchMsg, setSearchMsg] = useState('')
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null)
  const [confirmDeleteMsg, setConfirmDeleteMsg] = useState<ContactMessage | null>(null)

  // shared loading
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const [pi, msg] = await Promise.all([
      select<Preinscripcion>('preinscripciones', { order: { column: 'created_at', ascending: false } }),
      select<ContactMessage>('contact_messages', { order: { column: 'created_at', ascending: false } }),
    ])
    setInscripciones(pi)
    setMensajes(msg)
  }

  // ── Preinscripciones actions ──────────────────────────────────────────────

  async function changeEstado(p: Preinscripcion, estado: PreinscripcionEstado) {
    if (p.estado === estado) return
    setLoadingId(p.id)
    setActionError(null)
    const r = await update('preinscripciones', p.id, { estado } as Record<string, unknown>)
    if (r.success) {
      setInscripciones(prev => prev.map(x => x.id === p.id ? { ...x, estado } : x))
      setSelectedPI(prev => prev?.id === p.id ? { ...prev, estado } : prev)
    } else {
      setActionError(r.error ?? 'Error al actualizar')
    }
    setLoadingId(null)
  }

  // ── Convertir mensaje → preinscripción ───────────────────────────────────

  async function convertirAPreinscripcion(m: ContactMessage) {
    setLoadingId(m.id + '_conv')
    setActionError(null)
    // Verificar si ya existe una preinscripción con ese email
    const existing = await select<Preinscripcion>('preinscripciones', {
      filter: { email: m.email },
    })
    if (existing.length > 0) {
      setActionError(`Ya existe una pre-inscripción para ${m.email}`)
      setLoadingId(null)
      return
    }
    const r = await bulkInsert('preinscripciones', [{
      name: m.name,
      email: m.email,
      phone: m.phone ?? '',
      child_name: 'Por definir',
      current_grade: '1basico',
      message: `Desde formulario de contacto:\n${m.message}`,
      estado: 'pendiente',
    }])
    if (r.success) {
      await update('contact_messages', m.id, { leido: true } as Record<string, unknown>)
      setMensajes(prev => prev.map(x => x.id === m.id ? { ...x, leido: true } : x))
      const pi = await select<Preinscripcion>('preinscripciones', { order: { column: 'created_at', ascending: false } })
      setInscripciones(pi)
      setTab('preinscripciones')
    } else {
      setActionError(r.error ?? 'Error al convertir')
    }
    setLoadingId(null)
  }

  // ── Mensajes actions ──────────────────────────────────────────────────────

  async function markAtendido(m: ContactMessage) {
    setLoadingId(m.id)
    setActionError(null)
    const r = await update('contact_messages', m.id, { leido: true } as Record<string, unknown>)
    if (r.success) {
      setMensajes(prev => prev.map(x => x.id === m.id ? { ...x, leido: true } : x))
      setSelectedMsg(prev => prev?.id === m.id ? { ...prev, leido: true } : prev)
    } else { setActionError(r.error ?? 'Error') }
    setLoadingId(null)
  }

  async function markPendiente(m: ContactMessage) {
    setLoadingId(m.id)
    setActionError(null)
    const r = await update('contact_messages', m.id, { leido: false } as Record<string, unknown>)
    if (r.success) {
      setMensajes(prev => prev.map(x => x.id === m.id ? { ...x, leido: false } : x))
      setSelectedMsg(prev => prev?.id === m.id ? { ...prev, leido: false } : prev)
    } else { setActionError(r.error ?? 'Error') }
    setLoadingId(null)
  }

  async function deleteMsg(m: ContactMessage) {
    setLoadingId(m.id)
    const r = await remove('contact_messages', m.id)
    if (r.success) {
      setMensajes(prev => prev.filter(x => x.id !== m.id))
      if (selectedMsg?.id === m.id) setSelectedMsg(null)
    } else { setActionError(r.error ?? 'Error') }
    setLoadingId(null)
    setConfirmDeleteMsg(null)
  }

  async function openMsg(m: ContactMessage) {
    setSelectedMsg(m)
    if (!m.leido) await markAtendido(m)
  }

  // ── Filtered lists ────────────────────────────────────────────────────────

  const qPI  = searchPI.toLowerCase()
  const filteredPI = inscripciones.filter(p =>
    !qPI || p.name.toLowerCase().includes(qPI) ||
    p.child_name.toLowerCase().includes(qPI) || p.email.toLowerCase().includes(qPI)
  )

  const qMsg = searchMsg.toLowerCase()
  const filteredMsg = mensajes.filter(m =>
    !qMsg || m.name.toLowerCase().includes(qMsg) ||
    m.email.toLowerCase().includes(qMsg) || m.subject.toLowerCase().includes(qMsg)
  )

  const pendientesMsg = filteredMsg.filter(m => !m.leido)
  const atendidosMsg  = filteredMsg.filter(m => m.leido)
  const totalUnread   = mensajes.filter(m => !m.leido).length
  const totalPendPI   = inscripciones.filter(p => p.estado === 'pendiente').length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contactos</h1>
        <p className="text-sm text-gray-500 mt-0.5">Pre-inscripciones y mensajes del sitio web</p>
      </div>

      {actionError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {actionError}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <TabBtn
          active={tab === 'preinscripciones'}
          onClick={() => setTab('preinscripciones')}
          icon={<UserPlus className="w-4 h-4" />}
          label="Pre-inscripciones"
          badge={totalPendPI}
        />
        <TabBtn
          active={tab === 'mensajes'}
          onClick={() => setTab('mensajes')}
          icon={<MessageSquare className="w-4 h-4" />}
          label="Mensajes"
          badge={totalUnread}
        />
      </div>

      {/* ══ PRE-INSCRIPCIONES TAB ══════════════════════════════════════════ */}
      {tab === 'preinscripciones' && (
        <>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchPI}
              onChange={e => setSearchPI(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          {isLoading && inscripciones.length === 0 ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {KANBAN_COLS.map(col => {
                const rows = filteredPI.filter(p => p.estado === col.value)
                return (
                  <div key={col.value} className={`rounded-xl border ${col.border} overflow-hidden`}>
                    <div className={`${col.headerBg} px-4 py-3 flex items-center justify-between`}>
                      <span className="text-white font-semibold text-sm">{col.label}</span>
                      <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">{rows.length}</span>
                    </div>
                    <div className={`${col.bg} min-h-32 p-3 space-y-2.5`}>
                      {rows.length === 0 && <p className="text-center text-xs text-gray-400 py-6">Sin registros</p>}
                      {rows.map(p => (
                        <div key={p.id} className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm leading-tight">{p.child_name}</p>
                              <p className="text-xs text-gray-500">{p.name}</p>
                            </div>
                            <button
                              onClick={() => setSelectedPI(p)}
                              className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                            <GraduationCap className="w-3 h-3" />
                            {GRADO[p.current_grade] ?? p.current_grade}
                            <span className="mx-1">·</span>
                            <Calendar className="w-3 h-3" />
                            {formatDate(p.created_at)}
                          </div>
                          <div className="flex gap-1.5">
                            {KANBAN_COLS.filter(c => c.value !== col.value).map(target => (
                              <button
                                key={target.value}
                                disabled={loadingId === p.id}
                                onClick={() => changeEstado(p, target.value)}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-colors
                                  ${target.color} ${target.bg} ${target.border}
                                  hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {loadingId === p.id
                                  ? <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                                  : `→ ${target.label.slice(0, -1)}`}
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
        </>
      )}

      {/* ══ MENSAJES TAB ═══════════════════════════════════════════════════ */}
      {tab === 'mensajes' && (
        <>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o asunto..."
              value={searchMsg}
              onChange={e => setSearchMsg(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          {isLoading && mensajes.length === 0 ? (
            <Loading />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Por atender */}
              <KanbanCol title="Por atender" count={pendientesMsg.length} headerBg="bg-orange-500" border="border-orange-200" bg="bg-orange-50" icon={<Clock className="w-4 h-4" />}>
                {pendientesMsg.length === 0 && <p className="text-center text-xs text-gray-400 py-6">Sin mensajes pendientes</p>}
                {pendientesMsg.map(m => (
                  <MsgCard key={m.id} msg={m} loadingId={loadingId}
                    onOpen={() => openMsg(m)}
                    onAtendido={() => markAtendido(m)}
                    onConvertir={() => convertirAPreinscripcion(m)}
                    onDelete={() => setConfirmDeleteMsg(m)}
                  />
                ))}
              </KanbanCol>

              {/* Atendidos */}
              <KanbanCol title="Atendidos" count={atendidosMsg.length} headerBg="bg-green-500" border="border-green-200" bg="bg-green-50" icon={<CheckCheck className="w-4 h-4" />}>
                {atendidosMsg.length === 0 && <p className="text-center text-xs text-gray-400 py-6">Sin mensajes atendidos</p>}
                {atendidosMsg.map(m => (
                  <MsgCard key={m.id} msg={m} loadingId={loadingId}
                    onOpen={() => setSelectedMsg(m)}
                    onPendiente={() => markPendiente(m)}
                    onConvertir={() => convertirAPreinscripcion(m)}
                    onDelete={() => setConfirmDeleteMsg(m)}
                  />
                ))}
              </KanbanCol>
            </div>
          )}
        </>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> Error al cargar: {error}
        </div>
      )}

      {/* ── Dialog detalle pre-inscripción ─────────────────────────────── */}
      <Dialog open={!!selectedPI} onOpenChange={open => !open && setSelectedPI(null)}>
        {selectedPI && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Pre-inscripción — {selectedPI.child_name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Estado actual</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize ${BADGE_PI[selectedPI.estado]}`}>
                  {selectedPI.estado}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mover a</p>
                <div className="flex gap-2">
                  {KANBAN_COLS.filter(c => c.value !== selectedPI.estado).map(target => (
                    <button
                      key={target.value}
                      disabled={loadingId === selectedPI.id}
                      onClick={() => changeEstado(selectedPI, target.value)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${target.color} ${target.bg} ${target.border} hover:opacity-80 disabled:opacity-50`}
                    >
                      {loadingId === selectedPI.id ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : target.label}
                    </button>
                  ))}
                </div>
              </div>
              <hr className="border-gray-100" />
              <InfoBlock title="Apoderado">
                <InfoRow label="Nombre" value={selectedPI.name} />
                <InfoRow label="Email"  value={selectedPI.email} isEmail />
                {selectedPI.phone && <InfoRow label="Teléfono" value={selectedPI.phone} />}
              </InfoBlock>
              <InfoBlock title="Postulante">
                <InfoRow label="Nombre" value={selectedPI.child_name} />
                <InfoRow label="Curso"  value={GRADO[selectedPI.current_grade] ?? selectedPI.current_grade} />
              </InfoBlock>
              {selectedPI.message && (
                <InfoBlock title="Mensaje">
                  <p className="text-gray-700">{selectedPI.message}</p>
                </InfoBlock>
              )}
              <p className="text-xs text-gray-400">Recibida el {formatDate(selectedPI.created_at)}</p>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ── Dialog detalle mensaje ─────────────────────────────────────── */}
      <Dialog open={!!selectedMsg} onOpenChange={open => !open && setSelectedMsg(null)}>
        {selectedMsg && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedMsg.subject}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm">
              <div className="bg-gray-50 rounded-lg px-4 py-3 space-y-2">
                <InfoRow label="De"       value={selectedMsg.name} />
                <InfoRow label="Email"    value={selectedMsg.email} isEmail />
                {selectedMsg.phone && <InfoRow label="Teléfono" value={selectedMsg.phone} />}
                <InfoRow label="Fecha"    value={formatDate(selectedMsg.created_at)} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mensaje</p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg px-4 py-3">
                  {selectedMsg.message}
                </p>
              </div>
              {/* Email buttons */}
              <div className="flex gap-2">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedMsg.email}&su=Re: ${encodeURIComponent(selectedMsg.subject + ' — CCGM')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  <Mail className="w-4 h-4" /> Responder por Gmail
                </a>
              </div>
              {/* Convert + state + delete */}
              <div className="flex gap-2">
                <button
                  disabled={loadingId === selectedMsg.id + '_conv'}
                  onClick={() => { setSelectedMsg(null); convertirAPreinscripcion(selectedMsg) }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  {loadingId === selectedMsg.id + '_conv'
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <><ArrowRightLeft className="w-4 h-4" /> Pre-inscripción</>
                  }
                </button>
                {selectedMsg.leido ? (
                  <button onClick={() => markPendiente(selectedMsg)}
                    className="px-4 py-2.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-700 text-sm font-semibold hover:bg-orange-100 transition-colors">
                    Pendiente
                  </button>
                ) : (
                  <button onClick={() => markAtendido(selectedMsg)}
                    className="px-4 py-2.5 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors">
                    Atendido
                  </button>
                )}
                <button onClick={() => { setSelectedMsg(null); setConfirmDeleteMsg(selectedMsg) }}
                  className="px-3 py-2.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ── Confirm delete ─────────────────────────────────────────────── */}
      <Dialog open={!!confirmDeleteMsg} onOpenChange={open => !open && setConfirmDeleteMsg(null)}>
        {confirmDeleteMsg && (
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>¿Eliminar mensaje?</DialogTitle></DialogHeader>
            <p className="text-sm text-gray-600">
              El mensaje de <strong>{confirmDeleteMsg.name}</strong> será eliminado permanentemente.
            </p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setConfirmDeleteMsg(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button disabled={loadingId === confirmDeleteMsg.id} onClick={() => deleteMsg(confirmDeleteMsg)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
                {loadingId === confirmDeleteMsg.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Eliminar'}
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabBtn({ active, onClick, icon, label, badge }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge: number
}) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
        ${active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
      {icon} {label}
      {badge > 0 && (
        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </button>
  )
}

function KanbanCol({ title, count, headerBg, border, bg, icon, children }: {
  title: string; count: number; headerBg: string; border: string; bg: string
  icon: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div className={`rounded-xl border ${border} overflow-hidden`}>
      <div className={`${headerBg} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2 text-white">
          {icon}
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <div className={`${bg} min-h-32 p-3 space-y-2.5`}>{children}</div>
    </div>
  )
}

function MsgCard({ msg, loadingId, onOpen, onAtendido, onPendiente, onConvertir, onDelete }: {
  msg: ContactMessage; loadingId: string | null
  onOpen: () => void; onDelete: () => void; onConvertir: () => void
  onAtendido?: () => void; onPendiente?: () => void
}) {
  const busy = loadingId === msg.id
  const converting = loadingId === msg.id + '_conv'
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm hover:shadow-md transition-shadow">
      <button onClick={onOpen} className="w-full text-left mb-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-gray-900 text-sm">{msg.name}</p>
          <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(msg.created_at)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1 flex-wrap">
          <Mail className="w-3 h-3" /> {msg.email}
          {msg.phone && <><span className="mx-1">·</span><Phone className="w-3 h-3" />{msg.phone}</>}
        </p>
        <p className="text-sm text-gray-700 font-medium mt-1.5">{msg.subject}</p>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{msg.message}</p>
      </button>

      {/* Fila 1: Gmail */}
      <div className="mb-1.5">
        <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}&su=Re: ${encodeURIComponent(msg.subject + ' — CCGM')}`}
          target="_blank" rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex w-full items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-md bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors">
          <Mail className="w-3 h-3" /> Responder por Gmail
        </a>
      </div>

      {/* Fila 2: convertir + estado + eliminar */}
      <div className="flex gap-1.5">
        <button disabled={converting} onClick={onConvertir}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 disabled:opacity-50 transition-colors">
          {converting ? <Loader2 className="w-3 h-3 animate-spin" /> : <><ArrowRightLeft className="w-3 h-3" /> Pre-inscripción</>}
        </button>
        {onAtendido && (
          <button disabled={busy} onClick={onAtendido}
            className="flex-1 py-1.5 text-xs font-semibold rounded-md bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 disabled:opacity-50">
            {busy ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : '✓ Atendido'}
          </button>
        )}
        {onPendiente && (
          <button disabled={busy} onClick={onPendiente}
            className="flex-1 py-1.5 text-xs font-semibold rounded-md bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 disabled:opacity-50">
            {busy ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : '↩ Pendiente'}
          </button>
        )}
        <button onClick={onDelete}
          className="px-2.5 py-1.5 rounded-md bg-red-50 text-red-500 border border-red-200 hover:bg-red-100">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
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

function Loading() {
  return (
    <div className="flex items-center justify-center py-20 text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
    </div>
  )
}
