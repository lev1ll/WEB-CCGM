/**
 * OPCIÓN F — Horizontal stripe (Stripe-style)
 * Mitad superior: fondo rojo con texto
 * Mitad inferior: foto de ancho completo
 * El headline "flota" sobre el corte horizontal
 */
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HERO_CONTENT, HOME_STATS } from '@/constants/home'

export function HeroStripe() {
  return (
    <section className="relative min-h-svh flex flex-col overflow-hidden">
      {/* ── Banda superior roja ── */}
      <div className="relative bg-primary flex-shrink-0 pt-10 pb-32 px-6 sm:px-12 lg:px-20 flex flex-col items-center text-center">
        {/* Patrón puntitos */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.p
            className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase mb-5"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {HERO_CONTENT.eyebrow}
          </motion.p>

          <motion.h1
            className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {HERO_CONTENT.headline}
          </motion.h1>

          <motion.p
            className="mt-5 text-base sm:text-lg text-white/75 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            {HERO_CONTENT.subheadline}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
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
        </div>
      </div>

      {/* ── Foto que sube para "cortar" la banda ── */}
      <motion.div
        className="relative -mt-24 mx-4 sm:mx-8 lg:mx-16 rounded-2xl overflow-hidden shadow-2xl flex-1 min-h-[300px] sm:min-h-[420px]"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <img
          src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&auto=format&fit=crop&q=80"
          alt="Alumnos del colegio"
          className="w-full h-full object-cover absolute inset-0"
        />
        {/* Overlay suave abajo para que el borde inferior sea limpio */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />

        {/* Stats bar superpuesta abajo de la foto */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-foreground/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="grid grid-cols-3 divide-x divide-white/10 max-w-2xl mx-auto">
            {HOME_STATS.map((stat) => (
              <div key={stat.label} className="py-4 px-6 text-center">
                <p className="text-xl sm:text-2xl font-extrabold text-white">
                  {stat.value}
                  <span className="text-secondary">{stat.suffix}</span>
                </p>
                <p className="text-[11px] text-white/50 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Espaciado inferior */}
      <div className="bg-background h-8" />
    </section>
  )
}
