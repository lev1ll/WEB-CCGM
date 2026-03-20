import { useEffect, useState } from 'react'
import { PageHero } from '@/components/shared/PageHero'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { Noticia, NoticiaCategoria } from '@/types/noticias.types'
import NoticiasGrid from './sections/NoticiasGrid'

export default function NoticiasPage() {
  const { select, isLoading } = useSupabaseQuery()
  const [items, setItems] = useState<Noticia[]>([])
  const [filter, setFilter] = useState<NoticiaCategoria | 'todas'>('todas')

  useEffect(() => {
    async function load() {
      const data = await select<Noticia>('noticias', {
        filter: { publicado: true },
        order: { column: 'created_at', ascending: false },
      })
      setItems(data)
    }
    load()
  }, [])

  return (
    <>
      <PageHero
        title="Noticias y Eventos"
        subtitle="Mantente al día con todo lo que ocurre en el Colegio Cristiano Gabriela Mistral"
        breadcrumb="Noticias"
      />
      <NoticiasGrid
        items={items}
        isLoading={isLoading}
        filter={filter}
        onFilterChange={setFilter}
      />
    </>
  )
}
