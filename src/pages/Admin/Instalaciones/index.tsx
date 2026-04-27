import { useEffect, useRef, useState } from 'react'
import { Loader2, Upload, Trash2, Monitor, Dumbbell, TreePine, UtensilsCrossed, School } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { uploadToCloudinary } from '@/lib/utils'
import { INSTALACIONES } from '@/constants/instalaciones'
import CropModal from '@/components/shared/CropModal'

const ICON_MAP = { Monitor, Dumbbell, TreePine, UtensilsCrossed, School } as const
type IconName = keyof typeof ICON_MAP

export default function AdminInstalaciones() {
  const [fotos, setFotos] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropTarget, setCropTarget] = useState<string | null>(null)
  const [cropUploading, setCropUploading] = useState(false)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => { load() }, [])

  async function load() {
    if (!supabase) return
    setLoading(true)
    const { data, error: dbError } = await supabase.from('instalacion_fotos').select('instalacion,src')
    if (dbError) setError(`Error al cargar fotos: ${dbError.message}`)
    const map: Record<string, string> = {}
    ;(data ?? []).forEach((d: { instalacion: string; src: string }) => { map[d.instalacion] = d.src })
    setFotos(map)
    setLoading(false)
  }

  function handleFileSelect(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    // Abrir CropModal para reencuadrar
    const url = URL.createObjectURL(file)
    setCropTarget(id)
    setCropSrc(url)
  }

  async function handleCropConfirm(croppedFile: File) {
    if (!cropTarget) return
    const id = cropTarget
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    setCropTarget(null)
    setCropUploading(true)
    setUploading(id)
    setError(null)
    try {
      const url = await uploadToCloudinary(croppedFile)
      const { error: dbError } = await supabase!
        .from('instalacion_fotos')
        .upsert({ instalacion: id, src: url, updated_at: new Date().toISOString() }, { onConflict: 'instalacion' })
      if (dbError) throw dbError
      await load()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Error desconocido'
      setError(`Error al guardar la foto: ${msg}`)
    } finally {
      setUploading(null)
      setCropUploading(false)
    }
  }

  function handleCropCancel() {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    setCropTarget(null)
  }

  async function handleDelete(id: string) {
    if (!supabase) return
    setUploading(id)
    setConfirmDelete(null)
    await supabase.from('instalacion_fotos').delete().eq('instalacion', id)
    setFotos(prev => { const next = { ...prev }; delete next[id]; return next })
    setUploading(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Fotos de Instalaciones</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Sube una foto por instalación para mostrarla en la sección "Nosotros".
          Si no hay foto subida se usa la imagen predeterminada.
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
          {INSTALACIONES.map(({ id, name, image: fallback, icon }) => {
            const Icon = ICON_MAP[icon as IconName]
            const foto = fotos[id] ?? fallback
            const hasCustom = !!fotos[id]
            const isUploading = uploading === id
            return (
              <div key={id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Preview */}
                <div className="relative h-44 overflow-hidden bg-gray-100 flex items-center justify-center">
                  {foto ? (
                    <img src={foto} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon className="w-14 h-14 text-gray-300" />
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                  {/* Badge si es foto personalizada */}
                  {hasCustom && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                      Personalizada
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-1.5">
                    <p className="text-white text-sm font-bold">{name}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 flex gap-2">
                  <button
                    onClick={() => fileRefs.current[id]?.click()}
                    disabled={isUploading}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {hasCustom ? 'Cambiar foto' : 'Subir foto'}
                  </button>
                  {hasCustom && (
                    <button
                      onClick={() => setConfirmDelete(id)}
                      disabled={isUploading}
                      className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 disabled:opacity-60 transition-colors"
                      title="Quitar foto personalizada"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <input
                    ref={el => { fileRefs.current[id] = el }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleFileSelect(id, e)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* CropModal al seleccionar imagen */}
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

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-gray-900">¿Quitar foto personalizada?</h3>
            <p className="text-sm text-gray-500">
              Se volverá a mostrar la imagen predeterminada de{' '}
              <strong>{INSTALACIONES.find(i => i.id === confirmDelete)?.name}</strong>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Quitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
