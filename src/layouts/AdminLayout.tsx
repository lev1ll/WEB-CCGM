import { useState } from 'react'
import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, Newspaper, LogOut, GraduationCap, Images, FileText, ImagePlay, Trophy, CalendarDays } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { LogoCCGM } from '@/components/shared/LogoCCGM'

const NAV_ITEMS = [
  { to: '/admin',            label: 'Dashboard',      icon: LayoutDashboard, exact: true  },
  { to: '/admin/noticias',   label: 'Noticias',        icon: Newspaper,       exact: false },
  { to: '/admin/trabajadores', label: 'Equipo',        icon: GraduationCap,   exact: false },
  { to: '/admin/galeria',    label: 'Galería',         icon: Images,          exact: false },
  { to: '/admin/documentos', label: 'Documentos',      icon: FileText,        exact: false },
  { to: '/admin/hero',       label: 'Hero (portada)',  icon: ImagePlay,       exact: false },
  { to: '/admin/academias',  label: 'Academias',       icon: Trophy,          exact: false },
  { to: '/admin/calendario', label: 'Calendario',      icon: CalendarDays,    exact: false },
]

export default function AdminLayout() {
  const { session, isLoading, signOut } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
          <LogoCCGM showText={false} className="h-10 w-10 shrink-0" />
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
          <div className="text-xs text-gray-500">{session?.user?.email}</div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
