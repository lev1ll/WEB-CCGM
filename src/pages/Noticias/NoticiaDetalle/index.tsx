import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Calendar, ChevronRight, ArrowLeft, Share2, Copy, Check } from 'lucide-react'
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
  const [copied, setCopied] = useState(false)

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(`${noticia?.titulo ?? ''} — ${window.location.href}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

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

        {/* Compartir + Back */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Noticias
          </Link>

          {noticia && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" /> Compartir:
              </span>
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20b858] text-white text-xs font-semibold transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </button>
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-semibold text-muted-foreground transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '¡Copiado!' : 'Copiar enlace'}
              </button>
            </div>
          )}
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
