import { useRef, useState } from 'react'
import { Upload, X, ChevronUp, ChevronDown, Images } from 'lucide-react'
import { uploadToCloudinary } from '@/lib/utils'
import type { BloqueContenidoMap, CarruselItem } from '@/types/noticias.types'

interface Props {
  contenido: BloqueContenidoMap['carrusel']
  onChange: (contenido: BloqueContenidoMap['carrusel']) => void
}

export default function CarruselBlock({ contenido, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setUploadError(null)
    try {
      const uploaded = await Promise.all(
        files.map(async f => {
          const url = await uploadToCloudinary(f)
          return { url, caption: '' } satisfies CarruselItem
        })
      )
      onChange({ items: [...contenido.items, ...uploaded] })
    } catch {
      setUploadError('Error al subir imagen(es). Verifica la configuración de Cloudinary.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function updateCaption(index: number, caption: string) {
    const items = contenido.items.map((item, i) => i === index ? { ...item, caption } : item)
    onChange({ items })
  }

  function removeItem(index: number) {
    onChange({ items: contenido.items.filter((_, i) => i !== index) })
  }

  function moveItem(index: number, dir: 'up' | 'down') {
    const items = [...contenido.items]
    const swap = dir === 'up' ? index - 1 : index + 1
    ;[items[index], items[swap]] = [items[swap], items[index]]
    onChange({ items })
  }

  return (
    <div className="space-y-3">
      {contenido.items.length === 0 ? (
        <div className="h-28 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Images className="w-8 h-8 mx-auto mb-1 opacity-40" />
            <p className="text-xs">Agrega imágenes al carrusel</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {contenido.items.map((item, i) => (
            <div key={i} className="flex gap-3 items-center bg-gray-50 rounded-lg p-2 border border-gray-200">
              <img
                src={item.url}
                alt={item.caption || `Imagen ${i + 1}`}
                className="w-16 h-12 object-cover rounded flex-shrink-0"
              />
              <input
                type="text"
                placeholder="Descripción (opcional)"
                value={item.caption}
                onChange={e => updateCaption(i, e.target.value)}
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary bg-white"
              />
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => moveItem(i, 'up')}
                  className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={i === contenido.items.length - 1}
                  onClick={() => moveItem(i, 'down')}
                  className="p-0.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
      >
        {uploading ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        {uploading ? 'Subiendo...' : 'Agregar imagen(es)'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

      {uploadError && (
        <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">{uploadError}</p>
      )}
    </div>
  )
}
