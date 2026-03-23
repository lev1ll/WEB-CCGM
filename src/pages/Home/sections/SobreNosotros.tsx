import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { useCounterAnimation } from '@/hooks/useCounterAnimation'
import { HOME_STATS } from '@/constants/home'
import { useVariant } from '@/context/VariantContext'

function StatCounter({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  const { count, ref } = useCounterAnimation(value)
  return (
    <div className="text-center sm:text-left">
      <p
        ref={ref as React.RefObject<HTMLParagraphElement>}
        className="text-4xl font-extrabold text-primary"
      >
        {count}
        <span className="text-secondary">{suffix}</span>
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

// ── Variante 1: 2 columnas texto/imagen (original) ────────────────────
function SobreNosotrosV1() {
  return (
    <SectionWrapper>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <AnimatedSection direction="left">
          <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-4">
            Quiénes somos
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            Más de tres décadas educando con propósito
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            El Colegio Cristiano Gabriela Mistral nació con la convicción de que la educación transforma vidas.
            Hoy somos una comunidad vibrante que combina rigor académico con formación en valores,
            preparando a nuestros estudiantes para enfrentar los desafíos del siglo XXI con fe y carácter.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-6">
            {HOME_STATS.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
          <Link
            to="/nosotros"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors"
          >
            Conoce nuestra historia
            <ArrowRight className="h-4 w-4" />
          </Link>
        </AnimatedSection>

        <AnimatedSection direction="right" delay={0.1}>
          <div className="relative">
            <div className="absolute -top-3 -right-3 h-full w-full rounded-2xl border-2 border-secondary/40" />
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop"
              alt="Alumnos del colegio aprendiendo"
              className="relative rounded-2xl w-full object-cover aspect-[4/3] shadow-xl"
            />
          </div>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  )
}

// ── Variante 2: Stats grandes centrados + texto debajo ─────────────────
function SobreNosotrosV2() {
  return (
    <SectionWrapper>
      {/* Stats band */}
      <AnimatedSection direction="up">
        <div className="grid grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden mb-12 shadow-sm">
          {HOME_STATS.map((stat) => (
            <div key={stat.label} className="bg-card py-8 px-6 text-center">
              <StatCounter {...stat} />
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Text + image row */}
      <AnimatedSection direction="up" delay={0.1}>
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-3">
            <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">
              Quiénes somos
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
              Más de tres décadas educando con propósito
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              El Colegio Cristiano Gabriela Mistral nació con la convicción de que la educación transforma vidas.
              Hoy somos una comunidad vibrante que combina rigor académico con formación en valores,
              preparando a nuestros estudiantes para enfrentar los desafíos del siglo XXI con fe y carácter.
            </p>
            <Link
              to="/nosotros"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors"
            >
              Conoce nuestra historia <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="lg:col-span-2">
            <img
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop"
              alt="Alumnos del colegio"
              className="rounded-2xl w-full object-cover aspect-square shadow-lg"
            />
          </div>
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}

// ── Variante 3: Imagen de fondo con texto superpuesto ─────────────────
function SobreNosotrosV3() {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&auto=format&fit=crop"
        alt="Alumnos del colegio"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-navy-deep/85" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <AnimatedSection direction="up">
          <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-4">
            Quiénes somos
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight max-w-2xl">
            Más de tres décadas educando con propósito
          </h2>
          <p className="mt-5 text-white/70 leading-relaxed max-w-xl text-lg">
            Combinamos rigor académico con formación en valores, preparando estudiantes para
            enfrentar los desafíos del siglo XXI con fe y carácter.
          </p>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection direction="up" delay={0.15}>
          <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/20 pt-10">
            {HOME_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <StatCounter {...stat} />
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection direction="up" delay={0.2}>
          <Link
            to="/nosotros"
            className="mt-10 inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-secondary/90 transition-colors text-sm"
          >
            Conoce nuestra historia <ArrowRight className="h-4 w-4" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ── Entrada ────────────────────────────────────────────────────────────
export function SobreNosotros() {
  const { variant } = useVariant()
  if (variant === 2) return <SobreNosotrosV2 />
  if (variant === 3) return <SobreNosotrosV3 />
  return <SobreNosotrosV1 />
}
