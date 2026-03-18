import { CheckCircle2 } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ADMISSION_REQUIREMENTS } from '@/constants/admision'

export function Requisitos() {
  return (
    <SectionWrapper className="bg-muted/40">
      <SectionTitle
        title="Requisitos de postulación"
        subtitle="Documentos necesarios para completar el proceso de admisión"
      />

      <div className="mt-10 grid sm:grid-cols-2 gap-6">
        {ADMISSION_REQUIREMENTS.map((req, i) => (
          <AnimatedSection key={req.category} direction={i === 0 ? 'left' : 'right'} delay={0.1}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{req.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {req.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </AnimatedSection>
        ))}
      </div>
    </SectionWrapper>
  )
}
