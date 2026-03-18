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

const INITIAL_VALUES = {
  name: '',
  email: '',
  phone: '',
  child_name: '',
  current_grade: '',
  message: '',
}

export function FormularioPreInscripcion() {
  const [toastOpen, setToastOpen] = useState(false)
  const [toastVariant, setToastVariant] = useState<'success' | 'destructive'>('success')
  const [toastMsg, setToastMsg] = useState('')

  const { values, handleChange, handleSubmit, isSubmitting, errors } = useContactForm(
    INITIAL_VALUES,
    {
      table: 'preinscripciones',
      onSuccess: () => {
        setToastVariant('success')
        setToastMsg('Tu pre-inscripción fue recibida. Te contactaremos pronto.')
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
    <SectionWrapper className="bg-muted/40" id="formulario">
      <SectionTitle
        title="Formulario de pre-inscripción"
        subtitle="Completa los datos y nos pondremos en contacto contigo"
      />

      <AnimatedSection direction="up" delay={0.1} className="mt-10 max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5" noValidate>
            {/* Apoderado */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre del apoderado *</Label>
              <Input
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Nombre completo"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
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
              <Label htmlFor="phone">Teléfono (opcional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="child_name">Nombre del postulante *</Label>
              <Input
                id="child_name"
                name="child_name"
                value={values.child_name}
                onChange={handleChange}
                placeholder="Nombre del niño/a"
                aria-invalid={!!errors.child_name}
              />
              {errors.child_name && (
                <p className="text-xs text-destructive">{errors.child_name}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="current_grade">Curso actual del postulante *</Label>
              <select
                id="current_grade"
                name="current_grade"
                value={values.current_grade}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-invalid={!!errors.current_grade}
              >
                <option value="">Selecciona el curso al que postula</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={`${n}basico`}>{n}° Básico</option>
                ))}
              </select>
              {errors.current_grade && (
                <p className="text-xs text-destructive">{errors.current_grade}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="message">Mensaje adicional (opcional)</Label>
              <Textarea
                id="message"
                name="message"
                value={values.message}
                onChange={handleChange}
                placeholder="Cuéntanos algo sobre tu hijo/a o alguna consulta específica..."
                rows={3}
              />
            </div>

            <div className="sm:col-span-2">
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar pre-inscripción'}
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
