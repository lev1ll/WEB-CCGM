import { Target, Eye } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { MISION_VISION } from '@/constants/nosotros'

export function MisionVision() {
  return (
    <SectionWrapper>
      <SectionTitle title="Misión y Visión" />

      <div className="mt-10 grid sm:grid-cols-2 gap-6">
        {/* Misión — rojo */}
        <AnimatedSection direction="left" delay={0.1}>
          <div className="h-full rounded-2xl bg-primary p-8 text-white">
            <Target className="h-10 w-10 mb-5 opacity-70" />
            <h3 className="text-2xl font-bold mb-4">Misión</h3>
            <p className="leading-relaxed text-white/80">{MISION_VISION.mision.text}</p>
          </div>
        </AnimatedSection>

        {/* Visión — carbón */}
        <AnimatedSection direction="right" delay={0.15}>
          <div className="h-full rounded-2xl bg-[#1C1814] p-8">
            <Eye className="h-10 w-10 mb-5 text-white/40" />
            <h3 className="text-2xl font-bold text-white mb-4">Visión</h3>
            <p className="leading-relaxed text-white/60">{MISION_VISION.vision.text}</p>
          </div>
        </AnimatedSection>
      </div>
    </SectionWrapper>
  )
}
