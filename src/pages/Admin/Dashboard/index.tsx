import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Users, Newspaper, ArrowRight, TrendingUp, PhoneMissed, CalendarCheck } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { Noticia } from '@/types/noticias.types'
import { formatDate } from '@/lib/utils'

export default function AdminDashboard() {
  const { select } = useSupabaseQuery()
  const [preinscripciones, setPreinscripciones] = useState<{ estado: string }[]>([])
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [pi, news] = await Promise.all([
        select<{ estado: string }>('preinscripciones', { select: 'estado' }),
        select<Noticia>('noticias', { filter: { publicado: true } }),
      ])
      setPreinscripciones(pi)
      setNoticias(news)
      setIsLoading(false)
    }
    load()
  }, [])

  const count = (estado: string) => preinscripciones.filter(p => p.estado === estado).length
  const total = preinscripciones.length
  const matriculados = count('matriculado')
  const pendientes = count('pendiente') + count('llamar_mas_tarde') + count('no_contesta')
  const enProceso = count('entrevista_agendada') + count('contactado')
  const conversionRate = total > 0 ? Math.round((matriculados / total) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen del proceso de admisión 2026</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          icon={<FileText className="w-5 h-5" />}
          iconBg="bg-blue-600"
          label="Total postulaciones"
          value={total}
          sub={`${conversionRate}% conversión`}
          isLoading={isLoading}
        />
        <KpiCard
          icon={<PhoneMissed className="w-5 h-5" />}
          iconBg="bg-orange-500"
          label="Por gestionar"
          value={pendientes}
          sub="pendientes o sin contacto"
          isLoading={isLoading}
          highlight={pendientes > 0}
        />
        <KpiCard
          icon={<CalendarCheck className="w-5 h-5" />}
          iconBg="bg-purple-600"
          label="En proceso"
          value={enProceso}
          sub="contactados o con entrevista"
          isLoading={isLoading}
        />
        <KpiCard
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-green-600"
          label="Matriculados"
          value={matriculados}
          sub={`de ${total} postulantes`}
          isLoading={isLoading}
        />
      </div>

      {/* Embudo visual */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Embudo de admisión</h2>
        </div>
        {isLoading ? (
          <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {[
              { label: 'Recibidas',     value: total,               bg: 'bg-slate-500'  },
              { label: 'Por gestionar', value: pendientes,          bg: 'bg-orange-500' },
              { label: 'En proceso',    value: enProceso,           bg: 'bg-purple-600' },
              { label: 'Contactados',   value: count('contactado'), bg: 'bg-blue-600'   },
              { label: 'Matriculados',  value: matriculados,        bg: 'bg-green-600'  },
            ].map(step => (
              <div key={step.label} className={`rounded-lg px-1 py-3 sm:px-3 sm:py-4 text-center text-white ${step.bg}`}>
                <p className="text-xl sm:text-2xl font-extrabold">{step.value}</p>
                <p className="text-[8px] sm:text-[10px] font-semibold mt-1 opacity-90 leading-tight">{step.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Noticias publicadas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Noticias publicadas
                <span className="ml-2 text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full normal-case">
                  {noticias.length}
                </span>
              </h2>
            </div>
            <Link to="/admin/noticias" className="text-xs text-primary hover:underline flex items-center gap-1">
              Gestionar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
          ) : noticias.length === 0 ? (
            <p className="text-sm text-gray-400">No hay noticias publicadas aún.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {noticias.slice(0, 6).map(n => (
                <div key={n.id} className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mr-2
                    ${n.categoria === 'evento' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {n.categoria}
                  </span>
                  <p className="text-sm font-medium text-gray-800 mt-1.5 leading-tight line-clamp-2">{n.titulo}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(n.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function KpiCard({ icon, iconBg, label, value, sub, isLoading, highlight }: {
  icon: React.ReactNode; iconBg: string; label: string
  value: number; sub: string; isLoading: boolean; highlight?: boolean
}) {
  return (
    <div className={`rounded-xl border p-3 sm:p-5 transition-all ${highlight ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${iconBg} flex items-center justify-center text-white shrink-0`}>
          {icon}
        </div>
        <span className="text-xs sm:text-sm text-gray-500 font-medium leading-tight">{label}</span>
      </div>
      {isLoading ? (
        <div className="h-7 w-14 bg-gray-100 rounded animate-pulse" />
      ) : (
        <>
          <p className={`text-2xl sm:text-3xl font-extrabold ${highlight ? 'text-orange-700' : 'text-gray-900'}`}>{value}</p>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 leading-tight">{sub}</p>
        </>
      )}
    </div>
  )
}
