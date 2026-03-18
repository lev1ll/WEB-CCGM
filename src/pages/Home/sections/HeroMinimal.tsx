/**
 * OPCIÓN E — Centrado minimal con formas geométricas
 * Sin foto. Fondo blanco con manchas de color como decoración.
 * Estilo Apple / marca fuerte. Perfecto sin fotos reales.
 */
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HERO_CONTENT, HOME_STATS } from '@/constants/home'

export function HeroMinimal() {
  return (
    <section className="relative min-h-svh bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Formas decorativas */}
      <div className="absolute top-16 right-[10%] w-72 h-72 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-[15%] w-40 h-40 rounded-full bg-secondary/15 blur-2xl pointer-events-none" />

      {/* Línea decorativa vertical izquierda */}
      <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent hidden lg:block" />
      <div className="absolute right-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-secondary/30 to-transparent hidden lg:block" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-10 text-center">
        {/* Eyebrow pill */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 shadow-sm mb-8"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className="text-xs font-semibold text-muted-foreground tracking-wide">
            {HERO_CONTENT.eyebrow}
          </span>
        </motion.div>

        {/* Headline grande centrado */}
        <motion.h1
          className="text-5xl sm:text-6xl xl:text-7xl font-extrabold text-foreground leading-[1.05] tracking-tight"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          Formando personas
          <br />
          con{' '}
          <span className="relative inline-block">
            <span className="relative z-10 text-primary">valores</span>
            {/* Underline amarilla */}
            <motion.span
              className="absolute -bottom-1 left-0 h-3 w-full bg-secondary/50 rounded"
              style={{ zIndex: 0 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {HERO_CONTENT.subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Button asChild size="lg" className="gap-2 px-10 font-bold text-base h-12">
            <Link to={HERO_CONTENT.cta2.href}>
              <MessageCircle className="h-5 w-5" />
              {HERO_CONTENT.cta2.label}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 px-10 h-12">
            <Link to={HERO_CONTENT.cta1.href}>
              {HERO_CONTENT.cta1.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Stats en fila */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          {HOME_STATS.map((stat) => (
            <div key={stat.label} className="bg-card py-5 px-4 text-center">
              <p className="text-3xl font-extrabold text-foreground">
                {stat.value}
                <span className="text-primary">{stat.suffix}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
