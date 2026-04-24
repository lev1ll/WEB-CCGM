import { MapPin, Phone, Mail, Clock, Users } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { SCHOOL } from '@/constants/school'

const INFO = [
  {
    icon: MapPin,
    label: 'Dirección',
    lines: [SCHOOL.address, `${SCHOOL.city}, ${SCHOOL.region}`],
  },
  {
    icon: Phone,
    label: 'Teléfono',
    lines: [SCHOOL.phone],
  },
  {
    icon: Mail,
    label: 'Correo electrónico',
    lines: [SCHOOL.email],
  },
]

const HORARIOS_SEC = [
  { dia: 'Lunes – Jueves', hora: '8:30 – 17:00 hrs' },
  { dia: 'Viernes',        hora: '8:30 – 14:00 hrs' },
  { dia: 'Sáb y Dom',     hora: 'Cerrado' },
]

const HORARIOS_PROF = [
  { dia: 'Lunes – Jueves', hora: 'Hasta 18:00 hrs' },
  { dia: 'Viernes',        hora: 'Hasta 14:00 hrs' },
]

export function ContactoHero() {
  return (
    <SectionWrapper>
      <div className="grid lg:grid-cols-[3fr_2fr] gap-8 items-start">

        {/* ── Google Maps ── */}
        <AnimatedSection direction="left" delay={0.05}>
          <div className="rounded-2xl overflow-hidden border border-border shadow-md w-full" style={{ height: 540 }}>
            <iframe
              title="Ubicación Escuela Gabriela Mistral"
              src="https://maps.google.com/maps?q=Escuela+Gabriela+Mistral+General+Urrutia+763+Nueva+Imperial+Chile&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </AnimatedSection>

        {/* ── Info de contacto ── */}
        <AnimatedSection direction="right" delay={0.1} className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Información de contacto</h2>
            <p className="text-sm text-muted-foreground mt-1">Estamos en Nueva Imperial, Región de La Araucanía</p>
          </div>

          {/* Datos básicos */}
          <div className="space-y-3">
            {INFO.map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{item.label}</p>
                    {item.lines.map((l, i) => (
                      <p key={i} className="text-sm font-medium text-foreground">{l}</p>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-primary" />
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Secretaría</p>
              </div>
              {HORARIOS_SEC.map(h => (
                <div key={h.dia}>
                  <p className="text-[11px] text-muted-foreground">{h.dia}</p>
                  <p className="text-sm font-semibold text-foreground">{h.hora}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-secondary" />
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Profesores</p>
              </div>
              {HORARIOS_PROF.map(h => (
                <div key={h.dia}>
                  <p className="text-[11px] text-muted-foreground">{h.dia}</p>
                  <p className="text-sm font-semibold text-foreground">{h.hora}</p>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground/70 leading-tight pt-1">Solo días laborales · al {SCHOOL.phone}</p>
            </div>
          </div>
        </AnimatedSection>

      </div>
    </SectionWrapper>
  )
}
