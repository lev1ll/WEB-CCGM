import { Hero } from './sections/Hero'
import { HeroSplit } from './sections/HeroSplit'
import { HeroBillboard } from './sections/HeroBillboard'
import { HeroMosaic } from './sections/HeroMosaic'
import { HeroMinimal } from './sections/HeroMinimal'
import { HeroStripe } from './sections/HeroStripe'
import { SobreNosotros } from './sections/SobreNosotros'
import { NivelesHome } from './sections/NivelesHome'
import { Valores } from './sections/Valores'
import { Galeria } from './sections/Galeria'
import { FAQ } from './sections/FAQ'
import { CTAAdmision } from './sections/CTAAdmision'

// ─────────────────────────────────────────────────────────────────
// MODO COMPARACIÓN — 3 layouts del Hero para elegir
// Una vez decidido, queda solo el elegido y se eliminan los demás
// ─────────────────────────────────────────────────────────────────
function HeroLabel({ letter, name, desc }: { letter: string; name: string; desc: string }) {
  return (
    <div className="bg-foreground text-background py-3 px-6 flex items-center gap-4 sticky top-16 z-40">
      <span className="text-2xl font-extrabold text-secondary shrink-0">{letter}</span>
      <div>
        <p className="font-bold text-sm leading-none">{name}</p>
        <p className="text-xs text-background/60 mt-0.5">{desc}</p>
      </div>
    </div>
  )
}

export function HomePage() {
  return (
    <>
      {/* ── OPCIÓN A: Hero actual (foto full-bleed + overlay) ── */}
      <HeroLabel
        letter="A"
        name="Hero clásico — foto de fondo"
        desc="Imagen full-bleed con overlay rojo degradado. Tipografía centrada."
      />
      <Hero />

      {/* ── OPCIÓN B: Split — mitad roja / mitad foto ── */}
      <HeroLabel
        letter="B"
        name="Split editorial — mitad roja / mitad foto"
        desc="Layout partido. Fondo rojo sólido con contenido a la izquierda, foto a la derecha."
      />
      <HeroSplit />

      {/* ── OPCIÓN C: Billboard — tipografía masiva sobre negro ── */}
      <HeroLabel
        letter="C"
        name="Billboard — negro + tipografía masiva"
        desc="Fondo oscuro, texto gigante rojo/amarillo/blanco. Estilo gráfico institucional."
      />
      <HeroBillboard />

      {/* ── OPCIÓN D: Mosaico de fotos ── */}
      <HeroLabel
        letter="D"
        name="Mosaico — grid de fotos"
        desc="Headline a la izquierda, collage de 6 fotos del colegio a la derecha. Muy efectivo con fotos reales."
      />
      <HeroMosaic />

      {/* ── OPCIÓN E: Minimal sin foto ── */}
      <HeroLabel
        letter="E"
        name="Minimal — sin foto, solo tipografía"
        desc="Fondo blanco, manchas de color decorativas. Funciona perfecto cuando no hay fotos reales todavía."
      />
      <HeroMinimal />

      {/* ── OPCIÓN F: Stripe horizontal ── */}
      <HeroLabel
        letter="F"
        name="Stripe — banda roja arriba, foto abajo"
        desc="Banda roja con texto en la parte superior, foto recortada que sube desde abajo. Estilo Stripe/Linear."
      />
      <HeroStripe />

      {/* ── Resto de la página (solo aparece una vez) ── */}
      <SobreNosotros />
      <NivelesHome />
      <Valores />
      {/* <Testimonios /> — desactivado hasta tener reseñas reales */}
      <Galeria />
      <FAQ />
      <CTAAdmision />
    </>
  )
}
