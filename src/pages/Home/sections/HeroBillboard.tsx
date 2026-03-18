/**
 * OPCIÓN C — Billboard Hero
 * Fondo oscuro/negro con tipografía masiva, foto como elemento flotante
 * Estilo gráfico + bold, inspirado en branding institucional fuerte
 */
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HERO_CONTENT, HOME_STATS } from '@/constants/home'

export function HeroBillboard() {
  return (
    <section className="relative min-h-svh bg-[oklch(0.10_0.01_0)] overflow-hidden flex flex-col justify-between">
      {/* ── Banda diagonal roja de fondo ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.42_0.27_27) 0%, oklch(0.42_0.27_27) 38%, transparent 38%)',
          opacity: 0.35,
        }}
      />

      {/* ── Foto flotante (desktop: esquina superior derecha) ── */}
      <motion.div
        className="absolute top-0 right-0 w-[45%] h-[70%] hidden lg:block overflow-hidden"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <img
          src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80"
          alt="Alumnos del colegio"
          className="h-full w-full object-cover"
          style={{
            clipPath: 'polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[oklch(0.10_0.01_0)]/60" />
      </motion.div>

      {/* ── Contenido principal ── */}
      <div className="relative z-10 flex flex-col justify-center flex-1 px-6 sm:px-12 lg:px-20 pt-28 pb-16">
        {/* Eyebrow con línea */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="h-px w-8 bg-secondary" />
          <span className="text-xs font-semibold tracking-[0.25em] text-secondary/80 uppercase">
            {HERO_CONTENT.eyebrow}
          </span>
        </motion.div>

        {/* Headline masivo — 2 líneas con color mixto */}
        <div className="max-w-2xl">
          <motion.h1
            className="font-extrabold leading-[0.95] tracking-tight"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <span className="block text-5xl sm:text-6xl xl:text-[5.5rem] text-white">
              Formando
            </span>
            <span className="block text-5xl sm:text-6xl xl:text-[5.5rem] text-secondary">
              personas
            </span>
            <span className="block text-5xl sm:text-6xl xl:text-[5.5rem] text-white/90">
              con valores
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mt-6 text-base sm:text-lg text-white/55 max-w-md leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {HERO_CONTENT.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-bold px-8 gap-2"
            >
              <Link to={HERO_CONTENT.cta2.href}>
                <MessageCircle className="h-5 w-5" />
                {HERO_CONTENT.cta2.label}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white px-8 gap-2"
            >
              <Link to={HERO_CONTENT.cta1.href}>
                {HERO_CONTENT.cta1.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ── Stats bar en la parte inferior ── */}
      <motion.div
        className="relative z-10 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {HOME_STATS.map((stat) => (
              <div key={stat.label} className="py-6 px-4 sm:px-8 first:pl-0 last:pr-0">
                <p className="text-3xl sm:text-4xl font-extrabold text-white">
                  {stat.value}
                  <span className="text-secondary">{stat.suffix}</span>
                </p>
                <p className="text-xs sm:text-sm text-white/45 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
