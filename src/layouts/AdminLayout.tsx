import { useEffect, useState, useCallback } from 'react'
import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, Newspaper, Users, LogOut, Bell, UserPlus, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/noticias', label: 'Noticias', icon: Newspaper, exact: false },
  { to: '/admin/contactos', label: 'Contactos', icon: Users, exact: false },
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

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Supabase Realtime: notificar cuando llega una preinscripción nueva
  useEffect(() => {
    if (!supabase || !session) return
    const channel = supabase
      .channel('admin-preinscripciones')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'preinscripciones' },
        (payload) => {
          setNewPostulaciones(prev => prev + 1)
          playChime()
          setBellAnimate(true)
          setTimeout(() => setBellAnimate(false), 1000)
          const nombre = (payload.new as { nombre_completo?: string })?.nombre_completo ?? 'Alguien'
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
        lg:static lg:translate-x-0
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
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 h-14 flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1" />

          {/* Notification bell — always visible */}
          <button
            onClick={clearNotifications}
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

          <div className="text-xs text-gray-500">
            {session?.user?.email}
          </div>
        </header>

        {/* Toast notifications */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
          {toasts.map(t => (
            <div
              key={t.id}
              className="pointer-events-auto flex items-start gap-3 bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 w-80 animate-in slide-in-from-right-full duration-300"
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
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
