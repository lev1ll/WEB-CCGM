import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Mail, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/constants/navigation'
import { SCHOOL } from '@/constants/school'
import { LogoCCGM } from '@/components/shared/LogoCCGM'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3">
            <LogoCCGM showText={false} className="h-14 w-14 shrink-0" />
            <div className="leading-tight">
              <p className="text-[11px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                Colegio Cristiano
              </p>
              <p className="font-bold text-lg text-foreground" style={{ fontFamily: "'Dancing Script', cursive" }}>
                Gabriela Mistral
              </p>
            </div>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === '/'}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA — correo + WhatsApp */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href={`https://mail.google.com/mail/?view=cm&to=${SCHOOL.email}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl
                         bg-[#EA4335] hover:bg-[#EA4335]/85 text-white transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="font-bold text-xs">Correo</span>
              </div>
              <span className="text-[9px] text-white/80 leading-none">{SCHOOL.email}</span>
            </a>
            <a
              href={`https://wa.me/${SCHOOL.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl
                         bg-[#25D366] hover:bg-[#25D366]/85 text-white transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="font-bold text-xs">WhatsApp</span>
              </div>
              <span className="text-[9px] text-white/80 leading-none">{SCHOOL.whatsappDisplay}</span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isOpen}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md pb-4">
            <div className="flex flex-col gap-1 pt-2">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end={link.href === '/'}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-3 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-2 px-4 flex gap-2">
                <a
                  href={`https://mail.google.com/mail/?view=cm&to=${SCHOOL.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                             bg-[#EA4335] hover:bg-[#EA4335]/85 transition-colors"
                >
                  <Mail className="w-5 h-5 text-white" />
                  <span className="text-[11px] font-bold text-white">Correo</span>
                </a>
                <a
                  href={`https://wa.me/${SCHOOL.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                             bg-[#25D366] hover:bg-[#25D366]/85 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span className="text-[11px] font-bold text-white">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
