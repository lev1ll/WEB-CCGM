/**
 * OPCIÓN B — Split Hero
 * Desktop: mitad izquierda roja con contenido + mitad derecha foto
 * Estilo editorial / revista moderna
 */
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HERO_CONTENT, HOME_STATS } from '@/constants/home'

export function HeroSplit() {
  return (
    <section className="relative min-h-svh flex flex-col lg:flex-row overflow-hidden">
      {/* ── Lado izquierdo — contenido sobre fondo rojo ── */}
      <div className="relative z-10 flex flex-col justify-center bg-primary px-8 sm:px-12 lg:px-16 py-24 lg:py-0 lg:w-1/2">
        {/* Patrón diagonal sutil */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 14px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative max-w-lg">
          {/* Eyebrow */}
          <motion.p
            className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-white/60 uppercase mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {HERO_CONTENT.eyebrow}
          </motion.p>

          {/* Headline */}
          <motion.h1
            className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] tracking-tight"
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {HERO_CONTENT.headline}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mt-5 text-base sm:text-lg text-white/75 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {HERO_CONTENT.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-secondary text-foreground hover:bg-secondary/90 font-bold px-8 gap-2"
            >
              <Link to={HERO_CONTENT.cta2.href}>
                <MessageCircle className="h-5 w-5" />
                {HERO_CONTENT.cta2.label}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white px-8 gap-2"
            >
              <Link to={HERO_CONTENT.cta1.href}>
                {HERO_CONTENT.cta1.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats horizontales */}
          <motion.div
            className="mt-10 pt-8 border-t border-white/20 grid grid-cols-3 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            {HOME_STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-secondary">
                  {stat.value}
                  {stat.suffix}
                </p>
                <p className="text-xs text-white/60 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Lado derecho — foto ── */}
      <div className="relative lg:w-1/2 min-h-[50vh] lg:min-h-svh">
        <img
          src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&auto=format&fit=crop&q=80"
          alt="Alumnos del colegio"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlay suave para que no sea demasiado brillante */}
        <div className="absolute inset-0 bg-foreground/20" />

        {/* Badge flotante */}
        <motion.div
          className="absolute bottom-8 left-8 bg-secondary rounded-xl px-5 py-3 shadow-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <p className="text-xs font-bold text-foreground/60 uppercase tracking-wide">Admisión</p>
          <p className="text-base font-extrabold text-foreground">Proceso 2026 abierto</p>
        </motion.div>
      </div>
    </section>
  )
}
