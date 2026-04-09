import { MapPin, Phone, Mail, Clock, Users } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
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
    subvalue: 'Lun–Jue 8:30–17:00 · Vie 8:30–14:00',
  },
  {
    icon: Mail,
    label: 'Correo electrónico',
    value: SCHOOL.email,
    subvalue: 'Respondemos en < 24 hrs hábiles',
  },
]

const HORARIOS_SECRETARIA = [
  { dia: 'Lunes – Jueves', horario: '8:30 – 17:00 hrs' },
  { dia: 'Viernes',        horario: '8:30 – 14:00 hrs' },
  { dia: 'Sáb y Dom',     horario: 'Cerrado'           },
]

const HORARIOS_PROFESORES = [
  { dia: 'Lunes – Jueves', horario: 'Hasta 18:00 hrs' },
  { dia: 'Viernes',        horario: 'Hasta 14:00 hrs' },
]

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
          {/* Horarios secretaría */}
          <div className="flex-1 flex flex-col items-center text-center p-8 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Clock className="h-7 w-7 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Atención apoderados</p>
            {HORARIOS_SECRETARIA.map(h => (
              <div key={h.dia}>
                <p className="text-xs text-muted-foreground">{h.dia}</p>
                <p className="font-semibold text-foreground text-sm">{h.horario}</p>
              </div>
            ))}
          </div>

          {/* Horarios profesores */}
          <div className="flex-1 flex flex-col items-center text-center p-8 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-secondary/15 flex items-center justify-center">
              <Users className="h-7 w-7 text-secondary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Llamadas a profesores</p>
            {HORARIOS_PROFESORES.map(h => (
              <div key={h.dia}>
                <p className="text-xs text-muted-foreground">{h.dia}</p>
                <p className="font-semibold text-foreground text-sm">{h.horario}</p>
              </div>
            ))}
            <p className="text-[10px] text-muted-foreground/70 leading-tight">Solo días laborales<br/>al {SCHOOL.phone}</p>
          </div>
        </div>
      </AnimatedSection>
    </SectionWrapper>
  )
}

export function DatosContacto() {
  return <DatosContactoV3 />
}
