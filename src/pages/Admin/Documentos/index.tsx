import { useEffect, useState } from 'react'
import { Plus, Trash2, Loader2, AlertCircle, FileText, ExternalLink } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { Documento, DocumentoCategoria } from '@/types/noticias.types'
import { formatDate } from '@/lib/utils'

const CATEGORIAS: { value: DocumentoCategoria; label: string }[] = [
  { value: 'lista_utiles', label: 'Lista de útiles' },
  { value: 'reglamento',   label: 'Reglamento' },
  { value: 'calendario',   label: 'Calendario y fechas' },
  { value: 'circular',     label: 'Circular' },
  { value: 'otro',         label: 'Otro' },
]

const CURSOS = [
  { value: '', label: 'Todos los cursos' },
  ...([1,2,3,4,5,6,7,8].map(n => ({ value: `${n}basico`, label: `${n}° Básico` }))),
]

const EMPTY_FORM = { titulo: '', descripcion: '', url: '', categoria: 'otro' as DocumentoCategoria, curso: '' }

export default function AdminDocumentos() {
  const { select, insert, remove, isLoading, error } = useSupabaseQuery()
  const [docs, setDocs] = useState<Documento[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Documento | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const data = await select<Documento>('documentos', { order: { column: 'created_at', ascending: false } })
    setDocs(data)
  }

  function openNew() {
    setForm(EMPTY_FORM)
    setActionError(null)
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.titulo.trim()) { setActionError('El título es obligatorio.'); return }
    if (!form.url.trim())    { setActionError('La URL del documento es obligatoria.'); return }
    setSaving(true)
    setActionError(null)
    const payload: Record<string, unknown> = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim() || null,
      url: form.url.trim(),
      categoria: form.categoria,
      curso: form.curso || null,
    }
    const r = await insert('documentos', payload)
    if (r.success) {
      await load()
      setDialogOpen(false)
    } else {
      setActionError(r.error ?? 'Error al guardar')
    }
    setSaving(false)
  }

  async function handleDelete(doc: Documento) {
    setDeletingId(doc.id)
    const r = await remove('documentos', doc.id)
    if (r.success) {
      setDocs(prev => prev.filter(x => x.id !== doc.id))
    } else {
      setActionError(r.error ?? 'Error al eliminar')
    }
    setDeletingId(null)
    setConfirmDelete(null)
  }

  const catLabel = (cat: string) => CATEGORIAS.find(c => c.value === cat)?.label ?? cat

  // Agrupar por categoría
  const grouped = CATEGORIAS.map(cat => ({
    ...cat,
    items: docs.filter(d => d.categoria === cat.value),
  })).filter(g => g.items.length > 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
          <p className="text-sm text-gray-500 mt-0.5">{docs.length} documento{docs.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar documento
        </button>
      </div>

      {(actionError || error) && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" /> {actionError || error}
        </div>
      )}

      {isLoading && docs.length === 0 && (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando...
        </div>
      )}

      {!isLoading && docs.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 py-16">
          <FileText className="w-8 h-8 text-gray-300" />
          <p className="text-sm text-gray-400 font-medium">No hay documentos aún</p>
          <button onClick={openNew} className="text-sm text-primary hover:underline">Agregar el primero</button>
        </div>
      )}

      {grouped.length > 0 && (
        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.value}>
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{group.label}</h2>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {group.items.map(doc => (
                  <div key={doc.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{doc.titulo}</p>
                      <p className="text-xs text-gray-400">
                        {doc.curso ? `${doc.curso.replace('basico', '° Básico')} · ` : ''}
                        {formatDate(doc.created_at)}
                      </p>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors shrink-0"
                      title="Abrir"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setConfirmDelete(doc)}
                      disabled={deletingId === doc.id}
                      className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                    >
                      {deletingId === doc.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog agregar */}
      <Dialog open={dialogOpen} onOpenChange={open => !open && setDialogOpen(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            {actionError && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{actionError}</p>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Título *</label>
              <input
                value={form.titulo}
                onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
                placeholder="Ej: Lista de útiles 2026 — 3° Básico"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Categoría *</label>
                <select
                  value={form.categoria}
                  onChange={e => setForm(p => ({ ...p, categoria: e.target.value as DocumentoCategoria }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                >
                  {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Curso</label>
                <select
                  value={form.curso}
                  onChange={e => setForm(p => ({ ...p, curso: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                >
                  {CURSOS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">URL del documento *</label>
              <input
                value={form.url}
                onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
                placeholder="https://drive.google.com/... o enlace directo al PDF"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <p className="text-[11px] text-gray-400">Pega el enlace de Google Drive, Dropbox o cualquier URL pública.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Descripción (opcional)</label>
              <textarea
                value={form.descripcion}
                onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                placeholder="Descripción breve del documento..."
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setDialogOpen(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Guardar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmar eliminar */}
      <Dialog open={!!confirmDelete} onOpenChange={open => !open && setConfirmDelete(null)}>
        {confirmDelete && (
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>¿Eliminar documento?</DialogTitle></DialogHeader>
            <p className="text-sm text-gray-600">
              <strong>{confirmDelete.titulo}</strong> será eliminado permanentemente.
            </p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancelar
              </button>
              <button disabled={deletingId === confirmDelete.id} onClick={() => handleDelete(confirmDelete)}
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
