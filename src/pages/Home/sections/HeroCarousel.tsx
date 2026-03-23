/**
 * HeroCarousel — Split hero con carrusel de fotos
 * 3 paletas: 'light' (blanco) | 'dark' (negro) | 'red' (rojo)
 * Texto fijo a la izquierda, carrusel automático a la derecha.
 */
import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HERO_CONTENT, HOME_STATS } from '@/constants/home'

// ── Fotos del carrusel ─────────────────────────────────────────────────
const PHOTOS = [
  { src: '/images/hero-escuela.jpg.jpg',                                                              alt: 'Colegio Cristiano Gabriela Mistral', caption: 'Nuestro colegio'    },
  { src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&auto=format&fit=crop', alt: 'Alumnos en clases',                  caption: 'Clases activas'    },
  { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&auto=format&fit=crop', alt: 'Lectura y aprendizaje',              caption: 'Formación integral' },
  { src: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1400&auto=format&fit=crop',    alt: 'Deporte y recreación',               caption: 'Vida deportiva'    },
]

const AUTOPLAY = 5000

// ── Configuración por paleta ───────────────────────────────────────────
type Palette = 'light' | 'dark' | 'red'

const PALETTES: Record<Palette, {
  panel:      string   // bg del panel izquierdo
  pattern?:   string   // patrón de fondo opcional
  eyebrow:    string   // color texto eyebrow
  headline:   string   // color título
  sub:        string   // color subtítulo
  accentA:    string   // primera barra de acento
  accentB:    string   // segunda barra de acento
  divider:    string   // línea divisora de stats
  border:     string   // borde derecho del panel
  statNum:    string   // color número stats
  statSuffix: string   // color sufijo stats
  statLabel:  string   // color label stats
  btnPrimary: string   // clases del botón primario
  btnSecond:  string   // clases del botón secundario
  progress:   string   // barra de progreso del carrusel
}> = {

  // ── G: Blanco limpio ──────────────────────────────────────────────
  light: {
    panel:      'bg-white',
    eyebrow:    'text-muted-foreground',
    headline:   'text-foreground',
    sub:        'text-muted-foreground',
    accentA:    'bg-primary',
    accentB:    'bg-secondary',
    divider:    'border-border',
    border:     'border-r border-border/60',
    statNum:    'text-primary',
    statSuffix: 'text-secondary',
    statLabel:  'text-muted-foreground',
    btnPrimary: '',
    btnSecond:  '',
    progress:   'bg-secondary',
  },

  // ── H: Negro profundo + rojo + amarillo ───────────────────────────
  dark: {
    panel:   'bg-[oklch(0.10_0.01_0)]',
    pattern: `repeating-linear-gradient(
                135deg,
                oklch(1_0_0/0.03) 0px, oklch(1_0_0/0.03) 1px,
                transparent 1px, transparent 18px
              )`,
    eyebrow:    'text-white/45',
    headline:   'text-white',
    sub:        'text-white/60',
    accentA:    'bg-primary',
    accentB:    'bg-secondary',
    divider:    'border-white/10',
    border:     'border-r border-white/10',
    statNum:    'text-secondary',
    statSuffix: 'text-white/40',
    statLabel:  'text-white/40',
    btnPrimary: 'bg-secondary text-foreground hover:bg-secondary/90 font-bold',
    btnSecond:  'border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white',
    progress:   'bg-secondary',
  },

  // ── I: Rojo vivo + amarillo ───────────────────────────────────────
  red: {
    panel:   'bg-primary',
    pattern: `repeating-linear-gradient(
                45deg,
                oklch(1_0_0/0.06) 0px, oklch(1_0_0/0.06) 1px,
                transparent 1px, transparent 22px
              )`,
    eyebrow:    'text-white/55',
    headline:   'text-white',
    sub:        'text-white/75',
    accentA:    'bg-secondary',
    accentB:    'bg-white/40',
    divider:    'border-white/20',
    border:     'border-r border-white/15',
    statNum:    'text-secondary',
    statSuffix: 'text-white/50',
    statLabel:  'text-white/55',
    btnPrimary: 'bg-secondary text-foreground hover:bg-secondary/90 font-bold',
    btnSecond:  'border-white/40 bg-transparent text-white hover:bg-white/15 hover:text-white',
    progress:   'bg-secondary',
  },
}

// ── Componente base ────────────────────────────────────────────────────
function HeroCarouselBase({ palette }: { palette: Palette }) {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)
  const p = PALETTES[palette]

  const next = useCallback(() => setCurrent(c => (c + 1) % PHOTOS.length), [])
  const prev = useCallback(() => setCurrent(c => (c - 1 + PHOTOS.length) % PHOTOS.length), [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, AUTOPLAY)
    return () => clearInterval(t)
  }, [paused, next])

  return (
    <section className="relative min-h-svh flex flex-col lg:flex-row overflow-hidden">

      {/* ── Panel izquierdo — texto fijo ──────────────────────────── */}
      <div className={`relative z-10 flex flex-col justify-center lg:w-[44%]
                       px-8 sm:px-12 lg:px-14 xl:px-20 py-24 lg:py-0
                       ${p.panel} ${p.border}`}
      >
        {/* Patrón de fondo (dark / red) */}
        {p.pattern && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: p.pattern }}
          />
        )}

        <div className="relative z-10">
          {/* Eyebrow */}
          <motion.p
            className={`text-xs font-semibold tracking-[0.2em] uppercase mb-5 ${p.eyebrow}`}
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {HERO_CONTENT.eyebrow}
          </motion.p>

          {/* Headline */}
          <motion.h1
            className={`text-4xl sm:text-5xl xl:text-[3.25rem] font-extrabold
                        leading-[1.1] tracking-tight ${p.headline}`}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {HERO_CONTENT.headline}
          </motion.h1>

          {/* Líneas de acento */}
          <motion.div
            className="mt-5 flex gap-1.5"
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
            style={{ originX: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <div className={`h-1 w-10 rounded-full ${p.accentA}`} />
            <div className={`h-1 w-4  rounded-full ${p.accentB}`} />
          </motion.div>

          {/* Subheadline */}
          <motion.p
            className={`mt-5 text-base sm:text-lg leading-relaxed max-w-md ${p.sub}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {HERO_CONTENT.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button asChild size="lg" className={`gap-2 px-7 ${p.btnPrimary}`}>
              <Link to={HERO_CONTENT.cta2.href}>
                <MessageCircle className="h-5 w-5" />
                {HERO_CONTENT.cta2.label}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className={`gap-2 px-7 ${p.btnSecond}`}>
              <Link to={HERO_CONTENT.cta1.href}>
                {HERO_CONTENT.cta1.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className={`mt-10 pt-8 border-t grid grid-cols-3 gap-4 ${p.divider}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {HOME_STATS.map(stat => (
              <div key={stat.label}>
                <p className={`text-2xl font-extrabold leading-none ${p.statNum}`}>
                  {stat.value}
                  <span className={p.statSuffix}>{stat.suffix}</span>
                </p>
                <p className={`text-xs mt-1 ${p.statLabel}`}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Panel derecho — carrusel ──────────────────────────────── */}
      <div
        className="relative flex-1 min-h-[55vw] lg:min-h-svh overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fotos crossfade */}
        <AnimatePresence mode="sync">
          <motion.img
            key={current}
            src={PHOTOS[current].src}
            alt={PHOTOS[current].alt}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeInOut' }}
          />
        </AnimatePresence>

        {/* Caption */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`cap-${current}`}
            className="absolute top-6 left-6 z-10"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-block bg-black/40 backdrop-blur-sm text-white/90
                             text-xs font-semibold px-3 py-1.5 rounded-full tracking-wide">
              {PHOTOS[current].caption}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Flechas */}
        <button onClick={prev} aria-label="Anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full
                     bg-white/90 hover:bg-white shadow-lg flex items-center justify-center
                     transition-all hover:scale-105">
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button onClick={next} aria-label="Siguiente"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full
                     bg-white/90 hover:bg-white shadow-lg flex items-center justify-center
                     transition-all hover:scale-105">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {PHOTOS.map((_, i) => (
            <button
              key={i} onClick={() => setCurrent(i)} aria-label={`Foto ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-7 h-2.5 bg-white shadow' : 'w-2.5 h-2.5 bg-white/45 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Barra de progreso */}
        {!paused && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/15 z-10">
            <motion.div
              key={current}
              className={`h-full ${p.progress}`}
              initial={{ width: '0%' }} animate={{ width: '100%' }}
              transition={{ duration: AUTOPLAY / 1000, ease: 'linear' }}
            />
          </div>
        )}
      </div>
    </section>
  )
}

// ── Exports nombrados (uno por paleta) ─────────────────────────────────
export function HeroCarousel()     { return <HeroCarouselBase palette="light" /> }
export function HeroCarouselDark() { return <HeroCarouselBase palette="dark"  /> }
export function HeroCarouselRed()  { return <HeroCarouselBase palette="red"   /> }
