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

export function DatosContacto() {
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
                    {item.subvalue && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.subvalue}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          )
        })}
      </div>

      {/* Horarios */}
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
