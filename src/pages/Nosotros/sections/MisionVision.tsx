import { Target, Eye } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { MISION_VISION } from '@/constants/nosotros'

export function MisionVision() {
  return (
    <SectionWrapper className="bg-muted/40">
      <SectionTitle title="Misión y Visión" />

      <div className="mt-10 grid sm:grid-cols-2 gap-6">
        {/* Misión */}
        <AnimatedSection direction="left" delay={0.1}>
          <div className="h-full rounded-2xl bg-primary p-8 text-primary-foreground">
            <Target className="h-10 w-10 mb-5 opacity-80" />
            <h3 className="text-2xl font-bold mb-4">{MISION_VISION.mision.title}</h3>
            <p className="leading-relaxed opacity-90">{MISION_VISION.mision.text}</p>
          </div>
        </AnimatedSection>

        {/* Visión */}
        <AnimatedSection direction="right" delay={0.15}>
          <div className="h-full rounded-2xl bg-secondary/20 border border-secondary/30 p-8">
            <Eye className="h-10 w-10 mb-5 text-secondary" />
            <h3 className="text-2xl font-bold text-foreground mb-4">{MISION_VISION.vision.title}</h3>
            <p className="leading-relaxed text-muted-foreground">{MISION_VISION.vision.text}</p>
          </div>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  )
}
