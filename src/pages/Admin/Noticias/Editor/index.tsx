import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Eye, Send } from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import MetadataForm, { type MetadataValues } from './MetadataForm'
import BlockList from './BlockList'
import type { LocalBloque, Bloque, BloqueContenidoMap, BloqueType } from '@/types/noticias.types'

const DEFAULT_METADATA: MetadataValues = {
  titulo: '',
  slug: '',
  categoria: 'noticia',
  fecha_evento: '',
  imagen_portada: '',
  resumen: '',
  publicado: false,
  destacada: false,
}

export default function NoticiaEditorPage() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const { upsert, removeWhere, bulkInsert, select } = useSupabaseQuery()

  const [metadata, setMetadata] = useState<MetadataValues>(DEFAULT_METADATA)
  const [bloques, setBloques] = useState<LocalBloque[]>([])
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(!!id)

  useEffect(() => {
    if (!id) return
    async function load() {
      const noticias = await select<MetadataValues & { id: string }>('noticias', {
        filter: { id },
        select: 'id,titulo,slug,categoria,fecha_evento,imagen_portada,resumen,publicado,destacada',
      })
      const noticia = noticias[0]
      if (!noticia) { navigate('/admin/noticias'); return }

      setMetadata({
        titulo: noticia.titulo,
        slug: noticia.slug,
        categoria: noticia.categoria as MetadataValues['categoria'],
        fecha_evento: noticia.fecha_evento ?? '',
        imagen_portada: noticia.imagen_portada ?? '',
        resumen: noticia.resumen ?? '',
        publicado: noticia.publicado,
        destacada: (noticia as MetadataValues & { destacada: boolean }).destacada ?? false,
      })

      const rawBloques = await select<Bloque>('noticias_bloques', {
        filter: { noticia_id: id },
        order: { column: 'orden', ascending: true },
      })
      const local: LocalBloque[] = rawBloques.map(b => ({
        _tempId: b.id,
        tipo: b.tipo as BloqueType,
        contenido: b.contenido as BloqueContenidoMap[BloqueType],
      }))
      setBloques(local)
      setIsLoading(false)
    }
    load()
  }, [id])

  async function handleSave(publicar?: boolean) {
    if (!metadata.titulo.trim()) {
      setSaveError('El título es obligatorio.')
      return
    }
    if (!metadata.slug.trim()) {
      setSaveError('El slug es obligatorio.')
      return
    }
    setSaving(true)
    setSaveError(null)

    // 1. Upsert noticia
    const payload = {
      ...(id ? { id } : {}),
      titulo: metadata.titulo,
      slug: metadata.slug,
      categoria: metadata.categoria,
      fecha_evento: metadata.fecha_evento || null,
      imagen_portada: metadata.imagen_portada || null,
      resumen: metadata.resumen || null,
      publicado: publicar !== undefined ? publicar : metadata.publicado,
      destacada: metadata.destacada,
    }
    const { success, id: savedId, error } = await upsert('noticias', payload)
    if (!success || !savedId) {
      setSaveError(error ?? 'Error al guardar. El slug puede estar duplicado.')
      setSaving(false)
      return
    }

    // 2. Delete existing bloques
    await removeWhere('noticias_bloques', 'noticia_id', savedId)

    // 3. Insert bloques con orden
    if (bloques.length > 0) {
      const rows = bloques.map((b, i) => ({
        noticia_id: savedId,
        tipo: b.tipo,
        orden: i,
        contenido: b.contenido,
      }))
      const { success: bSuccess, error: bError } = await bulkInsert('noticias_bloques', rows)
      if (!bSuccess) {
        setSaveError(bError ?? 'Error al guardar los bloques.')
        setSaving(false)
        return
      }
    }

    setSaving(false)
    navigate('/admin/noticias')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/noticias')}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          title="Volver"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">
            {id ? 'Editar noticia' : 'Nueva noticia'}
          </h1>
        </div>
        {metadata.slug && metadata.publicado && (
          <a
            href={`/noticias/${metadata.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Eye className="w-4 h-4" /> Ver
          </a>
        )}
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : 'Guardar borrador'}
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          <Send className="w-4 h-4" />
          {saving ? 'Guardando...' : 'Publicar'}
        </button>
      </div>

      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {saveError}
        </div>
      )}

      {/* Two-panel layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-5 items-start">
        {/* Blocks — left / main */}
        <div className="flex-1 min-w-0">
          <BlockList bloques={bloques} onChange={setBloques} />
        </div>

        {/* Metadata — right / sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 bg-white rounded-xl border border-gray-200 p-5 lg:sticky lg:top-20">
          <MetadataForm values={metadata} onChange={setMetadata} />
        </div>
      </div>
    </div>
  )
}
