import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Button } from '@/components/ui/button'
import { HOME_GALLERY_IMAGES } from '@/constants/home'
import { SCHOOL } from '@/constants/school'
import { cn } from '@/lib/utils'

export function Galeria() {
  return (
    <SectionWrapper>
      <SectionTitle
        title="Galería"
        subtitle="Momentos que definen nuestra comunidad"
      />

      <AnimatedSection direction="up" delay={0.1} className="mt-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] gap-3">
          {HOME_GALLERY_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              className={cn(
                'relative overflow-hidden rounded-xl',
                img.span === 'wide' && 'col-span-2',
                img.span === 'tall' && 'row-span-2'
              )}
              whileHover="hovered"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              <motion.div
                className="absolute inset-0 bg-primary/30"
                initial={{ opacity: 0 }}
                variants={{ hovered: { opacity: 1 } }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" className="gap-2">
            <a
              href={SCHOOL.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-4 w-4" />
              Ver más en Instagram
            </a>
          </Button>
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}
