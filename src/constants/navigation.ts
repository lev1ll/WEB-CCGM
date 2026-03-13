export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Niveles', href: '/niveles' },
  { label: 'Admisión', href: '/admision' },
  { label: 'Contacto', href: '/contacto' },
]
