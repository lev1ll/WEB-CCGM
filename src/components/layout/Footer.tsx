import { NavLink } from 'react-router-dom'
import { GraduationCap, Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react'
import { SCHOOL } from '@/constants/school'
import { NAV_LINKS } from '@/constants/navigation'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <GraduationCap className="h-6 w-6" />
              <span>{SCHOOL.shortName}</span>
            </div>
            <p className="text-sm text-background/70 max-w-xs">
              {SCHOOL.name} — Formando líderes con valores cristianos para un
              mundo mejor.
            </p>
            <div className="flex gap-3">
              {SCHOOL.socialMedia.facebook && (
                <a href={SCHOOL.socialMedia.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="h-5 w-5 text-background/70 hover:text-background transition-colors" />
                </a>
              )}
              {SCHOOL.socialMedia.instagram && (
                <a href={SCHOOL.socialMedia.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="h-5 w-5 text-background/70 hover:text-background transition-colors" />
                </a>
              )}
              {SCHOOL.socialMedia.youtube && (
                <a href={SCHOOL.socialMedia.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube className="h-5 w-5 text-background/70 hover:text-background transition-colors" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/50">
              Navegación
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    className="text-sm text-background/70 hover:text-background transition-colors"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-background/50">
              Contacto
            </h3>
            <ul className="space-y-3">
              {SCHOOL.address && (
                <li className="flex items-start gap-2 text-sm text-background/70">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{SCHOOL.address}</span>
                </li>
              )}
              {SCHOOL.phone && (
                <li className="flex items-center gap-2 text-sm text-background/70">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a href={`tel:${SCHOOL.phone}`} className="hover:text-background transition-colors">
                    {SCHOOL.phone}
                  </a>
                </li>
              )}
              {SCHOOL.email && (
                <li className="flex items-center gap-2 text-sm text-background/70">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href={`mailto:${SCHOOL.email}`} className="hover:text-background transition-colors">
                    {SCHOOL.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-background/10 pt-6 text-center text-xs text-background/40">
          © {currentYear} {SCHOOL.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
