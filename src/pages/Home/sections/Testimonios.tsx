import { Quote } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Carousel } from '@/components/ui/carousel'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { HOME_TESTIMONIOS } from '@/constants/home'

export function Testimonios() {
  return (
    <SectionWrapper className="bg-muted/40 overflow-hidden">
      <SectionTitle
        title="Lo que dicen las familias"
        subtitle="La experiencia de nuestra comunidad habla por nosotros"
      />

      <AnimatedSection direction="up" delay={0.1} className="mt-10">
        <Carousel itemWidth={340} gap={20}>
          {HOME_TESTIMONIOS.map((t) => (
            <div
              key={t.name}
              className="w-[340px] shrink-0 rounded-2xl bg-card border border-border p-6 flex flex-col gap-4 shadow-sm"
            >
              <Quote className="h-7 w-7 text-secondary shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <Avatar className="h-10 w-10">
                  <AvatarFallback initials={t.initials} />
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </AnimatedSection>
    </SectionWrapper>
  )
}
