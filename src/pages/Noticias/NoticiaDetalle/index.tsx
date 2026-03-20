import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Calendar, ChevronRight, ArrowLeft } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Badge } from '@/components/ui/badge'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { toEmbedUrl, formatDate } from '@/lib/utils'
import type { Noticia, Bloque, BloqueType, BloqueContenidoMap } from '@/types/noticias.types'
import { Carousel } from '@/components/ui/carousel'

export default function NoticiaDetallePage() {
  const { slug } = useParams<{ slug: string }>()
  const { select, isLoading } = useSupabaseQuery()
  const [noticia, setNoticia] = useState<Noticia | null>(null)
  const [bloques, setBloques] = useState<Bloque[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    async function load() {
      const noticias = await select<Noticia>('noticias', {
        filter: { slug, publicado: true },
      })
      if (!noticias[0]) { setNotFound(true); return }
      setNoticia(noticias[0])

      const rawBloques = await select<Bloque>('noticias_bloques', {
        filter: { noticia_id: noticias[0].id },
        order: { column: 'orden', ascending: true },
      })
      setBloques(rawBloques)
    }
    load()
  }, [slug])

  if (notFound) return <Navigate to="/noticias" replace />

  return (
    <>
      {/* Hero */}
      <div className="relative bg-navy-deep text-white">
        {noticia?.imagen_portada && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${noticia.imagen_portada})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-white/60 text-sm mb-6">
            <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/noticias" className="hover:text-white transition-colors">Noticias</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/80 line-clamp-1">{noticia?.titulo ?? '...'}</span>
          </nav>

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-4 bg-white/20 rounded w-24 animate-pulse" />
              <div className="h-10 bg-white/20 rounded animate-pulse" />
              <div className="h-10 bg-white/20 rounded w-3/4 animate-pulse" />
            </div>
          ) : noticia && (
            <AnimatedSection direction="up">
              <Badge
                className={`mb-4 capitalize text-sm font-semibold
                  ${noticia.categoria === 'evento'
                    ? 'bg-amber-500 text-white border-transparent'
                    : 'bg-primary text-white border-transparent'
                  }`}
              >
                {noticia.categoria}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
                {noticia.titulo}
              </h1>
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(noticia.created_at)}</span>
                {noticia.fecha_evento && (
                  <>
                    <span>·</span>
                    <span>Evento: {formatDate(noticia.fecha_evento)}</span>
                  </>
                )}
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {noticia?.resumen && (
          <AnimatedSection direction="up" delay={0.1}>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 pb-10 border-b border-border">
              {noticia.resumen}
            </p>
          </AnimatedSection>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {bloques.map((bloque, i) => (
              <AnimatedSection key={bloque.id} direction="up" delay={i * 0.04}>
                <BlockRenderer bloque={bloque} />
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-border">
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Noticias
          </Link>
        </div>
      </div>
    </>
  )
}

function BlockRenderer({ bloque }: { bloque: Bloque }) {
  switch (bloque.tipo as BloqueType) {
    case 'texto': {
      const c = bloque.contenido as BloqueContenidoMap['texto']
      return (
        <div
          className="prose prose-base max-w-none text-foreground
            prose-headings:font-bold prose-headings:text-foreground
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:leading-relaxed prose-p:text-muted-foreground
            prose-strong:text-foreground
            prose-ul:text-muted-foreground prose-ol:text-muted-foreground
            prose-blockquote:border-primary prose-blockquote:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: c.html }}
        />
      )
    }
    case 'imagen': {
      const c = bloque.contenido as BloqueContenidoMap['imagen']
      if (!c.url) return null
      return (
        <figure className="my-2">
          <img
            src={c.url}
            alt={c.caption || ''}
            className="w-full rounded-xl object-cover max-h-[500px] border border-border"
          />
          {c.caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
              {c.caption}
            </figcaption>
          )}
        </figure>
      )
    }
    case 'video': {
      const c = bloque.contenido as BloqueContenidoMap['video']
      const embedUrl = toEmbedUrl(c.url)
      if (!embedUrl) return null
      return (
        <figure className="my-2">
          {c.title && (
            <p className="text-base font-semibold text-foreground mb-2">{c.title}</p>
          )}
          <div className="rounded-xl overflow-hidden border border-border aspect-video bg-black">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={c.title || 'Video'}
            />
          </div>
        </figure>
      )
    }
    case 'carrusel': {
      const c = bloque.contenido as BloqueContenidoMap['carrusel']
      if (!c.items?.length) return null
      return (
        <div className="my-2">
          <Carousel itemWidth={720} className="w-full">
            {c.items.map((item, i) => (
              <div key={i} style={{ minWidth: 720 }}>
                <figure>
                  <img
                    src={item.url}
                    alt={item.caption || `Imagen ${i + 1}`}
                    className="w-full rounded-xl object-cover max-h-[450px] border border-border"
                  />
                  {item.caption && (
                    <figcaption className="text-center text-sm text-muted-foreground mt-2 italic">
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              </div>
            ))}
          </Carousel>
        </div>
      )
    }
    default:
      return null
  }
}
