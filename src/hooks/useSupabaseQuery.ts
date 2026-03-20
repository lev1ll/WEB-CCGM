import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface SelectOptions {
  filter?: Record<string, unknown>
  order?: { column: string; ascending?: boolean }
  limit?: number
  select?: string
}

export function useSupabaseQuery() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function notConfigured() {
    return { success: false, error: 'Supabase no configurado (faltan variables de entorno).' }
  }

  async function select<T>(table: string, options?: SelectOptions): Promise<T[]> {
    if (!supabase) return []
    setIsLoading(true)
    setError(null)
    try {
      let query = supabase.from(table).select(options?.select ?? '*')
      if (options?.filter) {
        for (const [key, value] of Object.entries(options.filter)) {
          query = query.eq(key, value as string)
        }
      }
      if (options?.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? false })
      }
      if (options?.limit) {
        query = query.limit(options.limit)
      }
      const { data, error: sbError } = await query
      if (sbError) { setError(sbError.message); return [] }
      return (data ?? []) as T[]
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  async function update<T extends Record<string, unknown>>(
    table: string,
    id: string,
    data: T
  ): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return notConfigured()
    setIsLoading(true)
    setError(null)
    try {
      const { error: sbError } = await supabase.from(table).update(data).eq('id', id)
      if (sbError) { setError(sbError.message); return { success: false, error: sbError.message } }
      return { success: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setIsLoading(false)
    }
  }

  async function remove(table: string, id: string): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return notConfigured()
    setIsLoading(true)
    setError(null)
    try {
      const { error: sbError } = await supabase.from(table).delete().eq('id', id)
      if (sbError) { setError(sbError.message); return { success: false, error: sbError.message } }
      return { success: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setIsLoading(false)
    }
  }

  async function upsert<T extends Record<string, unknown>>(
    table: string,
    data: T
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!supabase) return notConfigured()
    setIsLoading(true)
    setError(null)
    try {
      const { data: rows, error: sbError } = await supabase.from(table).upsert(data).select('id')
      if (sbError) { setError(sbError.message); return { success: false, error: sbError.message } }
      const id = (rows as Array<{ id: string }>)?.[0]?.id
      return { success: true, id }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setIsLoading(false)
    }
  }

  async function removeWhere(
    table: string,
    column: string,
    value: string
  ): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return notConfigured()
    try {
      const { error: sbError } = await supabase.from(table).delete().eq(column, value)
      if (sbError) return { success: false, error: sbError.message }
      return { success: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      return { success: false, error: msg }
    }
  }

  async function bulkInsert<T extends Record<string, unknown>>(
    table: string,
    rows: T[]
  ): Promise<{ success: boolean; error?: string }> {
    if (!supabase) return notConfigured()
    if (rows.length === 0) return { success: true }
    try {
      const { error: sbError } = await supabase.from(table).insert(rows)
      if (sbError) return { success: false, error: sbError.message }
      return { success: true }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      return { success: false, error: msg }
    }
  }

  return { select, update, remove, removeWhere, bulkInsert, upsert, isLoading, error }
}
