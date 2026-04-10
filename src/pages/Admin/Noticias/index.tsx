import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import type { Noticia } from '@/types/noticias.types'
import { formatDate } from '@/lib/utils'

type SortMode = 'todas' | 'publicadas' | 'borradores'

export default function AdminNoticiasPage() {
  const { select, update, remove, isLoading } = useSupabaseQuery()
  const [items, setItems] = useState<Noticia[]>([])
  const [deleteTarget, setDeleteTarget] = useState<Noticia | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [sort, setSort] = useState<SortMode>('todas')

  useEffect(() => { load() }, [])

  async function load() {
    const data = await select<Noticia>('noticias', {
      order: { column: 'created_at', ascending: false },
    })
    setItems(data)
  }

  async function togglePublicado(id: string, current: boolean) {
    await update('noticias', id, { publicado: !current })
    setItems(prev => prev.map(n => n.id === id ? { ...n, publicado: !current } : n))
  }

  async function toggleDestacada(id: string, current: boolean) {
    await update('noticias', id, { destacada: !current })
    setItems(prev => prev.map(n => n.id === id ? { ...n, destacada: !current } : n))
  }

  const sorted = [...items]
    .filter(n => {
      if (sort === 'publicadas') return n.publicado
      if (sort === 'borradores') return !n.publicado
      return true
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    await remove('noticias', deleteTarget.id)
    setItems(prev => prev.filter(n => n.id !== deleteTarget.id))
    setDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Noticias y Eventos</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona el contenido publicado en el sitio</p>
        </div>
        <Link
          to="/admin/noticias/nueva"
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva
        </Link>
      </div>

      {/* Tabs filtro */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-semibold w-full sm:w-auto">
        {([
          { value: 'todas',     label: 'Todas' },
          { value: 'publicadas', label: 'Publicadas' },
          { value: 'borradores', label: 'Borradores' },
        ] as { value: SortMode; label: string }[]).map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSort(value)}
            className={`flex-1 sm:flex-none px-4 py-2.5 transition-colors
              ${sort === value ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-500 mb-3">No hay noticias todavía.</p>
            <Link
              to="/admin/noticias/nueva"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear la primera noticia
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[540px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Título</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Categoría</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Fecha</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.map(n => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/admin/noticias/${n.id}/editar`} className="group/title">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 line-clamp-1 group-hover/title:text-primary transition-colors">{n.titulo}</p>
                          {n.destacada && (
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" aria-label="Destacada" />
                          )}
                        </div>
                        <p className="text-xs text-gray-400 font-mono">/noticias/{n.slug}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize
                        ${n.categoria === 'evento' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {n.categoria}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePublicado(n.id, n.publicado)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors
                          ${n.publicado
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                      >
                        {n.publicado ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {n.publicado ? 'Publicado' : 'Borrador'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap hidden md:table-cell">
                      {formatDate(n.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleDestacada(n.id, n.destacada)}
                          className={`p-1.5 rounded-md transition-colors
                            ${n.destacada ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50'}`}
                          title={n.destacada ? 'Quitar destacada' : 'Marcar como destacada'}
                        >
                          <Star className={`w-4 h-4 ${n.destacada ? 'fill-amber-500' : ''}`} />
                        </button>
                        <Link
                          to={`/admin/noticias/${n.id}/editar`}
                          className="hidden sm:block p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(n)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar noticia</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres eliminar <strong>"{deleteTarget?.titulo}"</strong>?
            Esta acción no se puede deshacer.
          </p>
          <DialogFooter>
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-60 transition-colors"
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
