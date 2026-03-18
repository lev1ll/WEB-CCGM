import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HOME_FAQ } from '@/constants/home'

export function FAQ() {
  return (
    <SectionWrapper className="bg-muted/40">
      <SectionTitle
        title="Preguntas frecuentes"
        subtitle="Respuestas a las consultas más comunes de las familias"
      />

      <AnimatedSection direction="up" delay={0.1} className="mt-10 max-w-3xl mx-auto">
        <Accordion type="multiple">
          {HOME_FAQ.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
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
