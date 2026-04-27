import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Dumbbell, Music, Calculator, Recycle, Globe, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { EXTRAESCOLARES, CYCLE_LABELS } from '@/constants/niveles'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const ICON_MAP = { Trophy, Dumbbell, Music, Calculator, Recycle, Globe } as const
type IconName = keyof typeof ICON_MAP

// Paleta visual por academia — reemplazar `bg` por una foto real cuando esté disponible
const ACADEMIA_STYLE: Record<string, { bg: string; text: string; description: string }> = {
  'Fútbol':        { bg: 'bg-emerald-600',  text: 'text-emerald-100', description: 'Desarrollamos habilidades deportivas, trabajo en equipo y espíritu competitivo en canchas adaptadas para todos los niveles.' },
  'Polideportivo': { bg: 'bg-teal-600',     text: 'text-teal-100',    description: 'Atletismo, básquetbol, vóleibol y más actividades que fomentan la actividad física y el deporte recreativo.' },
  'Danza':         { bg: 'bg-rose-500',     text: 'text-rose-100',    description: 'Expresión corporal, folclore y danza moderna en un espacio de creatividad y confianza personal.' },
  'Matemáticas':   { bg: 'bg-amber-500',    text: 'text-amber-100',   description: 'Resolución de problemas, pensamiento lógico y desafíos matemáticos que van más allá del aula.' },
  'Reciclaje':     { bg: 'bg-lime-600',     text: 'text-lime-100',    description: 'Educación ambiental, reciclaje creativo y conciencia ecológica para cuidar nuestra comunidad.' },
  'Inglés':        { bg: 'bg-blue-600',     text: 'text-blue-100',    description: 'Conversación, vocabulario y comprensión auditiva con metodología comunicativa para estudiantes del segundo ciclo.' },
}

export function Extraescolares() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [academiaFotos, setAcademiaFotos] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('academia_fotos')
      .select('academia,src')
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {}
          data.forEach(d => { map[d.academia] = d.src })
          setAcademiaFotos(map)
        }
      })
  }, [])

  const next = useCallback(() => setCurrent(c => (c + 1) % EXTRAESCOLARES.length), [])
  const prev = useCallback(() => setCurrent(c => (c - 1 + EXTRAESCOLARES.length) % EXTRAESCOLARES.length), [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [paused, next])

  const academia = EXTRAESCOLARES[current]
  const Icon = ICON_MAP[academia.icon as IconName] ?? Trophy
  const style = ACADEMIA_STYLE[academia.name] ?? { bg: 'bg-gray-600', text: 'text-gray-100', description: '' }

  return (
    <SectionWrapper variant="dark">
      <SectionTitle
        title="Academias"
        subtitle="Actividades extracurriculares que potencian los talentos de nuestros estudiantes"
      />

      <div
        className="mt-10 max-w-4xl mx-auto"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Carrusel principal */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={academia.name}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={cn('relative flex flex-col sm:flex-row min-h-[320px]', style.bg)}
            >
              {/* Lado izquierdo — foto real o placeholder de color */}
              <div className="relative sm:w-2/5 flex items-center justify-center py-8 px-4 sm:py-14 sm:px-8 overflow-hidden">
                {academiaFotos[academia.name] ? (
                  <img
                    src={academiaFotos[academia.name]}
                    alt={academia.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} />
                )}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  {!academiaFotos[academia.name] && (
                    <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center">
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                  )}
                  {/* Chip de ciclo */}
                  <span className={cn(
                    'text-xs font-bold rounded-full px-3 py-1',
                    academia.cycle === 'segundo'
                      ? 'bg-amber-300 text-amber-900'
                      : 'bg-white/25 text-white'
                  )}>
                    {CYCLE_LABELS[academia.cycle]}
                  </span>
                </div>
              </div>

              {/* Lado derecho — info */}
              <div className="sm:w-3/5 bg-black/30 backdrop-blur-sm flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10">
                <p className={cn('text-xs font-bold tracking-widest uppercase mb-2 opacity-70', style.text)}>
                  Academia
                </p>
                <h3 className="text-3xl font-extrabold text-white mb-4">{academia.name}</h3>
                <p className="text-white/75 leading-relaxed text-sm sm:text-base">
                  {style.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Flechas */}
          <button onClick={prev} aria-label="Anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full
                       bg-black/40 hover:bg-black/60 flex items-center justify-center
                       backdrop-blur-sm border border-white/10 transition-all">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button onClick={next} aria-label="Siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full
                       bg-black/40 hover:bg-black/60 flex items-center justify-center
                       backdrop-blur-sm border border-white/10 transition-all">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>

          {/* Barra de progreso */}
          {!paused && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <motion.div
                key={current}
                className="h-full bg-white/60"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 4, ease: 'linear' }}
              />
            </div>
          )}
        </div>

        {/* Dots + miniaturas */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {EXTRAESCOLARES.map((ex, i) => {
            const DotIcon = ICON_MAP[ex.icon as IconName] ?? Trophy
            const s = ACADEMIA_STYLE[ex.name] ?? { bg: 'bg-gray-600', text: '' }
            return (
              <button
                key={ex.name}
                onClick={() => { setCurrent(i); setPaused(true) }}
                aria-label={ex.name}
                className={cn(
                  'rounded-xl transition-all duration-300 flex items-center gap-2 px-3 py-2',
                  i === current
                    ? `${s.bg} text-white shadow-lg scale-105 px-4`
                    : 'bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                )}
              >
                <DotIcon className="w-4 h-4 shrink-0" />
                <span className={cn('text-xs font-semibold overflow-hidden transition-all duration-300',
                  i === current ? 'max-w-[80px]' : 'max-w-0'
                )}>
                  {ex.name}
                </span>
              </button>
            )
          })}
        </div>

        <p className="text-center text-white/35 text-xs mt-5">
          Las academias se realizan en horario extraprogramático · Consulta disponibilidad por nivel
        </p>
      </div>
    </SectionWrapper>
  )
}
