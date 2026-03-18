import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useSupabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function insert<T extends Record<string, unknown>>(
    table: string,
    data: T
  ): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase no configurado (faltan variables de entorno).' }
    }
    setIsLoading(true)
    setError(null)
    try {
      const { error: sbError } = await supabase.from(table).insert(data)
      if (sbError) {
        setError(sbError.message)
        return { success: false, error: sbError.message }
      }
      return { success: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setIsLoading(false)
    }
  }

  return { client: supabase, insert, isLoading, error }
}
