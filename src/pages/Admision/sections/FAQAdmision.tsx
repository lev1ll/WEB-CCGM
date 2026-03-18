import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ADMISSION_FAQ } from '@/constants/admision'

export function FAQAdmision() {
  return (
    <SectionWrapper>
      <SectionTitle
        title="Preguntas sobre admisión"
        subtitle="Resolvemos las dudas más comunes del proceso"
      />

      <AnimatedSection direction="up" delay={0.1} className="mt-10 max-w-3xl mx-auto">
        <Accordion type="multiple">
          {ADMISSION_FAQ.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-semibold">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </AnimatedSection>
    </SectionWrapper>
  )
}
