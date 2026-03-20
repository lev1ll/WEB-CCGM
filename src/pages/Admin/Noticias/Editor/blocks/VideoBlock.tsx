import { toEmbedUrl } from '@/lib/utils'
import type { BloqueContenidoMap } from '@/types/noticias.types'
import { Youtube } from 'lucide-react'

interface Props {
  contenido: BloqueContenidoMap['video']
  onChange: (contenido: BloqueContenidoMap['video']) => void
}

export default function VideoBlock({ contenido, onChange }: Props) {
  const embedUrl = toEmbedUrl(contenido.url)

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
          <Youtube className="w-3.5 h-3.5" />
          Link de YouTube o Vimeo
        </label>
        <input
          type="url"
          placeholder="https://youtu.be/... o https://www.youtube.com/watch?v=..."
          value={contenido.url}
          onChange={e => onChange({ ...contenido, url: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Título del video (opcional)</label>
        <input
          type="text"
          placeholder="Ej: Acto de clausura 2025"
          value={contenido.title}
          onChange={e => onChange({ ...contenido, title: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {embedUrl ? (
        <div className="rounded-lg overflow-hidden border border-gray-200 bg-black aspect-video">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={contenido.title || 'Video'}
          />
        </div>
      ) : contenido.url ? (
        <p className="text-xs text-red-500 bg-red-50 rounded px-3 py-2">
          URL no reconocida. Usa un link de YouTube (youtu.be/... o youtube.com/watch?v=...) o Vimeo.
        </p>
      ) : (
        <div className="h-28 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Youtube className="w-8 h-8 mx-auto mb-1 opacity-40" />
            <p className="text-xs">La vista previa aparecerá aquí</p>
          </div>
        </div>
      )}
    </div>
  )
}
