import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { HomePage } from '@/pages/Home'
import { NosotrosPage } from '@/pages/Nosotros'
import { NivelesPage } from '@/pages/Niveles'
import { AdmisionPage } from '@/pages/Admision'
import { ContactoPage } from '@/pages/Contacto'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="nosotros" element={<NosotrosPage />} />
          <Route path="niveles" element={<NivelesPage />} />
          <Route path="admision" element={<AdmisionPage />} />
          <Route path="contacto" element={<ContactoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
