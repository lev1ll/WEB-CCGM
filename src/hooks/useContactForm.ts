import { useState } from 'react'
import { useSupabase } from '@/hooks/useSupabase'

interface UseContactFormOptions {
  table: string
  requiredFields?: string[]
  onSuccess?: () => void
  onError?: (error: string) => void
}

type Errors<T> = Partial<Record<keyof T, string>>

export function useContactForm<T extends Record<string, string>>(
  initialValues: T,
  options: UseContactFormOptions
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Errors<T>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { insert } = useSupabase()

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  function validate(): boolean {
    const newErrors: Errors<T> = {}
    const required = options.requiredFields ?? Object.keys(initialValues)
    for (const key of required as (keyof T)[]) {
      const val = values[key]
      if (typeof val === 'string' && val.trim() === '') {
        newErrors[key] = 'Este campo es requerido'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    const result = await insert(options.table, values as Record<string, unknown>)
    setIsSubmitting(false)
    if (result.success) {
      reset()
      options.onSuccess?.()
    } else {
      options.onError?.(result.error ?? 'Error al enviar')
    }
  }

  function reset() {
    setValues(initialValues)
    setErrors({})
  }

  return { values, handleChange, handleSubmit, isSubmitting, errors, reset }
}
