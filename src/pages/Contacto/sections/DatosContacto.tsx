import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Card, CardContent } from '@/components/ui/card'
import { SCHOOL } from '@/constants/school'

const CONTACT_CARDS = [
  {
    icon: MapPin,
    label: 'Dirección',
    value: SCHOOL.address,
    subvalue: `${SCHOOL.city}, ${SCHOOL.region}`,
  },
  {
    icon: Phone,
    label: 'Teléfono',
    value: SCHOOL.phone,
    subvalue: 'Lun – Vie, 8:00 – 17:00 hrs',
  },
  {
    icon: Mail,
    label: 'Correo electrónico',
    value: SCHOOL.email,
    subvalue: 'Respondemos en < 24 hrs hábiles',
  },
]

const HORARIOS = [
  { dia: 'Lunes – Viernes', horario: '8:00 – 17:00 hrs' },
  { dia: 'Sábado y Domingo', horario: 'Cerrado' },
]

// ── Variante 1: Cards en grid (original) ──────────────────────────────
function DatosContactoV1() {
  return (
    <SectionWrapper>
      <SectionTitle title="Información de contacto" />
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CONTACT_CARDS.map((item, i) => {
          const Icon = item.icon
          return (
            <AnimatedSection key={item.label} direction="up" delay={i * 0.1}>
              <Card className="h-full">
                <CardContent className="p-6 flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</p>
                    <p className="font-semibold text-foreground mt-0.5">{item.value}</p>
                    {item.subvalue && <p className="text-xs text-muted-foreground mt-0.5">{item.subvalue}</p>}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          )
        })}
      </div>
      <AnimatedSection direction="up" delay={0.3} className="mt-8 max-w-md">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">Horarios de atención</h3>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {HORARIOS.map((h) => (
                  <tr key={h.dia} className="border-b border-border last:border-0">
                    <td className="py-2 text-muted-foreground">{h.dia}</td>
                    <td className="py-2 text-right font-medium text-foreground">{h.horario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </AnimatedSection>
    </SectionWrapper>
  )
}

// ── Variante 2: Banda oscura con datos grandes en blanco ───────────────
function DatosContactoV2() {
  return (
    <section className="bg-foreground text-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedSection direction="up">
          <h2 className="text-2xl font-bold text-background mb-10">Información de contacto</h2>
        </AnimatedSection>
        <div className="grid sm:grid-cols-3 gap-8 border-t border-background/10 pt-10">
          {CONTACT_CARDS.map((item, i) => {
            const Icon = item.icon
            return (
              <AnimatedSection key={item.label} direction="up" delay={i * 0.1}>
                <div className="flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-background/50 uppercase tracking-wider">{item.label}</p>
                    <p className="text-lg font-bold text-background mt-1">{item.value}</p>
                    {item.subvalue && <p className="text-sm text-background/60 mt-0.5">{item.subvalue}</p>}
                  </div>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
        <AnimatedSection direction="up" delay={0.3}>
          <div className="mt-10 pt-8 border-t border-background/10 flex items-start gap-4">
            <Clock className="h-5 w-5 text-secondary mt-0.5 shrink-0" />
            <div className="flex gap-10">
              {HORARIOS.map(h => (
                <div key={h.dia}>
                  <p className="text-sm text-background/60">{h.dia}</p>
                  <p className="font-semibold text-background">{h.horario}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ── Variante 3: Lista horizontal con íconos grandes centrados ──────────
function DatosContactoV3() {
  return (
    <SectionWrapper>
      <SectionTitle title="Información de contacto" />
      <AnimatedSection direction="up" className="mt-10">
        <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border sm:divide-y-0 sm:divide-x sm:flex">
          {CONTACT_CARDS.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex-1 flex flex-col items-center text-center p-8 gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</p>
                <p className="font-semibold text-foreground">{item.value}</p>
                {item.subvalue && <p className="text-xs text-muted-foreground">{item.subvalue}</p>}
              </div>
            )
          })}
          {/* Horarios */}
          <div className="flex-1 flex flex-col items-center text-center p-8 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-7 w-7 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Horarios</p>
            {HORARIOS.map(h => (
              <div key={h.dia}>
                <p className="text-xs text-muted-foreground">{h.dia}</p>
                <p className="font-semibold text-foreground text-sm">{h.horario}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}

export function DatosContacto() {
  return <DatosContactoV3 />
}
