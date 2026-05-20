import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { INSTALACIONES } from '@/constants/instalaciones'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

export function Instalaciones() {
  const [fotosDB, setFotosDB] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('instalacion_fotos')
      .select('instalacion,src')
      .then(({ data }) => {
        const map: Record<string, string> = {}
        ;(data ?? []).forEach((d: { instalacion: string; src: string }) => { map[d.instalacion] = d.src })
        setFotosDB(map)
      })
  }, [])

  return (
    <section className="bg-[#1C1814] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary uppercase mb-3">
            Infraestructura
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Nuestras instalaciones
          </h2>
          <div className="mt-4 flex gap-2">
            <div className="h-1 w-10 rounded-full bg-primary" />
            <div className="h-1 w-4 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Grid de fotos full-bleed */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {INSTALACIONES.map((item, i) => {
            const isFeatured = i === 0
            const imageSrc = fotosDB[item.id]

            return (
              <motion.div
                key={item.id}
                className={cn(
                  'group relative overflow-hidden rounded-2xl cursor-default',
                  isFeatured ? 'col-span-2 lg:col-span-2 h-72 sm:h-80' : 'h-56 sm:h-64'
                )}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                {/* Imagen o placeholder */}
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className={cn(
                      'absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
                      item.id === 'gimnasio' && 'object-top'
                    )}
                  />
                ) : (
                  <div className="absolute inset-0 bg-white/5" />
                )}

                {/* Gradiente inferior */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                {/* Nombre overlay */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
                  <h3 className={cn(
                    'font-extrabold text-white leading-tight',
                    isFeatured ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'
                  )}>
                    {item.name}
                  </h3>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
