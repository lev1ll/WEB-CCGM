import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { Noticia } from '@/types/noticias.types'
import { formatDate } from '@/lib/utils'

export default function UltimasNoticias() {
  const { select } = useSupabaseQuery()
  const [items, setItems] = useState<Noticia[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await select<Noticia>('noticias', {
        filter: { publicado: true },
        order: { column: 'created_at', ascending: false },
        limit: 3,
      })
      setItems(data)
      setLoaded(true)
    }
    load()
  }, [])

  // No renderizar si no hay noticias
  if (loaded && items.length === 0) return null

  return (
    <SectionWrapper className="bg-muted/30">
      <AnimatedSection direction="up">
        <SectionTitle
          title="Últimas Noticias"
          subtitle="Mantente informado sobre todo lo que ocurre en nuestra comunidad escolar"
        />
      </AnimatedSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {!loaded
          ? [1, 2, 3].map(i => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                <div className="h-44 bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))
          : items.map((noticia, i) => (
              <AnimatedSection key={noticia.id} direction="up" delay={i * 0.08}>
                <motion.div whileHover={{ y: -6, transition: { duration: 0.2 } }}>
                  <Link to={`/noticias/${noticia.slug}`}>
                    <Card className="overflow-hidden h-full group cursor-pointer border-border hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-44 overflow-hidden bg-muted">
                        {noticia.imagen_portada ? (
                          <img
                            src={noticia.imagen_portada}
                            alt={noticia.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Calendar className="w-10 h-10 text-primary/40" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <Badge
                            className={`text-xs font-semibold capitalize
                              ${noticia.categoria === 'evento'
                                ? 'bg-amber-500 text-white border-transparent'
                                : 'bg-primary text-white border-transparent'
                              }`}
                          >
                            {noticia.categoria}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col gap-2">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(noticia.created_at)}
                        </p>
                        <h3 className="font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                          {noticia.titulo}
                        </h3>
                        {noticia.resumen && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{noticia.resumen}</p>
                        )}
                        <div className="mt-auto pt-2 flex items-center gap-1 text-primary text-sm font-medium">
                          Leer más <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              </AnimatedSection>
            ))
        }
      </div>

      <AnimatedSection direction="up" delay={0.3}>
        <div className="text-center mt-10">
          <Link
            to="/noticias"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all duration-300"
          >
            Ver todas las noticias <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}
