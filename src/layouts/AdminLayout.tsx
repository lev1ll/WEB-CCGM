import { useEffect, useState, useCallback, useRef } from 'react'
import { Outlet, NavLink, useLocation, Navigate, Link } from 'react-router-dom'
import { LayoutDashboard, Newspaper, Users, LogOut, Bell, UserPlus, X, GraduationCap, Loader2, Images, FileText } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

const ESTADO_LABEL: Record<string, string> = {
  pendiente:           'Pendiente',
  llamar_mas_tarde:    'Llamar más tarde',
  no_contesta:         'No contesta',
  entrevista_agendada: 'Entrevista agendada',
  contactado:          'Contactado',
  matriculado:         'Matriculado',
  descartado:          'Descartado',
}
const ESTADO_STYLE: Record<string, { bg: string; color: string }> = {
  pendiente:           { bg: 'bg-slate-200',   color: 'text-slate-800'  },
  llamar_mas_tarde:    { bg: 'bg-orange-200',  color: 'text-orange-900' },
  no_contesta:         { bg: 'bg-red-200',     color: 'text-red-900'    },
  entrevista_agendada: { bg: 'bg-purple-200',  color: 'text-purple-900' },
  contactado:          { bg: 'bg-blue-200',    color: 'text-blue-900'   },
  matriculado:         { bg: 'bg-green-200',   color: 'text-green-900'  },
  descartado:          { bg: 'bg-gray-200',    color: 'text-gray-700'   },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} h`
  return `hace ${Math.floor(hours / 24)} d`
}

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/noticias', label: 'Noticias', icon: Newspaper, exact: false },
  { to: '/admin/contactos', label: 'Contactos', icon: Users, exact: false },
  { to: '/admin/trabajadores', label: 'Equipo', icon: GraduationCap, exact: false },
  { to: '/admin/galeria', label: 'Galería', icon: Images, exact: false },
  { to: '/admin/documentos', label: 'Documentos', icon: FileText, exact: false },
]

function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = ctx.currentTime + i * 0.18
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.25, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5)
      osc.start(start)
      osc.stop(start + 0.5)
    })
  } catch {
    // AudioContext not available
  }
}

interface ToastNotif {
  id: number
  nombre: string
}

export default function AdminLayout() {
  const { session, isLoading, signOut } = useAuth()
  const location = useLocation()
  const [newPostulaciones, setNewPostulaciones] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastNotif[]>([])
  const [bellAnimate, setBellAnimate] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [recentPI, setRecentPI] = useState<{id:string;name:string;child_name:string;estado:string;created_at:string}[]>([])
  const [loadingPanel, setLoadingPanel] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!panelOpen) return
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setPanelOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [panelOpen])

  async function openPanel() {
    const opening = !panelOpen
    setPanelOpen(opening)
    if (opening && supabase) {
      setLoadingPanel(true)
      const { data } = await supabase
        .from('preinscripciones')
        .select('id,name,child_name,estado,created_at')
        .order('created_at', { ascending: false })
        .limit(8)
      setRecentPI(data ?? [])
      setLoadingPanel(false)
      setNewPostulaciones(0)
    }
  }

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Supabase Realtime: notificar cuando llega una preinscripción nueva
  useEffect(() => {
    if (!supabase || !session) return

    function getSeenIds(): Set<string> {
      try {
        const raw = localStorage.getItem('ccgm_seen_preinscripciones')
        return new Set(raw ? JSON.parse(raw) : [])
      } catch { return new Set() }
    }

    function markSeen(rowId: string) {
      try {
        const seen = getSeenIds()
        seen.add(rowId)
        const arr = Array.from(seen).slice(-500)
        localStorage.setItem('ccgm_seen_preinscripciones', JSON.stringify(arr))
      } catch { /* ignore */ }
    }

    const channel = supabase
      .channel('admin-preinscripciones')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'preinscripciones' },
        (payload) => {
          const rowId = String((payload.new as { id?: unknown })?.id ?? '')
          if (rowId && getSeenIds().has(rowId)) return
          if (rowId) markSeen(rowId)

          setNewPostulaciones(prev => prev + 1)
          playChime()
          setBellAnimate(true)
          setTimeout(() => setBellAnimate(false), 1000)
          const nombre = (payload.new as { name?: string })?.name ?? 'Alguien'
          const id = Date.now()
          setToasts(prev => [...prev, { id, nombre }])
          setTimeout(() => dismissToast(id), 8000)
        }
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [session, dismissToast])

  function clearNotifications() {
    setNewPostulaciones(0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />
  }

  if (session && location.pathname === '/admin/login') {
    return <Navigate to="/admin" replace />
  }

  // Login page: no sidebar
  if (location.pathname === '/admin/login') {
    return <Outlet />
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col
        transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <img
            src="/images/logo_gabriela_mistral.png"
            alt="Logo CCGM"
            className="h-10 w-auto flex-shrink-0"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">CCGM</p>
            <p className="text-xs text-gray-500">Panel Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {item.to === '/admin/contactos' && newPostulaciones > 0 && (
                <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {newPostulaciones > 9 ? '9+' : newPostulaciones}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={signOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 h-14 flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1" />

          {/* Notification bell + panel */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={openPanel}
              className="relative p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
              title={newPostulaciones > 0 ? `${newPostulaciones} nueva(s) postulación(es)` : 'Notificaciones'}
            >
              <Bell className={`w-5 h-5 transition-transform ${bellAnimate ? 'animate-bounce' : ''}`} />
              {newPostulaciones > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-0.5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full">
                    {newPostulaciones > 9 ? '9+' : newPostulaciones}
                  </span>
                </>
              )}
            </button>

            {panelOpen && (
              <div className="fixed left-3 right-3 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Pre-inscripciones</h3>
                  <Link
                    to="/admin/contactos"
                    onClick={() => setPanelOpen(false)}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Ver todas →
                  </Link>
                </div>
                {loadingPanel ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
                  </div>
                ) : recentPI.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No hay postulaciones aún.</p>
                ) : (
                  <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                    {recentPI.map(p => {
                      const st = ESTADO_STYLE[p.estado] ?? { bg: 'bg-gray-100', color: 'text-gray-600' }
                      return (
                        <Link
                          key={p.id}
                          to={`/admin/contactos?open=${p.id}`}
                          onClick={() => setPanelOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary">{p.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{p.child_name}</p>
                            <p className="text-xs text-gray-400 truncate">{p.name} · {timeAgo(p.created_at)}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${st.bg} ${st.color}`}>
                            {ESTADO_LABEL[p.estado] ?? p.estado}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500">
            {session?.user?.email}
          </div>
        </header>

        {/* Toast notifications */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3 pointer-events-none w-[calc(100vw-2rem)] sm:w-80">
          {toasts.map(t => (
            <div
              key={t.id}
              className="pointer-events-auto flex items-start gap-3 bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 w-full animate-in slide-in-from-right-full duration-300"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Nueva pre-inscripción</p>
                <p className="text-xs text-gray-500 truncate">{t.nombre} ha enviado una solicitud</p>
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                className="flex-shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
