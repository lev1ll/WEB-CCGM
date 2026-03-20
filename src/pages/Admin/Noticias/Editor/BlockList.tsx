import { ChevronUp, ChevronDown, Trash2, Type, Image, Youtube, Images } from 'lucide-react'
import type { BloqueType, LocalBloque, BloqueContenidoMap } from '@/types/noticias.types'
import TextoBlock from './blocks/TextoBlock'
import ImagenBlock from './blocks/ImagenBlock'
import VideoBlock from './blocks/VideoBlock'
import CarruselBlock from './blocks/CarruselBlock'

interface Props {
  bloques: LocalBloque[]
  onChange: (bloques: LocalBloque[]) => void
}

const TIPO_LABELS: Record<BloqueType, { label: string; icon: React.ElementType }> = {
  texto:    { label: 'Texto',    icon: Type },
  imagen:   { label: 'Imagen',   icon: Image },
  video:    { label: 'Video',    icon: Youtube },
  carrusel: { label: 'Carrusel', icon: Images },
}

function defaultContenido(tipo: BloqueType): BloqueContenidoMap[BloqueType] {
  switch (tipo) {
    case 'texto':    return { html: '' }
    case 'imagen':   return { url: '', caption: '' }
    case 'video':    return { url: '', title: '' }
    case 'carrusel': return { items: [] }
  }
}

export default function BlockList({ bloques, onChange }: Props) {
  function addBlock(tipo: BloqueType) {
    const newBloque: LocalBloque = {
      _tempId: `${tipo}-${Date.now()}`,
      tipo,
      contenido: defaultContenido(tipo),
    }
    onChange([...bloques, newBloque])
  }

  function removeBlock(tempId: string) {
    onChange(bloques.filter(b => b._tempId !== tempId))
  }

  function moveBlock(index: number, dir: 'up' | 'down') {
    const next = [...bloques]
    const swap = dir === 'up' ? index - 1 : index + 1
    ;[next[index], next[swap]] = [next[swap], next[index]]
    onChange(next)
  }

  function updateBlock(tempId: string, contenido: BloqueContenidoMap[BloqueType]) {
    onChange(bloques.map(b => b._tempId === tempId ? { ...b, contenido } : b))
  }

  return (
    <div className="space-y-4">
      {bloques.length === 0 && (
        <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm">No hay bloques todavía.</p>
          <p className="text-xs mt-1">Agrega contenido con los botones de abajo.</p>
        </div>
      )}

      {bloques.map((bloque, i) => {
        const { label, icon: Icon } = TIPO_LABELS[bloque.tipo]
        return (
          <div key={bloque._tempId} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Block header */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
              <Icon className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</span>
              <div className="flex-1" />
              <button
                type="button"
                disabled={i === 0}
                onClick={() => moveBlock(i, 'up')}
                className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                title="Mover arriba"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={i === bloques.length - 1}
                onClick={() => moveBlock(i, 'down')}
                className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 transition-colors"
                title="Mover abajo"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => removeBlock(bloque._tempId)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Eliminar bloque"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Block editor */}
            <div className="p-4">
              {bloque.tipo === 'texto' && (
                <TextoBlock
                  contenido={bloque.contenido as BloqueContenidoMap['texto']}
                  onChange={c => updateBlock(bloque._tempId, c)}
                />
              )}
              {bloque.tipo === 'imagen' && (
                <ImagenBlock
                  contenido={bloque.contenido as BloqueContenidoMap['imagen']}
                  onChange={c => updateBlock(bloque._tempId, c)}
                />
              )}
              {bloque.tipo === 'video' && (
                <VideoBlock
                  contenido={bloque.contenido as BloqueContenidoMap['video']}
                  onChange={c => updateBlock(bloque._tempId, c)}
                />
              )}
              {bloque.tipo === 'carrusel' && (
                <CarruselBlock
                  contenido={bloque.contenido as BloqueContenidoMap['carrusel']}
                  onChange={c => updateBlock(bloque._tempId, c)}
                />
              )}
            </div>
          </div>
        )
      })}

      {/* Add block toolbar */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(TIPO_LABELS) as BloqueType[]).map(tipo => {
          const { label, icon: Icon } = TIPO_LABELS[tipo]
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => addBlock(tipo)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-primary hover:text-primary transition-colors"
            >
              <Icon className="w-4 h-4" />
              + {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
