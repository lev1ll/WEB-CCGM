import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2, Loader2, AlertCircle, Upload, X, Check } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { uploadToCloudinary } from '@/lib/utils'
import type { GaleriaItem } from '@/types/noticias.types'

export default function AdminGaleria() {
  const { select, upsert, update, remove, isLoading, error } = useSupabaseQuery()
  const [items, setItems] = useState<GaleriaItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<GaleriaItem | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editCaption, setEditCaption] = useState<{ id: string; value: string } | null>(null)
  const [savingCaption, setSavingCaption] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const data = await select<GaleriaItem>('galeria', { order: { column: 'created_at', ascending: false } })
    setItems(data)
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    e.target.value = ''
    setUploading(true)
    setActionError(null)
    try {
      for (const file of files) {
        const url = await uploadToCloudinary(file)
        const r = await upsert('galeria', { url, caption: '', orden: 0 })
        if (!r.success) throw new Error(r.error ?? 'Error al guardar')
      }
      await load()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error al subir fotos')
    } finally {
      setUploading(false)
    }
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

  async function saveCaption(id: string, caption: string) {
    setSavingCaption(true)
    const r = await update('galeria', id, { caption })
    if (r.success) {
      setItems(prev => prev.map(x => x.id === id ? { ...x, caption } : x))
      setSavedId(id)
      setTimeout(() => setSavedId(null), 1500)
      setEditCaption(null)
    } else {
      setActionError(r.error ?? 'Error al guardar')
    }
    setSavingCaption(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galería</h1>
          <p className="text-sm text-gray-500 mt-0.5">{items.length} foto{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {uploading ? 'Subiendo...' : 'Subir fotos'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>

      {(actionError || error) && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" /> {actionError || error}
        </div>
      )}

      {isLoading && items.length === 0 && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 py-16 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-300" />
          <p className="text-sm text-gray-400 font-medium">Haz clic para subir fotos</p>
          <p className="text-xs text-gray-300">JPG, PNG, WEBP — múltiples a la vez</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map(item => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.url}
                  alt={item.caption ?? ''}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Caption + delete overlay */}
              <div className="p-2 space-y-1.5">
                {editCaption?.id === item.id ? (
                  <div className="flex gap-1">
                    <input
                      autoFocus
                      value={editCaption.value}
                      onChange={e => setEditCaption({ id: item.id, value: e.target.value })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveCaption(item.id, editCaption.value)
                        if (e.key === 'Escape') setEditCaption(null)
                      }}
                      placeholder="Caption..."
                      className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />
                    <button
                      onClick={() => saveCaption(item.id, editCaption.value)}
                      disabled={savingCaption}
                      className="p-1 rounded-md bg-primary text-white"
                    >
                      {savingCaption ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                    </button>
                    <button onClick={() => setEditCaption(null)} className="p-1 rounded-md text-gray-400 hover:text-gray-600">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditCaption({ id: item.id, value: item.caption ?? '' })}
                    className="w-full text-left text-xs text-gray-400 hover:text-gray-700 truncate transition-colors"
                  >
                    {savedId === item.id
                      ? <span className="text-green-600 font-medium">✓ Guardado</span>
                      : item.caption || <span className="italic">Agregar caption...</span>}
                  </button>
                )}
              </div>

              <button
                onClick={() => setConfirmDelete(item)}
                disabled={deletingId === item.id}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                {deletingId === item.id
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : <Trash2 className="w-3.5 h-3.5" />}
              </button>
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
            {confirmDelete.caption && (
              <p className="text-sm text-gray-500 mb-4">"{confirmDelete.caption}"</p>
            )}
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
