import { useEffect, useState } from 'react'
import { Bus, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

// Slot mapping: bus 1→slots 1-2, bus 2→slots 3-4, bus 3→slots 5-6, bus 4→slots 7-8
const MICROS = [
  { num: 1, nombre: 'Transporte 1', slotExt: 1, slotInt: 2 },
  { num: 2, nombre: 'Transporte 2', slotExt: 3, slotInt: 4 },
  { num: 3, nombre: 'Transporte 3', slotExt: 5, slotInt: 6 },
  { num: 4, nombre: 'Transporte 4', slotExt: 7, slotInt: 8 },
]

type FotoSlot = { src: string; alt: string }

function MicroCard({ micro, fotos }: { micro: typeof MICROS[0]; fotos: Record<number, FotoSlot> }) {
  const [view, setView] = useState<'ext' | 'int'>('ext')
  const slot = view === 'ext' ? micro.slotExt : micro.slotInt
  const foto = fotos[slot]
  const label = view === 'ext' ? 'Exterior' : 'Interior'

  return (
    <motion.div
      className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: micro.num * 0.08 }}
    >
      {/* Imagen con carrusel */}
      <div className="relative h-52 bg-white/5 overflow-hidden">
        {foto?.src ? (
          <img
            key={slot}
            src={foto.src}
            alt={foto.alt || micro.nombre}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/20">
            <Bus className="w-14 h-14" />
            <span className="text-xs">Sin foto</span>
          </div>
        )}

        {/* Label exterior/interior */}
        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider
                         bg-black/50 text-white/80 px-2 py-0.5 rounded-full backdrop-blur-sm">
          {label}
        </span>

        {/* Flechas prev/next */}
        <button
          onClick={() => setView('ext')}
          disabled={view === 'ext'}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full
                     bg-black/40 text-white disabled:opacity-20 hover:bg-black/60 transition-colors"
          aria-label="Ver exterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => setView('int')}
          disabled={view === 'int'}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full
                     bg-black/40 text-white disabled:opacity-20 hover:bg-black/60 transition-colors"
          aria-label="Ver interior"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
          <button
            onClick={() => setView('ext')}
            className={`w-2 h-2 rounded-full transition-all ${view === 'ext' ? 'bg-white w-4' : 'bg-white/40'}`}
            aria-label="Exterior"
          />
          <button
            onClick={() => setView('int')}
            className={`w-2 h-2 rounded-full transition-all ${view === 'int' ? 'bg-white w-4' : 'bg-white/40'}`}
            aria-label="Interior"
          />
        </div>
      </div>

      {/* Nombre */}
      <div className="px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0">
          <Bus className="w-5 h-5 text-secondary" />
        </div>
        <p className="font-bold text-white">{micro.nombre}</p>
      </div>
    </motion.div>
  )
}

export function SeccionMicros() {
  const [fotos, setFotos] = useState<Record<number, FotoSlot>>({})

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('movilizacion_fotos')
      .select('slot,src,alt')
      .then(({ data }) => {
        const map: Record<number, FotoSlot> = {}
        ;(data ?? []).forEach((d: { slot: number; src: string; alt: string }) => {
          map[d.slot] = { src: d.src, alt: d.alt ?? '' }
        })
        setFotos(map)
      })
  }, [])

  return (
    <section className="bg-[#0F0D0C] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-12">
          <p className="text-[11px] font-bold tracking-[0.25em] text-secondary uppercase mb-3">
            Transporte escolar
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Nuestro transporte
          </h2>
          <div className="mt-4 flex gap-2">
            <div className="h-1 w-10 rounded-full bg-secondary" />
            <div className="h-1 w-4 rounded-full bg-primary" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MICROS.map(micro => (
            <MicroCard key={micro.num} micro={micro} fotos={fotos} />
          ))}
        </div>
      </div>
    </section>
  )
}
