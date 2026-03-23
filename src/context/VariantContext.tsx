import { createContext, useContext, useState } from 'react'

export type Variant = 1 | 2 | 3

interface VariantCtx {
  variant: Variant
  setVariant: (v: Variant) => void
}

const VariantContext = createContext<VariantCtx>({ variant: 1, setVariant: () => {} })

export function VariantProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<Variant>(() => {
    try {
      const n = Number(localStorage.getItem('ccgm_variant'))
      return (n === 1 || n === 2 || n === 3) ? n : 1
    } catch { return 1 }
  })

  function handleSet(v: Variant) {
    setVariant(v)
    try { localStorage.setItem('ccgm_variant', String(v)) } catch { /* ignore */ }
  }

  return (
    <VariantContext.Provider value={{ variant, setVariant: handleSet }}>
      {children}
    </VariantContext.Provider>
  )
}

export const useVariant = () => useContext(VariantContext)
