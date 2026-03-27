/**
 * HOME NUEVA — Diseño propio del diseñador
 * Paleta: negro profundo / rojo vivo / amarillo dorado / blanco
 * Filosofía: colores con propósito, tipografía bold, mucho respiro
 */
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, ChevronLeft, ChevronRight, MessageCircle,
  Heart, Users, Shield, Star, BookOpen,
  GraduationCap, Smile, Lightbulb,
} from 'lucide-react'

// ── Datos ──────────────────────────────────────────────────────────────
const FOTOS = [
  { src: '/images/hero-escuela.jpg.jpg',                                                              alt: 'Colegio Cristiano Gabriela Mistral' },
  { src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&auto=format&fit=crop', alt: 'Alumnos en clases'                  },
  { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&auto=format&fit=crop', alt: 'Lectura y aprendizaje'              },
  { src: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1400&auto=format&fit=crop',    alt: 'Vida deportiva'                    },
]

const STATS = [
  { value: '200+', label: 'Estudiantes activos'   },
  { value: '30+',  label: 'Años de trayectoria'   },
  { value: '95%',  label: 'Satisfacción familiar'  },
]

const NIVELES = [
  { num: '01', icon: Smile,         name: '1° y 2° Básico', ages: '6 – 8 años',   desc: 'Lectoescritura, matemática concreta y hábitos escolares en un ambiente cálido y estructurado.'             },
  { num: '02', icon: BookOpen,      name: '3° y 4° Básico', ages: '8 – 10 años',  desc: 'Comprensión lectora, ciencias naturales y resolución de problemas con énfasis comunicacional.'             },
  { num: '03', icon: Lightbulb,     name: '5° y 6° Básico', ages: '10 – 12 años', desc: 'Pensamiento crítico, investigación científica y trabajo colaborativo en todas las asignaturas.'            },
  { num: '04', icon: GraduationCap, name: '7° y 8° Básico', ages: '12 – 14 años', desc: 'Preparación sólida para educación media con orientación vocacional y liderazgo estudiantil.'              },
]

const VALORES = [
  { icon: Heart,    title: 'Amor',          desc: 'Base de toda relación pedagógica auténtica e incondicional.'  },
  { icon: Shield,   title: 'Justicia',      desc: 'Equidad y trato justo en cada instancia de la convivencia.'  },
  { icon: Users,    title: 'Servicio',      desc: 'El verdadero liderazgo se expresa sirviendo a los demás.'    },
  { icon: Star,     title: 'Excelencia',    desc: 'Dar siempre lo mejor en todo lo que emprendemos juntos.'     },
  { icon: BookOpen, title: 'Trascendencia', desc: 'Propósito de vida claro, más allá de lo inmediato.'          },
]

// ── 1. HERO ────────────────────────────────────────────────────────────
function Hero() {
  const [current, setCurrent] = useState(0)
  const [paused,  setPaused]  = useState(false)

  const next = useCallback(() => setCurrent(c => (c + 1) % FOTOS.length), [])
  const prev = useCallback(() => setCurrent(c => (c - 1 + FOTOS.length) % FOTOS.length), [])

  useEffect(() => {
    if (paused) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [paused, next])

  return (
    <section
      className="relative h-[calc(100svh-64px)] min-h-[580px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Fotos full-bleed ── */}
      <AnimatePresence mode="sync">
        <motion.img
          key={current}
          src={FOTOS[current].src}
          alt={FOTOS[current].alt}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85 }}
        />
      </AnimatePresence>

      {/* ── Degradado: más cubierto en la zona de texto ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/10" />

      {/* ── Dots esquina superior derecha ── */}
      <div className="absolute top-6 right-4 sm:right-6 lg:right-8 z-20 flex gap-2 items-center">
        {FOTOS.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} aria-label={`Foto ${i + 1}`}
            className={`rounded-full transition-all duration-300
              ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/35 hover:bg-white/60'}`} />
        ))}
      </div>

      {/* ── Eyebrow superior ── */}
      <motion.div className="absolute top-6 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-3">
          <div className="h-px w-10 bg-secondary" />
          <span className="text-xs font-bold tracking-[0.28em] text-white/70 uppercase">
            Escuela Gabriela Mistral · Nueva Imperial
          </span>
        </div>
      </motion.div>

      {/* ── Barra de progreso superior ── */}
      {!paused && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
          <motion.div
            key={current}
            className="h-full bg-secondary"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </div>
      )}

      {/* ── Flechas laterales ── */}
      <button onClick={prev} aria-label="Anterior"
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full
                   bg-black/40 hover:bg-black/65 backdrop-blur-sm flex items-center
                   justify-center transition-all hover:scale-105 border border-white/10">
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button onClick={next} aria-label="Siguiente"
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full
                   bg-black/40 hover:bg-black/65 backdrop-blur-sm flex items-center
                   justify-center transition-all hover:scale-105 border border-white/10">
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* ── Contenido inferior ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8 pb-6">
        <div>


          {/* Headline + CTAs en fila */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

            {/* Título */}
            <motion.h1
              className="text-4xl sm:text-5xl xl:text-6xl font-extrabold
                         text-white leading-[1.05] tracking-tight max-w-xl"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Formando personas<br />
              <span className="text-white/90 italic">con valores.</span>
            </motion.h1>

            {/* Bloque derecho: texto + botones */}
            <motion.div className="lg:max-w-xs"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}>
              <p className="text-sm text-white/55 leading-relaxed mb-5">
                Más de 30 años educando con fe, excelencia académica y formación
                en valores en el corazón de La Araucanía.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/admision"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90
                             text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                  <MessageCircle className="w-4 h-4" />
                  Pre-inscripción 2026
                </Link>
                <Link to="/nosotros"
                  className="inline-flex items-center gap-2 border border-white/20
                             hover:border-white/40 text-white/60 hover:text-white
                             font-medium px-4 py-2.5 rounded-xl transition-colors text-sm">
                  Conocer más <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ── 2. SOBRE NOSOTROS ─────────────────────────────────────────────────
