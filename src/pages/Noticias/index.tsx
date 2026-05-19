import { useEffect, useState } from 'react'
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import type { Noticia, NoticiaCategoria } from '@/types/noticias.types'
import NoticiasGrid from './sections/NoticiasGrid'
import { SeoHead } from '@/components/shared/SeoHead'

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
      <SeoHead
        title="Noticias y Novedades"
        description="Entérate de todo lo que pasa en la Escuela Gabriela Mistral: actividades, logros, eventos y comunicados oficiales."
        canonicalPath="/noticias"
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
