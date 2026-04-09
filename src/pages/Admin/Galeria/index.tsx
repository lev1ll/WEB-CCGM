import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2, Loader2, AlertCircle, Upload, Check } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { uploadToCloudinary } from '@/lib/utils'
import type { GaleriaItem } from '@/types/noticias.types'

interface PendingPhoto {
  tempId: string
  file: File
  previewUrl: string
  caption: string
  uploading: boolean
  error: string | null
}

export default function AdminGaleria() {
  const { select, upsert, update, remove, isLoading, error } = useSupabaseQuery()
  const [items, setItems] = useState<GaleriaItem[]>([])
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<GaleriaItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  // captions en edición: id -> valor actual
  const [captions, setCaptions] = useState<Record<string, string>>({})
  const [savingCaption, setSavingCaption] = useState<string | null>(null)
  const [savedCaption, setSavedCaption] = useState<string | null>(null)
  // fotos pendientes de subir
  const [pending, setPending] = useState<PendingPhoto[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const data = await select<GaleriaItem>('galeria', { order: { column: 'created_at', ascending: false } })
    setItems(data)
    // inicializar captions
    const map: Record<string, string> = {}
    data.forEach(d => { map[d.id] = d.caption ?? '' })
    setCaptions(map)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    e.target.value = ''
    const newPending: PendingPhoto[] = files.map(file => ({
      tempId: `${Date.now()}-${Math.random()}`,
      file,
      previewUrl: URL.createObjectURL(file),
      caption: '',
      uploading: false,
      error: null,
    }))
    setPending(prev => [...prev, ...newPending])
  }

  async function uploadPending() {
    if (pending.length === 0) return
    setActionError(null)
    // marcar todas como uploading
    setPending(prev => prev.map(p => ({ ...p, uploading: true, error: null })))

    const updated = [...pending]

    for (let i = 0; i < updated.length; i++) {
      const p = updated[i]
      try {
        const url = await uploadToCloudinary(p.file)
        const r = await upsert('galeria', { url, caption: p.caption.trim(), orden: 0 })
        if (!r.success) throw new Error(r.error ?? 'Error al guardar')
        updated[i] = { ...p, uploading: false }
      } catch (err) {
        updated[i] = { ...p, uploading: false, error: err instanceof Error ? err.message : 'Error' }
      }
      setPending([...updated])
    }

    // limpiar los exitosos
    setPending(prev => prev.filter(p => p.error !== null))
    await load()
  }

  function removePending(tempId: string) {
    setPending(prev => prev.filter(p => p.tempId !== tempId))
  }

  function updatePendingCaption(tempId: string, caption: string) {
    setPending(prev => prev.map(p => p.tempId === tempId ? { ...p, caption } : p))
  }

  async function handleSaveCaption(id: string) {
    const caption = captions[id] ?? ''
    setSavingCaption(id)
    const r = await update('galeria', id, { caption })
    if (r.success) {
      setItems(prev => prev.map(x => x.id === id ? { ...x, caption } : x))
      setSavedCaption(id)
      setTimeout(() => setSavedCaption(null), 1500)
    } else {
      setActionError(r.error ?? 'Error al guardar')
    }
    setSavingCaption(null)
  }

  async function handleDelete(item: GaleriaItem) {
    setDeletingId(item.id)
    const r = await remove('galeria', item.id)
    if (r.success) {
      setItems(prev => prev.filter(x => x.id !== item.id))
    } else {
      setActionError(r.error ?? 'Error al eliminar')
    }
    setDeletingId(null)
    setConfirmDelete(null)
  }

  const anyUploading = pending.some(p => p.uploading)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galería</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} foto{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar fotos
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
      </div>

      {(actionError || error) && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" /> {actionError || error}
        </div>
      )}

      {/* Fotos pendientes de subir */}
      {pending.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">
              {pending.length} foto{pending.length !== 1 ? 's' : ''} lista{pending.length !== 1 ? 's' : ''} para subir
            </p>
            <button
              onClick={uploadPending}
              disabled={anyUploading}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {anyUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {anyUploading ? 'Subiendo...' : 'Subir todas'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {pending.map(p => (
              <div key={p.tempId} className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <div className="relative aspect-square">
                  <img src={p.previewUrl} alt="" className="w-full h-full object-cover" />
                  {p.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  {p.error && (
                    <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center p-2">
                      <p className="text-white text-[10px] text-center">{p.error}</p>
                    </div>
                  )}
                  {!p.uploading && (
                    <button
                      onClick={() => removePending(p.tempId)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="p-2">
                  <input
                    value={p.caption}
                    onChange={e => updatePendingCaption(p.tempId, e.target.value)}
                    placeholder="Caption (opcional)"
                    disabled={p.uploading}
                    className="w-full text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/40 disabled:opacity-50 bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isLoading && items.length === 0 && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
        </div>
      )}

      {!isLoading && items.length === 0 && pending.length === 0 && (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 py-16 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-300" />
          <p className="text-sm text-gray-400 font-medium">Haz clic para agregar fotos</p>
          <p className="text-xs text-gray-300">JPG, PNG, WEBP — múltiples a la vez</p>
        </div>
      )}

      {/* Fotos subidas */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(item => (
            <div key={item.id} className="rounded-xl overflow-hidden border border-gray-200 bg-white">
              <div className="aspect-square overflow-hidden">
                <img src={item.url} alt={item.caption ?? ''} className="w-full h-full object-cover" />
              </div>
              <div className="p-2 space-y-2">
                {/* Caption */}
                <div className="flex gap-1.5">
                  <input
                    value={captions[item.id] ?? ''}
                    onChange={e => setCaptions(prev => ({ ...prev, [item.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleSaveCaption(item.id)}
                    onBlur={() => {
                      if ((captions[item.id] ?? '') !== (item.caption ?? '')) {
                        handleSaveCaption(item.id)
                      }
                    }}
                    placeholder="Caption..."
                    className="flex-1 min-w-0 text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/40 bg-gray-50"
                  />
                  {savingCaption === item.id && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400 shrink-0 mt-1.5" />}
                  {savedCaption === item.id && <Check className="w-3.5 h-3.5 text-green-500 shrink-0 mt-1.5" />}
                </div>
                {/* Eliminar */}
                <button
                  onClick={() => setConfirmDelete(item)}
                  disabled={deletingId === item.id}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deletingId === item.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Trash2 className="w-3.5 h-3.5" />}
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
        {confirmDelete && (
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>¿Eliminar foto?</DialogTitle></DialogHeader>
            <div className="rounded-lg overflow-hidden border border-gray-200 mb-4">
              <img src={confirmDelete.url} alt="" className="w-full h-40 object-cover" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
              <button
                disabled={deletingId === confirmDelete.id}
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-50">
                {deletingId === confirmDelete.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Eliminar'}
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
