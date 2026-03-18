import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { useCounterAnimation } from '@/hooks/useCounterAnimation'
import { HOME_STATS } from '@/constants/home'

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

export function SobreNosotros() {
  return (
    <SectionWrapper>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — stats + text */}
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

          {/* Stats */}
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

        {/* Right — image */}
        <AnimatedSection direction="right" delay={0.1}>
          <div className="relative">
            {/* Gold border accent */}
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
