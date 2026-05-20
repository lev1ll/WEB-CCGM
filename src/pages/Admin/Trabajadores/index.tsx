import { useEffect, useRef, useState } from 'react'
import { Pencil, Plus, Trash2, Loader2, Upload, X, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import CropModal from '@/components/shared/CropModal'
import { uploadToCloudinary } from '@/lib/utils'
import type { Trabajador, TrabajadorCategoria } from '@/types/noticias.types'

const CATEGORIAS: { value: TrabajadorCategoria; label: string }[] = [
  { value: 'directivo', label: 'Equipo Directivo' },
  { value: 'docente',   label: 'Docentes' },
  { value: 'asistente', label: 'Asistentes de la Educación' },
]

const EMPTY_FORM = { name: '', role: '', categoria: 'docente' as TrabajadorCategoria, photo: '' }

export default function AdminTrabajadores() {
  const { select, upsert, remove, update: updateRow, isLoading, error } = useSupabaseQuery()
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Trabajador | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Trabajador | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [moving, setMoving] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const data = await select<Trabajador>('trabajadores', { order: { column: 'orden', ascending: true } })
    setTrabajadores(data)
  }

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setActionError(null)
    setDialogOpen(true)
  }

  function openEdit(t: Trabajador) {
    setEditing(t)
    setForm({ name: t.name, role: t.role, categoria: t.categoria, photo: t.photo })
    setActionError(null)
    setDialogOpen(true)
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setCropSrc(url)
    e.target.value = ''
  }

  async function handleCropConfirm(croppedFile: File) {
    setUploading(true)
    try {
      const url = await uploadToCloudinary(croppedFile)
      setForm(prev => ({ ...prev, photo: url }))
    } catch {
      setActionError('Error al subir la foto. Verifica la configuración de Cloudinary.')
    } finally {
      setUploading(false)
      setCropSrc(null)
    }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.role.trim()) {
      setActionError('Nombre y cargo son obligatorios.')
      return
    }
    setSaving(true)
    setActionError(null)
    const catCount = trabajadores.filter(t => t.categoria === form.categoria).length
    const payload = editing
      ? { id: editing.id, ...form }
      : { ...form, orden: catCount }
    const r = await upsert('trabajadores', payload as Record<string, unknown>)
    if (r.success) {
      await load()
      setDialogOpen(false)
    } else {
      setActionError(r.error ?? 'Error al guardar')
    }
    setSaving(false)
  }

  async function handleDelete(t: Trabajador) {
    setDeletingId(t.id)
    const r = await remove('trabajadores', t.id)
    if (r.success) {
      setTrabajadores(prev => prev.filter(x => x.id !== t.id))
    } else {
      setActionError(r.error ?? 'Error al eliminar')
    }
    setDeletingId(null)
    setConfirmDelete(null)
  }

  async function moveItem(categoria: TrabajadorCategoria, index: number, dir: 'up' | 'down') {
    const catItems = trabajadores
      .filter(t => t.categoria === categoria)
      .sort((a, b) => a.orden - b.orden)

    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= catItems.length) return

    setMoving(catItems[index].id)

    const newCat = [...catItems]
    ;[newCat[index], newCat[target]] = [newCat[target], newCat[index]]
    const withOrden = newCat.map((t, i) => ({ ...t, orden: i }))

    setTrabajadores(prev => {
      const map = new Map(withOrden.map(t => [t.id, t]))
      return prev.map(t => map.get(t.id) ?? t)
    })

    await Promise.all(withOrden.map(t =>
      updateRow('trabajadores', t.id, { orden: t.orden } as Record<string, unknown>)
    ))
    setMoving(null)
  }

  const initials = (name: string) =>
    name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipo</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestiona el personal que aparece en la página Nosotros</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar persona
        </button>
      </div>

      {actionError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {actionError}
        </div>
      )}

      {isLoading && trabajadores.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
        </div>
      ) : (
        <div className="space-y-8">
          {CATEGORIAS.map(cat => {
            const miembros = trabajadores
              .filter(t => t.categoria === cat.value)
              .sort((a, b) => a.orden - b.orden)
            return (
              <div key={cat.value}>
                <h2 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                  {cat.label} ({miembros.length})
                </h2>
                {miembros.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Sin personas en esta categoría.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {miembros.map((t, idx) => (
                      <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
                        {t.photo ? (
                          <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0 text-sm">
                            {initials(t.name)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{t.name}</p>
                          <p className="text-xs text-gray-500 truncate">{t.role}</p>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          {/* Flechas de orden */}
                          <div className="flex flex-col">
                            <button
                              onClick={() => moveItem(cat.value, idx, 'up')}
                              disabled={idx === 0 || moving === t.id}
                              className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              title="Mover arriba"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveItem(cat.value, idx, 'down')}
                              disabled={idx === miembros.length - 1 || moving === t.id}
                              className="p-0.5 rounded text-gray-300 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                              title="Mover abajo"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button onClick={() => openEdit(t)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setConfirmDelete(t)}
                            className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> Error al cargar: {error}
        </div>
      )}

      {/* ── Dialog agregar / editar ─────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={open => !open && setDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar persona' : 'Agregar persona'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Foto */}
            <div className="flex items-center gap-4">
              {form.photo ? (
                <div className="relative">
                  <img src={form.photo} alt="foto" className="w-16 h-16 rounded-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, photo: '' }))}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  {form.name ? (
                    <span className="font-bold text-lg">{initials(form.name)}</span>
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
              )}
              <div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  {uploading ? 'Subiendo...' : 'Subir foto'}
                </button>
                <p className="text-xs text-gray-400 mt-1">Opcional. JPG, PNG, WEBP.</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              </div>
            </div>

            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nombre completo *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: María González Rojas"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {/* Cargo */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Cargo *</label>
              <input
                type="text"
                value={form.role}
                onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                placeholder="Ej: Directora, Profesora 3° Básico, Coordinadora PIE..."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {/* Categoría */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Categoría *</label>
              <select
                value={form.categoria}
                onChange={e => setForm(prev => ({ ...prev, categoria: e.target.value as TrabajadorCategoria }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            {actionError && (
              <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">{actionError}</p>
            )}

            <div className="flex gap-2 pt-1">
              <button onClick={() => setDialogOpen(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : editing ? 'Guardar cambios' : 'Agregar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Crop modal ─────────────────────────────────────────────────── */}
      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          uploading={uploading}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}

      {/* ── Confirm delete ──────────────────────────────────────────────── */}
      <Dialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
        {confirmDelete && (
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>¿Eliminar persona?</DialogTitle></DialogHeader>
            <p className="text-sm text-gray-600">
              <strong>{confirmDelete.name}</strong> será eliminado/a del equipo permanentemente.
            </p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button disabled={deletingId === confirmDelete.id} onClick={() => handleDelete(confirmDelete)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">
                {deletingId === confirmDelete.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Eliminar'}
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
