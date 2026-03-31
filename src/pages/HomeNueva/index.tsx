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
  BookOpen, GraduationCap, Instagram, Facebook, Calendar,
} from 'lucide-react'
import { SCHOOL } from '@/constants/school'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { Noticia } from '@/types/noticias.types'
import { formatDate } from '@/lib/utils'

// ── Datos ──────────────────────────────────────────────────────────────
const FOTOS = [
  { src: '/images/hero-escuela.jpg.jpg',                                                              alt: 'Escuela Gabriela Mistral' },
  { src: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&auto=format&fit=crop', alt: 'Alumnos en clases'        },
  { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&auto=format&fit=crop', alt: 'Lectura y aprendizaje'    },
  { src: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1400&auto=format&fit=crop',    alt: 'Vida deportiva'          },
]

const STATS = [
  { value: '198',  label: 'Estudiantes'       },
  { value: '46',   label: 'Años de historia'  },
  { value: '17',   label: 'Docentes'          },
]

const CICLOS = [
  {
    num: '01',
    icon: BookOpen,
    name: 'Primer Ciclo',
    grades: '1° a 4° Básico',
    ages: '6 – 10 años',
    desc: 'Lectoescritura, matemática concreta y hábitos escolares en un ambiente cálido, inclusivo y estructurado.',
    academias: 'Fútbol · Polideportivo · Danza · Matemáticas · Reciclaje',
  },
  {
    num: '02',
    icon: GraduationCap,
    name: 'Segundo Ciclo',
    grades: '5° a 8° Básico',
    ages: '10 – 14 años',
    desc: 'Pensamiento crítico, ciencias, orientación vocacional y preparación sólida para la educación media.',
    academias: 'Fútbol · Polideportivo · Danza · Matemáticas · Reciclaje · Inglés',
  },
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

      {/* ── Degradado ── */}
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
            Escuela Gabriela Mistral · Nueva Imperial · Desde 1980
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
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">

          {/* Título — slogan real del PEI */}
          <div className="max-w-2xl">
            <motion.h1
              className="text-3xl sm:text-4xl xl:text-5xl font-extrabold
                         text-white leading-[1.15] tracking-tight"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Enseñar siempre: en el patio<br />
              y en la calle como en la sala de clase.<br />
              Enseñar con la{' '}
              <span className="text-secondary">actitud</span>,{' '}
              el <span className="text-secondary">gesto</span>{' '}
              y la <span className="text-secondary">palabra</span>.
            </motion.h1>
          </div>

          {/* Bloque derecho: botones */}
          <motion.div className="lg:max-w-xs shrink-0"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              46 años educando con fe, excelencia académica y formación
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
              46 años educando<br />
              con <span className="text-primary">propósito</span>
            </h2>
            <div className="mt-5 flex gap-2">
              <div className="h-1 w-10 rounded-full bg-primary" />
              <div className="h-1 w-4  rounded-full bg-secondary" />
            </div>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-md">
              Desde 1980, la Escuela Gabriela Mistral forma personas íntegras en Nueva Imperial.
              Combinamos rigor académico con valores cristianos, preparando a nuestros estudiantes
              para la vida con fe y carácter.
            </p>
            <Link to="/nosotros"
              className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary
                         hover:gap-3 transition-all">
              Conoce nuestra historia <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Stats + redes */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-6">

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden shadow-sm">
              {STATS.map(s => (
                <div key={s.label} className="bg-white py-10 px-6 text-center">
                  <p className="text-5xl font-extrabold text-primary leading-none">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-3 leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Redes sociales */}
            <div className="flex flex-col sm:flex-row gap-3">
              {SCHOOL.socialMedia.instagram && (
                <a
                  href={SCHOOL.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 rounded-2xl px-5 py-4
                             font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
                >
                  <Instagram className="w-6 h-6 shrink-0" />
                  <span>@escuela_gm</span>
                </a>
              )}
              {SCHOOL.socialMedia.facebook && (
                <a
                  href={SCHOOL.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 rounded-2xl px-5 py-4
                             bg-[#1877F2] hover:bg-[#166fe5] font-bold text-white
                             transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  <Facebook className="w-6 h-6 shrink-0" />
                  <span>Escuela Gabriela Mistral</span>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── 3. CICLOS EDUCATIVOS ──────────────────────────────────────────────
function Ciclos() {
  return (
    <section className="bg-[#0F0D0C] py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-secondary uppercase mb-3">
              Programa académico
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Ciclos educativos
            </h2>
          </div>
          <Link to="/niveles"
            className="inline-flex items-center gap-2 text-secondary/70 hover:text-secondary
                       transition-colors text-sm font-semibold shrink-0">
            Ver programas completos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards de ciclos */}
        <div className="grid sm:grid-cols-2 gap-6">
          {CICLOS.map((ciclo, i) => {
            const Icon = ciclo.icon
            return (
              <motion.div key={ciclo.num}
                className="group relative rounded-2xl border border-white/8 bg-white/[0.03]
                           hover:bg-white/[0.06] hover:border-secondary/30 transition-all p-8"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}>

                {/* Número decorativo */}
                <span className="absolute top-6 right-7 text-7xl font-extrabold leading-none
                                 text-secondary/10 group-hover:text-secondary/20 transition-colors select-none">
                  {ciclo.num}
                </span>

                {/* Encabezado */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center shrink-0
                                  group-hover:bg-secondary/25 transition-colors">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-xl leading-tight">{ciclo.name}</h3>
                    <span className="text-sm font-semibold text-secondary">{ciclo.grades}</span>
                    <span className="text-xs text-white/40 ml-2">· {ciclo.ages}</span>
                  </div>
                </div>

                <p className="text-sm text-white/55 leading-relaxed mb-6">{ciclo.desc}</p>

                {/* Academias */}
                <div className="border-t border-white/8 pt-4">
                  <p className="text-[10px] font-bold tracking-widest text-secondary/60 uppercase mb-2">
                    Academias extracurriculares
                  </p>
                  <p className="text-sm text-white/70 font-medium">{ciclo.academias}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── 4. FRANJA DE IDENTIDAD ────────────────────────────────────────────
function FranjaIdentidad() {
  const PALABRAS = ['Fe', 'Familia', 'Inclusión', 'Excelencia', '46 años', 'Nueva Imperial', 'Fe', 'Familia', 'Inclusión', 'Excelencia']
  return (
    <div className="bg-primary overflow-hidden py-5 select-none">
      <motion.div className="flex gap-10 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>
        {[...PALABRAS, ...PALABRAS].map((word, i) => (
          <span key={i} className="text-sm font-extrabold tracking-widest text-white/70 uppercase">
            {word} <span className="text-secondary mx-3">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── 5. ÚLTIMAS NOTICIAS ───────────────────────────────────────────────
function UltimasNoticias() {
  const { select } = useSupabaseQuery()
  const [noticias, setNoticias] = useState<Noticia[]>([])

  useEffect(() => {
    select<Noticia>('noticias', {
      filter: { publicado: true },
      order: { column: 'created_at', ascending: false },
      limit: 3,
    }).then(setNoticias)
  }, [])

  if (noticias.length === 0) return null

  return (
    <section className="bg-background py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-bold tracking-[0.25em] text-primary uppercase mb-3">
              Novedades
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
              Últimas noticias
            </h2>
          </div>
          <Link
            to="/noticias"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all shrink-0"
          >
            Ver todas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            >
              <Link to={`/noticias/${n.slug}`} className="group block h-full">
                <div className="rounded-2xl border border-border overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {n.imagen_portada ? (
                      <img
                        src={n.imagen_portada}
                        alt={n.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                        <Calendar className="w-10 h-10 text-primary/30" />
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full
                      ${n.categoria === 'evento' ? 'bg-amber-500 text-white' : 'bg-primary text-white'}`}>
                      {n.categoria}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{formatDate(n.created_at)}
                    </p>
                    <h3 className="font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {n.titulo}
                    </h3>
                    {n.resumen && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5">{n.resumen}</p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 sm:hidden text-center">
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary"
          >
            Ver todas las noticias <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
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
      <Ciclos />
      <FranjaIdentidad />
      <UltimasNoticias />
      <CTAFinal />
    </>
  )
}