function SobreNosotros() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-[11px] font-bold tracking-[0.25em] text-primary uppercase mb-4">
              Quiénes somos
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
              Más de tres décadas<br />
              educando con <span className="text-primary">propósito</span>
            </h2>
            <div className="mt-5 flex gap-2">
              <div className="h-1 w-10 rounded-full bg-primary" />
              <div className="h-1 w-4  rounded-full bg-secondary" />
            </div>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md">
              Nacimos con la convicción de que la educación transforma vidas.
              Combinamos rigor académico con formación en valores, preparando a
              nuestros estudiantes para los desafíos del siglo XXI con fe y carácter.
            </p>
            <Link to="/nosotros"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary
                         hover:gap-3 transition-all">
              Conoce nuestra historia <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            className="grid grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden shadow-sm"
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
            {STATS.map(s => (
              <div key={s.label} className="bg-white py-12 px-6 text-center">
                <p className="text-5xl font-extrabold text-primary leading-none">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-3 leading-tight">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── 3. NIVELES ────────────────────────────────────────────────────────
function Niveles() {
  return (
    <section className="bg-[#2C2825] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-secondary uppercase mb-3">
              Programa académico
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Niveles educativos
            </h2>
          </div>
          <Link to="/niveles"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white
                       transition-colors text-sm font-medium shrink-0">
            Ver programas completos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Lista dividida — sin tarjetas */}
        <div className="divide-y divide-white/8">
          {NIVELES.map((nivel, i) => {
            const Icon = nivel.icon
            return (
              <motion.div key={nivel.num}
                className="group grid grid-cols-[auto_1fr_2fr] items-center gap-6 sm:gap-10 py-8
                           hover:bg-white/[0.02] -mx-4 px-4 transition-colors cursor-default"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.09 }}>

                {/* Número en amarillo */}
                <span className="text-5xl font-extrabold leading-none text-secondary/25
                                 group-hover:text-secondary/60 transition-colors select-none w-14 text-right">
                  {nivel.num}
                </span>

                {/* Nombre + edad */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-white/30 group-hover:text-secondary transition-colors shrink-0" />
                    <h3 className="font-bold text-white text-base leading-tight">{nivel.name}</h3>
                  </div>
                  <span className="text-xs font-semibold text-secondary/60">{nivel.ages}</span>
                </div>

                {/* Descripción */}
                <p className="text-sm text-white/40 leading-relaxed hidden sm:block">{nivel.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── 4. VALORES ────────────────────────────────────────────────────────
function Valores() {
  return (
    <section className="bg-[#1C1814] py-20 md:py-28 relative overflow-hidden">
      {/* Patrón de puntos sutil */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary/70 uppercase mb-3">
            Lo que nos define
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Nuestros valores
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {VALORES.map((v, i) => {
            const Icon = v.icon
            return (
              <motion.div key={v.title}
                className="group bg-white/5 hover:bg-primary/80 rounded-2xl p-6 text-center
                           border border-white/8 hover:border-primary transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.09 }}>
                <div className="w-12 h-12 rounded-xl bg-primary/20 group-hover:bg-secondary/25
                                flex items-center justify-center mx-auto mb-4 transition-colors">
                  <Icon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                </div>
                <h3 className="font-bold text-white mb-2 text-base">{v.title}</h3>
                <p className="text-xs text-white/45 group-hover:text-white/70 leading-relaxed transition-colors">{v.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── 5. FRANJA DE IDENTIDAD ────────────────────────────────────────────
function FranjaIdentidad() {
  const PALABRAS = ['Fe', 'Familia', 'Formación', 'Futuro', 'Fe', 'Familia', 'Formación', 'Futuro']
  return (
    <div className="bg-primary overflow-hidden py-5 select-none">
      <motion.div className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
        {[...PALABRAS, ...PALABRAS].map((word, i) => (
          <span key={i} className="text-sm font-extrabold tracking-widest text-white/70 uppercase">
            {word} <span className="text-secondary mx-3">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── 6. CTA FINAL ─────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="bg-background py-20 md:py-28 relative overflow-hidden">
      {/* Acento decorativo */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
      <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-secondary" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-[11px] font-bold tracking-[0.25em] text-primary uppercase mb-5">
            Admisión 2026 · Cupos disponibles
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C1814]
                         leading-[1.05] tracking-tight">
            ¿Tu hijo/a estudiará<br />
            <span className="text-primary">con nosotros?</span>
          </h2>
          <p className="mt-6 text-lg text-[#1C1814]/50 max-w-lg mx-auto leading-relaxed">
            El proceso es simple y completamente gratuito.
            Contáctanos hoy y te guiamos en cada paso.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link to="/admision"
              className="inline-flex items-center gap-2 bg-primary text-white
                         font-bold px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors">
              <MessageCircle className="w-5 h-5" />
              Iniciar pre-inscripción
            </Link>
            <Link to="/contacto"
              className="inline-flex items-center gap-2 bg-secondary text-[#1C1814]
                         font-semibold px-8 py-4 rounded-xl hover:bg-secondary/80 transition-colors">
              Hacer una consulta <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── PÁGINA ────────────────────────────────────────────────────────────
export function HomeNueva() {
  return (
    <>
      <Hero />
      <SobreNosotros />
      <Niveles />
      <Valores />
      <FranjaIdentidad />
      <CTAFinal />
    </>
  )
}
