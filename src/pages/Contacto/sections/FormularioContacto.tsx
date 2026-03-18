import { useState } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { Send } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Toast, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast'
import { useContactForm } from '@/hooks/useContactForm'

const SUBJECTS = ['Admisión', 'Información general', 'Extraprogramáticas', 'Reclamo / Sugerencia', 'Otro']

const INITIAL_VALUES = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

export function FormularioContacto() {
  const [toastOpen, setToastOpen] = useState(false)
  const [toastVariant, setToastVariant] = useState<'success' | 'destructive'>('success')
  const [toastMsg, setToastMsg] = useState('')

  const { values, handleChange, handleSubmit, isSubmitting, errors } = useContactForm(
    INITIAL_VALUES,
    {
      table: 'contact_messages',
      onSuccess: () => {
        setToastVariant('success')
        setToastMsg('Tu mensaje fue enviado correctamente. Te responderemos pronto.')
        setToastOpen(true)
      },
      onError: (err) => {
        setToastVariant('destructive')
        setToastMsg(err)
        setToastOpen(true)
      },
    }
  )

  return (
    <SectionWrapper>
      <SectionTitle
        title="Escríbenos"
        subtitle="Completa el formulario y te responderemos en menos de 24 horas hábiles"
      />

      <AnimatedSection direction="up" delay={0.1} className="mt-10 max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="contact-name">Nombre completo *</Label>
              <Input
                id="contact-name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-email">Correo electrónico *</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-phone">Teléfono (opcional)</Label>
              <Input
                id="contact-phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-subject">Asunto *</Label>
              <select
                id="contact-subject"
                name="subject"
                value={values.subject}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-invalid={!!errors.subject}
              >
                <option value="">Selecciona un asunto</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="contact-message">Mensaje *</Label>
              <Textarea
                id="contact-message"
                name="message"
                value={values.message}
                onChange={handleChange}
                placeholder="Escribe tu consulta o mensaje..."
                rows={4}
                aria-invalid={!!errors.message}
              />
              {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                {!isSubmitting && <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
      </AnimatedSection>

      <ToastPrimitive.Provider>
        <Toast open={toastOpen} onOpenChange={setToastOpen} variant={toastVariant}>
          <ToastTitle>{toastVariant === 'success' ? '¡Enviado!' : 'Error'}</ToastTitle>
          <ToastDescription>{toastMsg}</ToastDescription>
          <ToastClose />
        </Toast>
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] w-full max-w-sm" />
      </ToastPrimitive.Provider>
    </SectionWrapper>
  )
}
