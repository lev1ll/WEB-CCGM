import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Users, Newspaper, ArrowRight, TrendingUp, PhoneMissed, CalendarCheck } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { Preinscripcion, Noticia } from '@/types/noticias.types'
import { formatDate } from '@/lib/utils'

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

export default function AdminDashboard() {
  const { select } = useSupabaseQuery()
  const [preinscripciones, setPreinscripciones] = useState<Preinscripcion[]>([])
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [pi, news] = await Promise.all([
        select<Preinscripcion>('preinscripciones', { order: { column: 'created_at', ascending: false } }),
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

  const recientes = preinscripciones.slice(0, 6)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Resumen del proceso de admisión 2026</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
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
          <div className="flex items-stretch gap-2">
            {[
              { label: 'Recibidas',    value: total,                          bg: 'bg-slate-500'  },
              { label: 'Por gestionar',value: pendientes,                     bg: 'bg-orange-500' },
              { label: 'En proceso',   value: enProceso,                      bg: 'bg-purple-600' },
              { label: 'Contactados',  value: count('contactado'),            bg: 'bg-blue-600'   },
              { label: 'Matriculados', value: matriculados,                   bg: 'bg-green-600'  },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2 flex-1">
                <div className={`flex-1 rounded-lg px-3 py-4 text-center text-white ${step.bg}`}>
                  <p className="text-2xl font-extrabold">{step.value}</p>
                  <p className="text-[10px] font-semibold mt-1 opacity-90 leading-tight">{step.label}</p>
                </div>
                {i < arr.length - 1 && <span className="text-gray-300 font-bold shrink-0">›</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Últimas postulaciones */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Últimas postulaciones</h2>
            <Link to="/admin/contactos" className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver todas <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          ) : recientes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No hay postulaciones aún.</p>
          ) : (
            <div className="space-y-2">
              {recientes.map(p => {
                const st = ESTADO_STYLE[p.estado] ?? { bg: 'bg-gray-100', color: 'text-gray-600' }
                return (
                  <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{p.child_name}</p>
                      <p className="text-xs text-gray-400">{p.name} · {formatDate(p.created_at)}</p>
                    </div>
                    <span className={`ml-3 shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${st.bg} ${st.color}`}>
                      {ESTADO_LABEL[p.estado] ?? p.estado}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Distribución por estado */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Distribución por estado</h2>
          {isLoading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />)}</div>
          ) : total === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sin datos aún.</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(ESTADO_LABEL).map(([val, label]) => {
                const n = count(val)
                if (n === 0) return null
                const pct = Math.round((n / total) * 100)
                const st = ESTADO_STYLE[val] ?? { bg: 'bg-gray-200', color: 'text-gray-700' }
                return (
                  <div key={val}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">{label}</span>
                      <span className="text-gray-400">{n} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${st.bg}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

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
    <div className={`rounded-xl border p-5 transition-all ${highlight ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center text-white shrink-0`}>
          {icon}
        </div>
        <span className="text-sm text-gray-500 font-medium leading-tight">{label}</span>
      </div>
      {isLoading ? (
        <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
      ) : (
        <>
          <p className={`text-3xl font-extrabold ${highlight ? 'text-orange-700' : 'text-gray-900'}`}>{value}</p>
          <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </>
      )}
    </div>
  )
}
