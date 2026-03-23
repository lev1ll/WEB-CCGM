import { useVariant, type Variant } from '@/context/VariantContext'
import { LayoutGrid } from 'lucide-react'
import { useState } from 'react'

const VARIANTS: { id: Variant; label: string; desc: string }[] = [
  { id: 1, label: 'Diseño 1', desc: 'Compacto' },
  { id: 2, label: 'Diseño 2', desc: 'Visual' },
  { id: 3, label: 'Diseño 3', desc: 'Amplio' },
]

export function VariantSwitcher() {
  const { variant, setVariant } = useVariant()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed top-[72px] right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-3 w-44">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
            Estilo de diseño
          </p>
          {VARIANTS.map(v => (
            <button
              key={v.id}
              onClick={() => { setVariant(v.id); setOpen(false) }}
              className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-1 last:mb-0 ${
                variant === v.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{v.label}</span>
              <span className={`text-xs font-normal ${variant === v.id ? 'text-primary-foreground/70' : 'text-gray-400'}`}>
                {v.desc}
              </span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-full shadow-lg px-3.5 py-2.5 hover:shadow-xl transition-shadow"
        title="Cambiar diseño"
      >
        <LayoutGrid className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-gray-700">Diseño {variant}</span>
      </button>
    </div>
  )
}
