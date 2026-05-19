const BASE_URL = 'https://escuelagm.cl'
const SITE_NAME = 'Escuela Gabriela Mistral'

interface SeoHeadProps {
  title: string
  description: string
  canonicalPath: string
  ogImage?: string
}

export function SeoHead({ title, description, canonicalPath, ogImage }: SeoHeadProps) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const canonical = `${BASE_URL}${canonicalPath}`
  const image = ogImage ?? `${BASE_URL}/images/og-default.png`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}
