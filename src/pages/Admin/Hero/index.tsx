import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2, Loader2, Upload, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { uploadToCloudinary } from '@/lib/utils'
import CropModal from '@/components/shared/CropModal'

const MAX_SLIDES = 5

// 9 posiciones (3×3) — fila: vertical, col: horizontal
const POSITIONS = [
  { v: 'top',    h: 'left',   value: 'top left'      },
  { v: 'top',    h: 'center', value: 'top center'    },
  { v: 'top',    h: 'right',  value: 'top right'     },
  { v: 'center', h: 'left',   value: 'center left'   },
  { v: 'center', h: 'center', value: 'center'        },
  { v: 'center', h: 'right',  value: 'center right'  },
  { v: 'bottom', h: 'left',   value: 'bottom left'   },
  { v: 'bottom', h: 'center', value: 'bottom center' },
  { v: 'bottom', h: 'right',  value: 'bottom right'  },
]

interface HeroSlide {
  id: string
  src: string
  alt: string
  orden: number
  activo: boolean
  object_position: string
  created_at: string
}

interface PendingSlide {
  tempId: string
  file: File
  previewUrl: string
  alt: string
  uploading: boolean
  error: string | null
}

export default function AdminHero() {
  const { select, upsert, update, remove } = useSupabaseQuery()
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState<PendingSlide[]>([])
  const [confirmDelete, setConfirmDelete] = useState<HeroSlide | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const isFull = slides.length + pending.length >= MAX_SLIDES
  const [savingAlt, setSavingAlt] = useState<string | null>(null)
  const [alts, setAlts] = useState<Record<string, string>>({})
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropUploading, setCropUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const data = await select<HeroSlide>('hero_slides', {
      order: { column: 'orden', ascending: true },
    })
    setSlides(data)
    const map: Record<string, string> = {}
    data.forEach(d => { map[d.id] = d.alt })
    setAlts(map)
    setLoading(false)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const slots = MAX_SLIDES - slides.length - pending.length
    if (slots <= 0) {
      setActionError(`Máximo ${MAX_SLIDES} imágenes en el carrusel.`)
      return
    }
    setActionError(null)
    // Abrir CropModal para reencuadrar antes de agregar a pending
    const url = URL.createObjectURL(file)
    setCropSrc(url)
  }

  function handleCropConfirm(croppedFile: File) {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
    const newPending: PendingSlide = {
      tempId: `${Date.now()}-${Math.random()}`,
      file: croppedFile,
      previewUrl: URL.createObjectURL(croppedFile),
      alt: '',
      uploading: false,
      error: null,
    }
    setPending(prev => [...prev, newPending])
  }

  function handleCropCancel() {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
  }

  async function uploadPending(tempId: string) {
    const item = pending.find(p => p.tempId === tempId)
    if (!item) return
    setPending(prev => prev.map(p => p.tempId === tempId ? { ...p, uploading: true, error: null } : p))
    try {
      const url = await uploadToCloudinary(item.file)
      const existing = await select<HeroSlide>('hero_slides', { order: { column: 'orden', ascending: false }, limit: 1 })
      const nextOrden = existing.length > 0 ? existing[0].orden + 1 : 0
      await upsert('hero_slides', {
        src: url,
        alt: item.alt || 'Imagen del carrusel',
        orden: nextOrden,
        activo: true,
        object_position: 'center',
      })
      setPending(prev => prev.filter(p => p.tempId !== tempId))
      URL.revokeObjectURL(item.previewUrl)
      await load()
    } catch {
      setPending(prev => prev.map(p =>
        p.tempId === tempId ? { ...p, uploading: false, error: 'Error al subir. Intenta de nuevo.' } : p
      ))
    }
  }

  async function uploadAll() {
    for (const p of pending) {
      if (!p.uploading) await uploadPending(p.tempId)
    }
  }

  async function handleDelete(slide: HeroSlide) {
    setDeletingId(slide.id)
    setActionError(null)
    await remove('hero_slides', slide.id)
    setConfirmDelete(null)
    setDeletingId(null)
    await load()
  }

  async function toggleActivo(slide: HeroSlide) {
    await update('hero_slides', slide.id, { activo: !slide.activo })
    await load()
  }

  async function moveSlide(slide: HeroSlide, dir: 'up' | 'down') {
    const idx = slides.findIndex(s => s.id === slide.id)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= slides.length) return
    await Promise.all([
      update('hero_slides', slides[idx].id,     { orden: swapIdx }),
      update('hero_slides', slides[swapIdx].id, { orden: idx }),
    ])
    await load()
  }

  async function saveAlt(slide: HeroSlide) {
    setSavingAlt(slide.id)
    await update('hero_slides', slide.id, { alt: alts[slide.id] ?? slide.alt })
    setSavingAlt(null)
    await load()
  }

  async function savePosition(slide: HeroSlide, position: string) {
    // Optimistic update
    setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, object_position: position } : s))
    await update('hero_slides', slide.id, { object_position: position })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Carrusel del Hero</h1>
          <p className="text-sm text-gray-500 mt-0.5">Imágenes que rotan en la portada del sitio</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isFull}
          title={isFull ? `Máximo ${MAX_SLIDES} imágenes` : undefined}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar foto {slides.length + pending.length}/{MAX_SLIDES}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </div>

      {actionError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {actionError}
        </div>
      )}

      {/* Pending uploads */}
      {pending.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-amber-900">{pending.length} foto(s) por subir</p>
            <button
              onClick={uploadAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Subir todo
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pending.map(p => (
              <div key={p.tempId} className="flex gap-3 bg-white rounded-lg border border-amber-200 p-3">
                <img src={p.previewUrl} alt="" className="w-20 h-14 object-cover rounded-md shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <input
                    type="text"
                    placeholder="Descripción de la imagen"
                    value={p.alt}
                    onChange={e => setPending(prev => prev.map(x => x.tempId === p.tempId ? { ...x, alt: e.target.value } : x))}
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                  {p.error && <p className="text-xs text-red-500">{p.error}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={() => uploadPending(p.tempId)}
                      disabled={p.uploading}
                      className="text-xs px-2 py-1 rounded bg-primary text-white disabled:opacity-60 hover:bg-primary/90 transition-colors"
                    >
                      {p.uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Subir'}
                    </button>
                    <button
                      onClick={() => { URL.revokeObjectURL(p.previewUrl); setPending(prev => prev.filter(x => x.tempId !== p.tempId)) }}
                      className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slides list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Upload className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Sin imágenes aún</p>
          <p className="text-sm mt-1">Agrega fotos para el carrusel del hero</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, idx) => {
            const currentPos = slide.object_position ?? 'center'
            return (
              <div
                key={slide.id}
                className={`flex gap-3 items-start bg-white rounded-xl border p-3 transition-opacity ${!slide.activo ? 'opacity-50' : 'border-gray-200'}`}
              >
                {/* Preview con posición aplicada */}
                <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: currentPos }}
                  />
                </div>

                {/* Alt + posición */}
                <div className="flex-1 min-w-0 space-y-2">
                  <input
                    type="text"
                    value={alts[slide.id] ?? slide.alt}
                    onChange={e => setAlts(prev => ({ ...prev, [slide.id]: e.target.value }))}
                    onBlur={() => saveAlt(slide)}
                    placeholder="Descripción"
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {savingAlt === slide.id && <p className="text-xs text-primary">Guardando...</p>}

                  {/* Selector de posición 3×3 */}
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wide">Foco de imagen</p>
                    <div className="grid grid-cols-3 gap-0.5 w-fit">
                      {POSITIONS.map(pos => {
                        const active = currentPos === pos.value
                        return (
                          <button
                            key={pos.value}
                            onClick={() => savePosition(slide, pos.value)}
                            title={pos.value}
                            className={`w-6 h-6 rounded transition-all ${
                              active
                                ? 'bg-primary shadow-sm'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <span className={`block w-2 h-2 rounded-full mx-auto ${active ? 'bg-white' : 'bg-gray-400'}`} />
                          </button>
                        )
                      })}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Posición {idx + 1} de {slides.length} · foco: <span className="font-medium text-gray-500">{currentPos}</span>
                    </p>
                  </div>
                </div>

                {/* Mover arriba/abajo */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveSlide(slide, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    title="Subir"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => moveSlide(slide, 'down')}
                    disabled={idx === slides.length - 1}
                    className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
                    title="Bajar"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Ojo + eliminar */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => toggleActivo(slide)}
                    className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                    title={slide.activo ? 'Ocultar' : 'Mostrar'}
                  >
                    {slide.activo
                      ? <Eye className="w-4 h-4 text-green-500" />
                      : <EyeOff className="w-4 h-4 text-gray-400" />
                    }
                  </button>
                  <button
                    onClick={() => setConfirmDelete(slide)}
                    className="p-1.5 rounded hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
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
          aspect={16 / 9}
          cropShape="rect"
          outputSize={1600}
          uploading={cropUploading}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-gray-900">¿Eliminar esta imagen?</h3>
            <img src={confirmDelete.src} alt={confirmDelete.alt} className="w-full h-32 object-cover rounded-lg" />
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete.id}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {deletingId === confirmDelete.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
