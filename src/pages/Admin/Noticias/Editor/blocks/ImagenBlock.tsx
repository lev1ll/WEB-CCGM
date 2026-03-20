import { useRef, useState } from 'react'
import { ImageIcon, Upload, X } from 'lucide-react'
import { uploadToCloudinary } from '@/lib/utils'
import type { BloqueContenidoMap } from '@/types/noticias.types'

interface Props {
  contenido: BloqueContenidoMap['imagen']
  onChange: (contenido: BloqueContenidoMap['imagen']) => void
}

export default function ImagenBlock({ contenido, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const url = await uploadToCloudinary(file)
      onChange({ ...contenido, url })
    } catch {
      setUploadError('Error al subir la imagen. Verifica la configuración de Cloudinary.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {contenido.url ? (
        <div className="relative">
          <img
            src={contenido.url}
            alt={contenido.caption || 'Imagen'}
            className="w-full max-h-72 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={() => onChange({ url: '', caption: contenido.caption })}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition"
          >
            <X className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <>
              <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
              <span className="text-sm">Subiendo...</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8" />
              <span className="text-sm font-medium">Haz clic para subir una imagen</span>
              <span className="text-xs">JPG, PNG, WEBP</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {uploadError && (
        <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">{uploadError}</p>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          <ImageIcon className="w-3 h-3 inline mr-1" />
          Descripción de la imagen (opcional)
        </label>
        <input
          type="text"
          placeholder="Ej: Acto de graduación 2025"
          value={contenido.caption}
          onChange={e => onChange({ ...contenido, caption: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
    </div>
  )
}
