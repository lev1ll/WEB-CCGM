import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import type { IncomingMessage, ServerResponse } from 'http'

interface NoticiaOG {
  titulo: string
  resumen: string | null
  imagen_portada: string | null
}

export default async function handler(
  req: IncomingMessage & { query: Record<string, string | string[]> },
  res: ServerResponse
) {
  const slug = Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

  let noticia: NoticiaOG | null = null

  if (supabaseUrl && supabaseKey && slug) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data } = await supabase
      .from('noticias')
      .select('titulo, resumen, imagen_portada')
      .eq('slug', slug)
      .eq('publicado', true)
      .maybeSingle()
    noticia = data
  }

  const indexHtml = readFileSync(join(process.cwd(), 'dist', 'index.html'), 'utf-8')

  if (!noticia) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(indexHtml)
    return
  }

  const siteUrl = process.env.SITE_URL || 'https://escuelacgm.cl'
  const title = `${noticia.titulo} | Escuela Gabriela Mistral`
  const description = noticia.resumen?.trim() || 'Noticias de la Escuela Gabriela Mistral — Nueva Imperial, La Araucanía.'
  const image = noticia.imagen_portada || `${siteUrl}/images/og-default.png`
  const url = `${siteUrl}/noticias/${slug}`

  const ogTags = `  <title>${esc(title)}</title>
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${esc(image)}" />
  <meta property="og:url" content="${esc(url)}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Escuela Gabriela Mistral" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(image)}" />`

  const html = indexHtml
    .replace(/<title>[^<]*<\/title>/, '')
    .replace('</head>', `${ogTags}\n</head>`)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600')
  res.end(html)
}

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
