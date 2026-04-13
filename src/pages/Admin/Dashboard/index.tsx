import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Newspaper, Images, FileText, GraduationCap, ImagePlay, Trophy,
  ArrowRight, CheckCircle, AlertCircle, CalendarDays,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import type { Noticia } from '@/types/noticias.types'

interface Stats {
  noticiasPublicadas: number
  noticiasBorrador: number
  ultimaNoticia: Noticia | null
  galeria: number
  documentos: number
  trabajadores: number
  heroSlides: number
  academiaFotos: number
  proximosEventos: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!supabase) return
      const today = new Date().toISOString().slice(0, 10)
      const [
        { count: notPub },
        { count: notBor },
        { data: ultimaData },
        { count: gal },
        { count: doc },
        { count: trab },
        { count: hero },
        { count: acad },
        { count: eventos },
      ] = await Promise.all([
        supabase.from('noticias').select('*', { count: 'exact', head: true }).eq('publicado', true),
        supabase.from('noticias').select('*', { count: 'exact', head: true }).eq('publicado', false),
        supabase.from('noticias').select('id,titulo,categoria,created_at').eq('publicado', true).order('created_at', { ascending: false }).limit(1),
        supabase.from('galeria').select('*', { count: 'exact', head: true }),
        supabase.from('documentos').select('*', { count: 'exact', head: true }),
        supabase.from('trabajadores').select('*', { count: 'exact', head: true }),
        supabase.from('hero_slides').select('*', { count: 'exact', head: true }).eq('activo', true),
        supabase.from('academia_fotos').select('*', { count: 'exact', head: true }),
        supabase.from('calendario_eventos').select('*', { count: 'exact', head: true }).gte('fecha_inicio', today),
      ])
      setStats({
        noticiasPublicadas: notPub ?? 0,
        noticiasBorrador:   notBor ?? 0,
        ultimaNoticia:      (ultimaData?.[0] as Noticia) ?? null,
        galeria:            gal ?? 0,
        documentos:         doc ?? 0,
        trabajadores:       trab ?? 0,
        heroSlides:         hero ?? 0,
        academiaFotos:      acad ?? 0,
        proximosEventos:    eventos ?? 0,
      })
      setIsLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Estado del contenido del sitio</p>
      </div>

      {/* KPIs de contenido */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={<Newspaper className="w-5 h-5" />}
          iconBg="bg-blue-600"
          label="Noticias publicadas"
          value={stats?.noticiasPublicadas}
          sub={stats ? `${stats.noticiasBorrador} en borrador` : '—'}
          href="/admin/noticias"
          isLoading={isLoading}
        />
        <StatCard
          icon={<Images className="w-5 h-5" />}
          iconBg="bg-violet-600"
          label="Fotos en galería"
          value={stats?.galeria}
          sub="imágenes subidas"
          href="/admin/galeria"
          isLoading={isLoading}
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          iconBg="bg-amber-500"
          label="Documentos"
          value={stats?.documentos}
          sub="disponibles para apoderados"
          href="/admin/documentos"
          isLoading={isLoading}
        />
        <StatCard
          icon={<GraduationCap className="w-5 h-5" />}
          iconBg="bg-teal-600"
          label="Equipo"
          value={stats?.trabajadores}
          sub="miembros registrados"
          href="/admin/trabajadores"
          isLoading={isLoading}
        />
        <StatCard
          icon={<CalendarDays className="w-5 h-5" />}
          iconBg="bg-primary"
          label="Próximos eventos"
          value={stats?.proximosEventos}
          sub="en el calendario escolar"
          href="/admin/calendario"
          isLoading={isLoading}
        />
      </div>

      {/* Estado del carrusel y academias */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Hero */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ImagePlay className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">Carrusel portada</h2>
            </div>
            <Link to="/admin/hero" className="text-xs text-primary hover:underline flex items-center gap-1">
              Gestionar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ) : (
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${(stats?.heroSlides ?? 0) > 0 ? 'bg-green-100' : 'bg-amber-100'}`}>
                {(stats?.heroSlides ?? 0) > 0
                  ? <CheckCircle className="w-5 h-5 text-green-600" />
                  : <AlertCircle className="w-5 h-5 text-amber-500" />
                }
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900">{stats?.heroSlides ?? 0} / 5</p>
                <p className="text-xs text-gray-400">fotos activas en el carrusel</p>
              </div>
            </div>
          )}
        </div>

        {/* Academias */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-semibold text-gray-700">Fotos de academias</h2>
            </div>
            <Link to="/admin/academias" className="text-xs text-primary hover:underline flex items-center gap-1">
              Gestionar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
          ) : (
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${(stats?.academiaFotos ?? 0) === 6 ? 'bg-green-100' : 'bg-amber-100'}`}>
                {(stats?.academiaFotos ?? 0) === 6
                  ? <CheckCircle className="w-5 h-5 text-green-600" />
                  : <AlertCircle className="w-5 h-5 text-amber-500" />
                }
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900">{stats?.academiaFotos ?? 0} / 6</p>
                <p className="text-xs text-gray-400">academias con foto subida</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Últimas noticias */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Última noticia publicada</h2>
          </div>
          <Link to="/admin/noticias" className="text-xs text-primary hover:underline flex items-center gap-1">
            Ver todas <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {isLoading ? (
          <div className="h-14 bg-gray-100 rounded-lg animate-pulse" />
        ) : stats?.ultimaNoticia ? (
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full
                ${stats.ultimaNoticia.categoria === 'evento' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                {stats.ultimaNoticia.categoria}
              </span>
              <p className="text-sm font-semibold text-gray-900 mt-1.5 line-clamp-1">{stats.ultimaNoticia.titulo}</p>
              <p className="text-xs text-gray-400 mt-0.5">{formatDate(stats.ultimaNoticia.created_at)}</p>
            </div>
            <Link
              to="/admin/noticias/nueva"
              className="shrink-0 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              + Nueva
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">No hay noticias publicadas aún.</p>
            <Link
              to="/admin/noticias/nueva"
              className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              + Crear primera noticia
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, iconBg, label, value, sub, href, isLoading }: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: number | undefined
  sub: string
  href: string
  isLoading: boolean
}) {
  return (
    <Link to={href} className="block rounded-xl border border-gray-200 bg-white p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 sm:gap-3 mb-3">
        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${iconBg} flex items-center justify-center text-white shrink-0`}>
          {icon}
        </div>
        <span className="text-xs sm:text-sm text-gray-500 font-medium leading-tight">{label}</span>
      </div>
      {isLoading ? (
        <div className="h-7 w-14 bg-gray-100 rounded animate-pulse" />
      ) : (
        <>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{value ?? 0}</p>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 leading-tight">{sub}</p>
        </>
      )}
    </Link>
  )
}
