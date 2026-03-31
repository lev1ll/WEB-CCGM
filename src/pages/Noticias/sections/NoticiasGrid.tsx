import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import type { Noticia, NoticiaCategoria } from '@/types/noticias.types'
import { formatDate } from '@/lib/utils'

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

interface Props {
  items: Noticia[]
  isLoading: boolean
  filter: NoticiaCategoria | 'todas'
  onFilterChange: (f: NoticiaCategoria | 'todas') => void
}

const FILTERS: { value: NoticiaCategoria | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'noticia', label: 'Noticias' },
  { value: 'evento', label: 'Eventos' },
]

export default function NoticiasGrid({ items, isLoading, filter, onFilterChange }: Props) {
  const [anio, setAnio] = useState<number | null>(null)
  const [mes, setMes] = useState<number | null>(null)

  // Años disponibles según los items
  const aniosDisponibles = Array.from(
    new Set(items.map(n => new Date(n.created_at).getFullYear()))
  ).sort((a, b) => b - a)

  const filtered = items.filter(n => {
    if (filter !== 'todas' && n.categoria !== filter) return false
    const fecha = new Date(n.created_at)
    if (anio !== null && fecha.getFullYear() !== anio) return false
    if (mes !== null && fecha.getMonth() !== mes) return false
    return true
  })

  function handleAnio(val: string) {
    setAnio(val === '' ? null : Number(val))
    setMes(null)
  }

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Filtros */}
        <div className="flex flex-col items-center gap-4 mb-10">
          {/* Categoría */}
          <div className="flex gap-2">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => onFilterChange(f.value)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
                  ${filter === f.value
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Año / Mes */}
          {aniosDisponibles.length > 0 && (
            <div className="flex gap-2 items-center">
              <select
                value={anio ?? ''}
                onChange={e => handleAnio(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Todos los años</option>
                {aniosDisponibles.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>

              {anio !== null && (
                <select
                  value={mes ?? ''}
                  onChange={e => setMes(e.target.value === '' ? null : Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Todos los meses</option>
                  {MESES.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
              )}

              {(anio !== null || mes !== null) && (
                <button
                  onClick={() => { setAnio(null); setMes(null) }}
                  className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                <div className="h-48 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No hay publicaciones todavía.</p>
            <p className="text-sm mt-1">Vuelve pronto para estar al día.</p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (() => {
          const destacada = filtered.find(n => n.destacada)
          const resto = filtered.filter(n => !n.destacada || n !== destacada)
          return (
            <div className="space-y-6">
              {/* Noticia destacada */}
              {destacada && (
                <AnimatedSection direction="up">
                  <NoticiaCardDestacada noticia={destacada} />
                </AnimatedSection>
              )}
              {/* Grid normal */}
              {resto.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resto.map((noticia, i) => (
                    <AnimatedSection key={noticia.id} direction="up" delay={i * 0.05}>
                      <NoticiaCard noticia={noticia} />
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </div>
          )
        })()}
      </div>
    </section>
  )
}

function NoticiaCardDestacada({ noticia }: { noticia: Noticia }) {
  return (
    <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}>
      <Link to={`/noticias/${noticia.slug}`}>
        <Card className="overflow-hidden group cursor-pointer border-border hover:shadow-xl transition-shadow duration-300">
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative h-64 md:h-80 overflow-hidden bg-muted">
              {noticia.imagen_portada ? (
                <img
                  src={noticia.imagen_portada}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-primary/30" />
                </div>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-amber-500 text-white border-transparent text-xs font-bold">
                  Destacada
                </Badge>
                <Badge
                  className={`text-xs font-semibold capitalize
                    ${noticia.categoria === 'evento'
                      ? 'bg-amber-500/80 text-white border-transparent'
                      : 'bg-primary text-white border-transparent'
                    }`}
                >
                  {noticia.categoria}
                </Badge>
              </div>
            </div>
            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center gap-3">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(noticia.created_at)}
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                {noticia.titulo}
              </h3>
              {noticia.resumen && (
                <p className="text-muted-foreground leading-relaxed line-clamp-3">{noticia.resumen}</p>
              )}
              <div className="mt-2 flex items-center gap-1.5 text-primary font-semibold">
                Leer más <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}

function NoticiaCard({ noticia }: { noticia: Noticia }) {
  return (
    <motion.div whileHover={{ y: -6, transition: { duration: 0.2 } }}>
      <Link to={`/noticias/${noticia.slug}`}>
        <Card className="overflow-hidden h-full group cursor-pointer border-border hover:shadow-lg transition-shadow duration-300">
          {/* Image */}
          <div className="relative h-56 overflow-hidden bg-muted">
            {noticia.imagen_portada ? (
              <img
                src={noticia.imagen_portada}
                alt={noticia.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Calendar className="w-10 h-10 text-primary/40" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge
                className={`text-xs font-semibold capitalize
                  ${noticia.categoria === 'evento'
                    ? 'bg-amber-500 text-white border-transparent'
                    : 'bg-primary text-white border-transparent'
                  }`}
              >
                {noticia.categoria}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(noticia.created_at)}
            </p>
            <h3 className="font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {noticia.titulo}
            </h3>
            {noticia.resumen && (
              <p className="text-sm text-muted-foreground line-clamp-2">{noticia.resumen}</p>
            )}
            <div className="mt-auto pt-2 flex items-center gap-1 text-primary text-sm font-medium">
              Leer más <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
