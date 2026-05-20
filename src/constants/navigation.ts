export interface NavLink {
  label: string
  href: string
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Niveles', href: '/niveles' },
{ label: 'Calendario', href: '/calendario' },
  { label: 'Horarios', href: '/horarios' },
  { label: 'Recursos', href: '/recursos' },
  { label: 'Admisión', href: '/admision' },
  { label: 'Contacto', href: '/contacto' },
]
