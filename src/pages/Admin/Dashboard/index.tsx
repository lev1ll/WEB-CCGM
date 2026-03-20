import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, MessageSquare, Newspaper, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { Preinscripcion, ContactMessage, Noticia } from '@/types/noticias.types'

interface Metrics {
  totalPostulaciones: number
  pendientes: number
  contactados: number
  matriculados: number
  mensajesSinLeer: number
  noticiasPublicadas: number
}

export default function AdminDashboard() {
  const { select } = useSupabaseQuery()
  const [metrics, setMetrics] = useState<Metrics>({
    totalPostulaciones: 0,
    pendientes: 0,
    contactados: 0,
    matriculados: 0,
    mensajesSinLeer: 0,
    noticiasPublicadas: 0,
  })
  const [recentPostulaciones, setRecentPostulaciones] = useState<Preinscripcion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [preinscripciones, mensajes, noticias] = await Promise.all([
        select<Preinscripcion>('preinscripciones', { order: { column: 'created_at', ascending: false } }),
        select<ContactMessage>('contact_messages', { filter: { leido: false } }),
        select<Noticia>('noticias', { filter: { publicado: true } }),
      ])

      const pendientes = preinscripciones.filter(p => p.estado === 'pendiente').length
      const contactados = preinscripciones.filter(p => p.estado === 'contactado').length
      const matriculados = preinscripciones.filter(p => p.estado === 'matriculado').length

      setMetrics({
        totalPostulaciones: preinscripciones.length,
        pendientes,
        contactados,
        matriculados,
        mensajesSinLeer: mensajes.length,
        noticiasPublicadas: noticias.length,
      })
      setRecentPostulaciones(preinscripciones.slice(0, 5))
      setIsLoading(false)
    }
    load()
  }, [])

  const conversionRate = metrics.totalPostulaciones > 0
    ? Math.round((metrics.matriculados / metrics.totalPostulaciones) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen de actividad del sitio web</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={<FileText className="w-5 h-5 text-blue-600" />}
          bg="bg-blue-50"
          label="Total postulaciones"
          value={metrics.totalPostulaciones}
          isLoading={isLoading}
          sub={`${metrics.pendientes} pendientes`}
        />
        <KpiCard
          icon={<Users className="w-5 h-5 text-green-600" />}
          bg="bg-green-50"
          label="Matriculados"
          value={metrics.matriculados}
          isLoading={isLoading}
          sub={`${conversionRate}% conversión`}
        />
        <KpiCard
          icon={<MessageSquare className="w-5 h-5 text-orange-600" />}
          bg="bg-orange-50"
          label="Mensajes sin leer"
          value={metrics.mensajesSinLeer}
          isLoading={isLoading}
          sub="de contacto"
        />
        <KpiCard
          icon={<Newspaper className="w-5 h-5 text-purple-600" />}
          bg="bg-purple-50"
          label="Noticias publicadas"
          value={metrics.noticiasPublicadas}
          isLoading={isLoading}
          sub="en el sitio"
        />
      </div>

      {/* Embudo de conversión */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <h2 className="text-base font-semibold text-gray-900">Embudo de postulaciones</h2>
        </div>
        {isLoading ? (
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          <div className="flex items-stretch gap-2">
            <FunnelStep label="Recibidas" value={metrics.totalPostulaciones} color="bg-blue-100 text-blue-700" />
            <div className="flex items-center text-gray-300">›</div>
            <FunnelStep label="Contactados" value={metrics.contactados} color="bg-yellow-100 text-yellow-700" />
            <div className="flex items-center text-gray-300">›</div>
            <FunnelStep label="Matriculados" value={metrics.matriculados} color="bg-green-100 text-green-700" />
          </div>
        )}
      </div>

      {/* Últimas postulaciones */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Últimas postulaciones</h2>
          <Link
            to="/admin/preinscripciones"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            Ver todas <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentPostulaciones.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">No hay postulaciones aún.</p>
        ) : (
          <div className="space-y-3">
            {recentPostulaciones.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.child_name} — {p.current_grade}</p>
                </div>
                <EstadoBadge estado={p.estado} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function KpiCard({ icon, bg, label, value, isLoading, sub }: {
  icon: React.ReactNode
  bg: string
  label: string
  value: number
  isLoading: boolean
  sub: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
          {icon}
        </div>
        <span className="text-sm text-gray-500 font-medium">{label}</span>
      </div>
      {isLoading ? (
        <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
      ) : (
        <>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </>
      )}
    </div>
  )
}

function FunnelStep({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`flex-1 rounded-lg px-4 py-3 ${color} text-center`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-medium mt-0.5">{label}</p>
    </div>
  )
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    contactado: 'bg-blue-100 text-blue-700',
    matriculado: 'bg-green-100 text-green-700',
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[estado] ?? 'bg-gray-100 text-gray-600'}`}>
      {estado}
    </span>
  )
}
