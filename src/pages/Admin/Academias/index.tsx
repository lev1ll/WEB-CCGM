import { useEffect, useState } from 'react'
import { Loader2, Upload, Trash2, Trophy, Dumbbell, Music, Calculator, Recycle, Globe } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { uploadToCloudinary } from '@/lib/utils'
import CropModal from '@/components/shared/CropModal'

const ACADEMIAS = [
  { nombre: 'Fútbol',        icon: Trophy,      color: 'bg-emerald-600' },
  { nombre: 'Polideportivo', icon: Dumbbell,    color: 'bg-teal-600'    },
  { nombre: 'Danza',         icon: Music,       color: 'bg-rose-500'    },
  { nombre: 'Matemáticas',   icon: Calculator,  color: 'bg-amber-500'   },
  { nombre: 'Reciclaje',     icon: Recycle,     color: 'bg-lime-600'    },
  { nombre: 'Inglés',        icon: Globe,       color: 'bg-blue-600'    },
]

export default function AdminAcademias() {
  const [fotos, setFotos] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropAcademia, setCropAcademia] = useState<string | null>(null)
  const [cropUploading, setCropUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    if (!supabase) return
    setLoading(true)
    const { data } = await supabase.from('academia_fotos').select('academia,src')
    const map: Record<string, string> = {}
    ;(data ?? []).forEach((d: { academia: string; src: string }) => { map[d.academia] = d.src })
    setFotos(map)
    setLoading(false)
  }

  function handleFileSelect(nombre: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setCropAcademia(nombre)
    setCropSrc(URL.createObjectURL(file))
  }

  async function handleCropConfirm(croppedFile: File) {
    if (!cropAcademia) return
    const nombre = cropAcademia
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null); setCropAcademia(null); setCropUploading(true); setUploading(nombre); setError(null)
    try {
      const url = await uploadToCloudinary(croppedFile)
      await supabase!
        .from('academia_fotos')
        .upsert({ academia: nombre, src: url, alt: nombre, updated_at: new Date().toISOString() }, { onConflict: 'academia' })
      await load()
    } catch {
      setError(`Error al subir foto de ${nombre}.`)
    } finally {
      setUploading(null); setCropUploading(false)
    }
  }

  function handleCropCancel() {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null); setCropAcademia(null)
  }

  async function handleDelete(nombre: string) {
    if (!supabase) return
    setUploading(nombre)
    await supabase.from('academia_fotos').delete().eq('academia', nombre)
    setFotos(prev => { const next = { ...prev }; delete next[nombre]; return next })
    setUploading(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Fotos de Academias</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Sube una foto por academia para mostrarla en el carrusel de Niveles.
          Si no hay foto, se muestra el fondo de color.
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACADEMIAS.map(({ nombre, icon: Icon, color }) => {
            const foto = fotos[nombre]
            const isUploading = uploading === nombre
            const fileId = `foto-academia-${nombre}`
            return (
              <div key={nombre} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Preview */}
                <div className={`relative h-40 ${foto ? '' : color} flex items-center justify-center`}>
                  {foto ? (
                    <img src={foto} alt={nombre} className="w-full h-full object-cover" />
                  ) : (
                    <Icon className="w-14 h-14 text-white/60" />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-1.5">
                    <p className="text-white text-sm font-bold">{nombre}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 flex gap-2">
                  <label
                    htmlFor={fileId}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors cursor-pointer ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {foto ? 'Cambiar foto' : 'Subir foto'}
                  </label>
                  <input
                    id={fileId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleFileSelect(nombre, e)}
                  />
                  {foto && (
                    <button
                      onClick={() => handleDelete(nombre)}
                      disabled={isUploading}
                      className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 disabled:opacity-60 transition-colors"
                      title="Quitar foto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          aspect={4 / 3}
          cropShape="rect"
          outputSize={1200}
          uploading={cropUploading}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  )
}
