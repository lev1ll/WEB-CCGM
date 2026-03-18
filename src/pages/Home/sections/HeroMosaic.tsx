/**
 * OPCIÓN D — Mosaico de fotos
 * Headline a la izquierda, grid 2×3 de fotos a la derecha
 * Muestra la riqueza del colegio en un vistazo
 */
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HERO_CONTENT, HOME_STATS } from '@/constants/home'

const MOSAIC_PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80', alt: 'Alumnos en clases' },
  { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80', alt: 'Lectura' },
  { src: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80', alt: 'Deporte' },
  { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80', alt: 'Ciencias' },
  { src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80', alt: 'Trabajo en equipo' },
  { src: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=600&auto=format&fit=crop&q=80', alt: 'Arte' },
]

export function HeroMosaic() {
  return (
    <section className="relative min-h-svh bg-background overflow-hidden flex items-center">
      {/* Fondo con blob decorativo */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-muted/60 rounded-l-[4rem] hidden lg:block" />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 sm:px-10 lg:px-16 py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* ── Izquierda — contenido ── */}
        <div>
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary tracking-wide">Admisión 2026 abierta</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {HERO_CONTENT.headline.split(' con ').map((part, i, arr) => (
              <span key={i}>
                {i === 0 ? part : (
                  <>
                    {' '}con{' '}
                    <span className="text-primary">{arr[i]}</span>
                  </>
                )}
              </span>
            ))}
          </motion.h1>

          <motion.p
            className="mt-5 text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {HERO_CONTENT.subheadline}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            <Button asChild size="lg" className="gap-2 px-8 font-bold">
              <Link to={HERO_CONTENT.cta2.href}>
                <MessageCircle className="h-5 w-5" />
                {HERO_CONTENT.cta2.label}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 px-8">
              <Link to={HERO_CONTENT.cta1.href}>
                {HERO_CONTENT.cta1.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-10 flex gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.85 }}
          >
            {HOME_STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-primary">
                  {stat.value}<span className="text-secondary">{stat.suffix}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Derecha — grid de fotos ── */}
        <motion.div
          className="grid grid-cols-3 grid-rows-2 gap-2 sm:gap-3"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
        >
          {MOSAIC_PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              className={`relative overflow-hidden rounded-xl sm:rounded-2xl ${i === 0 ? 'col-span-2 row-span-1' : ''}`}
              style={{ aspectRatio: i === 0 ? '16/9' : '4/3' }}
              variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } } }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
