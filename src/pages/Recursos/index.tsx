import { useEffect, useState } from 'react'
import { Images, FileText, Download, X, ChevronLeft, ChevronRight, Loader2, Play } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { extractYouTubeId } from '@/lib/utils'
import type { GaleriaItem, Documento, DocumentoCategoria } from '@/types/noticias.types'

const CATEGORIAS: { value: DocumentoCategoria; label: string; emoji: string }[] = [
  { value: 'lista_utiles', label: 'Listas de útiles',    emoji: '📋' },
  { value: 'reglamento',   label: 'Reglamentos',         emoji: '📖' },
  { value: 'calendario',   label: 'Calendario y fechas', emoji: '📅' },
  { value: 'circular',     label: 'Circulares',          emoji: '📢' },
  { value: 'otro',         label: 'Otros documentos',    emoji: '📄' },
]

type Tab = 'galeria' | 'documentos'

export default function RecursosPage() {
  const { select } = useSupabaseQuery()
  const [tab, setTab] = useState<Tab>('galeria')
  const [fotos, setFotos] = useState<GaleriaItem[]>([])
  const [docs, setDocs] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const [g, d] = await Promise.all([
        select<GaleriaItem>('galeria', { order: { column: 'created_at', ascending: false } }),
        select<Documento>('documentos', { order: { column: 'created_at', ascending: false } }),
      ])
      setFotos(g)
      setDocs(d)
      setLoading(false)
    }
    load()
  }, [])

  // Lightbox keyboard nav
  useEffect(() => {
    if (lightbox === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => i !== null ? Math.min(i + 1, fotos.length - 1) : null)
      if (e.key === 'ArrowLeft')  setLightbox(i => i !== null ? Math.max(i - 1, 0) : null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, fotos.length])

  const grouped = CATEGORIAS.map(cat => ({
    ...cat,
    items: docs.filter(d => d.categoria === cat.value),
  })).filter(g => g.items.length > 0)

  const currentItem = lightbox !== null ? fotos[lightbox] : null
  const isVideo = currentItem?.tipo === 'video'

  return (
    <>
      {/* Hero */}
      <div className="bg-navy-deep text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection direction="up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Recursos</h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">
              Galería de fotos y videos, y documentos descargables para la comunidad escolar
            </p>
          </AnimatedSection>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2">
            {([
              { id: 'galeria',    label: 'Galería',    icon: Images    },
              { id: 'documentos', label: 'Documentos', icon: FileText  },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${tab === t.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
                {t.id === 'galeria' && !loading && fotos.length > 0 && (
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {fotos.length}
                  </span>
                )}
                {t.id === 'documentos' && !loading && docs.length > 0 && (
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {docs.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <SectionWrapper>
        {loading ? (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
          </div>
        ) : tab === 'galeria' ? (
          <GaleriaTab fotos={fotos} onOpen={i => setLightbox(i)} />
        ) : (
          <DocumentosTab grouped={grouped} />
        )}
      </SectionWrapper>

      {/* Lightbox */}
      {lightbox !== null && currentItem && (
        <div
          className="fixed inset-0 z-[1200] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={e => { e.stopPropagation(); setLightbox(null) }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {lightbox > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setLightbox(i => i !== null ? i - 1 : null) }}
              className="absolute left-3 sm:left-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div
            className={`px-14 sm:px-16 w-full ${isVideo ? 'max-w-4xl' : 'max-w-5xl'}`}
            onClick={e => e.stopPropagation()}
          >
            {isVideo ? (
              <div className="w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYouTubeId(currentItem.video_url ?? '')}?autoplay=1`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  title={currentItem.caption ?? 'Video'}
                />
              </div>
            ) : (
              <img
                src={currentItem.url}
                alt={currentItem.caption ?? ''}
                className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto block"
              />
            )}
            {currentItem.caption && (
              <p className="text-white/70 text-sm text-center mt-3">{currentItem.caption}</p>
            )}
            <p className="text-white/40 text-xs text-center mt-1">{lightbox + 1} / {fotos.length}</p>
          </div>

          {lightbox < fotos.length - 1 && (
            <button
              onClick={e => { e.stopPropagation(); setLightbox(i => i !== null ? i + 1 : null) }}
              className="absolute right-3 sm:right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </>
  )
}

function GaleriaTab({ fotos, onOpen }: { fotos: GaleriaItem[]; onOpen: (i: number) => void }) {
  if (fotos.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Images className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">La galería estará disponible próximamente</p>
      </div>
    )
  }

  return (
    <AnimatedSection direction="up">
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {fotos.map((foto, i) => (
          <button
            key={foto.id}
            onClick={() => onOpen(i)}
            className="break-inside-avoid w-full block rounded-xl overflow-hidden border border-border hover:opacity-90 transition-opacity relative group"
          >
            <img
              src={foto.url}
              alt={foto.caption ?? ''}
              loading="lazy"
              className="w-full h-auto object-cover"
            />
            {foto.tipo === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </AnimatedSection>
  )
}

type GroupedCat = { value: DocumentoCategoria; label: string; emoji: string; items: Documento[] }

function DocumentosTab({ grouped }: { grouped: GroupedCat[] }) {
  if (grouped.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">Los documentos estarán disponibles próximamente</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {grouped.map((group, gi) => (
        <AnimatedSection key={group.value} direction="up" delay={gi * 0.05}>
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground mb-4">
            <span>{group.emoji}</span> {group.label}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.items.map(doc => (
              <a
                key={doc.id}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {doc.titulo}
                  </p>
                  {doc.descripcion && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{doc.descripcion}</p>
                  )}
                  {doc.curso && (
                    <span className="inline-block mt-1.5 text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {doc.curso.replace('basico', '° Básico')}
                    </span>
                  )}
                </div>
                <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </a>
            ))}
          </div>
        </AnimatedSection>
      ))}
    </div>
  )
}
