import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { HomePage } from '@/pages/Home'
import { NosotrosPage } from '@/pages/Nosotros'
import { NivelesPage } from '@/pages/Niveles'
import { AdmisionPage } from '@/pages/Admision'
import { ContactoPage } from '@/pages/Contacto'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
            <Route path="nosotros" element={<ErrorBoundary><NosotrosPage /></ErrorBoundary>} />
            <Route path="niveles" element={<ErrorBoundary><NivelesPage /></ErrorBoundary>} />
            <Route path="admision" element={<ErrorBoundary><AdmisionPage /></ErrorBoundary>} />
            <Route path="contacto" element={<ErrorBoundary><ContactoPage /></ErrorBoundary>} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
