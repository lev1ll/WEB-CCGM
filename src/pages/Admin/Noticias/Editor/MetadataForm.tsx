import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { slugify, uploadToCloudinary } from '@/lib/utils'
import type { NoticiaCategoria } from '@/types/noticias.types'

export interface MetadataValues {
  titulo: string
  slug: string
  categoria: NoticiaCategoria
  fecha_evento: string
  imagen_portada: string
  resumen: string
  publicado: boolean
}

interface Props {
  values: MetadataValues
  onChange: (values: MetadataValues) => void
}

export default function MetadataForm({ values, onChange }: Props) {
  const [slugIsAutomatic, setSlugIsAutomatic] = useState(true)
  const [uploadingPortada, setUploadingPortada] = useState(false)
  const portadaRef = useRef<HTMLInputElement>(null)

  function handleTituloChange(titulo: string) {
    const next: MetadataValues = { ...values, titulo }
    if (slugIsAutomatic) next.slug = slugify(titulo)
    onChange(next)
  }

  function handleSlugChange(slug: string) {
    setSlugIsAutomatic(false)
    onChange({ ...values, slug })
  }

  async function handlePortadaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPortada(true)
    try {
      const url = await uploadToCloudinary(file)
      onChange({ ...values, imagen_portada: url })
    } catch {
      // silently fail — user sees no image
    } finally {
      setUploadingPortada(false)
    }
  }

  return (
    <div className="space-y-4 text-sm">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Información</h2>

      {/* Título */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Título *</label>
        <input
          type="text"
          value={values.titulo}
          onChange={e => handleTituloChange(e.target.value)}
          placeholder="Ej: We Tripantu 2025"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          URL (slug)
          {slugIsAutomatic && <span className="ml-1 text-gray-400 font-normal">— auto</span>}
        </label>
        <input
          type="text"
          value={values.slug}
          onChange={e => handleSlugChange(e.target.value)}
          placeholder="we-tripantu-2025"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <p className="text-xs text-gray-400 mt-0.5">/noticias/{values.slug || '...'}</p>
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Categoría *</label>
        <div className="flex gap-2">
          {(['noticia', 'evento'] as NoticiaCategoria[]).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => onChange({ ...values, categoria: cat })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors border
                ${values.categoria === cat
                  ? 'bg-primary text-white border-transparent'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Fecha evento */}
      {values.categoria === 'evento' && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Fecha del evento</label>
          <input
            type="date"
            value={values.fecha_evento}
            onChange={e => onChange({ ...values, fecha_evento: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      )}

      {/* Imagen portada */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Imagen portada</label>
        {values.imagen_portada ? (
          <div className="relative">
            <img
              src={values.imagen_portada}
              alt="Portada"
              className="w-full h-32 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={() => onChange({ ...values, imagen_portada: '' })}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white"
            >
              <X className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => portadaRef.current?.click()}
            disabled={uploadingPortada}
            className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
          >
            {uploadingPortada ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span className="text-xs">Subir imagen de portada</span>
              </>
            )}
          </button>
        )}
        <input ref={portadaRef} type="file" accept="image/*" className="hidden" onChange={handlePortadaUpload} />
      </div>

      {/* Resumen */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Resumen</label>
        <textarea
          value={values.resumen}
          onChange={e => onChange({ ...values, resumen: e.target.value })}
          placeholder="Breve descripción para las tarjetas y SEO..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Publicado */}
      <div className="pt-2 border-t border-gray-100">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium text-gray-700">Publicado</span>
          <button
            type="button"
            onClick={() => onChange({ ...values, publicado: !values.publicado })}
            className={`relative w-10 h-5 rounded-full transition-colors
              ${values.publicado ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform
              ${values.publicado ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
          </button>
        </label>
        <p className="text-xs text-gray-400 mt-1">
          {values.publicado ? 'Visible en el sitio web' : 'Borrador — no visible al público'}
        </p>
      </div>
    </div>
  )
}
